import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    index: 0,
    title: "Sombriks Has a Plan"
  },
  mutations: {
    setIndex(state, index) {
      state.index = index;
    }
  },
  actions: {
  },
  modules: {
  }
})
