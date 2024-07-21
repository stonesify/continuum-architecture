import { Decorator, classDecorator, get, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Integration.Middleware')

export const AdapterMiddleware = <TFunction extends Function>(options?: AdapterMiddlewareOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const isAdapterMiddleware = (Class: Function): boolean => has(Class, META_KEY)

export const getAdapterMiddlewareOptions = (Class: Function): AdapterMiddlewareOptions => get(Class, META_KEY, {})

interface AdapterMiddlewareOptions {
  adapter?: string
  outgoing?: boolean
  priority?: number
}
