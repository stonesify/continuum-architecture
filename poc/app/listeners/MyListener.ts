import { IncomingEvent } from "../../core/events/IncomingEvent";
import { OutgoingEvent } from "../../core/events/OutgoingEvent";
import { Logger, ServiceContainer } from "../../core/interfaces";
import { KernelEvent } from "../../core/initialization/events/KernelEvent";
import { Listener } from "../../core/initialization/setup/decorators/Listener";

@Listener({ event: KernelEvent.RESPONSE_PREPARED })
export class MyListener {
  private readonly logger: Logger

  constructor (container: ServiceContainer) {
    this.logger = container.make('logger')
    console.log('My listener...');
  }

  handle (event: KernelEvent<IncomingEvent, OutgoingEvent>) {
    this.logger.info('Listener => Kernel event response prepared...')
  }
}
