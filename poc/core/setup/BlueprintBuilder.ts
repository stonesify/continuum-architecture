import { merge } from 'ts-deepmerge'
import { BlueprintContext } from './types'
import { SetupBlueprint } from './Blueprint'
import { isClass, isFunction } from '../utils'
import { DataContainer } from '../DataContainer'
import { isConfiguration } from './decorators/Configuration'
import { isConfigMiddleware } from './decorators/ConfigMiddleware'
import { getBlueprints, hasBlueprints } from '../DecoratorMetadata'

/**
 * Class representing a BlueprintBuilder.
 * Constructing the StoneBlueprint by introspection and Reflexion.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class BlueprintBuilder {
  /**
   * Feature modules.
   *
   * @type {unknown[]}
  */
  private readonly modules: unknown[]

  /**
   * Modules classes.
   *
   * @type {Function[]}
  */
  private readonly classes: Function[]

  /**
   * BlueprintBuilder constructor.
   *
   * @param {Record<string, unknown>[]} modules
  */
  constructor (...modules: Array<Record<string, unknown>>) {
    this.modules = modules.flatMap((module) => Object.values(module))
    this.classes = this.modules.filter((module) => isFunction(module)).map((module) => module as Function)
  }

  /**
   * Build Stone blueprint.
   *
   * @returns {DataContainer}
   */
  build (): DataContainer {
    const blueprint = this.getBlueprint()
    const context = { blueprint, modules: this.modules }
    const middleware = blueprint.get<Function[]>('stone.builder.middleware', [])

    const runMiddleware = (index: number = 0): BlueprintContext => {
      if (index < middleware.length) {
        const currentMiddleware = middleware[index]
        if (isClass(currentMiddleware)) {
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
   * @returns {DataContainer}
  */
  private getBlueprint (): DataContainer {
    const stoneBlueprint = this
      .gatherSetupBlueprint()
      .concat(this.gatherDeclarativeBlueprints(), this.gatherImperativeBlueprints())
      .reduce((prev, curr) => merge(prev, curr), {})

    return new DataContainer(stoneBlueprint)
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
