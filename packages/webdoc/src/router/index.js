import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/html",
    name: "html",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/html.vue")
  },
  {
    path: "/css",
    name: "CSS",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/css.vue")
  },
  {
    path: "/accessibility",
    name: "Accessibility",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/accessibility.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
