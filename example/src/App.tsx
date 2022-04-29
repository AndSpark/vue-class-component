import { defineComponent, ref } from 'vue-demi'
import { Component } from './vue-di'

class WordProps {
	name?: string = '345'
	title: string
}

type Constructor<T = any> = new (...args: any[]) => T

function props<T = any>(propsClass: Constructor<T>) {
	return new propsClass()
}

@Component()
class Word {
	$props = props(WordProps)

	click() {
		console.log(this.$props)
	}

	render() {
		return (
			<div>
				{this.$props.title}
				<p onClick={() => this.click()}>{this.$props.name}</p>
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
				<Word title={this.title}></Word>
				<button onClick={() => (this.title += '11')}>+++</button>
			</div>
		)
	}
})
