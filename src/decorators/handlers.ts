import { computedHandler } from './computed'
import { HookHandler } from './hook'
import { refHandler } from './ref'
import { watchHandler } from './watch'
import { watchEffectHandler } from './watchEffect'

export const handlerList = [
	refHandler,
	computedHandler,
	watchHandler,
	watchEffectHandler,
	HookHandler,
]
