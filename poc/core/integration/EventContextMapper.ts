import { EventContext } from './EventContext'
import { PlatformResponse } from './interfaces'
import { Middleware, Pipeline } from '../Pipeline'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'

export class EventContextMapper<TMessage, UEvent extends IncomingEvent, VResponse extends PlatformResponse, WEvent extends OutgoingEvent, XContext = unknown> {
  constructor (
    private readonly incomingEventMiddleware: Array<Middleware<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>>> = [],
    private readonly outgoingEventMiddleware: Array<Middleware<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>>> = []
  ) {}

  async toIncomingEvent (context: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>): Promise<UEvent> {
    return (await this.map(context, this.incomingEventMiddleware)).incomingEvent
  }

  async toPlatformResponse (context: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>): Promise<VResponse | undefined> {
    return (await this.map(context, this.outgoingEventMiddleware)).response
  }

  private async map (
    context: EventContext<TMessage, UEvent, VResponse, WEvent, XContext>,
    middleware: Array<Middleware<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>>>
  ): Promise<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>> {
    return await Pipeline
      .create<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>>()
      .send(context)
      .through(middleware)
      .thenReturn()
  }
}
