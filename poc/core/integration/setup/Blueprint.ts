import { Adapter } from '../Adapter'

/**
 * Integration Blueprint.
*/
export const IntegrationBlueprint = {
  // Stone namespace configuration options.
  stone: {
    // Integration layer configuration options.
    adapter: {
      [Adapter.NAME]: {
        alias: null,
        type: Adapter,
        middleware: {
          incoming: [],
          outgoing: []
        },
        default: true,
        current: false,
        hooks: {
          onInit: [],
          beforeHandle: [],
          onTerminate: []
        },
        errorHandler: null,
        HandlerFactory: null,
      }
    }
  }
}
