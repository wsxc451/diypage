import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import diypage from './modules/diypage'
// const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    diypage: diypage
  }
})
export default store
