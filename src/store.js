const Vue = require("vue");
const Vuex = require("vuex");
Vue.use(Vuex);

const state = {
  title: "Try to Keep It Simple"
}

const mutations = {
  setTitle(state, title) {
    state.title = title;
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

module.exports = {
  store
}