import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './directives/index.js'
Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
