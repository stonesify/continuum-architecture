import { Configuration } from '../../core/setup/decorators/Configuration'

@Configuration()
export class AppConfig {
  constructor () {
    console.log('My App Imperative config...')
  }

  readonly stone = {
    name: 'Stone'
  }
}
