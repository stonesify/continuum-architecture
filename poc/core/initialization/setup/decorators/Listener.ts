import { Decorator, classDecorator, get, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Listener')

export const Listener = <TFunction extends Function>(options: ListenerOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

export const isListener = (Class: Function): boolean => has(Class, META_KEY)

export const getListenerOptions = (Class: Function): ListenerOptions => get(Class, META_KEY)

interface ListenerOptions {
  event: string
}
