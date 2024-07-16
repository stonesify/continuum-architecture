import { Decorator, classDecorator, has } from '../DecoratorMetadata'

/**
 * A unique symbol key for the ConfigMiddleware metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol.for('Stone.Configuration.Middleware')

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
export const ConfigMiddleware = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

/**
 * Checks if the given class has configuration middleware metadata.
 *
 * @param   {Function} Class - The class to check for configuration middleware metadata.
 * @returns {boolean} True if the class has configuration middleware metadata, false otherwise.
 */
export const isConfigMiddleware = (Class: Function): boolean => has(Class, META_KEY)
