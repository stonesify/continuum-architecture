import { isConstructor } from '../utils'

export class ServiceContainer {
  private readonly bindings: Map<unknown, Binding> = new Map()
  private readonly aliases: Map<string | string[], unknown> = new Map()

  alias (key: unknown, aliases: string | string[]) {
    Array<string>()
      .concat(aliases)
      .forEach(alias => {
        if (key === alias) {
          throw new TypeError('Key cannot be aliased to itself.')
        } else if (!this.bound(key)) {
          throw new TypeError('Cannot alias an unbound value')
        }
        this.aliases.set(alias, key)
      })

    return this
  }

  isAlias (alias: string): boolean {
    return this.aliases.has(alias)
  }

  getAlias<T>(alias: string): T {
    return this.aliases.get(alias) as T
  }

  instance (key: unknown, value: unknown, alias?: string | string[]) {
    this.bindings.set(key, { resolve: <T>() => value as T })
    return this.alias(key, alias ?? [])
  }

  binding (key: unknown, resolver: Function, alias?: string | string[]) {
    this.bindings.set(key, { resolve: (container: ServiceContainer) => resolver(container) })
    return this.alias(key, alias ?? [])
  }

  singleton (key: unknown, resolver: Function, alias?: string | string[]) {
    this.bindings.set(key, {
      resolved: false,
      resolve (container: ServiceContainer) {
        if (this.resolved === false) {
          this.resolved = true
          this.value = resolver(container)
        }

        return this.value
      }
    })

    return this.alias(key, alias ?? [])
  }

  bound (key: unknown): boolean {
    return this.bindings.has(this.getKey(key))
  }

  make<T>(key: unknown): T {
    if (this.bound(key)) {
      return this.bindings.get(this.getKey(key))!.resolve(this)
    }

    throw new TypeError(`No service found for this key: ${key}`)
  }

  resolve<T>(key: Function): T {
    if (this.bound(key)) {
      return this.make(key)
    } else if (isConstructor(key)) {
      return this.singleton(key, (container: ServiceContainer) => Reflect.construct(key, [container])).make(key)
    }

    throw new TypeError(`No service found for this key: ${key}`)
  }

  private getKey (key: unknown): unknown {
    return typeof key === 'string' && this.isAlias(key) ? this.getAlias(key) : key
  }
}

interface Binding {
  value?: unknown
  resolved?: boolean
  resolve: <T>(container: ServiceContainer) => T
}
