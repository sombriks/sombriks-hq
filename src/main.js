import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-37990292-20'
})

Vue.config.productionTip = false;

const name = "sombriks-hq";

new Vue({
  name,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
