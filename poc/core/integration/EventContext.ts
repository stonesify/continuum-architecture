import { PlatformResponse } from './types'
import { DataContainer } from '../DataContainer'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'

export class EventContext<TMessage, UEvent extends IncomingEvent, VResponse extends PlatformResponse, WEvent extends OutgoingEvent, XContext = unknown> {
  private _response?: VResponse
  private _outgoingEvent?: WEvent

  constructor (
    public readonly blueprint: DataContainer,
    public readonly message: TMessage,
    public readonly incomingEvent: UEvent,
    public readonly context?: XContext
  ) {}

  get response () {
    return this._response
  }

  get outgoingEvent () {
    return this._outgoingEvent
  }

  setResponse (value: VResponse): this {
    this._response = value
    return this
  }

  setOutgoingEvent (value: WEvent): this {
    this._outgoingEvent = value
    return this
  }
}
