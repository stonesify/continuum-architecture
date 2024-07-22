import { IncomingEvent } from "../../core/events/IncomingEvent";
import { ErrorHandler, Logger, ServiceContainer } from "../../core/interfaces";
import { KernelErrorHandler } from "../../core/initialization/setup/decorators/KernelErrorHandler";

@KernelErrorHandler()
export class MyKernelErrorHandler<T extends IncomingEvent> implements ErrorHandler<Error, T, unknown> {
  private readonly logger: Logger

  constructor (container: ServiceContainer) {
    this.logger = container.make('logger')
    console.log('My kernel error handler...')
  }

  report(error: Error, context: T): this {
    this.logger.error({ error, context })
    return this
  }

  render(error: Error, context: T): unknown {
    return { error, context }
  }
}