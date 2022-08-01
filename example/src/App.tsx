import { Injectable, SkipSelf } from 'injection-js'
import { defineComponent, getCurrentInstance, ref, VNode } from 'vue-demi'
import { useCurrentInstance, useVueComponent } from '../../src/helper'
import { Component, Computed, Props, Watch, Ref, WatchEffect, Hook, Service } from '../../src/index'
import Vue from 'vue'
import { VueComponentProps } from '../../src/types'
// 服务类使用@Service装饰器
@Service()
class WordService {
	@Ref()
	title: string = 'hello'

	//各种生命周期
	@Hook('onBeforeMount')
	hello() {
		console.log((this.title += '1'))
	}
}

// 组件Props使用class声明，同时可设置默认值
class WordProps {
	name?: string = '1234'
	title?: string
	setName?: (name: string) => void
	slots?: {
		name?: () => VNode
		say?: (name: string) => VNode
	}
}

//组件使用@Component装饰器声明
@Component()
class Word extends Vue {
	// 服务类会自动依赖注入，在constructor中的函数相当于在setup中运行
	constructor(@SkipSelf() private wordService: WordService) {
		super()
	}

	// 如果要使用组件内方法，需先进行声明
	vueComponent = useVueComponent()

	// 注意：props必须这样声明
	@Props(WordProps)
	$props: VueComponentProps<WordProps>

	// Ref声明
	@Ref() number: number = 1
	@Ref() btnRef: HTMLButtonElement

	// 计算属性声明
	@Computed()
	get val() {
		return this.number * 2
	}

	@Hook(['onMounted'])
	hooks() {
		console.log(this)
	}

	click() {
		console.log(this)
		this.wordService.hello()
		this.vueComponent.$emit('test', 'dddddd')
		this.number++
		this.$props.setName?.(this.$props.name + 'aaa')
		console.log(this.$props)
	}

	@Watch((o: Word) => o.number, { immediate: true, deep: true })
	test(newval: any, oldVal: any) {
		console.log(1111)
	}

	render() {
		return (
			<div>
				<button ref='btnRef' onClick={() => this.click()}>
					++
				</button>
				<p>{this.number}</p>
				<p>{this.val}</p>
				{this.$props.name}
				{/* 插槽使用 */}
				{this.$props.slots?.say?.(String(this.number))}
			</div>
		)
	}
}

// 父级组件提供服务，可在子组件中共享
@Component({
	providers: [WordService]
})
export default class ParentWord {
	@Ref() name: string = 'aaa'

	setName(name: string) {
		console.log(this)
		this.name = name
	}

	render() {
		return (
			<div>
				<Word
					setName={(name: string) => {
						this.name = name
					}}
					name={this.name}
					title='12344'
					class='dddd'
					attrs={{ a: '1234' }}
					slots={{ say: name => <div>我的名字：{name}</div> }}
				></Word>
				哈哈哈哈哈哈
				<Word
					setName={(name: string) => {
						this.name = name
					}}
					style={'color:red'}
					slots={{ say: name => <div>我的名字：{name}</div> }}
				></Word>
			</div>
		)
	}
}
