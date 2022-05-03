import {
	onActivated,
	onBeforeMount,
	onBeforeUnmount,
	onBeforeUpdate,
	onDeactivated,
	onErrorCaptured,
	onMounted,
	onServerPrefetch,
	onUnmounted,
	onUpdated
} from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

const lifecycle = {
	onActivated,
	onBeforeMount,
	onBeforeUnmount,
	onBeforeUpdate,
	onDeactivated,
	onErrorCaptured,
	onMounted,
	onServerPrefetch,
	onUnmounted,
	onUpdated
}

type Lifecycle =
	| 'onActivated'
	| 'onBeforeMount'
	| 'onBeforeUnmount'
	| 'onBeforeUpdate'
	| 'onDeactivated'
	| 'onErrorCaptured'
	| 'onMounted'
	| 'onServerPrefetch'
	| 'onUnmounted'
	| 'onUpdated'

export const Hook: HookDecorator = createDecorator('Hook', true)

export interface HookDecorator {
	(lifecycle: Lifecycle | Lifecycle[]): MethodDecorator
	MetadataKey: symbol
}

function handler(targetThis: Record<any, any>) {
	handleDecorator<[Lifecycle | Lifecycle[]]>(
		targetThis,
		Hook.MetadataKey,
		store => {
			const { desc, args } = store
			if (!desc || !args.length) return
			args.forEach(arg => {
				arg.forEach(v => {
					if (typeof v === 'string') {
						lifecycle[v]?.(desc.value.bind(targetThis))
					}
					if (Array.isArray(v)) {
						v.forEach(x => lifecycle[x]?.(desc.value.bind(targetThis)))
					}
				})
			})
		},
		true
	)
}

export const HookHandler = {
	key: 'Hook',
	handler
}
