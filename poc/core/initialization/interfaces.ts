import { Event } from '../events/Event'

export interface ServicePovider {
  mustSkip?: () => boolean
  onInit?: () => Promise<void> | void
  beforeHandle?: () => Promise<void> | void
  onTerminate?: () => Promise<void> | void
  register?: () => Promise<void> | void
  boot?: () => Promise<void> | void
}

export interface RouterInterface<TIncomingEvent, UOutgoingEvent> {
  dispatch: (event: TIncomingEvent) => UOutgoingEvent
}

export interface OutgoingEventContext<TIncomingEvent, UOutgoingEvent> {
  incomingEvent: TIncomingEvent
  outgoingEvent: UOutgoingEvent
}

export interface EventEmitterInterface {}

export interface EventSubscriber {
  subscribe: (eventEmitter: EventEmitterInterface) => void
}

export interface EventListener<TEvent = unknown> {
  handle: (event: Event<TEvent>) => void
}
