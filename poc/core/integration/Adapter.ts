import { isFunction } from '../utils'
import { EventContext } from './EventContext'
import { ErrorHandler, Logger } from '../types'
import { DataContainer } from '../DataContainer'
import { EventContextMapper } from './EventContextMapper'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'
import { AdapterHooks, AdapterInterface, EventHandlerable, HandlerFactory, PlatformResponse } from './types'

export class Adapter<TMessage, UEvent extends IncomingEvent, VResponse extends PlatformResponse, WEvent extends OutgoingEvent, XContext = unknown> implements AdapterInterface {
  static readonly NAME = 'default'

  protected readonly logger: Logger | undefined
  protected readonly hooks: Record<AdapterHooks, Function[]>
  protected readonly handlerFactory: HandlerFactory<UEvent, WEvent>
  protected readonly mapper: EventContextMapper<TMessage, UEvent, VResponse, WEvent, XContext>
  protected readonly errorHandler?: ErrorHandler<Error, EventContext<TMessage, UEvent, VResponse, WEvent, XContext>, unknown>

  constructor (protected readonly blueprint: DataContainer<Record<string, unknown>>) {
    this.hooks = this.makeHooks()
    this.logger = this.makeLogger()
    this.mapper = this.makeMapper()
    this.errorHandler = this.makeErrorHandler()
    this.handlerFactory = this.makeHandlerFactory()
  }

  get name () {
    return Adapter.NAME
  }

  hook (event: AdapterHooks, listener: Function): this {
    this.hooks[event].push(listener)
    return this
  }

  async run (): Promise<unknown> {
    await this.onInit()
    const handler = this.handlerFactory(this.blueprint)
    await this.beforeHandle(handler)
    return await this.onMessageReceived(handler, new EventContext(this.blueprint, {} as TMessage, {} as UEvent))
  }

  protected async onMessageReceived (
    handler: EventHandlerable<UEvent, WEvent>,
    eventContext: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>
  ): Promise<unknown> {
    try {
      const incomingEvent = await this.mapper.toIncomingEvent(eventContext)

      const outgoingEvent = 'handle' in handler
        ? await handler.handle(incomingEvent)
        : await handler(incomingEvent)

      const response = await this.mapper.toPlatformResponse(eventContext.setOutgoingEvent(outgoingEvent))

      return await response?.send()
    } catch (error) {
      return this.handleError(error, eventContext)
    } finally {
      await this.onTerminate(handler, eventContext)
    }
  }

  protected async onInit (): Promise<void> {
    if (!isFunction(this.handlerFactory)) {
      throw new TypeError('The `handlerFactory` must be a function.')
    }

    if (Array.isArray(this.hooks.onInit)) {
      for (const listener of this.hooks.onInit) {
        await listener()
      }
    }
  }

  protected async beforeHandle (handler: EventHandlerable<UEvent, WEvent>): Promise<void> {
    if (Array.isArray(this.hooks.beforeHandle)) {
      for (const listener of this.hooks.beforeHandle) {
        await listener()
      }
    }

    if ('beforeHandle' in handler) {
      await handler.beforeHandle()
    }
  }

  protected async onTerminate (
    handler: EventHandlerable<UEvent, WEvent>,
    eventContext?: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>
  ): Promise<void> {
    if (Array.isArray(this.hooks.onTerminate)) {
      for (const listener of this.hooks.onTerminate) {
        await listener()
      }
    }

    if ('onTerminate' in handler) {
      await handler.onTerminate()
    }
  }

  protected handleError (error: Error, eventContext: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>): unknown {
    if (this.errorHandler) {
      return this.errorHandler.report(error, eventContext).render(error, eventContext)
    } else if (this.logger) {
      this.logger.error(error)
    } else {
      console.error(error)
    }
  }

  protected setPlatform (platform: string): this {
    this.blueprint.set('stone.platformName', platform)
    return this
  }

  private makeHandlerFactory (): (blueprint: DataContainer) => EventHandlerable<UEvent, WEvent> {
    return this.blueprint.get(`stone.adapter.${this.name}.HandlerFactory`)
  }

  private makeHooks (): Record<AdapterHooks, Function[]> {
    return this.blueprint.get(
      `stone.adapter.${this.name}.hooks`,
      {
        onInit: [],
        onTerminate: [],
        beforeHandle: [],
      }
    )
  }

  private makeLogger (): Logger | undefined {
    if (this.blueprint.has('stone.logger')) {
      return Reflect.construct(this.blueprint.get('stone.logger'), [this.blueprint])
    } else {
      return undefined
    }
  }

  private makeMapper (): EventContextMapper<TMessage, UEvent, VResponse, WEvent, XContext> {
    return new EventContextMapper(
      this.blueprint.get(`stone.adapter.${this.name}.middleware.incoming`, []),
      this.blueprint.get(`stone.adapter.${this.name}.middleware.outgoing`, [])
    )
  }

  private makeErrorHandler (): ErrorHandler<Error, EventContext<TMessage, UEvent, VResponse, WEvent, XContext>, unknown> | undefined {
    if (this.blueprint.has(`stone.adapter.${this.name}.errorHandler`)) {
      return Reflect.construct(this.blueprint.get(`stone.adapter.${this.name}.errorHandler`), [this.blueprint])
    } else {
      return undefined
    }
  }
}