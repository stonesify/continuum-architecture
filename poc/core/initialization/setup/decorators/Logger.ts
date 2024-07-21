import { Decorator, classDecorator, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.Logger')

export const Logger = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

export const isLogger = (Class: Function): boolean => has(Class, META_KEY)
