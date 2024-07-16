import { ClassDecorator, classDecorator, has, get } from '../../DecoratorMetadata'

/**
 * A unique symbol key for the Configuration metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol('StoneApp')

/**
 * Interface representing the options for a Stone application.
 */
interface StoneAppOptions {
  /**
   * The environment in which the application is running.
   *
   * @type {string}
   */
  env?: string

  /**
   * The name of the application.
   *
   * @type {string}
   */
  name?: string

  /**
   * Indicates if debug mode is enabled.
   *
   * @type {boolean}
   */
  debug?: boolean

  /**
   * An array of imports, each containing a blueprint object and its corresponding options.
   *
   * @type {Array<[Record<string, unknown>, unknown]>}
   */
  imports?: Array<[Record<string, unknown>, unknown]>
}

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
export const StoneApp = (options: StoneAppOptions): ClassDecorator => classDecorator(META_KEY, options)

/**
 * Checks if the given class has configuration metadata.
 *
 * @param   {Function} Class - The class to check for configuration metadata.
 * @returns {boolean} True if the class has configuration metadata, false otherwise.
 */
export const isStoneApp = (Class: Function): boolean => has(Class, META_KEY)

/**
 * Retrieves the options metadata for the given class.
 *
 * @param   {Function} Class - The class to retrieve the options metadata from.
 * @returns {StoneAppOptions | undefined} The options metadata or undefined if not found.
 */
export const getStoneAppOptions = (Class: Function): StoneAppOptions => get<StoneAppOptions>(Class, META_KEY, {})

/**
 * Creates a class-level decorator to add blueprint metadata.
 *
 * @param   {Record<string, unknown>} blueprint - The blueprint object to be added.
 * @param   {unknown} [options={}] - Additional options for the blueprint.
 * @returns {ClassDecorator} The class decorator.
 */
export const BlueprintDecoratorFactory = (blueprint: Record<string, unknown>, options: unknown = {}): ClassDecorator => {
  return classDecorator(META_KEY, (Class: Function) => {
    const appOptions: StoneAppOptions = get<StoneAppOptions>(Class, META_KEY, {})
    appOptions.imports ??= []
    appOptions.imports.push([blueprint, options])
    return appOptions
  })
}
