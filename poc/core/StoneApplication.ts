import { DataContainer } from './DataContainer'
import { BlueprintBuilder } from './setup/BlueprintBuilder'
import { AdapterInterface, AdapterOptions } from './integration/types'

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

  initialize (blueprint: DataContainer): AdapterInterface {
    return Reflect.construct(this.gatherCurrentAdapter(blueprint), [blueprint])
  }

  run (): unknown {
    return this.initialize(this.makeBlueprint()).run()
  }

  private makeBlueprint (): DataContainer {
    return this.blueprintBuilder.build()
  }

  private gatherCurrentAdapter (blueprint: DataContainer): Function {
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
