import { get, set, has, mergeWith } from 'lodash-es'

/**
 * Class representing a Config.
 *
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class Config {
  /**
   * @type {Record<string, unknown>}
   */
  private _items: Record<string, unknown>

  /**
   * Create a Config.
   *
   * @param {Record<string, unknown>} [items={}]
   */
  constructor (items: Record<string, unknown> = {}) {
    this._items = { ...items, __proto__: null }
  }

  /**
   * All of the configuration items.
   *
   * @public
   * @returns {Record<string, unknown>}
   */
  get items (): Record<string, unknown> {
    return this._items
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

    return get(this._items, key, fallback)
  }

  /**
   * Get many configuration values.
   *
   * @param   {(string[]|Record<string, unknown>)} keys
   * @returns {Record<string, unknown>}
   */
  getMany (keys: string[] | Record<string, unknown>): Record<string, unknown> {
    const entries = Array.isArray(keys) ? keys.map(v => [v]) : Object.entries(keys)
    return entries.reduce((results, [key, fallback = null]) => ({ ...results, [key]: get(this._items, key, fallback) }), {})
  }

  /**
   * Determine if the given configuration value exists.
   *
   * @param   {(string|string[]|Record<string, unknown>)} key
   * @returns {boolean}
   */
  has (key: string | string[] | Record<string, unknown>): boolean {
    return has(this._items, key)
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
      set(this._items, name, val)
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
  all (): Record<string, unknown> {
    return this._items
  }

  /**
   * Clear all of the configuration items.
   *
   * @returns {this}
   */
  clear (): this {
    this._items = Object.create(null)

    return this
  }
}
