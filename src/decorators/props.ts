import type { PropOptions } from 'vue-demi'
import type { Constructor } from '../types'
import { createDecorator, handleDecorator } from './utils'

export const Props: PropsDecorator = createDecorator<[]>('Props')

interface PropsDecorator {
	(): PropertyDecorator
	MetadataKey: symbol
}

function handler(target: any) {
	let props: Record<string, PropOptions<string>> = {}
	handleDecorator<[]>(target, Props.MetadataKey, store => {
		if (Object.keys(props).length) {
			console.warn('PropsDecorator is more then one, should be one')
		}
		const type = Reflect.getMetadata('design:type', target.prototype, store.key)
		props = Object.assign(props, resolveProps(new type()))
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
