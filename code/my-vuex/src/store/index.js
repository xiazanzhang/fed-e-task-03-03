import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../myvuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.BABEL_ENV !== 'production',
  state: {
    count: 0,
    msg: 'Hello Vuex'
  },
  getters: {
    reverseMsg(state) {
      return state.msg.split('').reverse().join('')
    }
  },
  mutations: {
    increate(state, payload) {
      state.count += payload
    }
  },
  actions: {
    increateAsync(context, payload) {
      setTimeout(() => {
        context.commit('increate', payload)
      }, 2000);
    }
  },
  modules: {
    products,
    cart
  }
})
