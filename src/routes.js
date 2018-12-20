const Vue = require("vue");
const VueRouter = require("vue-router");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/bio"
  },
  {
    urlitem: "/bio",
    path: "/bio",
    label: "Bio",
    component: require("./views/bio.vue")
  },
  {
    urlitem: "/skills",
    path: "/skills",
    label: "Skills",
    component: require("./views/skills.vue")
  },
  {
    urlitem: "/showcases",
    path: "/showcases",
    label: "Showcases",
    component: require("./views/showcases.vue")
  },
  {
    urlitem: "/blog",
    path: "/blog/:post?",
    label: "Blog",
    component: require("./views/blog.vue")
  }
];
const router = new VueRouter({ routes });

router.afterEach(to => {
  if (window.afterEach) window.afterEach(`#${to}`);
});

module.exports = { router, routes };
