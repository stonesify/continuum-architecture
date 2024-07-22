import { isClass } from './utils'
import { ServiceContainer } from './interfaces'
import { isString, isPlainObject } from 'lodash-es'

/**
 * Class representing a Pipeline.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class Pipeline<TPassable = unknown> {
  /** @type {Pipe[]} */
  private pipes: Array<Pipe<TPassable>> = []

  /** @type {number} */
  private priority: number = 10

  /** @type {boolean} */
  private isSync: boolean = false

  /** @type {TPassable} */
  private passable: TPassable

  /** @type {string} */
  private method: string = 'handle'

  /** @type {Container} */
  private container?: ServiceContainer

  /**
   * Create a pipeline.
   *
   * @returns {Pipeline<TPassable>}
   */
  static create<TPassable> (): Pipeline<TPassable> {
    return new this()
  }

  /**
   * Get the array of pipes definitions.
   *
   * @returns {PipeDefinition[]}
   */
  private get pipeDefinitions (): Array<PipeDefinition<TPassable>> {
    return this.pipes
      .map((pipe) => isPlainObject(pipe) ? pipe : ({ pipe, priority: this.priority }))
      .map((pipe) => pipe as PipeDefinition<TPassable>)
      .sort((a, b) => a.priority - b.priority)
  }

  /**
   * Get the array of configured pipes.
   *
   * @returns {PipeItem<TPassable>[]}
   */
  private get pipeItems (): Array<PipeItem<TPassable>> {
    return this.pipeDefinitions.map((v) => v.pipe)
  }

  /**
   * Set pipes service container.
   *
   * @param   {ServiceContainer} container
   * @returns {this}
   */
  serviceContainer (container: ServiceContainer): this {
    this.container = container
    return this
  }

  /**
   * Set pipes default priority.
   *
   * @param   {number} value
   * @returns {this}
   */
  defaultPriority (value: number): this {
    this.priority = value
    return this
  }

  /**
   * Make pipeline sync.
   *
   * @param   {boolean} value
   * @returns {this}
   */
  sync (value: boolean = true): this {
    this.isSync = value
    return this
  }

  /**
   * Set the passable object being sent on the pipeline.
   *
   * @param   {TPassable} passable
   * @returns {this}
   */
  send (passable: TPassable): this {
    this.passable = passable
    return this
  }

  /**
   * Set the pipes of the pipeline.
   *
   * @param   {Pipe<TPassable>[]} pipes
   * @returns {this}
   */
  through (pipes: Array<Pipe<TPassable>>): this {
    this.pipes = pipes
    return this
  }

  /**
   * Push additional pipes onto the pipeline.
   *
   * @param   {(Pipe<TPassable> | Pipe<TPassable>[])} pipe
   * @returns {this}
   */
  pipe (pipe: Pipe<TPassable> | Array<Pipe<TPassable>>): this {
    this.pipes = this.pipes.concat(pipe)
    return this
  }

  /**
   * Set the method to call on the stops.
   *
   * @param   {string} method
   * @returns {this}
   */
  via (method: string): this {
    this.method = method
    return this
  }

  /**
   * Run the pipeline with a final destination callback.
   *
   * @param   {PipelineDestinationCallback<TPassable, UOutput>} destination
   * @returns {U}
   */
  then<UOutput = TPassable>(destination: PipelineDestinationCallback<TPassable, TPassable | UOutput>): TPassable | UOutput | Promise<TPassable | UOutput> {
    return this
      .pipeItems
      .reverse()
      .reduce<NextPipe<TPassable | UOutput> | NextPromisePipe<TPassable | UOutput>>(
      this.isSync ? this.reducer() : this.asyncReducer(),
      (passable: TPassable) => destination(passable)
    )(this.passable)
  }

  /**
   * Run the pipeline and return the result.
   *
   * @returns {TPassable}
   */
  thenReturn (): TPassable | Promise<TPassable> {
    return this.then((passable: TPassable) => passable)
  }

  /**
   * Get the async reducer that iterate over the pipes.
   *
   * @returns {PipelinePromiseReducer}
   * @throws  {TypeError}
   */
  private asyncReducer (): PipelinePromiseReducer<TPassable> {
    return (next: NextPipe<TPassable>, pipe: PipeItem<TPassable>): NextPromisePipe<TPassable> => {
      return async (passable: TPassable): Promise<TPassable> => {
        if (isString(pipe) || isClass(pipe)) {
          return this.executePipe(pipe, this.makeArgs(passable, next, pipe))
        } else if (typeof pipe === 'function') {
          return Reflect.apply(pipe, undefined, this.makeArgs(passable, next, pipe))
        } else {
          throw new TypeError('Pipe must be a function, a class or a service alias.')
        }
      }
    }
  }

  /**
   * Get the reducer that iterate over the pipes.
   *
   * @returns {PipelineReducer}
   * @throws  {TypeError}
   */
  private reducer (): PipelineReducer<TPassable> {
    return (next: NextPipe<TPassable>, pipe: PipeItem<TPassable>): NextPipe<TPassable> => {
      return (passable: TPassable): TPassable => {
        if (isString(pipe) || isClass(pipe)) {
          return this.executePipe(pipe, this.makeArgs(passable, next, pipe))
        } else if (typeof pipe === 'function') {
          return Reflect.apply(pipe, undefined, this.makeArgs(passable, next, pipe))
        } else {
          throw new TypeError('Pipe must be a function, a class or a service alias.')
        }
      }
    }
  }

  /**
   * Resolve and execute Pipe.
   *
   * @param   {PipeItem<TPassable>} pipe - Pipe can be a class or a service alias string.
   * @param   {PipeArgs<TPassable>} args - Pipe Arguments.
   * @returns {TPassable}
   * @throws  {TypeError}
   */
  private executePipe (pipe: PipeItem<TPassable>, args: PipeArgs<TPassable>): TPassable {
    let instance: Function

    if (this.container != null) {
      instance = this.container.resolve(pipe)
    } else if (typeof pipe === 'function') {
      instance = Reflect.construct(pipe, [])
    } else {
      throw new TypeError(`Cannot resolve this pipe ${pipe}.`)
    }

    if (!Reflect.has(instance, this.method)) {
      throw new TypeError(`No method with this name(${this.method}) exists in this constructor(${instance.constructor.name})`)
    }

    return instance[this.method](...args)
  }

  /**
   * Make args.
   *
   * @param   {TPassable[]} passable
   * @param   {NextPipe<TPassable>} next
   * @param   {PipeItem} pipe
   * @returns {PipeArgs<TPassable>}
   */
  private makeArgs (passable: TPassable, next: NextPipe<TPassable>, pipe: PipeItem<TPassable>): PipeArgs<TPassable> {
    return [passable, next, this.pipeDefinitions.find(v => v.params && v.pipe === pipe)?.params]
  }
}

interface PipeDefinition<TPassable> {
  pipe: PipeItem<TPassable>
  params?: unknown
  priority: number
}

type PipeItem<TPassable> = string | ClassBasedPipe<TPassable> | FunctionalPipe<TPassable>

type Pipe<TPassable> = PipeDefinition<TPassable> | PipeItem<TPassable>

interface ClassBasedPipe<TPassable> {
  handle: (passable: TPassable, next: NextPipe<TPassable>, params?: unknown) => TPassable
}

type FunctionalPipe<TPassable> = (passable: TPassable, next: NextPipe<TPassable>, params?: unknown) => TPassable

type PipeArgs<TPassable> = [TPassable, NextPipe<TPassable>, unknown]

type PipelineDestinationCallback<TPassable, UOutput> = (passable: TPassable) => UOutput

type NextPipe<TPassable> = (passable: TPassable) => TPassable

type NextPromisePipe<TPassable> = (passable: TPassable) => Promise<TPassable>

type PipelineReducer<TPassable> = (next: NextPipe<TPassable>, pipe: PipeItem<TPassable>) => NextPipe<TPassable>

type PipelinePromiseReducer<TPassable> = (next: NextPipe<TPassable>, pipe: PipeItem<TPassable>) => NextPromisePipe<TPassable>

export type NextMiddleware<TPassable> = NextPipe<TPassable>

export type Middleware<TPassable> = Pipe<TPassable>
