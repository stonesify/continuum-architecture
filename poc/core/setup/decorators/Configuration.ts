import { ClassDecorator, classDecorator, has } from '../../DecoratorMetadata'

/**
 * A unique symbol key for the Configuration metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol('Configuration')

/**
 * A class decorator that sets the Configuration metadata.
 *
 * @returns {ClassDecorator} The class decorator that sets the metadata key to true.
 *
 * @example
 *
 * @Configuration()
 * class AppConfig {
 *   // Class definition
 * }
 */
export const Configuration = (): ClassDecorator => classDecorator(META_KEY)

/**
 * Checks if the given class has configuration metadata.
 *
 * @param {Function} Class - The class to check for configuration metadata.
 * @returns {boolean} True if the class has configuration metadata, false otherwise.
 */
export const isConfiguration = (Class: Function): boolean => has(Class, META_KEY)
