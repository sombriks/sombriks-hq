import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/principal",
  },
  {
    path: "/principal",
    name: "principal",
    component: () =>
      import(/* webpackChunkName: "principal" */ "../views/Principal.vue"),
  },
  {
    path: "/bio",
    name: "bio",
    component: () => import(/* webpackChunkName: "bio" */ "../views/Bio.vue"),
  },
  {
    path: "/blog/:post?",
    name: "blog",
    component: () => import(/* webpackChunkName: "blog" */ "../views/Blog.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () =>
      import(/* webpackChunkName: "contact" */ "../views/Contact.vue"),
  },
  {
    path: "/experiments",
    name: "experiments",
    component: () =>
      import(/* webpackChunkName: "experiments" */ "../views/Experiments.vue"),
  },
  {
    path: "/links",
    name: "links",
    component: () =>
      import(/* webpackChunkName: "links" */ "../views/Links.vue"),
  },
];

const router = new VueRouter({
  routes,
});

// router.afterEach = (to) => page(to.fullPath);

export default router;
