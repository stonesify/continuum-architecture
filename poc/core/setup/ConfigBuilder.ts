import { Config } from '../Config'
import { merge } from 'ts-deepmerge'
import { Middleware } from '../types'
import { isConstructor, isFunction } from '../utils'
import { isConfiguration } from './decorators/Configuration'
import { isConfigMiddleware } from './decorators/ConfigMiddleware'
import { getStoneAppOptions, isStoneApp } from './decorators/StoneApp'
import { Blueprint } from '../Blueprint'

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
   * @type {FeatureModules}
  */
  private _modules: FeatureModules = {}

  /**
   * Default middleware priority.
   * The priority determine the middleware execution order.
   *
   * @type {number}
  */
  private _defaultPriority: number = 10

  /**
   * Config Middleware.
   *
   * @type {Middleware<BlueprintContext>[]}
  */
  private _middleware: Array<Middleware<BlueprintContext>> = []

  /**
   * Modules classes.
   *
   * @type {Function[]}
  */
  private _classes: Function[] = []

  /**
   * Gather classes from modules.
   *
   * @type {Function[]}
  */
  private get classes (): Function[] {
    this._classes ??= Object
      .values(this._modules)
      .filter((module: unknown) => isFunction(module))
      .map((module: unknown) => module as Function)

    return this._classes
  }

  /**
   * Add configuration middleware.
   *
   * @param   {(Middleware<BlueprintContext> | Middleware<BlueprintContext>[])} middleware
   * @returns {ConfigBuilder}
  */
  middleware (middleware: Middleware<BlueprintContext> | Array<Middleware<BlueprintContext>>): ConfigBuilder {
    this._middleware = this._middleware.concat(middleware)
    return this
  }

  /**
   * Add default middleware priority.
   *
   * @param   {number} priority
   * @returns {ConfigBuilder}
  */
  defaultPriority (priority: number): ConfigBuilder {
    this._defaultPriority = priority
    return this
  }

  /**
   * Add feature modules.
   *
   * @param   {FeatureModules} modules
   * @returns {ConfigBuilder}
  */
  modules (modules: FeatureModules): ConfigBuilder {
    this._modules = { ...this._modules, ...modules }
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

    const runMiddleware = (index: number): BlueprintContext => {
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

    return runMiddleware(0).blueprint
  }

  /**
   * Get Config Middleware.
   *
   * @returns {Config}
  */
  private getBlueprint (): Config {
    const middleware = this.gatherConfigMiddleware()
    const imperative = this.gatherImperativeBlueprints().reduce((prev, curr) => merge(prev, curr), {})
    const declarative = this.gatherDeclarativeBlueprints().reduce((prev, curr) => merge(prev, curr), {})

    return new Config(merge(declarative, imperative, { stone: { builder: { middleware } } }))
  }

  /**
   * Get configuration middleware from `@ConfigMiddleware()` decorator.
   *
   * @returns {Middleware<BlueprintContext>[]}
  */
  private gatherConfigMiddleware (): Array<Middleware<BlueprintContext>> {
    return this.classes
      .filter((Class: Function) => isConfigMiddleware(Class))
      .map((Class: Function) => Class as Middleware<BlueprintContext>)
  }

  /**
   * Gather declarative Blueprints.
   *
   * @returns {Record<string, unknown>[]}
  */
  private gatherDeclarativeBlueprints (): Array<Record<string, unknown>> {
    return this.classes
      .filter((Class: Function) => isStoneApp(Class))
      .flatMap((Class: Function) => {
        const options = getStoneAppOptions(Class)
        return [[Blueprint, { ...options, imports: undefined }], ...(options.imports ?? [])]
      })
      .map(([blueprint, options]) => merge(blueprint, options as any))
  }

  /**
   * Gather imperative Blueprints.
   *
   * @returns {Record<string, unknown>[]}
  */
  private gatherImperativeBlueprints (): Array<Record<string, unknown>> {
    return this.classes
      .filter((Class: Function) => isConfiguration(Class))
      .map((Class: Function) => Class.prototype)
      .map((blueprint) => {
        Reflect.deleteProperty(blueprint, 'constructor')
        return blueprint
      })
  }
}

/**
 * User-defined modules in the feature layer.
 *
 * This interface represents a collection of modules, where each module can be
 * a function, a string, a number, a boolean, an array of these types, or nested
 * feature modules.
 */
export interface FeatureModules {
  /**
   * Module key pair value.
   *
   * The key is a string that identifies the module, and the value can be one of
   * several types: Function, string, number, boolean, an array of these types,
   * or nested feature modules.
   */
  readonly [key: string]: Function | Function[] | string | string[] | number | number[] | boolean | boolean[] | FeatureModules
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
   * @type {FeatureModules}
   */
  readonly modules: FeatureModules
}
