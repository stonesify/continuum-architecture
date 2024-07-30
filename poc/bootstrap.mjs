import * as app from "./.stone/app.js";
// import { BlueprintBuilder } from "./dist/core.js";
import { StoneApplication } from "./.stone/core.js";

// const blueprint = new BlueprintBuilder(app).build()

// console.log(blueprint.all().stone.builder)
// console.log('--------------------------------');
// console.log(blueprint.all().stone.adapter)
// console.log(blueprint.all().stone.adapter.default.middleware)
// console.log('--------------------------------');
// console.log(blueprint.all().stone.kernel)

export const stone = await StoneApplication.create(app).run()