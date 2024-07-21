import { DataContainer } from '../DataContainer'
import { EventHandlerInterface } from '../integration/types'

export class Kernel<VEvent, WEvent> implements EventHandlerInterface<VEvent, WEvent> {
  private booted: boolean
  private incomingEvent: VEvent
  private outgoingEvent: WEvent

  private readonly container: any
  private readonly providers: Set<Function>
  private readonly eventEmitter: any
  private readonly registeredProviders: Set<Function>
  private readonly handler: EventHandlerInterface<VEvent, WEvent>

  constructor (private readonly blueprint: DataContainer<Record<string, unknown>>) {
    this.booted = false
    this.providers = new Set()
    this.registeredProviders = new Set()
  }

  async beforeHandle (): Promise<void> {

  }

  async handle (event: VEvent): Promise<WEvent> {
    return {} as WEvent
  }

  async onTerminate (): Promise<void> {}
}
