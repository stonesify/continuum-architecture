import { merge } from 'ts-deepmerge'
import { isFunction } from 'lodash-es'
import { SetupBlueprint } from './Blueprint'
import { BlueprintContext } from './interfaces'
import { StoneBlueprint } from '../StoneBlueprint'
import { Middleware, Pipeline } from '../Pipeline'
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
   * @returns {StoneBlueprint}
   */
  build (): StoneBlueprint {
    const blueprint = this.getBlueprint()
    const context: BlueprintContext = { blueprint, modules: this.modules }
    const defaultPriority = blueprint.get<number>('stone.builder.defaultMiddlewarePriority', 10)
    const middleware = blueprint.get<Middleware<BlueprintContext>[]>('stone.builder.middleware', [])

    return Pipeline
      .create<BlueprintContext>()
      .sync()
      .send(context)
      .through(middleware)
      .defaultPriority(defaultPriority)
      .then<StoneBlueprint>(({ blueprint }) => blueprint) as StoneBlueprint
  }

  /**
   * Get Stone blueprint.
   *
   * @returns {StoneBlueprint}
  */
  private getBlueprint (): StoneBlueprint {
    const stoneBlueprint = this
      .gatherSetupBlueprint()
      .concat(this.gatherDeclarativeBlueprints(), this.gatherImperativeBlueprints())
      .reduce((prev, curr) => merge(prev, curr), {})

    return new StoneBlueprint(stoneBlueprint)
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
