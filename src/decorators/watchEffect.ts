import { watch, watchEffect, WatchOptions } from 'vue-demi'
import { createDecorator, handleDecorator } from './utils'

interface WatchEffectDecorator {
	(): PropertyDecorator
	MetadataKey: symbol
}

export const WatchEffect: WatchEffectDecorator = createDecorator('WatchEffect')

function handler(targetThis: Record<any, any>) {
	handleDecorator<[(instance: any) => any, WatchOptions]>(
		targetThis,
		WatchEffect.MetadataKey,
		store => {
			const { desc } = store
			if (!desc) return
			watchEffect(desc.value.bind(targetThis))
		},
		true
	)
}

export const watchEffectHandler = {
	key: 'WatchEffect',
	handler
}
