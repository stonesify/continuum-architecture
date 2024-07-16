import { classDecorator, has, get, Decorator } from '../DecoratorMetadata'

/**
 * A unique symbol key for the Configuration metadata.
 *
 * @constant {symbol}
 */
const META_KEY = Symbol.for('Stone.App')

/**
 * A class decorator that sets the Configuration metadata.
 *
 * @returns {Decorator<TFunction, void>} The class decorator that sets the metadata key to true.
 *
 * @example
 *
 * @StoneApp()
 * class Application {
 *   // Class definition
 * }
 */
export function StoneApp <TFunction extends Function>(options?: AppOptions): Decorator<TFunction, void> {
  return classDecorator(META_KEY, { stone: { ...options, imports: [] }, imports: options?.imports ?? [] })
}

/**
 * Checks if the given class is the main handler.
 *
 * @param   {Function} Class - The class to check for configuration metadata.
 * @returns {boolean} True if the class has configuration metadata, false otherwise.
 */
export const isStoneApp = (Class: Function): boolean => has(Class, META_KEY)

/**
 * Retrieves the options metadata for the given class.
 *
 * @param   {Function} Class - The class to retrieve the options metadata from.
 * @returns {StoneOptions | undefined} The options metadata or undefined if not found.
 */
export const getStoneAppOptions = (Class: Function): StoneAppOptions => get(Class, META_KEY)

/**
 * Creates a class-level decorator to add blueprint metadata.
 *
 * @param   {Record<string, unknown>} blueprint - The blueprint object to be added.
 * @param   {unknown} [options={}] - Additional options for the blueprint.
 * @returns {Decorator<T, void>} The class decorator.
 */
export function BlueprintDecoratorFactory<T extends Function>(blueprint: Record<string, unknown>, options: unknown = {}): Decorator<T, void> {
  return classDecorator(META_KEY, (Class: Function) => {
    const appOptions = get<StoneAppOptions>(Class, META_KEY, { stone: {}, imports: [] })
    appOptions.imports = [...appOptions.imports].concat([[blueprint, options]])
    return appOptions
  })
}

/**
 * Interface representing the options for a Stone application.
 */
interface AppOptions {
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

export interface StoneAppOptions {
  imports: Array<[Record<string, unknown>, unknown]>
  stone: Pick<AppOptions, 'name' | 'debug' | 'env'>
}