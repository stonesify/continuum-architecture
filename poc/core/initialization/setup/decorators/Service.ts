import { Decorator, classDecorator, get, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Service')

export const Service = <TFunction extends Function>(options?: ServiceOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const Injectable = Service

export const isService = (Class: Function): boolean => has(Class, META_KEY)

export const getServiceOptions = (Class: Function): ServiceOptions => get(Class, META_KEY, {})

interface ServiceOptions {
  singleton?: boolean
  alias?: string
}
