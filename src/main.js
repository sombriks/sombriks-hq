// src/main.js
require("./index.css");

const Vue = require("vue");
const Vuetify = require("vuetify");
Vue.use(Vuetify);
const VueApexCharts = require("vue-apexcharts");
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
const {
	router
} = require("./routes");
const {
	store
} = require("./store");

// everyone register components inside each viewmodel/.vue file as needed
// but my mom always told me i am not everyone
Vue.component("side-menu", require("./components/side-menu.vue"));

Vue.component("chart-languages", require("./components/chart-languages.vue"));
Vue.component("chart-frameworks", require("./components/chart-frameworks.vue"));
Vue.component("chart-dev-tools", require("./components/chart-dev-tools.vue"));
Vue.component("chart-devops", require("./components/chart-devops.vue"));
Vue.component("chart-social", require("./components/chart-social.vue"));

window.vuevm = new Vue({
	render: r => r(require("./App.vue")),
	name: "sombriks-hq",
	el: "#app",
	router,
	store
});