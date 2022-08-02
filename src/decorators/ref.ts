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
		const define = (v: any) => {
			Object.defineProperty(v, key, {
				enumerable: true,
				configurable: true,
				get() {
					if (refs?.[key as string] !== undefined) {
						return refs[key as string]
					}
					return keyVal.value
				},
				set(v) {
					keyVal.value = v
				}
			})
		}
		define(targetThis)
		define(getCurrentInstance()?.proxy)
	})
}

export const refHandler = {
	key: 'Ref',
	handler
}
