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
