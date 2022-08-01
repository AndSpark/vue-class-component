import { computed } from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

interface ComputedDecorator {
	(): PropertyDecorator
	MetadataKey: symbol
}

export const Computed: ComputedDecorator = createDecorator('Computed')

function handler(targetThis: Record<any, any>) {
	handleDecorator<[]>(
		targetThis,
		Computed.MetadataKey,
		store => {
			const { key, desc } = store
			if (!desc) return
			const keyVal = computed({
				get: () => desc.get?.call(targetThis),
				set: val => desc.set?.call(targetThis, val)
			})

			Object.defineProperty(targetThis, key, {
				enumerable: true,
				configurable: true,
				get() {
					return keyVal.value
				},
				set(v) {
					keyVal.value = v
				}
			})
		},
		true
	)
}

export const computedHandler = {
	key: 'Computed',
	handler
}
