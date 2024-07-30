import { NextMiddleware } from '../../../core/Pipeline'
import { IncomingEvent } from '../../../core/events/IncomingEvent'
import { OutgoingEvent } from '../../../core/events/OutgoingEvent'
import { EventContext } from '../../../core/integration/EventContext'
import { KernelMiddleware } from '../../../core/initialization/setup/decorators/KernelMiddleware'

@KernelMiddleware({ outgoing: true })
export class MyOutgoingKernelMiddleware<T extends EventContext<unknown, IncomingEvent, any, OutgoingEvent, unknown>> {
  constructor () {
    console.log('My App outgoing kernel middleware...')
  }

  handle (context: T, next: NextMiddleware<T>) {
    console.log('Kernel outgoing event middleware...')
    return next(context)
  }
}
