import { Event } from '../events/Event'
import NodeEventEmitter from 'node:events'

/**
 * Class representing an EventEmitter.
 */
export class EventEmitter extends NodeEventEmitter {
  /**
   * Emit Events.
   *
   * @param {Event} event
   */
  emitEvent<U>(event: Event<U>) {
    super.emit(event.name, event)
  }
}
