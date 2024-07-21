import { StoneBlueprint } from '../StoneBlueprint'

/**
 * Middleware blueprint context.
 *
 * This interface represents the context passed through middleware functions,
 * containing the blueprint configuration and feature modules.
 */
export interface BlueprintContext {
  /**
   * Stone blueprint configuration.
   *
   * @type {StoneBlueprint}
   */
  readonly blueprint: StoneBlueprint

  /**
   * Feature modules.
   *
   * @type {unknown[]}
   */
  readonly modules: unknown[]
}
