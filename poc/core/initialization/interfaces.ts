export interface ServicePovider {
  mustSkip?(): boolean
  onInit?(): Promise<void> | void
  beforeHandle?(): Promise<void> | void
  onTerminate?(): Promise<void> | void
  register?(): Promise<void> | void
  boot?(): Promise<void> | void
}


export interface RouterInterface<TIncomingEvent, UOutgoingEvent> {
  dispatch(event: TIncomingEvent): UOutgoingEvent
}

export interface KernelResponseContext<TIncomingEvent, UOutgoingEvent> {
  incomingEvent: TIncomingEvent
  outgoingEvent: UOutgoingEvent
}