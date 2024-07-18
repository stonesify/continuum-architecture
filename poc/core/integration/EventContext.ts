import { PlatformResponse } from './Adapter'
import { DataContainer } from '../DataContainer'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'

export class EventContext<TMessage, UResponse extends PlatformResponse, VEvent extends IncomingEvent, WResult extends OutgoingEvent, XContext = unknown> {
  constructor (
    public readonly blueprint: DataContainer,
    public readonly incomingEvent: VEvent,
    public readonly message?: TMessage,
    public readonly response?: UResponse,
    public readonly outgoingEvent?: WResult,
    public readonly context?: XContext
  ) {}

  cloneWith (event: VEvent, result: WResult): EventContext<TMessage, UResponse, VEvent, WResult, XContext> {
    return new EventContext(this.blueprint, event, this.message, this.response, result, this.context)
  }
}
