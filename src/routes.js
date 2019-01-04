const Vue = require("vue");
const VueRouter = require("vue-router");
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/bio"
  },
  {
    path: "/bio",
    label: "Bio",
    urlitem: "/bio",
    icon: "account_circle",
    component: require("./views/bio.vue")
  },
  {
    icon: "build",
    path: "/skills",
    label: "Skills",
    urlitem: "/skills",
    component: require("./views/skills.vue")
  },
  {
    icon: "stars",
    path: "/showcases",
    label: "Showcases",
    urlitem: "/showcases",
    component: require("./views/showcases.vue")
  },
  {
    icon: "link",
    path: "/links",
    label: "Links",
    urlitem: "/links",
    component: require("./views/links.vue")
  },
  {
    label: "Blog",
    path: "/blog/:post?",
    component: require("./views/blog.vue")
  }
];
const router = new VueRouter({
  routes
});

router.afterEach(to => {
  if (window.afterEach) window.afterEach(to);
});

module.exports = {
  router,
  routes
};
