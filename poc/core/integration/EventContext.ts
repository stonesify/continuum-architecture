import { PlatformResponse } from './interfaces'
import { StoneBlueprint } from '../StoneBlueprint'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'

export class EventContext<TMessage, UEvent extends IncomingEvent, VResponse extends PlatformResponse, WEvent extends OutgoingEvent, XContext = unknown> {
  private _response?: VResponse
  private _outgoingEvent?: WEvent

  constructor (
    public readonly blueprint: StoneBlueprint,
    public readonly message: TMessage,
    public readonly incomingEvent: UEvent,
    public readonly context?: XContext
  ) {}

  get response (): VResponse | undefined {
    return this._response
  }

  get outgoingEvent (): WEvent | undefined {
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
