import { Event } from './Event'
import { IncomingEvent } from './IncomingEvent'

/**
 * Class representing an OutgoingEvent.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class OutgoingEvent<T = unknown> extends Event<Record<string, unknown>> {
  /**
   * OUTGOING_RESPONSE Event name, fires on reponse to the incoming event.
   *
   * @type {Symbol}
   * @event OutgoingEvent#OUTGOING_RESPONSE
   */
  static OUTGOING_RESPONSE: Symbol = Symbol('stone.OutgoingEvent')

  constructor (body: T, statusCode?: number, statusMessage?: string) {
    super(OutgoingEvent.OUTGOING_RESPONSE, { body, statusCode, statusMessage })
  }

  /** @returns {T} */
  get body (): T {
    return this.get('body')
  }

  /** @returns {number} */
  get statusCode (): number {
    return this.get('statusCode')
  }

  /** @returns {string} */
  get statusMessage (): string {
    return this.get('statusMessage')
  }

  /**
   * Prepare response before send it.
   *
   * @param   {IncomingEvent} event
   * @returns {this}
   */
  prepare (event?: IncomingEvent): OutgoingEvent {
    return this
  }
}
