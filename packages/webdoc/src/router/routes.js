import Home from "../views/Home.vue";
import Html from "../views/html.vue";
import Css from "../views/css.vue";
import Accessibility from "../views/accessibility.vue";

export default [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/html",
    name: "html",
    component: Html,
    meta: {
      title: "HTML"
    }
  },
  {
    path: "/css",
    name: "CSS",
    component: Css,
    meta: {
      title: "CSS"
    }
  },
  {
    path: "/accessibility",
    name: "Accessibility",
    component: Accessibility,
    meta: {
      title: "Accessibility"
    }
  }
]