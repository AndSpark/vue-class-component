import type { PropOptions } from 'vue-demi'
import type { Constructor } from '../types'
import { createDecorator, handleDecorator } from './utils'

export const Props: PropsDecorator = createDecorator<[Constructor]>('Props')

interface PropsDecorator {
	(options: Constructor): PropertyDecorator
	MetadataKey: symbol
}

function handler(target: any) {
	let props: Record<string, PropOptions<string>> = {}
	handleDecorator<[Constructor]>(target, Props.MetadataKey, store => {
		if (Object.keys(props).length) {
			console.warn('PropsDecorator is more then one, should be one')
		}
		props = Object.assign(props, resolveProps(new store.args[0][0]()))
	})
	return props
}

function resolveProps(props: Record<string, any>) {
	const targetProps: Record<string, PropOptions<string>> = {}
	for (const key in props) {
		if (props[key]) {
			targetProps[key] = {
				default: props[key]
			}
		} else {
			targetProps[key] = {}
		}
	}

	return targetProps
}

export const propsHandler = {
	key: 'Props',
	handler
}
