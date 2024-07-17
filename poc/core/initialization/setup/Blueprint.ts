import { MainHandlerMiddleware } from "./middleware/MainHandlerMiddleware";

/**
 * Initialization Blueprint.
*/
export const InitializationBlueprint = {
  // Stone namespace configuration options.
  stone: {
    // Setup layer configuration options.
    builder: {
      middleware: [MainHandlerMiddleware]
    },

    // Initialization layer configuration options.
    kernel: {
      handler: null,
      middleware: {
        skip: false,
        event: [],
        response: [],
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
