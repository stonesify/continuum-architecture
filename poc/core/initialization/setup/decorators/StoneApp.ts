import { InitializationBlueprint } from '../Blueprint'
import { Decorator, blueprintClassDecorator } from '../../../DecoratorMetadata'

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
export function StoneApp <TFunction extends Function> (options?: AppOptions): Decorator<TFunction, void> {
  const { imports = [], ...stone } = options ?? {}
  return blueprintClassDecorator([[InitializationBlueprint, { stone }], ...imports])
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
   * @type {Array<[Record<string, unknown>, Record<string, unknown>]>}
   */
  imports?: Array<[Record<string, unknown>, Record<string, unknown>]>
}
