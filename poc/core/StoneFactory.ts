import { DataContainer } from "./DataContainer";
import { ConfigBuilder } from "./setup/ConfigBuilder";
import { AdapterInterface, AdapterOptions } from "./integration/types";

/**
 * Class representing StoneFactory.
 *
 * @version 0.0.1
 * @author Mr. Stone <evensstone@gmail.com>
 */
export class StoneFactory {
  private readonly configBuilder: ConfigBuilder

  static create (...modules: Array<Record<string, unknown>>) {
    return new this(...modules)
  }

  constructor(...modules: Array<Record<string, unknown>>) {
    this.configBuilder = new ConfigBuilder().modules(...modules)
  }

  initialize (blueprint: DataContainer): AdapterInterface {
    return Reflect.construct(this.gatherCurrentAdapter(blueprint), [blueprint])
  }

  run (): unknown {
    return this.initialize(this.makeBlueprint()).run()
  }

  private makeBlueprint () {
    return this.configBuilder.build()
  }

  private gatherCurrentAdapter (blueprint: DataContainer): Function {
    const adapters = Object.values(blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    const current = adapters.find((adapter) => adapter.preferred) ??
      adapters.find((adapter) => adapter.current) ??
      adapters.find((adapter) => adapter.default)
    
    if (current) {
      return current.type
    } else {
      throw new TypeError('No adapters provided. Stone.js needs at least one adapter to run.')
    }
  }
}
