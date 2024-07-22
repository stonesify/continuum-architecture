import { ErrorHandler } from '../interfaces'
import { EventEmitter } from './EventEmitter'
import { StoneBlueprint } from '../StoneBlueprint'
import { Middleware, Pipeline } from '../Pipeline'
import { KernelEvent } from './events/KernelEvent'
import { ServiceContainer } from './ServiceContainer'
import { IncomingEvent } from '../events/IncomingEvent'
import { OutgoingEvent } from '../events/OutgoingEvent'
import { ClassEventHandler } from '../integration/interfaces'
import { OutgoingEventContext, RouterInterface, ServicePovider } from './interfaces'

export class Kernel<TIncomingEvent extends IncomingEvent, UOutgoingEvent extends OutgoingEvent> implements ClassEventHandler<TIncomingEvent, UOutgoingEvent> {
  private booted: boolean
  private incomingEvent: TIncomingEvent
  private outgoingEvent: UOutgoingEvent

  private readonly eventEmitter: EventEmitter
  private readonly container: ServiceContainer
  private readonly providers: Set<ServicePovider>
  private readonly registeredProviders: Set<string>

  constructor (private readonly blueprint: StoneBlueprint) {
    this.booted = false
    this.providers = new Set()
    this.registeredProviders = new Set()
    this.eventEmitter = new EventEmitter()
    this.container = new ServiceContainer()

    this.registerBaseBindings()
  }

  private get handler (): ClassEventHandler<TIncomingEvent, UOutgoingEvent> {
    return this.container.resolve(this.blueprint.get('stone.kernel.handler'))
  }

  private get errorHandler (): ErrorHandler<Error, OutgoingEventContext<TIncomingEvent, UOutgoingEvent>, UOutgoingEvent> | undefined {
    if (this.blueprint.has('stone.kernel.errorHandler')) {
      return this.container.resolve(this.blueprint.get('stone.kernel.errorHandler'))
    } else {
      return undefined
    }
  }

  private get responseContext (): OutgoingEventContext<TIncomingEvent, UOutgoingEvent> {
    return { incomingEvent: this.incomingEvent, outgoingEvent: this.outgoingEvent }
  }

  /** @returns {boolean} */
  private get skipMiddleware (): boolean {
    return this.blueprint.get('stone.kernel.middleware.skip', false)
  }

  private get incomingMiddleware (): Array<Middleware<TIncomingEvent>> {
    return this.skipMiddleware ? [] : this.blueprint.get('stone.kernel.middleware.incoming', [])
  }

  /** @return {Function[]} */
  private get outgoingMiddleware (): Array<Middleware<OutgoingEventContext<TIncomingEvent, UOutgoingEvent>>> {
    return this.skipMiddleware ? [] : this.blueprint.get('stone.kernel.middleware.outgoing', [])
  }

  /** @return {Function[]} */
  private get terminateMiddleware (): Array<Middleware<OutgoingEventContext<TIncomingEvent, UOutgoingEvent>>> {
    return this.skipMiddleware ? [] : this.blueprint.get('stone.kernel.middleware.terminate', [])
  }

  async beforeHandle (): Promise<void> {
    this.makeProviders()
    await this.callProvidersBeforeHandleHook()
    await this.callProvidersRegisterHook()
  }

  async handle (event: TIncomingEvent): Promise<UOutgoingEvent> {
    try {
      await this.onBootstrap(event)
      await this.sendEventThroughDestination(event)
      return await this.prepareOutgoingEvent(event)
    } catch (error) {
      if (this.errorHandler != null) {
        return this.errorHandler.report(error, this.responseContext).render(error, this.responseContext)
      } else {
        throw error
      }
    }
  }

  async onTerminate (): Promise<void> {
    await this.callProvidersOnTerminateHook()
    await Pipeline
      .create<OutgoingEventContext<TIncomingEvent, UOutgoingEvent>>()
      .send(this.responseContext)
      .through(this.terminateMiddleware)
      .serviceContainer(this.container)
      .thenReturn()
  }

  private async onBootstrap (event: TIncomingEvent) {
    if (!event) {
      throw new TypeError('No IncomingEvent provided.')
    }

    if (!this.booted) {
      this.booted = true
      await this.callProvidersBootHook()
    }
  }

  private async sendEventThroughDestination (event: TIncomingEvent): Promise<void> {
    this.outgoingEvent = await Pipeline
      .create<TIncomingEvent>()
      .send(event)
      .through(this.incomingMiddleware)
      .serviceContainer(this.container)
      .then<Promise<UOutgoingEvent>>(async (event: TIncomingEvent) => await this.prepareDestination(event)) as UOutgoingEvent
  }

  private async prepareDestination (event: TIncomingEvent): Promise<UOutgoingEvent> {
    this.incomingEvent = event
    this.container.instance('event', event, 'request')

    // If App router is bound dispatch event to routes.
    if (this.container.bound('router')) {
      const router = this.container.make<RouterInterface<TIncomingEvent, UOutgoingEvent>>('router')
      if (Reflect.has(router, 'dispatch')) {
        return router.dispatch(event)
      }
    }

    // If no routers are bound dispatch event to app handler.
    if (Reflect.has(this.handler, 'handle')) {
      return await this.handler.handle(event)
    }

    throw new TypeError('No router nor handler has been provided.')
  }

  private async prepareOutgoingEvent (event: TIncomingEvent): Promise<UOutgoingEvent> {
    if (!this.outgoingEvent || !Reflect.has(this.outgoingEvent, 'prepare')) {
      throw new TypeError('Returned response must not be undefined and must be an instance of `OutgoingEvent` or a subclass of it.')
    }

    this.container.instance('response', this.outgoingEvent)

    this.eventEmitter.emitEvent(new KernelEvent(KernelEvent.PREPARING_RESPONSE, this.responseContext))

    await this.outgoingEvent.prepare(event, this.blueprint)

    this.eventEmitter.emitEvent(new KernelEvent(KernelEvent.RESPONSE_PREPARED, this.responseContext))

    this.outgoingEvent = await Pipeline
      .create<OutgoingEventContext<TIncomingEvent, UOutgoingEvent>>()
      .send(this.responseContext)
      .through(this.outgoingMiddleware)
      .serviceContainer(this.container)
      .then<Promise<UOutgoingEvent>>(async ({ outgoingEvent }) => outgoingEvent) as UOutgoingEvent

    this.eventEmitter.emitEvent(new KernelEvent(KernelEvent.EVENT_HANDLED, this.responseContext))

    return this.outgoingEvent
  }

  private registerBaseBindings () {
    this
      .container
      .instance(ServiceContainer, this.container, 'container')
      .instance(StoneBlueprint, this.blueprint, ['blueprint', 'config'])
      .instance(EventEmitter, this.eventEmitter, ['events', 'eventEmitter'])
  }

  private makeProviders () {
    this
      .blueprint
      .get('stone.kernel.providers', [])
      .map((provider) => this.container.resolve<ServicePovider>(provider))
      .filter((provider) => !provider.mustSkip?.())
      .forEach((provider) => this.providers.add(provider))

    return this
  }

  private async callProvidersBeforeHandleHook (): Promise<void> {
    for (const provider of this.providers) {
      await provider.beforeHandle?.()
    }
  }

  private async callProvidersRegisterHook (): Promise<void> {
    for (const provider of this.providers) {
      if (!('register' in provider) || this.registeredProviders.has(provider.constructor.name)) {
        continue
      }

      await provider.register?.()

      this.registeredProviders.add(provider.constructor.name)

      if (this.booted) {
        await provider.boot?.()
      }
    }
  }

  private async callProvidersBootHook (): Promise<void> {
    for (const provider of this.providers) {
      await provider.boot?.()
    }
  }

  private async callProvidersOnTerminateHook (): Promise<void> {
    for (const provider of this.providers) {
      await provider.onTerminate?.()
    }
  }
}
