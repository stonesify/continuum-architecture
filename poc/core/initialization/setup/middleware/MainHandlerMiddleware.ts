import { isStoneApp } from "../decorators/StoneApp";
import { BlueprintContext } from "../../../setup/ConfigBuilder";

export class MainHandlerMiddleware<T extends BlueprintContext> {
  handle (context: T, next: (context: T) => T): T {
    context.blueprint.set(
      'stone.kernel.handler',
      context.modules.find((module) => typeof module === 'function' && isStoneApp(module))
    )
    return next(context)
  }
}