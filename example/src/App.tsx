import { Injectable, SkipSelf } from 'injection-js'
import { defineComponent, getCurrentInstance, ref, VNode } from 'vue-demi'
import { useCurrentInstance } from '../../src/helper'
import { Component, Computed, Props, Watch, Ref, WatchEffect, Hook, Service } from '../../src/index'

class WordProps {
	name?: string = '345'
	title: string
	slots?: {
		name?: () => VNode
		say?: (name: string) => VNode
	}
}

@Service()
class WordService {
	$ = useCurrentInstance()

	@Ref()
	title: string = 'hello'

	@WatchEffect()
	hello() {
		console.log(this.title)
	}

	@Hook('onBeforeMount')
	changeTitle() {
		console.log(this.$)
	}
}

@Component()
class Word {
	constructor(private wordService: WordService) {}

	$ = useCurrentInstance()?.proxy

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

	@Hook(['onMounted'])
	hooks() {
		console.log('onMounted')
		this.wordService.hello()
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

@Component({
	providers: [WordService]
})
class ParentWord {
	render() {
		return (
			<div>
				<Word title='12344'></Word>
				哈哈哈哈哈哈
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
				<ParentWord></ParentWord>
			</div>
		)
	}
})
