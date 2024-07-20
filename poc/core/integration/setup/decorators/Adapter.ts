import { IntegrationBlueprint } from '../Blueprint'
import { Decorator, blueprintClassDecorator } from '../../../setup/DecoratorMetadata'

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
export function Adapter<TFunction extends Function>(options: AdapterOptions = {}): Decorator<TFunction, void> {
  return blueprintClassDecorator([[IntegrationBlueprint, { stone: { adapter: { default : options } } }]])
}

/**
 * Interface representing the options for a Stone application.
 */
interface AdapterOptions {
  alias?: string
  current?: boolean
}
