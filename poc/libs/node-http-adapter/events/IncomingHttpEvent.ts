import { IncomingEvent } from '../../../core/events/IncomingEvent'

/**
 * Class representing an IncomingHttpEvent.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class IncomingHttpEvent extends IncomingEvent {
  /**
   * INCOMING_EVENT Event name, fires on platform message.
   *
   * @type {Symbol}
   * @event IncomingHttpEvent#INCOMING_EVENT
   */
  static INCOMING_EVENT: symbol = Symbol.for('Stone@IncomingHttpEvent')

  constructor (data: Record<string, unknown>) {
    super(data, IncomingHttpEvent.INCOMING_EVENT)
  }

  /**
   * Return a cloned instance.
   *
   * @returns {IncomingHttpEvent}
   */
  clone (): IncomingHttpEvent {
    return new IncomingHttpEvent(this.data)
  }
}
