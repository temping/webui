import Home from "../views/Home.vue";
import Html from "../views/html.vue";
import Css from "../views/css.vue";
import Accessibility from "../views/accessibility.vue";

export default [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/html",
    name: "html",
    component: Html
  },
  {
    path: "/css",
    name: "CSS",
    component: Css
  },
  {
    path: "/accessibility",
    name: "Accessibility",
    component: Accessibility
  }
]