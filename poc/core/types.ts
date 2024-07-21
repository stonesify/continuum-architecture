export interface ClassBasedMiddleware<T> extends Function {
  handle: (context: T, next: (context: T) => T) => T
};

export abstract class AbstractClassBasedMiddleware<T> {
  abstract handle (context: T, next: (context: T) => T): T
}

export type FunctionalMiddleware<T> = (context: T, next: (context: T) => T) => T

export type NextMiddleware<T> = (context: T) => T

export type Middleware<T> = FunctionalMiddleware<T> | ClassBasedMiddleware<T> | AbstractClassBasedMiddleware<T>

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
