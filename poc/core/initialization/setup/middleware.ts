import { Kernel } from '../Kernel'
import { ServicePovider } from '../types'
import { NextMiddleware } from '../../types'
import { isLogger } from './decorators/Logger'
import { DataContainer } from '../../DataContainer'
import { BlueprintContext } from '../../setup/types'
import { hasBlueprints } from '../../DecoratorMetadata'
import { AdapterOptions } from '../../integration/types'
import { isKernelErrorHandler } from './decorators/KernelErrorHandler'
import { getKernelMiddlewareOptions, isKernelMiddleware } from './decorators/KernelMiddleware'

export function MainHandlerMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const handler = context.modules.find((module) => typeof module === 'function' && hasBlueprints(module))

  context.blueprint
    .set('stone.kernel.handler', handler)
    .add('stone.kernel.providers', [handler])

  return next(context)
}

export function AdapterHandlerFactoryMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  Object
    .entries(context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    .forEach(([name]) => context.blueprint.set(`stone.adapter.${name}.handlerFactory`, (blueprint: DataContainer<Record<string, unknown>>) => new Kernel(blueprint)))

  return next(context)
}

export function AdapterOnInitSubscribersMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
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

export function LoggerMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.set(
    'stone.logger',
    context.modules.find((module) => typeof module === 'function' && isLogger(module))
  )

  return next(context)
}

export function KernelMiddlewareMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const middleware = context.modules.filter((module) => typeof module === 'function' && isKernelMiddleware(module)) as Function[]

  context.blueprint.add('stone.kernel.middleware.outgoing', middleware.filter((module) => getKernelMiddlewareOptions(module).outgoing))
  context.blueprint.add('stone.kernel.middleware.terminate', middleware.filter((module) => getKernelMiddlewareOptions(module).terminate))
  context.blueprint.add('stone.kernel.middleware.incoming', middleware.filter((module) => {
    const options = getKernelMiddlewareOptions(module)
    return !options.outgoing && !options.terminate
  }))

  return next(context)
}

export function KernelErrorHandlerMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.set(
    'stone.kernel.errorHandler',
    context.modules.find((module) => typeof module === 'function' && isKernelErrorHandler(module))
  )

  return next(context)
}
