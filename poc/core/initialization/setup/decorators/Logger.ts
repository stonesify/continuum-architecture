import { Decorator, classDecorator, get, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Logger')

export const Logger = <TFunction extends Function>(options?: LoggerOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const isLogger = (Class: Function): boolean => has(Class, META_KEY)

export const getLoggerOptions = (Class: Function): LoggerOptions => get(Class, META_KEY, {})

interface LoggerOptions {
  alias?: string | string[]
}
