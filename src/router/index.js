import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticlesView from "../views/ArticlesView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/articles",
      name: "articles",
      component: ArticlesView
    },
    {
      path: "/about",
      name: "about",
      component: AboutView
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        fullscreen: true
      }
    },
    {
      path: "/register",
      name: "register",
      component: LoginView,
      meta: {
        fullscreen: true,
        authMode: "register"
      }
    }
  ]
});

export default router;
