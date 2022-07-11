export type Constructor<T = any> = new (...args: any[]) => T

export type AllowedComponentProps = {
	class?: any
	style?: any
	attrs?: Record<string, any>
	key?: string
	ref?: string
	on?: Record<string, any>
	[x: string]: any
}

export type VueComponentProps<T extends {}> = T & AllowedComponentProps
