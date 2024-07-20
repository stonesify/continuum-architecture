import { Kernel } from '../Kernel'
import { ServicePovider } from '../types'
import { NextMiddleware } from '../../types'
import { isLogger } from './decorators/Logger'
import { isStoneApp } from './decorators/StoneApp'
import { DataContainer } from '../../DataContainer'
import { AdapterOptions } from '../../integration/types'
import { BlueprintContext } from '../../setup/ConfigBuilder'

export function MainHandlerMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
  const handler = context.modules.find((module) => typeof module === 'function' && isStoneApp(module))
  
  context.blueprint
    .set('stone.kernel.handler', handler)
    .add('stone.kernel.providers', handler)

  return next(context)
}

export function AdapterHandlerFactoryMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
  Object
    .entries(context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    .forEach(([name]) => context.blueprint.set(`stone.adapter.${name}.handlerFactory`, (blueprint: DataContainer) => new Kernel(blueprint)))

  return next(context)
}

export function AdapterOnInitSubscribersMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
  Object
    .entries(context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    .forEach(([name]) => {
      context.blueprint.add(
        `stone.adapter.${name}.hooks.onInit`,
        context.blueprint.get<ServicePovider[]>('stone.kernel.providers', []).filter((provider) => 'onInit' in provider)
      )
    })

  return next(context)
}

export function LoggerMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
  context.blueprint.set(
    'stone.logger',
    context.modules.find((module) => typeof module === 'function' && isLogger(module))
  )

  return next(context)
}

// export function KernelMiddlewareMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
//   const adapters = context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter')
//   const middleware = context.modules.filter((module) => typeof module === 'function' && isAdapterMiddleware(module)) as Function[]

//   Object
//     .entries(adapters)
//     .forEach(([name, options]) => {
//       const incoming = middleware.filter((module) => {
//         const params = getAdapterMiddlewareOptions(module)
//         return [name, options.alias, undefined].includes(params.adapter) && !params.outgoing
//       })
//       const outgoing = middleware.filter((module) => {
//         const params = getAdapterMiddlewareOptions(module)
//         return [name, options.alias, undefined].includes(params.adapter) && params.outgoing
//       })
//       const terminate = middleware.filter((module) => {
//         const params = getAdapterMiddlewareOptions(module)
//         return [name, options.alias, undefined].includes(params.adapter) && params.terminate
//       })
//       context.blueprint.add(`stone.kernel.middleware.incoming`, incoming)
//       context.blueprint.add(`stone.kernel.middleware.outgoing`, outgoing)
//       context.blueprint.add(`stone.kernel.middleware.terminate`, terminate)
//     })

//   return next(context)
// }

// export function KernelErrorHandlerMiddleware<T extends BlueprintContext>(context: T, next: NextMiddleware<T>): T {
//   const errorHandlers = context.modules.filter((module) => typeof module === 'function' && isAdapterErrorHandler(module)) as Function[]

//   context.blueprint.set(
//     'stone.kernel.errorHandler',
//     errorHandlers.find((module) => [name, options.alias, undefined].includes(getAdapterErrorHandlerOptions(module).adapter))
//   )

//   return next(context)
// }