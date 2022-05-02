import Vue from 'vue'
import { createApp } from 'vue-demi'
import App from './App'

Vue.config.productionTip = false

new Vue({
	el: '#app',
	//@ts-ignore
	render: h => h(App)
})
