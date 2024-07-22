import { Decorator, classDecorator, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Subscriber')

export const Subscriber = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

export const isSubscriber = (Class: Function): boolean => has(Class, META_KEY)
