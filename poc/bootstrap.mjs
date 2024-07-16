import * as app from "./dist/app.js";
import { ConfigBuilder } from "./dist/core.js";

const blueprint = new ConfigBuilder().modules({ app }).build()

console.log(blueprint.all())