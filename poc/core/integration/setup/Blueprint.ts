import { BaseAdapter } from '../BaseAdapter'
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
      [BaseAdapter.NAME]: {
        alias: null,
        type: BaseAdapter,
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
