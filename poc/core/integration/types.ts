import { DataContainer } from '../DataContainer'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'

export interface AdapterInterface {
  name: string
  run: () => Promise<unknown>
  hook: (event: AdapterHooks, listener: Function) => this
}

export interface PlatformResponse {
  send: () => Promise<unknown>
}

export type AdapterHooks = 'onInit' | 'beforeHandle' | 'onTerminate'

export type EventHandlerFunction<VEvent = IncomingEvent, WEvent = OutgoingEvent> = (event: VEvent) => Promise<WEvent>

export interface EventHandlerInterface<VEvent = IncomingEvent, WEvent = OutgoingEvent> {
  onInit?: () => Promise<void>
  beforeHandle?: () => Promise<void>
  onTerminate?: () => Promise<void>
  handle: (event: VEvent) => Promise<WEvent>
}

export type HandlerFactory<UEvent, WEvent> = (blueprint: DataContainer) => EventHandlerable<UEvent, WEvent>

export type EventHandlerable<VEvent = IncomingEvent, WEvent = OutgoingEvent> = EventHandlerFunction<VEvent, WEvent> | EventHandlerInterface<VEvent, WEvent>

export interface AdapterOptions {
  alias?: string | null
  type: Function
  middleware: {
    incoming: Function[]
    outgoing: Function[]
  }
  default?: boolean
  current?: boolean
  preferred?: boolean
  errorHandler?: Function | null
}
