import { StoneBlueprint } from '../StoneBlueprint'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'

/**
 * Defines an interface for an Adapter with methods to run and hook into events.
 */
export interface Adapter {
  name: string
  run: () => Promise<unknown>
  hook: (event: AdapterHooks, listener: Function) => this
}

/**
 * Type representing the possible hooks for the Adapter.
 */
export type AdapterHooks = 'onInit' | 'beforeHandle' | 'onTerminate'

/**
 * Defines an interface for PlatformResponse with a send method.
 */
export interface PlatformResponse {
  send: () => Promise<unknown>
}

/**
 * Type representing a factory function for creating event handlers.
 *
 * @template TIncomingEvent - The type of the incoming event.
 * @template UOutgoingEvent - The type of the outgoing event.
 */
export type HandlerFactory<TIncomingEvent, UOutgoingEvent> = (blueprint: StoneBlueprint) => EventHandler<TIncomingEvent, UOutgoingEvent>

/**
 * Type representing an event handler which can be either functional or class-based.
 *
 * @template TIncomingEvent - The type of the incoming event.
 * @template UOutgoingEvent - The type of the outgoing event.
 */
export type EventHandler<TIncomingEvent = IncomingEvent, UOutgoingEvent = OutgoingEvent> = FunctionalEventHandler<TIncomingEvent, UOutgoingEvent> | ClassEventHandler<TIncomingEvent, UOutgoingEvent>

/**
 * Functional event handler type definition.
 *
 * @template TIncomingEvent - The type of the incoming event.
 * @template UOutgoingEvent - The type of the outgoing event.
 */
export type FunctionalEventHandler<TIncomingEvent = IncomingEvent, UOutgoingEvent = OutgoingEvent> = (event: TIncomingEvent) => Promise<UOutgoingEvent>

/**
 * Interface defining a class-based event handler.
 *
 * @template TIncomingEvent - The type of the incoming event.
 * @template UOutgoingEvent - The type of the outgoing event.
 */
export interface ClassEventHandler<TIncomingEvent = IncomingEvent, UOutgoingEvent = OutgoingEvent> {
  beforeHandle: () => Promise<void>
  onTerminate: () => Promise<void>
  handle: (event: TIncomingEvent) => Promise<UOutgoingEvent>
}

/**
 * Defines the options for an Adapter.
 */
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
