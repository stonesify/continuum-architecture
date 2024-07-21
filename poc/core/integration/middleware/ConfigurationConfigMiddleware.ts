import { BlueprintContext } from '../../setup/interfaces'

/**
 * Middleware for handling configuration in the blueprint context.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class ConfigurationConfigMiddleware {
  /**
   * Handles the middleware logic for the given context.
   *
   * @param   {BlueprintContext} context - The blueprint context to be processed.
   * @param   {(context: BlueprintContext) => BlueprintContext} next - The next middleware function in the chain.
   * @returns {BlueprintContext} The processed blueprint context.
   */
  handle (context: BlueprintContext, next: (context: BlueprintContext) => BlueprintContext): BlueprintContext {
    return next(context)
  }
}
