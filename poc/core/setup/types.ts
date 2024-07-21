import { DataContainer } from '../DataContainer'

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
   * @type {DataContainer}
   */
  readonly blueprint: DataContainer

  /**
   * Feature modules.
   *
   * @type {unknown[]}
   */
  readonly modules: unknown[]
}
