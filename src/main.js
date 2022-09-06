import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueGtag from "vue-gtag";
import Vs2 from "vue-script2";
// import Ads from 'vue-google-adsense'

Vue.use(Vs2)
// Vue.use(Ads.AutoAdsense, { adClient: 'ca-pub-2943310396815221', isNewAdsCode: true })


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

Vue.config.productionTip = false;

const name = "sombriks-hq";

new Vue({
  name,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
