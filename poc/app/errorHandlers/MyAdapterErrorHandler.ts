import { ErrorHandler, Logger } from "../../core/types";
import { DataContainer } from "../../core/DataContainer";
import { IncomingEvent } from "../../core/events/IncomingEvent";
import { OutgoingEvent } from "../../core/events/OutgoingEvent";
import { EventContext } from "../../core/integration/EventContext";
import { AdapterErrorHandler } from "../../core/integration/setup/decorators/AdapterErrorHandler";

@AdapterErrorHandler()
export class MyAdapterErrorHandler<T extends EventContext<unknown, IncomingEvent, any, OutgoingEvent, unknown>> implements ErrorHandler<Error, T, unknown> {

  constructor(private readonly blueprint: DataContainer) {
    console.log('My adapter error handler...')
  }

  report(error: Error, context: T): this {
    const logger = this.makeLogger() ?? console
    logger.error({ error, context })
    return this
  }

  render(error: Error, context: T): unknown {
    return { error, context }
  }

  private makeLogger (): Logger | undefined {
    if (this.blueprint.has('stone.logger')) {
      return Reflect.construct(this.blueprint.get('stone.logger'), [this.blueprint])
    } else {
      return undefined
    }
  }
}