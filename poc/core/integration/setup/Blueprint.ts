import { Adapter } from '../Adapter'
import { AdapterErrorHandlerMiddleware, AdapterMiddlewareMiddleware } from './middleware'

/**
 * Integration Blueprint.
*/
export const IntegrationBlueprint = {
  // Stone namespace configuration options.
  stone: {
    // Setup layer configuration options.
    builder: {
      middleware: [
        AdapterMiddlewareMiddleware,
        AdapterErrorHandlerMiddleware
      ]
    },

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
        handlerFactory: null
      }
    }
  }
}
