import { isConstructor } from './utils'

/**
 * A unique symbol key for storing blueprint metadata.
 *
 * This key is used to associate metadata with blueprints in the context of the
 * framework's introspection and reflection processes.
 *
 * @constant {symbol}
 */
export const BLUEPRINTS_KEY = Symbol.for('StoneBlueprints')

/**
 * Utils for handling decorator metadata.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
/**
 * Sets a metadata value in the given context.
 *
 * @param   {DecoratorContext} context - The decorator context.
 * @param   {(string | number | symbol)} key - The key for the metadata.
 * @param   {unknown} value - The value to set.
 * @returns {void}
 */
export function set (context: DecoratorContext, key: string | number | symbol, value: unknown): void {
  context.metadata ??= {}
  context.metadata[key] = value
}

/**
 * Adds a value to the metadata array for the given key in the context.
 *
 * @param   {DecoratorContext} context - The decorator context.
 * @param   {(string | number | symbol)} key - The key for the metadata.
 * @param   {unknown} value - The value to add.
 * @returns {void}
 */
export function add (context: DecoratorContext, key: string | number | symbol, value: unknown): void {
  set(context, key, [value].concat(context.metadata?.[key] ?? []))
}

/**
 * Checks if the class has metadata for the given key.
 *
 * @param   {Function} Class - The class to check.
 * @param   {(string | number | symbol)} key - The key to check.
 * @returns {boolean} True if the metadata exists, false otherwise.
 */
export function has (Class: Function, key: string | number | symbol): boolean {
  return Class[Symbol.metadata]?.[key] !== undefined
}

/**
 * Gets the metadata value for the given key from the class.
 *
 * @template T - The type of the value being retrieved.
 * @param   {Function} Class - The class to get the metadata from.
 * @param   {(string | number | symbol)} key - The key of the metadata.
 * @param   {T} [fallback=null] - The fallback value if metadata does not exist.
 * @returns {T} The metadata value or the fallback value.
 */
export function get<T> (Class: Function, key: string | number | symbol, fallback?: T): T {
  return (Class[Symbol.metadata]?.[key] ?? fallback) as T
}

/**
 * Gets all metadata from the class.
 *
 * @param   {Function} Class - The class to get all metadata from.
 * @param   {unknown} [fallback=null] - The fallback value if no metadata exists.
 * @returns {unknown} All metadata or the fallback value.
 */
export function all (Class: Function, fallback: unknown = null): unknown {
  return Class[Symbol.metadata] ?? fallback
}

/**
 * Removes the metadata for the given key from the class.
 *
 * @param   {Function} Class - The class to remove the metadata from.
 * @param   {(string | number | symbol)} key - The key of the metadata.
 * @returns {void}
 */
export function remove (Class: Function, key: string | number | symbol): void {
  if (has(Class, key)) {
    const metadata = Class[Symbol.metadata]
    ;(metadata != null) && Reflect.deleteProperty(metadata, key)
  }
}

/**
 * Creates a class-level decorator to set metadata.
 *
 * @param   {(string | number | symbol)} key - The key for the metadata.
 * @param   {unknown} [options=null] - The options to set.
 * @returns {ClassDecorator} The class decorator.
 */
export function classDecorator (key: string | number | symbol, options: DecoratorOptions<Function> = {}): ClassDecorator {
  return (value: Function, context: DecoratorContext): void => {
    if (context.kind === 'class' || isConstructor(value)) {
      set(context, key, typeof options === 'function' ? options(value, context) : options)
    } else {
      throw new TypeError('This decorator can only be applied at class level.')
    }
  }
}

/**
 * Creates a method-level decorator to set metadata.
 *
 * @param   {(string | number | symbol)} key - The key for the metadata.
 * @param   {unknown} [options=null] - The options to set.
 * @returns {MethodDecorator} The method decorator.
 */
export function methodDecorator (key: string | number | symbol, options: DecoratorOptions<Function> = {}): MethodDecorator {
  return (value: Function, context: DecoratorContext): void => {
    if (context.kind === 'method') {
      set(context, key, typeof options === 'function' ? options(value, context) : options)
    } else {
      throw new TypeError('This decorator can only be applied at method level')
    }
  }
}

/**
 * Creates a field-level decorator to set metadata.
 *
 * @param   {(string | number | symbol)} key - The key for the metadata.
 * @param   {unknown} [options=null] - The options to set.
 * @returns {PropertyDecorator} The field decorator.
 */
export function propertyDecorator (key: string | number | symbol, options: DecoratorOptions<undefined> = {}): PropertyDecorator {
  return (value: undefined, context: DecoratorContext): void => {
    if (context.kind === 'field') {
      set(context, key, typeof options === 'function' ? options(value, context) : options)
    } else {
      throw new TypeError('This decorator can only be applied at field level')
    }
  }
}

/**
 * A decorator function type.
 *
 * This interface represents a decorator function that takes a value and a context,
 * and returns a transformed value or void.
 *
 * @template U - The type of the value being decorated.
 * @template V - The return type of the decorator function, defaulting to Function or void.
 */
/**
   * The decorator function.
   *
   * @param {U} value - The value being decorated.
   * @param {DecoratorContext} context - The context in which the decorator is applied.
   * @returns {V} The decorated value or void.
   */
export type Decorator<U, V = Function> = (value: U, context: DecoratorContext) => V

/**
 * A class decorator function type.
 *
 * @param   {Function} value - The class being decorated.
 * @param   {DecoratorContext} context - The context in which the decorator is applied.
 * @returns {Function} The decorated class or void.
 */
export type ClassDecorator = Decorator<Function, Function | void>

/**
 * A method decorator function type.
 *
 * @param   {Function} value - The method being decorated.
 * @param   {DecoratorContext} context - The context in which the decorator is applied.
 * @returns {Function} The decorated method or void.
 */
export type MethodDecorator = Decorator<Function, Function | void>

/**
 * A property decorator function type.
 *
 * @param   {undefined} value - The property being decorated.
 * @param   {DecoratorContext} context - The context in which the decorator is applied.
 * @returns {void} The decorated property or void.
 */
export type PropertyDecorator = Decorator<undefined, void>

/**
 * A callback function type for decorator options.
 *
 * @template T - The type of the value being decorated.
 * @param {T} value - The value being decorated.
 * @param {DecoratorContext} context - The context in which the decorator is applied.
 */
export type DecoratorOptionsCallback<T> = (value: T, context: DecoratorContext) => unknown

/**
 * Represents options for a decorator, which can be either a value of any type or a callback function.
 *
 * @template T - The type of the value being decorated.
 */
export type DecoratorOptions<T> = DecoratorOptionsCallback<T> | unknown

/**
 * The context in which a decorator is applied.
 *
 * This interface provides detailed information about the decorated element,
 * including its kind, name, access methods, and additional metadata.
 */
export interface DecoratorContext {
  /** The kind of the decorated element, such as 'class', 'field', or 'method'. */
  kind: 'class' | 'field' | 'method'

  /** The name of the decorated element. */
  name: string | symbol

  /** Accessor methods for the decorated element. */
  access: {
    /** Optional getter method for the element. */
    get?: () => unknown

    /** Optional setter method for the element. */
    set?: (value: unknown) => void
  }

  /** Indicates if the decorated element is private. */
  isPrivate?: boolean

  /** Indicates if the decorated element is static. */
  isStatic?: boolean

  /**
   * Adds an initializer function to be called after the decoration.
   *
   * @param {Function} initializer - The initializer function to add.
   */
  addInitializer?: (initializer: () => void) => void

  /** Metadata associated with the decorated element. */
  metadata?: Record<string | number | symbol, unknown>
}
