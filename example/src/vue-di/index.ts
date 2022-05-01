import { defineComponent, PropOptions, h } from 'vue-demi'
import Vue from 'vue'
import 'reflect-metadata'
import { refHandler } from './decorators/ref'
import { Props, propsHandler } from './decorators/props'
import { getProtoMetadata } from './decorators/utils'
import { computedHandler } from './decorators/computed'

export function Component() {
	return function (Component: any) {
		const proto = Component.prototype
		if (Component.options__value) return Vue.extend(Component.options__value())

		const { displayName, emits } = proto
		const props = propsHandler.handler(Component)
		Component.options__value = () => {
			const target: any = {}

			return defineComponent({
				name: displayName || Component.name,
				props: props,
				emits: emits || [],
				setup(props) {
					const instance = new Component()
					const descriptors = Object.getOwnPropertyDescriptors(proto)
					for (const key in descriptors) {
						if (key !== 'render' && key !== 'constructor') {
							if (typeof descriptors[key].value === 'function') {
								instance[key] = instance[key].bind(instance)
							}
						}
					}

					instance.props = props

					refHandler.handler(instance)
					computedHandler.handler(instance)

					target.render = instance.render.bind(instance)

					return instance
				},
				render() {
					return target.render(h)
				}
			})
		}

		const options = Vue.extend(Component.options__value())

		return options
	}
}
