import { StoneApp } from "../core/initialization/setup/decorators/StoneApp";
import { IntegrationBlueprint } from "../core/integration/setup/Blueprint";
import { DefaultAdapter } from "../core/integration/setup/decorators/DefaultAdapter";

@StoneApp({
  env: 'dev',
  name: 'FooBar',
  imports: [
    [IntegrationBlueprint, { stone: { adapter: { default: { alias: 'StoneAdapter' } } } }]
  ]
})
// @DefaultAdapter({ alias: 'StoneAdapter' })
export class Application {
  static onInit () {}
}
