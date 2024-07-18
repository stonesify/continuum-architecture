import { Adapter } from '../Adapter'

/**
 * Integration Blueprint.
*/
export const IntegrationBlueprint = {
  // Stone namespace configuration options.
  stone: {
    // Integration layer configuration options.
    adapters: [
      [
        Adapter,
        {
          middleware: {
            incoming: [],
            outgoing: []
          },
          default: true,
          current: false,
          errorHandler: null
        }
      ]
    ]
  }
}
