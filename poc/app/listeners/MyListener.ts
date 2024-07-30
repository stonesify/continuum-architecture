import { IncomingEvent } from '../../core/events/IncomingEvent'
import { OutgoingEvent } from '../../core/events/OutgoingEvent'
import { Logger, ServiceContainer } from '../../core/interfaces'
import { KernelEvent } from '../../core/initialization/events/KernelEvent'
import { Listener } from '../../core/initialization/setup/decorators/Listener'
import { MyService } from '../services/MyService'

@Listener({ event: KernelEvent.RESPONSE_PREPARED })
export class MyListener {
  private readonly logger: Logger
  private readonly myService: MyService

  constructor (container: ServiceContainer) {
    this.logger = container.make('logger')
    this.myService = container.make('myService')
    console.log('My App listener...')
  }

  handle (event: KernelEvent<IncomingEvent, OutgoingEvent>) {
    this.logger.info('Listener => Kernel event response prepared...')
    this.logger.warn('Calling foobar on MyService...')
    this.myService.foobar()
  }
}
