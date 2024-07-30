import { AdapterOptions } from '../interfaces'
import { NextMiddleware } from '../../Pipeline'
import { BlueprintContext } from '../../setup/interfaces'
import { getAdapterMiddlewareOptions, isAdapterMiddleware } from './decorators/AdapterMiddleware'
import { getAdapterErrorHandlerOptions, isAdapterErrorHandler } from './decorators/AdapterErrorHandler'

export function AdapterMiddlewareMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const adapters = context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter')
  const middleware = context.modules.filter((module) => typeof module === 'function' && isAdapterMiddleware(module)) as Function[]

  Object
    .entries(adapters)
    .forEach(([name, options]) => {
      context.blueprint.add(
        `stone.adapter.${name}.middleware.incoming`,
        middleware
          .filter((module) => {
            const params = getAdapterMiddlewareOptions(module)
            return [name, options.alias, undefined].includes(params.adapter) && !params.outgoing
          })
          .map((module) => ({ pipe: module, priority: getAdapterMiddlewareOptions(module).priority ?? 10 }))
      )

      context.blueprint.add(
        `stone.adapter.${name}.middleware.outgoing`,
        middleware
          .filter((module) => {
            const params = getAdapterMiddlewareOptions(module)
            return [name, options.alias, undefined].includes(params.adapter) && params.outgoing
          })
          .map((module) => ({ pipe: module, priority: getAdapterMiddlewareOptions(module).priority ?? 10 }))
      )
    })

  return next(context)
}

export function AdapterErrorHandlerMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const adapters = context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter')
  const errorHandlers = context.modules.filter((module) => typeof module === 'function' && isAdapterErrorHandler(module)) as Function[]

  Object
    .entries(adapters)
    .forEach(([name, options]) => {
      context.blueprint.set(
        `stone.adapter.${name}.errorHandler`,
        errorHandlers.find((module) => [name, options.alias, undefined].includes(getAdapterErrorHandlerOptions(module).adapter))
      )
    })

  return next(context)
}
