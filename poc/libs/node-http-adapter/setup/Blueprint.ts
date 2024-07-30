import { NodeHTTPAdapter } from '../NodeHTTPAdapter'
import { AdapterErrorHandlerMiddleware, AdapterMiddlewareMiddleware } from './middleware'

/**
 * Integration Blueprint.
*/
export const NodeHttpAdapterBlueprint = {
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
      [NodeHTTPAdapter.NAME]: {
        alias: null,
        type: NodeHTTPAdapter,
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
