import { Decorator, classDecorator, get, has } from "../../../setup/DecoratorMetadata"

const META_KEY = Symbol.for('Stone.Integration.ErrorHandler')

export const AdapterErrorHandler = <TFunction extends Function>(options?: AdapterErrorHandlerOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const isAdapterErrorHandler = (Class: Function): boolean => has(Class, META_KEY)

export const getAdapterErrorHandlerOptions = (Class: Function): AdapterErrorHandlerOptions => get(Class, META_KEY, {})

interface AdapterErrorHandlerOptions {
  adapter?: string
}