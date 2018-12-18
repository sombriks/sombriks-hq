// src/main.js
require("./index.css");

const Vue = require("vue");
const { router } = require("./routes");

Vue.component("menu-bar", require("./components/menu-bar.vue"));

window.vuevm = new Vue({
  router,
  el: "#app",
  name: "sombriks-hq",
  render: r => r(require("./App.vue"))
});
