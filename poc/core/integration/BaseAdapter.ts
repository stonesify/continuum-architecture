import { isFunction } from '../utils'
import { EventContext } from './EventContext'
import { ErrorHandler, Logger } from '../interfaces'
import { StoneBlueprint } from '../StoneBlueprint'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'
import { EventContextMapper } from './EventContextMapper'
import { AdapterHooks, Adapter, EventHandler, HandlerFactory, PlatformResponse } from './interfaces'

export class BaseAdapter<
  TMessage,
  UIncomingEvent extends IncomingEvent,
  VResponse extends PlatformResponse,
  WOutgoingEvent extends OutgoingEvent,
  XContext = unknown
> implements Adapter {
  static readonly NAME = 'default'

  protected readonly logger?: Logger
  protected readonly hooks: Record<AdapterHooks, Function[]>
  protected readonly handlerFactory: HandlerFactory<UIncomingEvent, WOutgoingEvent>
  protected readonly mapper: EventContextMapper<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>
  protected readonly errorHandler?: ErrorHandler<Error, EventContext<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>, unknown>

  constructor (protected readonly blueprint: StoneBlueprint) {
    this.hooks = this.makeHooks()
    this.logger = this.makeLogger()
    this.mapper = this.makeMapper()
    this.errorHandler = this.makeErrorHandler()
    this.handlerFactory = this.makeHandlerFactory()
  }

  get name (): string {
    return BaseAdapter.NAME
  }

  hook (event: AdapterHooks, listener: Function): this {
    this.hooks[event].push(listener)
    return this
  }

  async run (): Promise<unknown> {
    await this.onInit()
    const handler = this.handlerFactory(this.blueprint)
    await this.beforeHandle(handler)
    return await this.onMessageReceived(handler, new EventContext(this.blueprint, {} as TMessage, {} as UIncomingEvent))
  }

  protected async onMessageReceived (
    handler: EventHandler<UIncomingEvent, WOutgoingEvent>,
    eventContext: EventContext<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>
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

  protected async beforeHandle (handler: EventHandler<UIncomingEvent, WOutgoingEvent>): Promise<void> {
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
    handler: EventHandler<UIncomingEvent, WOutgoingEvent>,
    _eventContext?: EventContext<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>
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

  protected handleError (error: Error, eventContext: EventContext<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>): unknown {
    if (this.errorHandler != null) {
      return this.errorHandler.report(error, eventContext).render(error, eventContext)
    } else if (this.logger != null) {
      this.logger.error(error)
    } else {
      console.error(error)
    }
  }

  protected setPlatform (platform: string): this {
    this.blueprint.set('stone.platformName', platform)
    return this
  }

  private makeHandlerFactory (): HandlerFactory<UIncomingEvent, WOutgoingEvent> {
    return this.blueprint.get(`stone.adapter.${this.name}.handlerFactory`)
  }

  private makeHooks (): Record<AdapterHooks, Function[]> {
    return this.blueprint.get(
      `stone.adapter.${this.name}.hooks`,
      {
        onInit: [],
        onTerminate: [],
        beforeHandle: []
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

  private makeMapper (): EventContextMapper<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext> {
    return new EventContextMapper(
      this.blueprint.get(`stone.adapter.${this.name}.middleware.incoming`, []),
      this.blueprint.get(`stone.adapter.${this.name}.middleware.outgoing`, [])
    )
  }

  private makeErrorHandler (): ErrorHandler<Error, EventContext<TMessage, UIncomingEvent, VResponse, WOutgoingEvent, XContext>, unknown> | undefined {
    if (this.blueprint.has(`stone.adapter.${this.name}.errorHandler`)) {
      return Reflect.construct(this.blueprint.get(`stone.adapter.${this.name}.errorHandler`), [this.blueprint])
    } else {
      return undefined
    }
  }
}
