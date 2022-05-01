export interface MetadataStore<T> {
	key: string | symbol
	options: T
	desc?: PropertyDescriptor | null
}

export function createDecorator<T = void>(name: string, allowRepeat = false) {
	const MetadataKey = Symbol(name)
	const decoratorMethod = function (options: T) {
		return function (target: any, key: string | symbol) {
			const list: MetadataStore<T | T[]>[] = Reflect.getMetadata(MetadataKey, target) || []
			const hasExist = list.find(v => v.key === key)
			if (!hasExist) {
				list.push({
					key,
					options
				})
			} else {
				if (!allowRepeat) hasExist.options = options
				else if (Array.isArray(hasExist.options)) hasExist.options.push(options)
			}
			Reflect.defineMetadata(MetadataKey, [...list], target)
		}
	}
	decoratorMethod.MetadataKey = MetadataKey
	return decoratorMethod
}

export function getProtoMetadata<T = void>(target: any, metadataKey: symbol, withDesc = false) {
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

export function handleDecorator<T>(
	targetThis: any,
	metadataKey: symbol,
	handler: (store: MetadataStore<T>) => any
) {
	const list = getProtoMetadata<T>(targetThis, metadataKey) || []
	for (const store of list) {
		handler(store)
	}
}
