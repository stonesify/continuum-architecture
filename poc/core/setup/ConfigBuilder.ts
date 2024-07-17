import { Config } from './Config'
import { merge } from 'ts-deepmerge'
import { SetupBlueprint } from './Blueprint'
import { isConstructor, isFunction } from '../utils'
import { isConfiguration } from './decorators/Configuration'
import { isConfigMiddleware } from './decorators/ConfigMiddleware'
import { getBlueprints, hasBlueprints } from './DecoratorMetadata'

/**
 * Class representing a ConfigBuilder.
 * Constructing and configuring the dynamic
 * Complex structured configuration options for StoneFactory.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class ConfigBuilder {
  /**
   * Feature modules.
   *
   * @type {unknown[]}
  */
  private _modules: unknown[] = []

  /**
   * Modules classes.
   *
   * @type {Function[]}
  */
  private _classes: Function[]

  /**
   * Gather classes from modules.
   *
   * @type {Function[]}
  */
  private get classes (): Function[] {
    this._classes ??= this._modules
      .filter((module) => isFunction(module))
      .map((module) => module as Function)

    return this._classes
  }

  /**
   * Add feature modules.
   *
   * @param   {Record<string, unknown>[]} modules
   * @returns {ConfigBuilder}
  */
  modules (...modules: Record<string, unknown>[]): ConfigBuilder {
    this._modules = this._modules.concat(modules.flatMap((module) => Object.values(module)))
    return this
  }

  /**
   * Build Stone blueprint.
   *
   * @returns {Config}
   */
  build (): Config {
    const blueprint = this.getBlueprint()
    const context = { blueprint, modules: this._modules }
    const middleware = blueprint.get<Function[]>('stone.builder.middleware', [])

    const runMiddleware = (index: number = 0): BlueprintContext => {
      if (index < middleware.length) {
        const currentMiddleware = middleware[index]
        if (isConstructor(currentMiddleware)) {
          const middlewareInstance = Reflect.construct(currentMiddleware, [])
          return middlewareInstance.handle(context, () => runMiddleware(index + 1))
        } else {
          return currentMiddleware(context, () => runMiddleware(index + 1))
        }
      } else {
        return context
      }
    }

    return runMiddleware().blueprint
  }

  /**
   * Get Stone blueprint bag.
   *
   * @returns {Config}
  */
  private getBlueprint (): Config {
    const stoneBlueprint = this
      .gatherSetupBlueprint()
      .concat(this.gatherDeclarativeBlueprints(), this.gatherImperativeBlueprints())
      .reduce((prev, curr) => merge(prev, curr), {})
    
    return new Config(stoneBlueprint)
  }

  /**
   * Gather Setup Blueprint.
   * Get configuration middleware first from `@ConfigMiddleware()` decorator
   * And push SetupBlueprint to array.
   *
   * @returns {Record<string, unknown>[]}
  */
  private gatherSetupBlueprint (): Array<Record<string, unknown>> {
    return this.classes
      .filter((Class: Function) => isConfigMiddleware(Class))
      .map((Class: Function) => ({ stone: { builder: { middleware: [Class] } } }))
      .concat(SetupBlueprint)
  }

  /**
   * Gather declarative Blueprints.
   *
   * @returns {Record<string, unknown>[]}
  */
  private gatherDeclarativeBlueprints (): Array<Record<string, unknown>> {
    return this.classes
      .filter((Class: Function) => hasBlueprints(Class))
      .flatMap((Class: Function) => getBlueprints(Class))
      .map(([blueprint, options]) => merge(blueprint, options))
  }

  /**
   * Gather imperative Blueprints.
   *
   * @returns {Record<string, unknown>[]}
  */
  private gatherImperativeBlueprints (): Array<Record<string, unknown>> {
    return this.classes
      .filter((Class: Function) => isConfiguration(Class))
      .map((Class: Function) => Reflect.construct(Class, []))
  }
}

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
   * @type {Config}
   */
  readonly blueprint: Config

  /**
   * Feature modules.
   *
   * @type {unknown[]}
   */
  readonly modules: unknown[]
}
