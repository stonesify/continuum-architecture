import { DataContainer } from "./DataContainer";

/**
 * The StoneBlueprint class extends the DataContainer class and represents 
 * the blueprint containing all the configurations and data required for 
 * the Stone framework to run. This class serves as a central repository 
 * for storing and managing the essential components of the framework.
 */
export class StoneBlueprint extends DataContainer<Record<string, unknown>> {}
