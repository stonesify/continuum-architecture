import { StoneBlueprint } from './StoneBlueprint'
import { BlueprintBuilder } from './setup/BlueprintBuilder'
import { Adapter, AdapterOptions } from './integration/interfaces'

/**
 * Class representing StoneApplication.
 *
 * @version 0.0.1
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class StoneApplication {
  private readonly blueprintBuilder: BlueprintBuilder

  static create (...modules: Array<Record<string, unknown>>): StoneApplication {
    return new this(...modules)
  }

  constructor (...modules: Array<Record<string, unknown>>) {
    this.blueprintBuilder = new BlueprintBuilder(...modules)
  }

  initialize (blueprint: StoneBlueprint): Adapter {
    return Reflect.construct(this.gatherCurrentAdapter(blueprint), [blueprint])
  }

  run () {
    return this.initialize(this.makeBlueprint()).run()
  }

  private makeBlueprint (): StoneBlueprint {
    return this.blueprintBuilder.build()
  }

  private gatherCurrentAdapter (blueprint: StoneBlueprint): Function {
    const adapters = Object.values(blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    const current = adapters.find((adapter) => adapter.preferred) ??
      adapters.find((adapter) => adapter.current) ??
      adapters.find((adapter) => adapter.default)

    if (current != null) {
      return current.type
    } else {
      throw new TypeError('No adapters provided. Stone.js needs at least one adapter to run.')
    }
  }
}
