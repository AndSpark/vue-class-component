# vue-class-di

一个用于 vue2 的类组件及依赖注入的库

## 特性/风格

1. vue2 项目中不再使用 SFC 文件，而是使用 tsx 来写渲染函数。

2. 使用了@vue/composition-api，告别 vue2 的选项式 api。

3. 组件以类形式编写，加上 composition-api 装饰器，更自然的编程体验。

4. 原来的函数式 cpa 写法，使用类服务来写，不需要再返回变量和方法。

5. 使用 injection-js 进行依赖注入，将类组件与类服务结合得更丝滑。

## 安装/配置

需要在 vue2 项目中预安装 `vue-demi` `@vue/composition-api` `reflect-metadata`。

```bash
yarn add vue-class-di vue-demi @vue/composition-api reflect-metadata
```

如果项目没有用 jsx，还需再安装`@vue/babel-preset-jsx`

babel.config.js 配置文件，配置 jsx。

```jsx
module.exports = {
	presets: [
		//...,
		['@vue/babel-preset-jsx', { compositionAPI: true }]
	]
}
```

组件采用 tsx 写法，需在 src 目录下新建 shims-tsx.d.ts,里面写

```tsx
import Vue, { VNode } from 'vue'

declare global {
	namespace JSX {
		interface Element extends VNode {}
		interface ElementAttributesProperty {
			props: any // 原本是$props,在setup中返回$props会冲突，这里改成props
		}
		interface IntrinsicElements {
			[elem: string]: any
		}
	}
}
```

#### 注意 ⚠️

在 src/main.ts 中，不要使用 createApp 来创建 vue 实例，而是用 vue2 原来的 new Vue，否则会报错。

## 组件

### 定义

使用@Component()来创建类组件。

```tsx
@Component()
class Foo {
	render() {
		return <div>Foo</div>
	}
}
```

### 引入组件

无需在组件中注册需要引入的组件，直接将类组件写在 render 函数中即可。

```tsx
@Component()
class Foo {
	render() {
		return <div>Foo</div>
	}
}

@Component()
class Bar {
	render() {
		return (
			<div>
				Bar
				<Foo></Foo>
			</div>
		)
	}
}
```

### 声明 props/slots

在类组件中声明 props/slots 的方法如下

```tsx
// 使用类来声明props,同时可以赋值props的默认值，slots也用props传值。
class FooProps {
	title?: string = 'foo'
	slots?: {
		default?: (name?: string) => VNode
	}
}

@Component()
class Foo {
	// 在组件中用@Props装饰器，并且传入Props类来声明props
	@Props(FooProps)
	props: FooProps

	render() {
		return (
			<div>
				Foo
				<p>{this.props.title}</p>
			</div>
		)
	}
}
```

### 装饰器

```tsx
@Component()
class Foo {
	// ref声明
	@Ref() number: number = 1
	@Ref() btnRef: HTMLButtonElement

	// 计算属性声明
	@Computed()
	get val() {
		return this.number * 2
	}

	//生命周期
	@Hook(['onMounted'])
	mounted() {
		console.log('onMounted')
	}

	//watch
	@Watch((o: Word) => o.number, { immediate: true, deep: true })
	watchNumber(newval: any, oldVal: any) {
		console.log(newval, oldVal)
	}

	render() {
		return <div>Foo</div>
	}
}
```

#### 注意 ⚠️

在类的 constructor 中写的代码会在 setup 中运行，但是不建议使用。
是由于 constructor 中的代码运行早于在类组件中声明的方法和属性，如果直接使用 this.xxx，会返回 undefined。
建议在生命周期中(@Hook)写。

## 服务

服务与类组件写法类似，只是少了 render 函数，并且类组件用的装饰器是@service。

```tsx
@Service()
class FooService {
	@Ref()
	title: string = 'hello'

	hello() {
		console.log(this.title)
	}
}
```

## 依赖注入

类组件使用类服务的方式如下，每一个类组件都会单独实例化类服务

```tsx
@Component()
class Foo {
	// 引入服务类
	constructor(private fooService: FooService) {}

	@Hook(['onMounted'])
	hooks() {
		this.wordService.hello()
	}

	render() {
		return <div>Foo</div>
	}
}
```

子组件使用父组件的服务

```tsx
@Component()
class Foo {
	// 使用@SkipSelf，子组件不会自己实例化服务，而是往上级寻找
	constructor(@SkipSelf() private fooService: FooService) {}

	@Hook(['onMounted'])
	hooks() {
		this.wordService.hello()
	}

	render() {
		return <div>Foo</div>
	}
}

@Component({
	// 父组件可直接提供服务或者自己引入服务
	providers: [fooService]
})
class FooParent {
	render() {
		return (
			<div>
				<Foo />
			</div>
		)
	}
}
```
