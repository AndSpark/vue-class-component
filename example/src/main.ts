import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

new Vue({
	el: '#app',
	//@ts-ignore
	render: h => h(App),
})
