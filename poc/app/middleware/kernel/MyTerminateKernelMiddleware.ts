import { NextMiddleware } from "../../../core/types";
import { IncomingEvent } from "../../../core/events/IncomingEvent";
import { OutgoingEvent } from "../../../core/events/OutgoingEvent";
import { EventContext } from "../../../core/integration/EventContext";
import { KernelMiddleware } from "../../../core/initialization/setup/decorators/KernelMiddleware";

@KernelMiddleware({ terminate: true })
export class MyTerminateKernelMiddleware<T extends EventContext<unknown, IncomingEvent, any, OutgoingEvent, unknown>> {
  handle(context: T, next: NextMiddleware<T>) {
    console.log('Kernel terminate event middleware...');
    return next(context)
  }
}