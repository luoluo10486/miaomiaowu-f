import { createRouter, createWebHistory } from "vue-router";
import { getStoredAuthToken } from "../utils/auth";

const LoginView = () => import("../views/LoginView.vue");
const RagChatView = () => import("../views/RagChatView.vue");
const WorkbenchView = () => import("../views/WorkbenchView.vue");
const AdminConsoleView = () => import("../views/AdminConsoleView.vue");
const IdeaNotesView = () => import("../views/IdeaNotesView.vue");
const GalleryView = () => import("../views/GalleryView.vue");

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
      redirect: "/workspace"
    },
    {
      path: "/workspace",
      name: "workspace-home",
      component: WorkbenchView,
      meta: {
        requiresAuth: true,
        title: "工作台首页",
        description: "登录后的默认入口，用于进入问答、管理与灵感页面。"
      }
    },
    {
      path: "/rag",
      name: "rag-chat",
      component: RagChatView,
      meta: {
        requiresAuth: true,
        title: "RAG 问答",
        description: "基于知识检索与流式回答的问答工作台。"
      }
    },
    {
      path: "/admin",
      name: "rag-admin",
      component: AdminConsoleView,
      meta: {
        requiresAuth: true,
        title: "后台管理",
        description: "面向知识库与系统配置的后台管理入口。"
      }
    },
    {
      path: "/ideas",
      name: "idea-notes",
      component: IdeaNotesView,
      meta: {
        requiresAuth: true,
        title: "小巧思",
        description: "记录工作台视觉表达与动效升级方案。"
      }
    },
    {
      path: "/gallery",
      name: "gallery",
      component: GalleryView,
      meta: {
        requiresAuth: true,
        title: "美图鉴赏",
        description: "3D 立体旋转展示高木同学美图收藏。"
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
    },
    {
      path: "/articles",
      redirect: "/workspace"
    },
    {
      path: "/about",
      redirect: "/workspace"
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
