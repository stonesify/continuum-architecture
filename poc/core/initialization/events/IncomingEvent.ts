import { Event } from './Event'

/**
 * Class representing an IncomingEvent.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class IncomingEvent extends Event<Record<string, unknown>> {
  /**
   * INCOMING_EVENT Event name, fires on platform message.
   *
   * @type {Symbol}
   * @event IncomingEvent#INCOMING_EVENT
   */
  static INCOMING_EVENT: Symbol = Symbol.for('Stone.IncomingEvent')

  constructor (data: Record<string, unknown>) {
    super(IncomingEvent.INCOMING_EVENT, data)
  }

  /**
   * Return a cloned instance.
   *
   * @returns {IncomingEvent}
   */
  clone (): IncomingEvent {
    return new IncomingEvent(this.data)
  }
}
