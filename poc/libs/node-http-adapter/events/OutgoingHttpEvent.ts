import { StoneBlueprint } from '../../../core/StoneBlueprint'
import { IncomingEvent } from '../../../core/events/IncomingEvent'
import { OutgoingEvent } from '../../../core/events/OutgoingEvent'

/**
 * Class representing an OutgoingHttpEvent.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class OutgoingHttpEvent<T = unknown> extends OutgoingEvent {
  /**
   * OUTGOING_RESPONSE Event name, fires on reponse to the incoming event.
   *
   * @type {Symbol}
   * @event OutgoingHttpEvent#OUTGOING_RESPONSE
   */
  static OUTGOING_RESPONSE: symbol = Symbol('Stone@OutgoingHttpEvent')

  constructor (body: T, statusCode?: number, statusMessage?: string) {
    super({ body, statusCode, statusMessage }, statusCode, statusMessage, OutgoingHttpEvent.OUTGOING_RESPONSE)
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
   * @returns {void}
   */
  async prepare (event?: IncomingEvent, blueprint?: StoneBlueprint): Promise<void> {

  }
}
