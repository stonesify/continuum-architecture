import { Middleware } from '../../../types'
import { EventContext } from '../../EventContext'
import { IntegrationBlueprint } from '../Blueprint'
import { IncomingEvent } from '../../../initialization/events/IncomingEvent'
import { OutgoingEvent } from '../../../initialization/events/OutgoingEvent'
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
export function Adapter <TFunction extends Function> (options?: AdapterOptions): Decorator<TFunction, void> {
  const [[adapter, params]]: any[][] = IntegrationBlueprint.stone.adapters
  const { incomingMiddleware = [], outgoingMiddleware = [], ...rest } = options ?? {}
  const middleware = {
    incoming: [...incomingMiddleware, params.middleware.incoming],
    outgoing: [...outgoingMiddleware, params.middleware.outgoing]
  }
  return blueprintClassDecorator([[{ stone: { adapters: [[adapter, { ...params, ...rest, middleware }]] } }, {}]])
}

/**
 * Interface representing the options for a Stone application.
 */
interface AdapterOptions {
  alias?: string
  current?: boolean
  incomingMiddleware?: Array<Middleware<EventContext<unknown, any, IncomingEvent, OutgoingEvent, null>>>
  outgoingMiddleware?: Array<Middleware<EventContext<unknown, any, IncomingEvent, OutgoingEvent, null>>>
}
