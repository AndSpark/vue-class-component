import { defineComponent, PropOptions } from 'vue-demi'
import Vue from 'vue'
import 'reflect-metadata'

export function Component() {
	return function (Component: any) {
		const proto = Component.prototype
		if (Component.options__value) return Component.options__value
		const { displayName, emits } = proto
		const instance = new Component()
		const props = resolveProps(instance.$props)

		Component.options__value = defineComponent({
			name: displayName || Component.name,
			props: props,
			emits: emits || [],
			setup() {
				const instance = new Component()

				delete instance.$props
				return instance
			},
			render(h) {
				return proto.render.call(this, h)
			}
		})

		return Vue.extend(Component.options__value)
	}
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
