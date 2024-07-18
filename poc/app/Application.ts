import { StoneApp } from "../core/initialization/setup/decorators/StoneApp";
import { Adapter } from "../core/integration/setup/decorators/Adapter";

@StoneApp({ env: 'dev', name: 'FooBar' })
@Adapter({ alias: 'StoneAdapter' })
export class Application {

}
