import { VNodeChildren } from 'vue'
import { computed, defineComponent, getCurrentInstance, ref, VNode, watch } from 'vue-demi'
import { Component } from './vue-di'
import { Computed } from './vue-di/decorators/computed'
import { Props } from './vue-di/decorators/props'
import { Ref } from './vue-di/decorators/ref'
import { createDecorator } from './vue-di/decorators/utils'

class WordProps {
	name?: string = '345'
	title: string
	slots?: {
		name?: () => VNode
		say?: (name: string) => VNode
	}
}

@Component()
class Word {
	@Props(WordProps)
	props: WordProps

	@Ref()
	number: number = 1

	@Computed()
	get val() {
		return this.number * 2
	}

	click() {
		this.number++
	}

	render() {
		return (
			<div>
				{this.val}
				<button onClick={() => this.click()}>++</button>
				{this.props.name}
				{this.props.slots?.say?.(String(this.number))}
			</div>
		)
	}
}

export default defineComponent({
	setup() {
		const title = ref('1234')
		return {
			title
		}
	},
	render() {
		return (
			<div>
				<Word
					title={this.title}
					slots={{
						name: () => <div>name</div>,
						say: name => <div>{name}</div>
					}}
				></Word>
			</div>
		)
	}
})
