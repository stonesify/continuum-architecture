import { Decorator, classDecorator, has } from '../../../DecoratorMetadata'

const META_KEY = Symbol.for('Stone.Initialization.ErrorHandler')

export const KernelErrorHandler = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

export const isKernelErrorHandler = (Class: Function): boolean => has(Class, META_KEY)
