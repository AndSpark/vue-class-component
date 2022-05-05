import { Injectable, SkipSelf } from 'injection-js'
import { defineComponent, getCurrentInstance, ref, VNode } from 'vue-demi'
import { useCurrentInstance, useVueComponent } from '../../src/helper'
import { Component, Computed, Props, Watch, Ref, WatchEffect, Hook, Service } from '../../src/index'

// 服务类使用@Service装饰器
@Service()
class WordService {
	@Ref()
	title: string = 'hello'

	//各种生命周期
	@Hook('onBeforeMount')
	hello() {
		console.log(this.title)
	}
}

// 组件Props使用class声明，同时可设置默认值
class WordProps {
	name?: string = '1234'
	title: string
	slots?: {
		name?: () => VNode
		say?: (name: string) => VNode
	}
}

//组件使用@Component装饰器声明
@Component()
class Word {
	// 服务类会自动依赖注入，在constructor中的函数相当于在setup中运行
	constructor(private wordService: WordService) {}

	// 如果要使用组件内方法，需先进行声明
	vueComponent = useVueComponent()

	// 注意：props必须这样声明
	@Props()
	$props: WordProps

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
		console.log('onMounted')
	}

	click() {
		this.number++
	}

	@Watch((o: Word) => o.number, { immediate: true, deep: true })
	test(newval: any, oldVal: any) {
		console.log(newval, oldVal)
	}

	render() {
		return (
			<div>
				<button ref='btnRef' onClick={() => this.click()}>
					++
				</button>
				{this.val}
				{this.$props.name}
				{/* 插槽使用 */}
				{this.$props.slots?.say?.(String(this.number))}
			</div>
		)
	}
}

// 父级组件提供服务，可在子组件中共享
@Component({})
export default class ParentWord {
	render() {
		return (
			<div>
				<Word title='12344' slots={{ say: name => <div>我的名字：{name}</div> }}></Word>
				哈哈哈哈哈哈
			</div>
		)
	}
}
