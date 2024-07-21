export interface Logger {
  init: () => void
  log: (level: string, message: unknown) => void
  fatal: (message: unknown) => void
  error: (message: unknown) => void
  warn: (message: unknown) => void
  info: (message: unknown) => void
  debug: (message: unknown) => void
  trace: (message: unknown) => void
}

export interface ErrorHandler<TError extends Error, UContext, VResponse> {
  report: (error: TError, context: UContext) => this
  render: (error: TError, context: UContext) => VResponse
}


export interface ServiceContainerInterface<T = unknown> {
  make<T>(key: unknown): T
  bound (key: unknown): boolean
  resolve<T>(key: unknown): T
  instance(key: unknown, value: unknown, alias?: string | string[]): this
  binding (key: unknown, resolver: Function, alias?: string | string[]): this
  singleton (key: unknown, resolver: Function, alias?: string | string[]): this
}