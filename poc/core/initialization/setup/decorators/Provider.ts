import { Decorator, classDecorator, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Provider')

export const Provider = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

export const isProvider = (Class: Function): boolean => has(Class, META_KEY)
