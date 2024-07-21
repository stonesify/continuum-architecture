import { NextMiddleware } from "../../../core/types";
import { BlueprintContext } from "../../../core/setup/types";
import { getModelOptions, isModel } from "../decorators/Model";
import { ConfigMiddleware } from "../../../core/setup/decorators/ConfigMiddleware";

@ConfigMiddleware()
export class ModelMiddleware<T extends BlueprintContext> {
  handle(context: T, next: NextMiddleware<T>) {
    const models = context.modules
      .filter((module) => typeof module === 'function' && isModel(module))
      .map((module: Function) => [module, getModelOptions(module)])
    
    context.blueprint.set('app.models', models)
    
    return next(context)
  }
}
