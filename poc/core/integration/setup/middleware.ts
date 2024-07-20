import { AdapterOptions } from '../types'
import { NextMiddleware } from '../../types'
import { BlueprintContext } from '../../setup/ConfigBuilder'
import { getAdapterMiddlewareOptions, isAdapterMiddleware } from './decorators/AdapterMiddleware'
import { getAdapterErrorHandlerOptions, isAdapterErrorHandler } from './decorators/AdapterErrorHandler'

export function AdapterMiddlewareMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
  const adapters = context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter')
  const middleware = context.modules.filter((module) => typeof module === 'function' && isAdapterMiddleware(module)) as Function[]

  Object
    .entries(adapters)
    .forEach(([name, options]) => {
      const incoming = middleware.filter((module) => {
        const params = getAdapterMiddlewareOptions(module)
        return [name, options.alias, undefined].includes(params.adapter) && !params.outgoing
      })
      const outgoing = middleware.filter((module) => {
        const params = getAdapterMiddlewareOptions(module)
        return [name, options.alias, undefined].includes(params.adapter) && params.outgoing
      })
      context.blueprint.set(`stone.adapter.${name}.middleware`, { incoming, outgoing })
    })

  return next(context)
}

export function AdapterErrorHandlerMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
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
