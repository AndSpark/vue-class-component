import 'reflect-metadata'

export interface MetadataStore<T extends any[]> {
	key: string | symbol
	args: T[]
	desc?: PropertyDescriptor | null
}

export function createDecorator<T extends any[]>(name: string, allowRepeat = false) {
	const MetadataKey = Symbol(name)
	const decoratorMethod = function (...args: T) {
		return function (target: any, key: string | symbol) {
			const list: MetadataStore<T>[] = Reflect.getMetadata(MetadataKey, target) || []
			const hasExist = list.find(v => v.key === key)
			if (!hasExist) {
				list.push({
					key,
					args: [args]
				})
			} else {
				if (!allowRepeat) hasExist.args = [args]
				else hasExist.args.push(args)
			}
			Reflect.defineMetadata(MetadataKey, [...list], target)
		}
	}
	decoratorMethod.MetadataKey = MetadataKey
	return decoratorMethod
}

export function getProtoMetadata<T extends any[]>(
	target: any,
	metadataKey: symbol,
	withDesc = false
) {
	let proto: any
	if (typeof target === 'function') {
		proto = target.prototype
	} else {
		proto = Object.getPrototypeOf(target)
	}
	const metadataStores: MetadataStore<T>[] = Reflect.getMetadata(metadataKey, proto) || []
	if (withDesc) {
		metadataStores.forEach(v => (v.desc = getDeepOwnDescriptor(proto, v.key)))
	}
	return metadataStores
}

export function getDeepOwnDescriptor(proto: any, key: string | symbol): PropertyDescriptor | null {
	if (!proto) return null
	const desc = Object.getOwnPropertyDescriptor(proto, key)
	if (desc) return desc
	return getDeepOwnDescriptor(Object.getPrototypeOf(proto), key)
}

export function handleDecorator<T extends any[]>(
	targetThis: any,
	metadataKey: symbol,
	handler: (store: MetadataStore<T>) => any,
	withDesc = false
) {
	const list = getProtoMetadata<T>(targetThis, metadataKey, withDesc) || []
	for (const store of list) {
		handler(store)
	}
}
