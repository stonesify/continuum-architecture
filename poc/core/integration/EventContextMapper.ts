import { Middleware } from '../types'
import { isConstructor } from '../utils'
import { EventContext } from './EventContext'
import { IncomingEvent } from '../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../initialization/events/OutgoingEvent'
import { PlatformResponse } from './Adapter'

export class EventContextMapper<TMessage, UResponse extends PlatformResponse, VEvent extends IncomingEvent, WResult extends OutgoingEvent, XContext = unknown> {
  constructor (
    private readonly incomingEventMiddleware: Array<Middleware<EventContext<TMessage, UResponse, VEvent, WResult, XContext>>> = [],
    private readonly outgoingEventMiddleware: Array<Middleware<EventContext<TMessage, UResponse, VEvent, WResult, XContext>>> = []
  ) {}

  async toIncomingEvent (context: EventContext<TMessage, UResponse, VEvent, WResult, XContext>): Promise<VEvent> {
    return (await this.map(context, this.incomingEventMiddleware)).incomingEvent
  }

  async toPlatformResponse (context: EventContext<TMessage, UResponse, VEvent, WResult, XContext>): Promise<UResponse | undefined> {
    return (await this.map(context, this.outgoingEventMiddleware)).response
  }

  private async map (
    context: EventContext<TMessage, UResponse, VEvent, WResult, XContext>,
    middleware: Array<Middleware<EventContext<TMessage, UResponse, VEvent, WResult, XContext>>>
  ): Promise<EventContext<TMessage, UResponse, VEvent, WResult, XContext>> {
    const runMiddleware = async (index: number = 0): Promise<EventContext<TMessage, UResponse, VEvent, WResult, XContext>> => {
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
