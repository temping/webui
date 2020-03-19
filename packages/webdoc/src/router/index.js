import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
export const routerHistory = createWebHashHistory("");
export const router = createRouter({
  history: routerHistory,
  routes
});
