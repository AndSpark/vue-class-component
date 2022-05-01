import { defineComponent, getCurrentInstance, ref, VNode } from 'vue-demi'
import { Component, Computed, Props, Watch, Ref, WatchEffect, Hook } from '../../src/index'

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
	$ = getCurrentInstance()?.proxy

	@Props(WordProps)
	props: WordProps

	@Ref() number: number = 1
	@Ref() btnRef: HTMLButtonElement

	@Computed()
	get val() {
		return this.number * 2
	}

	@Ref()
	my = {
		name: '哈哈哈'
	}

	@Hook(['onMounted', 'onBeforeMount'])
	hooks() {
		console.log('hook')
	}

	click() {
		this.my.name = this.my.name + '1'
	}

	@WatchEffect()
	eefe() {
		if (this.my.name) {
			console.log('myNameChange')
		}
	}

	@Watch(o => o.my, { immediate: true, deep: true })
	test(newval: any, oldVal: any) {
		console.log(newval, oldVal?.name)
	}

	render() {
		return (
			<div>
				{this.my.name}
				{this.val}
				<button ref='btnRef' onClick={() => this.click()}>
					++
				</button>
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
