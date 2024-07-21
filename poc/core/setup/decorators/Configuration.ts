import { Decorator, classDecorator, has } from '../../DecoratorMetadata'

/**
 * A unique symbol key for the Configuration metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol.for('Stone.Configuration')

/**
 * A class decorator that sets the Configuration metadata.
 *
 * @returns {Decorator<TFunction, void>} The class decorator that sets the metadata key to true.
 *
 * @example
 *
 * @Configuration()
 * class AppConfig {
 *   // Class definition
 * }
 */
export const Configuration = <TFunction extends Function>(): Decorator<TFunction, void> => classDecorator(META_KEY)

/**
 * Checks if the given class has configuration metadata.
 *
 * @param   {Function} Class - The class to check for configuration metadata.
 * @returns {boolean} True if the class has configuration metadata, false otherwise.
 */
export const isConfiguration = (Class: Function): boolean => has(Class, META_KEY)
