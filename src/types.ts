export type Constructor<T = any> = new (...args: any[]) => T

export type AllowedComponentProps = {
	class?: any
	style?: any
	[x: string]: any
}

export type VueComponentProps<T extends {}> = T & AllowedComponentProps
