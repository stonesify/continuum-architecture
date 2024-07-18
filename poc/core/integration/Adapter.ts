import { isFunction } from '../utils'
import { EventContext } from './EventContext'
import { DataContainer } from '../DataContainer'
import { EventContextMapper } from './EventContextMapper'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'

export class Adapter<TMessage, UResponse extends PlatformResponse, VEvent extends IncomingEvent, WResult extends OutgoingEvent, XContext = unknown> {
  protected readonly hooks: Record<'onInit' | 'beforeHandle' | 'onTerminate', Function[]>
  protected readonly mapper: EventContextMapper<TMessage, UResponse, VEvent, WResult, XContext>

  constructor (
    protected readonly blueprint: DataContainer<Record<string, unknown>>,
    protected readonly handlerFactory: () => EventHandlerable<VEvent, WResult>
  ) {
    this.mapper = new EventContextMapper()
  }

  hook (event: 'onInit' | 'beforeHandle' | 'onTerminate', listener: Function): this {
    this.hooks[event] ??= []
    this.hooks[event].push(listener)
    return this
  }

  async run (): Promise<unknown> {
    await this.onInit()
    const handler = this.handlerFactory()
    await this.beforeHandle(handler)
    return await this.onMessageReceived(handler, new EventContext(this.blueprint, new IncomingEvent({}) as VEvent))
  }

  protected async onMessageReceived (
    handler: EventHandlerable<VEvent, WResult>,
    eventContext: EventContext<TMessage, UResponse, VEvent, WResult, XContext>
  ): Promise<unknown> {
    try {
      const incomingEvent = await this.mapper.toIncomingEvent(eventContext)

      const result = 'handle' in handler
        ? await handler.handle(incomingEvent)
        : await handler(incomingEvent)

      const output = await this.mapper.toPlatformResponse(eventContext.cloneWith(incomingEvent, result))

      return await output?.send?.()
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

  protected async beforeHandle (handler: EventHandlerable<VEvent, WResult>): Promise<void> {
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
    handler: EventHandlerable<VEvent, WResult>,
    eventContext?: EventContext<TMessage, UResponse, VEvent, WResult, XContext>
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

  protected handleError (error: Error, eventContext: EventContext<TMessage, UResponse, VEvent, WResult, XContext>): unknown {
    return null
  }

  protected setPlatform (platform: string): this {
    this.blueprint.set('stone.platformName', platform)
    return this
  }
}

export interface PlatformResponse {
  send: () => Promise<unknown>
}

export type EventHandlerable<VEvent = IncomingEvent, WResult = OutgoingEvent> = EventHandlerFunction<VEvent, WResult> | EventHandlerInterface<VEvent, WResult>

export type EventHandlerFunction<VEvent = IncomingEvent, WResult = OutgoingEvent> = (event: VEvent) => Promise<WResult>

export interface EventHandlerInterface<VEvent = IncomingEvent, WResult = OutgoingEvent> {
  onInit: () => Promise<void>
  beforeHandle: () => Promise<void>
  onTerminate: () => Promise<void>
  handle: (event: VEvent) => Promise<WResult>
}
