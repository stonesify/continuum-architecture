import { isClass } from '../utils'
import { EventEmitter } from './EventEmitter'
import { ServiceContainer } from '../interfaces'
import { StoneBlueprint } from '../StoneBlueprint'
import { getLoggerOptions } from './setup/decorators/Logger'
import { getServiceOptions } from './setup/decorators/Service'
import { EventListener, EventSubscriber, ServicePovider } from './interfaces'

/**
 * Class representing a CoreServiceProvider.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class CoreServiceProvider implements ServicePovider {
  private readonly blueprint: StoneBlueprint
  private readonly eventEmitter: EventEmitter
  private readonly container: ServiceContainer

  /**
   * Create a new instance of Provider.
   *
   * @param {ServiceContainer} container
   */
  constructor (container: ServiceContainer) {
    this.container = container
    this.blueprint = container.make('blueprint')
    this.eventEmitter = container.make('eventEmitter')
  }

  /**
   * Register core components in service container.
   *
   * @returns
   */
  register () {
    this
      .registerServices()
      .registerListeners()
      .registerLogger()
      .registerAlias()
  }

  /**
   * Boot core components.
   *
   * @returns
   */
  boot () {
    this.bootSubscribers()
  }

  private registerServices (): this {
    this.blueprint.get('stone.kernel.services', []).filter((service) => {
      const { singleton, alias } = getServiceOptions(service)
      return singleton
        ? this.container.singleton(service, (container: ServiceContainer) => Reflect.construct(service, [container]), alias)
        : this.container.binding(service, (container: ServiceContainer) => Reflect.construct(service, [container]), alias)
    })
    return this
  }

  private registerAlias (): this {
    Object
      .entries(this.blueprint.get<Record<string, Function[]>>('stone.kernel.aliases', {}))
      .forEach(([alias, Class]) => isClass(Class) && this.container.alias(Class, alias))

    return this
  }

  private registerListeners (): this {
    Object
      .entries(this.blueprint.get<Record<string, Function[]> >('stone.kernel.listeners', {}))
      .forEach(([event, listeners]) => {
        listeners.forEach((listener) => {
          this.eventEmitter.on(event, (e) => this.container.resolve<EventListener>(listener).handle(e))
        })
      })

    return this
  }

  private registerLogger (): this {
    if (this.blueprint.has('stone.logger')) {
      const logger = this.blueprint.get<Function>('stone.logger')
      this.container.singleton(logger, () => Reflect.construct(logger, [this.blueprint]), getLoggerOptions(logger).alias)
    }

    return this
  }

  private bootSubscribers (): this {
    this.blueprint.get('stone.kernel.subscribers', []).forEach((subscriber) => {
      return this.container.resolve<EventSubscriber>(subscriber).subscribe(this.eventEmitter)
    })

    return this
  }
}
