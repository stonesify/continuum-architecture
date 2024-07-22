import { KernelSetupMiddleware } from './middleware'
import { CoreServiceProvider } from '../CoreServiceProvider'

/**
 * Initialization Blueprint.
*/
export const InitializationBlueprint = {
  // Stone namespace configuration options.
  stone: {
    env: null,
    name: null,
    debug: false,
    logger: null,

    // Setup layer configuration options.
    builder: {
      middleware: KernelSetupMiddleware
    },

    // Initialization layer configuration options.
    kernel: {
      handler: null,
      middleware: {
        skip: false,
        incoming: [],
        outgoing: [],
        terminate: [],
        defaultPriority: 10
      },
      aliases: {},
      services: [],
      listeners: {},
      providers: [CoreServiceProvider],
      subscribers: [],
      errorHandler: null
    }
  }
}
