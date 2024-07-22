import { Kernel } from '../Kernel'
import { ServicePovider } from '../interfaces'
import { isLogger } from './decorators/Logger'
import { NextMiddleware } from '../../Pipeline'
import { isService } from './decorators/Service'
import { isProvider } from './decorators/Provider'
import { StoneBlueprint } from '../../StoneBlueprint'
import { isSubscriber } from './decorators/Subscriber'
import { hasBlueprints } from '../../DecoratorMetadata'
import { BlueprintContext } from '../../setup/interfaces'
import { AdapterOptions } from '../../integration/interfaces'
import { isKernelErrorHandler } from './decorators/KernelErrorHandler'
import { getListenerOptions, isListener } from './decorators/Listener'
import { getKernelMiddlewareOptions, isKernelMiddleware } from './decorators/KernelMiddleware'

export function MainHandlerSetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const handler = context.modules.find((module) => typeof module === 'function' && hasBlueprints(module))

  context.blueprint
    .set('stone.kernel.handler', handler)
    .add('stone.kernel.providers', [handler])

  return next(context)
}

export function AdapterHandlerFactorySetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  Object
    .entries(context.blueprint.get<Record<string, AdapterOptions>>('stone.adapter', {}))
    .forEach(([name]) => context.blueprint.set(`stone.adapter.${name}.handlerFactory`, (blueprint: StoneBlueprint) => new Kernel(blueprint)))

  return next(context)
}

export function AdapterOnInitSubscribersSetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
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

export function LoggerSetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.set(
    'stone.logger',
    context.modules.find((module) => typeof module === 'function' && isLogger(module))
  )

  return next(context)
}

export function KernelMiddlewareSetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  const middleware = context.modules.filter((module) => typeof module === 'function' && isKernelMiddleware(module)) as Function[]

  context.blueprint.add(
    'stone.kernel.middleware.outgoing',
    middleware
      .filter((module) => getKernelMiddlewareOptions(module).outgoing)
      .map((module) => ({ pipe: module, priority: getKernelMiddlewareOptions(module).priority ?? 10 }))
  )

  context.blueprint.add(
    'stone.kernel.middleware.terminate',
    middleware
      .filter((module) => getKernelMiddlewareOptions(module).terminate)
      .map((module) => ({ pipe: module, priority: getKernelMiddlewareOptions(module).priority ?? 10 }))
  )

  context.blueprint.add(
    'stone.kernel.middleware.incoming', 
    middleware
      .filter((module) => {
        const options = getKernelMiddlewareOptions(module)
        return !options.outgoing && !options.terminate
      })
      .map((module) => ({ pipe: module, priority: getKernelMiddlewareOptions(module).priority ?? 10 }))
  )

  return next(context)
}

export function KernelErrorHandlerSetupMMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.set(
    'stone.kernel.errorHandler',
    context.modules.find((module) => typeof module === 'function' && isKernelErrorHandler(module))
  )

  return next(context)
}

export function ProviderSetupMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.add(
    'stone.kernel.providers',
    context.modules.filter((module) => typeof module === 'function' && isProvider(module))
  )

  return next(context)
}

export function ServiceSetupMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.add(
    'stone.kernel.services',
    context.modules.filter((module) => typeof module === 'function' && isService(module))
  )

  return next(context)
}

export function ListenerSetupMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context
    .modules
    .filter((module) => typeof module === 'function' && isListener(module))
    .map((module) => module as Function)
    .forEach((module) => {
      const options = getListenerOptions(module)
      context.blueprint.add(`stone.kernel.listeners.${options.event}`, [module])
    })

  return next(context)
}

export function SubscriberSetupMiddleware<T extends BlueprintContext> (context: T, next: NextMiddleware<T>): T {
  context.blueprint.add(
    'stone.kernel.subscribers',
    context.modules.filter((module) => typeof module === 'function' && isSubscriber(module))
  )

  return next(context)
}

export const KernelSetupMiddleware = [
  { pipe: MainHandlerSetupMMiddleware, priority: 0 },
  { pipe: AdapterHandlerFactorySetupMMiddleware, priority: 0.1 },
  { pipe: AdapterOnInitSubscribersSetupMMiddleware, priority: 0.2 },
  { pipe: ProviderSetupMiddleware, priority: 0.5 },
  { pipe: ServiceSetupMiddleware, priority: 0.6 },
  { pipe: ListenerSetupMiddleware, priority: 0.6 },
  { pipe: SubscriberSetupMiddleware, priority: 0.6 },
  { pipe: KernelMiddlewareSetupMMiddleware, priority: 0.7 },
  { pipe: KernelErrorHandlerSetupMMiddleware, priority: 0.7 },
  { pipe: LoggerSetupMMiddleware, priority: 0.7 }
]