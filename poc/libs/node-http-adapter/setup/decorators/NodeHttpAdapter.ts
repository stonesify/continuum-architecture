import { NodeHttpAdapterBlueprint } from '../Blueprint'
import { Decorator, blueprintClassDecorator } from '../../../../core/DecoratorMetadata'

export function NodeHttpAdapter<TFunction extends Function> (options: NodeHttpAdapterOptions = {}): Decorator<TFunction, void> {
  return blueprintClassDecorator([[NodeHttpAdapterBlueprint, { stone: { adapter: { [NodeHttpAdapter.NAME]: options } } }]])
}

/**
 * Interface representing the options for a Stone application.
 */
interface NodeHttpAdapterOptions {
  alias?: string
  current?: boolean
}
