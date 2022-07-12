import type { PropOptions } from 'vue-demi'
import type { Constructor } from '../types'
import { createDecorator, handleDecorator } from './utils'

export const Props: PropsDecorator = createDecorator<[]>('Props')

interface PropsDecorator {
	(props?: Constructor): PropertyDecorator
	MetadataKey: symbol
}

function handler(target: any) {
	let props: Record<string, PropOptions<string>> = {}
	handleDecorator<[Constructor]>(target, Props.MetadataKey, store => {
		let type
		if (store.args[0][0]) {
			type = store.args[0][0]
		} else {
			type = Reflect.getMetadata('design:type', target.prototype, store.key)
		}
		Object.assign(props, resolveProps(new type()))
	})
	return props
}

function resolveProps(props: Record<string, any>) {
	const targetProps: Record<string, PropOptions<string>> = {}
	for (const key in props) {
		if (props[key] !== undefined) {
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
