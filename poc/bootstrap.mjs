import * as app from "./dist/app.js";
import { BlueprintBuilder } from "./dist/core.js";

const blueprint = new BlueprintBuilder().modules(app).build()

console.log(blueprint.all().stone.builder)
console.log('--------------------------------');
console.log(blueprint.all().stone.adapter)
console.log(blueprint.all().stone.adapter.default.middleware)
console.log('--------------------------------');
console.log(blueprint.all().stone.kernel)