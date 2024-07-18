import { get, set, has, mergeWith } from 'lodash-es'

/**
 * Class representing a DataContainer.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class DataContainer<U = unknown> {
  /**
   * Create a DataContainer.
   *
   * @param {U} [items={}]
   */
  constructor (protected readonly items: U) {
    return new Proxy(this, {
      get (target, prop, receiver) {
        return Reflect.has(target, prop)
          ? Reflect.get(target, prop, receiver)
          : Reflect.apply(target.get, target, [prop])
      }
    })
  }

  /**
   * Get the specified configuration value.
   *
   * @param   {(string|string[]|Record<string, unknown>)} key
   * @param   {T} [fallback=null]
   * @returns {T}
   */
  get<T = unknown> (key: string | string[] | Record<string, unknown>, fallback?: T): T {
    if (!Array.isArray(key) && typeof key === 'object') {
      return this.getMany(key) as T
    }

    return get(this.items, key, fallback)
  }

  /**
   * Get many configuration values.
   *
   * @param   {(string[]|Record<string, unknown>)} keys
   * @returns {Record<string, unknown>}
   */
  getMany (keys: string[] | Record<string, unknown>): Record<string, unknown> {
    const entries = Array.isArray(keys) ? keys.map(v => [v]) : Object.entries(keys)
    return entries.reduce((results, [key, fallback = null]) => ({ ...results, [key]: get(this.items, key, fallback) }), {})
  }

  /**
   * Determine if the given configuration value exists.
   *
   * @param   {(string|string[]|Record<string, unknown>)} key
   * @returns {boolean}
   */
  has (key: string | string[] | Record<string, unknown>): boolean {
    return has(this.items, key)
  }

  /**
   * Set a given configuration value.
   *
   * @param   {(string|string[]|Record<string, unknown>)} key
   * @param   {T} [value=null]
   * @returns {this}
   */
  set<T = unknown> (key: string | string[] | Record<string, unknown>, value?: T): this {
    key = typeof key === 'object' ? key : { [key]: value }

    for (const [name, val] of Object.entries(key)) {
      set(this.items, name, val)
    }

    return this
  }

  /**
   * Allows providers to define the default config for a module.
   *
   * @param   {(string|string[]|Record<string, unknown>)} key
   * @param   {T} value
   * @returns {this}
   */
  add<T = unknown> (key: string | string[] | Record<string, unknown>, value: T): this {
    if (this.has(key)) {
      mergeWith(value, this.get(key))
    }

    return this.set(key, value)
  }

  /**
   * Get all of the configuration items as literal Object.
   *
   * @returns {Record<string, unknown>}
   */
  all (): U {
    return this.items
  }
}
