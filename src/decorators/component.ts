import { defineComponent, h } from 'vue-demi'
import Vue from 'vue'
import { computedHandler } from './computed'
import { propsHandler } from './props'
import { refHandler } from './ref'
import { watchHandler } from './watch'
import { watchEffectHandler } from './watchEffect'

const handlerList = [refHandler, computedHandler, watchHandler, watchEffectHandler]

export function Component() {
	return function (Component: any) {
		const proto = Component.prototype
		const props = propsHandler.handler(Component)
		Component.options__value = () => {
			const target: any = {}

			return defineComponent({
				name: proto.name || Component.name,
				props: props,
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

					handlerList.forEach(handler => handler.handler(instance))

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
