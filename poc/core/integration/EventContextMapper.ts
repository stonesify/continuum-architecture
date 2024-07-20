import { Middleware } from '../types'
import { isConstructor } from '../utils'
import { PlatformResponse } from './types'
import { EventContext } from './EventContext'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'

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
    const runMiddleware = async (index: number = 0): Promise<EventContext<TMessage, UEvent, VResponse, WEvent, XContext>> => {
      if (index < middleware.length) {
        const currentMiddleware = middleware[index] as Function
        if (isConstructor(currentMiddleware)) {
          const middlewareInstance = Reflect.construct(currentMiddleware, [])
          return await middlewareInstance.handle(context, async () => await runMiddleware(index + 1))
        } else {
          return await currentMiddleware(context, async () => await runMiddleware(index + 1))
        }
      } else {
        return context
      }
    }

    return await runMiddleware()
  }
}
