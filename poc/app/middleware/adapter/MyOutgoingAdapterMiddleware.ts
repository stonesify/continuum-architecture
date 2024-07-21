import { NextMiddleware } from "../../../core/Pipeline";
import { IncomingEvent } from "../../../core/events/IncomingEvent";
import { OutgoingEvent } from "../../../core/events/OutgoingEvent";
import { EventContext } from "../../../core/integration/EventContext";
import { AdapterMiddleware } from "../../../core/integration/setup/decorators/AdapterMiddleware";

@AdapterMiddleware({ outgoing: true })
export class MyOutgoingAdapterMiddleware<T extends EventContext<unknown, IncomingEvent, any, OutgoingEvent, unknown>> {
  handle(context: T, next: NextMiddleware<T>) {
    console.log('Adapter outgoing event middleware...');
    return next(context)
  }
}