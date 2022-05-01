import { watch, WatchOptions } from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

interface WatchDecorator {
	(target: (instance: any) => any, options?: WatchOptions): PropertyDecorator
	MetadataKey: symbol
}

export const Watch: WatchDecorator = createDecorator('Watch')

function handler(targetThis: Record<any, any>) {
	handleDecorator<[(instance: any) => any, WatchOptions]>(
		targetThis,
		Watch.MetadataKey,
		store => {
			const { desc, args } = store
			if (!desc) return
			const target = () => args[0][0](targetThis)
			watch(target, desc.value.bind(targetThis), args[0][1] || {})
		},
		true
	)
}

export const watchHandler = {
	key: 'Watch',
	handler
}
