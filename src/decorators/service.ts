import { handlerList } from './handlers'

export function Service() {
	return function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args)
				handlerList.forEach(handler => handler.handler(this))
			}
		}
	}
}

export class VueService {
	constructor() {
		handlerList.forEach(handler => handler.handler(this))
	}
}
