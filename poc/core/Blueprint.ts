/**
 * Stone Blueprint.
*/
export const Blueprint = {
  // Import packages blueprint
  imports: [],

  // Stone namespace configuration options.
  stone: {
    env: null,
    name: null,
    debug: false,
    logger: null,

    // Setup layer configuration options.
    builder: {
      middleware: [],
      errorHandler: null,
      defaultMiddlewarePriority: 10
    },

    // Integration layer configuration options.
    adapters: [
      // {
      //   mapper: {
      //     input: null,
      //     output: null
      //   },
      //   middleware: {
      //     input: [],
      //     output: []
      //   },
      //   current: false,
      //   errorHandler: null,
      //   incommingEvent: null,
      // }
    ],

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

    // http: {},
    // router: {},

  },

  // Feature layer configuration options.
  app: {}
}
