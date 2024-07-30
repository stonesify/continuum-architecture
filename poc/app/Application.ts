import { IncomingEvent } from '../core/events/IncomingEvent'
import { OutgoingEvent } from '../core/events/OutgoingEvent'
import { Logger, ServiceContainer } from '../core/interfaces'
import { IntegrationBlueprint } from '../core/integration/setup/Blueprint'
import { StoneApp } from '../core/initialization/setup/decorators/StoneApp'
import { DefaultAdapter } from '../core/integration/setup/decorators/DefaultAdapter'

@StoneApp({
  env: 'dev',
  name: 'FooBar',
  imports: [
    [IntegrationBlueprint, { stone: { adapter: { default: { alias: 'StoneAdapter' } } } }]
  ]
})
// @DefaultAdapter({ alias: 'StoneAdapter' })
export class Application {
  private readonly container: ServiceContainer

  constructor (container: ServiceContainer) {
    this.container = container
    console.log('My App main handler...')
  }

  static onInit () {}

  handle (event: IncomingEvent): OutgoingEvent {
    const logger = this.container.make<Logger>('logger')
    logger.info('IncomingEvent-----|>')
    logger.debug(event)
    return new OutgoingEvent({})
  }
}
