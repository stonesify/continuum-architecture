import { MiddlewareNext } from "../../core/types";
import { BlueprintContext } from "../../core/setup/ConfigBuilder";
import { ConfigMiddleware } from "../../core/setup/decorators/ConfigMiddleware";

@ConfigMiddleware()
export class MyConfigMiddleware {
  handle(context: BlueprintContext, next: MiddlewareNext<BlueprintContext>) {
    console.log('Helooooo...');
    
    return next(context)
  }
}
