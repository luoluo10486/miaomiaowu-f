import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ArticlesView from "../views/ArticlesView.vue";
import AboutView from "../views/AboutView.vue";
import LoginView from "../views/LoginView.vue";

const AUTH_TOKEN_KEY = "auth_token";

function getStoredAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function resolveRedirectTarget(target) {
  if (typeof target !== "string") {
    return "/";
  }

  const normalizedTarget = target.trim();
  if (!normalizedTarget.startsWith("/") || normalizedTarget.startsWith("/login")) {
    return "/";
  }

  return normalizedTarget;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/articles",
      name: "articles",
      component: ArticlesView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        requiresAuth: true
      }
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
      redirect: { path: "/login", query: { mode: "register" } }
    }
  ]
});

router.beforeEach((to) => {
  const token = getStoredAuthToken();
  const isAuthenticated = Boolean(token);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    };
  }

  if (to.name === "login" && isAuthenticated) {
    return resolveRedirectTarget(to.query.redirect);
  }

  return true;
});

export default router;
