import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueGtag from "vue-gtag";
4;
Vue.use(
  VueGtag,
  {
    config: { id: "G-SRC55ZDV0D" },
  },
  router
);

Vue.config.productionTip = false;

const name = "sombriks-hq";

new Vue({
  name,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
