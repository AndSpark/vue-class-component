import { getCurrentInstance } from 'vue-demi'

export function useCtx() {
	const instance = getCurrentInstance()
	// @ts-ignore
	return instance?.setupContext as SetupContext
}

export function useCurrentInstance() {
	const instance = getCurrentInstance()

	return instance
}

export function useVueComponent() {
	const instance = getCurrentInstance()

	return instance?.proxy
}
