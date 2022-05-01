import { getCurrentInstance, ref } from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

interface RefDecorator {
	(): PropertyDecorator
	MetadataKey: symbol
}

export const Ref: RefDecorator = createDecorator('Ref')

function handler(targetThis: Record<any, any>) {
	handleDecorator<[]>(targetThis, Ref.MetadataKey, store => {
		const { key } = store
		const keyVal = ref(targetThis[key as string])
		const refs = getCurrentInstance()?.proxy.$refs
		Object.defineProperty(targetThis, key, {
			enumerable: true,
			configurable: true,
			get() {
				if (refs?.[key as string]) {
					return refs[key as string]
				}
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
