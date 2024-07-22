import { Event } from '../../events/Event'
import { OutgoingEventContext } from '../interfaces'

/**
 * Class representing a kernel Event.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 *
 * @extends Event
 */
export class KernelEvent<TIncomingEvent, UOutgoingEvent> extends Event<OutgoingEventContext<TIncomingEvent, UOutgoingEvent>> {
  /**
   * EVENT_HANDLED Event name, fires when event was intercepted by kernel.
   *
   * @type {string}
   * @event Event#EVENT_HANDLED
   */
  static EVENT_HANDLED = 'stonejs@kernel.event_handled'

  /**
   * RESPONSE_PREPARED Event name, fires before preparing the response.
   *
   * @type {string}
   * @event Event#RESPONSE_PREPARED
   */
  static RESPONSE_PREPARED = 'stonejs@kernel.response_prepared'

  /**
   * PREPARING_RESPONSE Event name, fires after the response was prepared.
   *
   * @type {string}
   * @event Event#PREPARING_RESPONSE
   */
  static PREPARING_RESPONSE = 'stonejs@kernel.preparing_response'
}
