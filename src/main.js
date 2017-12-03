// src/main.js
require("./index.css")

const Vue = require("vue")

const VueRouter = require("vue-router")
Vue.use(VueRouter)

Vue.component("menu-bar",require("./components/menu-bar.vue"))

window.vuevm = new Vue({
  el: "#app",
  render: r => r(require("./components/mountpoint.vue"))
})
