import { InjectionToken, Provider, ReflectiveInjector } from 'injection-js'
import { getCurrentInstance } from 'vue-demi'
import { createCurrentInjector, getCurrentInjector, injectService } from './decorators/component'
import type { Constructor } from './types'

export function useCtx() {
	const instance = getCurrentInstance()
	// @ts-ignore
	return instance!.setupContext as SetupContext
}

export function useCurrentInstance() {
	const instance = getCurrentInstance()!

	return instance
}

export function useVueComponent() {
	const instance = getCurrentInstance()

	return instance!.proxy
}

export const resolveInstance = (provider: Provider) => {
	const resolvedProviders = ReflectiveInjector.resolve([provider])
	const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, getCurrentInjector())

	return injector.get(provider)
}

export const resolveInstances = (providers: Provider[]) => {
	const resolvedProviders = ReflectiveInjector.resolve(providers)
	const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders, getCurrentInjector())

	return providers.map(v => injector.get(v))
}

export const getProxyService = <T extends object>(Service: any) => {
	return new Proxy<T>(
		//@ts-ignore
		{},
		{
			get(target, key: keyof T) {
				return injectService(Service)?.[key]
			},
		}
	) as T
}

export const createService = <T extends Constructor<any>>(
	Service: T,
	params: ConstructorParameters<T>
) => {
	if (!params) return createCurrentInjector([Service]).get(Service)
	const tokens = params.map((v, i) => new InjectionToken(String(i)))
	const Provider: Provider = {
		provide: Service,
		useFactory: (...args: any[]) => {
			return new Service(...args)
		},
		deps: tokens,
	}

	const ps = tokens.map((v, i) => ({ provide: v, useValue: params[i] }))

	return createCurrentInjector([Provider, ...ps]).get(Service)
}
