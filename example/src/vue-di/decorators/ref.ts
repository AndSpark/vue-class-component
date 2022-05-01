import { ref } from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

interface RefDecorator {
	(): PropertyDecorator
	MetadataKey: symbol
}

export const Ref: RefDecorator = createDecorator('Ref')

function handler(targetThis: Record<any, any>) {
	handleDecorator<void>(targetThis, Ref.MetadataKey, store => {
		const { key } = store
		const keyVal = ref(targetThis[key as string])
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
	})
}

export const refHandler = {
	key: 'Ref',
	handler
}
