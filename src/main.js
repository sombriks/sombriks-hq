// src/main.js
require("./index.css");

const Vue = require("vue");
const Vuetify = require("vuetify");
Vue.use(Vuetify);
const {
  router
} = require("./routes");
const {
  store
} = require("./store");

Vue.component("menu-bar", require("./components/menu-bar.vue"));

window.vuevm = new Vue({
  render: r => r(require("./App.vue")),
  name: "sombriks-hq",
  el: "#app",
  router,
  store,
});