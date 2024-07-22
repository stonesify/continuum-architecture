import { Logger, ServiceContainer } from "../../core/interfaces";
import { EventEmitter } from "../../core/initialization/EventEmitter";
import { KernelEvent } from "../../core/initialization/events/KernelEvent";
import { Subscriber } from "../../core/initialization/setup/decorators/Subscriber";

@Subscriber()
export class MySubscriber {
  private readonly logger: Logger

  constructor (container: ServiceContainer) {
    this.logger = container.make('logger')
    console.log('My subscriber');
  }

  subscribe (eventEmitter: EventEmitter) {
    eventEmitter.on(KernelEvent.PREPARING_RESPONSE, (e) => this.logger.info('Subscriber => Kernel event preparing response...'))
  }
}
