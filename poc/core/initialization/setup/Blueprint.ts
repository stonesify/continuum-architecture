import { AdapterHandlerFactoryMiddleware, AdapterOnInitSubscribersMiddleware, KernelErrorHandlerMiddleware, KernelMiddlewareMiddleware, LoggerMiddleware, MainHandlerMiddleware } from './middleware'

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
      middleware: [
        MainHandlerMiddleware,
        LoggerMiddleware,
        KernelMiddlewareMiddleware,
        KernelErrorHandlerMiddleware,
        AdapterHandlerFactoryMiddleware,
        AdapterOnInitSubscribersMiddleware
      ]
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
      providers: [],
      subscribers: [],
      errorHandler: null
    }
  }
}
