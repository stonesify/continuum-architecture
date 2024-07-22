import { Logger } from "../../core/interfaces";
import { ServiceContainer } from "../../core/initialization/ServiceContainer";
import { Provider } from "../../core/initialization/setup/decorators/Provider";

@Provider()
export class MyServiceProvider {
  private readonly container: ServiceContainer

  constructor (container: ServiceContainer) {
    this.container = container
    console.log('My provider....');
  }

  boot () {
    this.container.make<Logger>('log').warn('MyServiceProvider boot method...')
  }
}
