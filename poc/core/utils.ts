/**
 * Is function.
 *
 * @param   {unknown} value
 * @returns {boolean}
 */
export const isFunction = (value: unknown): boolean => typeof value === 'function'

/**
 * Is constructor function.
 *
 * @param   {any} value
 * @returns {boolean}
 */
export const isConstructor = (value: any): boolean => {
  try {
    Reflect.construct(String, [], value)
  } catch (e) {
    return e.message.includes('is not a constructor') === false
  }

  return true
}

/**
 * Is class.
 *
 * @param   {unknown} value
 * @returns {boolean}
 */
export const isClass = (value: unknown): boolean => typeof value === 'function' && /^\s*class/.test(value.toString())

/**
 * Is string.
 *
 * @param   {unknown} value
 * @returns {boolean}
 */
export const isString = (value: unknown): boolean => typeof value === 'string' || value instanceof String

/**
 * Is Pojo.
 *
 * @param   {unknown} value
 * @returns {boolean}
 */
export const isPlainObject = (value: unknown): boolean => Object.getPrototypeOf(value) === Object.prototype