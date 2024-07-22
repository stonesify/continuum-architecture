import { NextMiddleware } from "../../../core/Pipeline";
import { IncomingEvent } from "../../../core/events/IncomingEvent";
import { OutgoingEvent } from "../../../core/events/OutgoingEvent";
import { EventContext } from "../../../core/integration/EventContext";
import { AdapterMiddleware } from "../../../core/integration/setup/decorators/AdapterMiddleware";

@AdapterMiddleware()
export class MyIncomingAdapterMiddleware<T extends EventContext<unknown, IncomingEvent, any, OutgoingEvent, unknown>> {
  constructor () {
    console.log('My incoming Adapter middleware...');
  }

  handle(context: T, next: NextMiddleware<T>) {
    console.log('Adapter incoming event middleware...');
    return next(context)
  }
}