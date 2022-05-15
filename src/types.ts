export type Constructor<T = any> = new (...args: any[]) => T

/**
 * 装饰器处理
 */
export interface Hanlder {
	key: string
	handler: (targetThis: any) => void
}

type KeysOfUnion<T> = T extends T ? keyof T : never

type ModelProps<T extends {}> = Exclude<
	{
		[Prop in keyof T]: T extends {
			[k in Prop as `onUpdate:${k & string}`]?: any
		}
			? Prop
			: never
	}[keyof T],
	undefined
>

export type WithVModel<T extends {}, U extends keyof T = ModelProps<T>> = TransformModelValue<{
	[k in U as `v-model`]?: T[k] | [T[k], string[]]
}>
export type TransformModelValue<T extends {}> = 'v-model' extends keyof T
	? Omit<T, 'v-model'> & { ['v-model']?: T['v-model'] }
	: T

export type ComponentSlots<T extends { props: any }> = NonNullable<T['props']['v-slots']>

/** 为了阻止ts把不相关的类也解析到metadata数据中，用这个工具类型包装一下类 */
export type ClassType<T> = T

export type AllowedComponentProps = {
	class?: any
	style?: any
	[name: string]: any
}

export type DistributiveOmit<T, K extends keyof any> = T extends T ? Omit<T, K> : never

type DistributiveVModel<T> = T extends T ? WithVModel<T> : never

export type VueComponentProps<T extends {}> = DistributiveOmit<T, 'slots'> &
	DistributiveVModel<T> &
	AllowedComponentProps
