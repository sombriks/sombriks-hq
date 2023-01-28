import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueGtag from "vue-gtag";
import Vs2 from "vue-script2";
// import {clickOutside} from "./components/click-outside-directive";

Vue.use(Vs2)

Vue.use(
  VueGtag,
  {
    config: { id: "G-SRC55ZDV0D" },
    pageTrackerTemplate(to) {
      return {
        page_title: to.fullPath,
        page_path: to.fullPath
      }
    }
  },
  router
);

// Vue.directive("click-outside", clickOutside);

Vue.config.productionTip = false;

const name = "sombriks-hq";

new Vue({
  name,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
