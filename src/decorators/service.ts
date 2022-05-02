import { computedHandler } from './computed'
import { HookHandler } from './hook'
import { refHandler } from './ref'
import { watchHandler } from './watch'
import { watchEffectHandler } from './watchEffect'

const handlerList = [refHandler, computedHandler, watchHandler, watchEffectHandler, HookHandler]

export function Service() {
	return function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			constructor(...args: any[]) {
				super()
				handlerList.forEach(handler => handler.handler(this))
			}
		}
	}
}
