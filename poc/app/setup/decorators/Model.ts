import { Decorator, classDecorator, get, has } from '../../../core/DecoratorMetadata'

/**
 * A unique symbol key for the decorator metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol.for('App.Model')

/**
 * A class decorator that sets the ConfigMiddleware metadata.
 *
 * @returns {Decorator<TFunction, void>} The class decorator that sets the metadata key to true.
 *
 * @example
 *
 * @ConfigMiddleware()
 * class MyConfigMiddleware {
 *   // Class definition
 * }
 */
export const Model = <TFunction extends Function>(options?: ModelOptions): Decorator<TFunction, void> => classDecorator(META_KEY, options)

/**
 * Checks if the given class has configuration middleware metadata.
 *
 * @param   {Function} Class - The class to check for configuration middleware metadata.
 * @returns {boolean} True if the class has configuration middleware metadata, false otherwise.
 */
export const isModel = (Class: Function): boolean => has(Class, META_KEY)

export const getModelOptions = (Class: Function): ModelOptions => get(Class, META_KEY)

interface ModelOptions {
  table?: string
}
