import { Logger } from '../../core/interfaces'
import { Service } from '../../core/initialization/setup/decorators/Service'
import { ServiceContainer } from '../../core/initialization/ServiceContainer'

@Service({ alias: 'myService' })
export class MyService {
  private readonly log: Logger

  constructor (container: ServiceContainer) {
    this.log = container.make('log')
    console.log('My App service...')
  }

  foobar () {
    this.log.warn('Foo bar service...')
  }
}
