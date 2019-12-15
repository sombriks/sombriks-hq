import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

const name = "sombriks-hq";

new Vue({
  name,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
