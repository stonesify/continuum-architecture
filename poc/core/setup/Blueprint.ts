/**
 * Setup Blueprint.
*/
export const SetupBlueprint = {
  // Stone namespace configuration options.
  stone: {
    env: null,
    name: null,
    debug: false,
    logger: null,

    // Setup layer configuration options.
    builder: {
      errorHandler: null,
      middleware: new Array(),
      defaultMiddlewarePriority: 10
    }
  }
}
