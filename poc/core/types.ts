export interface ClassBasedMiddleware<T> extends Function {
  handle: (context: T, next: (context: T) => T) => T
};

export abstract class AbstractClassBasedMiddleware<T> {
  abstract handle (context: T, next: (context: T) => T): T
}

export type FunctionalMiddleware<T> = (context: T, next: (context: T) => T) => T

export type MiddlewareNext<T> = (context: T) => T

export type Middleware<T> = FunctionalMiddleware<T> | ClassBasedMiddleware<T> | AbstractClassBasedMiddleware<T>

export interface Logger {
  init: () => Promise<never> | never
  log: (level: string, message: unknown) => never
  fatal: (message: unknown) => never
  error: (message: unknown) => never
  warn: (message: unknown) => never
  info: (message: unknown) => never
  debug: (message: unknown) => never
  trace: (message: unknown) => never
}

export interface ErrorHandler<T extends Error, U> {
  report: (error: T) => this
  render: (error: T) => U
}
