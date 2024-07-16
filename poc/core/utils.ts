/**
 * Is function.
 *
 * @param   {any} value
 * @returns {boolean}
 */
export const isFunction = (value: any): boolean => typeof value === 'function'

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
