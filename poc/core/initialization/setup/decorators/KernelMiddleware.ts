import { Decorator, classDecorator, get, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Middleware')

export const KernelMiddleware = <TFunction extends Function>(options?: KernelMiddlewareOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const isKernelMiddleware = (Class: Function): boolean => has(Class, META_KEY)

export const getKernelMiddlewareOptions = (Class: Function): KernelMiddlewareOptions => get(Class, META_KEY, {})

interface KernelMiddlewareOptions {
  priority?: number
  outgoing?: boolean
  terminate?: boolean
}
