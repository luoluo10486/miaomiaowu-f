import { createRouter, createWebHistory } from "vue-router";
import { getStoredAuthToken, getStoredAuthUser, isAdminUser } from "../utils/auth";

const LoginView = () => import("../views/LoginView.vue");
const NotFoundView = () => import("../views/NotFoundView.vue");
const RagChatView = () => import("../views/RagChatView.vue");
const WorkbenchView = () => import("../views/WorkbenchView.vue");
const IdeaNotesView = () => import("../views/IdeaNotesView.vue");
const GalleryView = () => import("../views/GalleryView.vue");

const AdminLayoutView = () => import("../views/admin/AdminLayoutView.vue");
const DashboardPage = () => import("../views/admin/DashboardPage.vue");
const KnowledgeListPage = () => import("../views/admin/KnowledgeListPage.vue");
const KnowledgeDocumentsPage = () => import("../views/admin/KnowledgeDocumentsPage.vue");
const KnowledgeChunksPage = () => import("../views/admin/KnowledgeChunksPage.vue");
const IntentTreePage = () => import("../views/admin/IntentTreePage.vue");
const IngestionPage = () => import("../views/admin/IngestionPage.vue");
const TracesPage = () => import("../views/admin/TracesPage.vue");
const TraceDetailPage = () => import("../views/admin/TraceDetailPage.vue");
const SettingsPage = () => import("../views/admin/SettingsPage.vue");
const SampleQuestionsPage = () => import("../views/admin/SampleQuestionsPage.vue");
const MappingsPage = () => import("../views/admin/MappingsPage.vue");
const UsersPage = () => import("../views/admin/UsersPage.vue");
const IntentListPage = () => import("../views/admin/IntentListPage.vue");
const IntentEditPage = () => import("../views/admin/IntentEditPage.vue");

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
        title: "Workspace",
        description: "登录后的默认入口。"
      }
    },
    {
      path: "/rag",
      redirect: "/chat"
    },
    {
      path: "/chat",
      name: "rag-chat",
      component: RagChatView,
      meta: {
        requiresAuth: true,
        title: "RAG Chat",
        description: "RAG 问答工作台。"
      }
    },
    {
      path: "/chat/:sessionId",
      name: "rag-chat-session",
      component: RagChatView,
      meta: {
        requiresAuth: true,
        title: "RAG Chat",
        description: "支持会话深链的 RAG 问答工作台。"
      }
    },
    {
      path: "/rag/:sessionId",
      redirect: (to) => `/chat/${to.params.sessionId || ""}`
    },
    {
      path: "/admin",
      component: AdminLayoutView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        fullscreen: true,
        title: "Admin",
        description: "RAG 管理控制台。"
      },
      children: [
        {
          path: "",
          redirect: "/admin/dashboard"
        },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: DashboardPage
        },
        {
          path: "knowledge",
          name: "admin-knowledge",
          component: KnowledgeListPage
        },
        {
          path: "knowledge/:kbId",
          name: "admin-knowledge-documents",
          component: KnowledgeDocumentsPage
        },
        {
          path: "knowledge/:kbId/docs/:docId",
          name: "admin-knowledge-chunks",
          component: KnowledgeChunksPage
        },
        {
          path: "intent-tree",
          name: "admin-intent-tree",
          component: IntentTreePage
        },
        {
          path: "intent-list",
          name: "admin-intent-list",
          component: IntentListPage
        },
        {
          path: "intent-list/:id/edit",
          name: "admin-intent-edit",
          component: IntentEditPage
        },
        {
          path: "ingestion",
          name: "admin-ingestion",
          component: IngestionPage
        },
        {
          path: "traces",
          name: "admin-traces",
          component: TracesPage
        },
        {
          path: "traces/:traceId",
          name: "admin-trace-detail",
          component: TraceDetailPage
        },
        {
          path: "settings",
          name: "admin-settings",
          component: SettingsPage
        },
        {
          path: "sample-questions",
          name: "admin-sample-questions",
          component: SampleQuestionsPage
        },
        {
          path: "mappings",
          name: "admin-mappings",
          component: MappingsPage
        },
        {
          path: "users",
          name: "admin-users",
          component: UsersPage
        }
      ]
    },
    {
      path: "/ideas",
      name: "idea-notes",
      component: IdeaNotesView,
      meta: {
        requiresAuth: true,
        title: "Ideas",
        description: "灵感记录页。"
      }
    },
    {
      path: "/gallery",
      name: "gallery",
      component: GalleryView,
      meta: {
        requiresAuth: true,
        title: "Gallery",
        description: "图片展示页。"
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
      path: "/chat",
      redirect: "/rag"
    },
    {
      path: "/chat/:sessionId",
      redirect: (to) => `/rag/${to.params.sessionId || ""}`
    },
    {
      path: "/articles",
      redirect: "/workspace"
    },
    {
      path: "/about",
      redirect: "/workspace"
    },
    {
      path: "/dashboard",
      redirect: "/admin/dashboard"
    },
    {
      path: "/knowledge",
      redirect: "/admin/knowledge"
    },
    {
      path: "/traces",
      redirect: "/admin/traces"
    },
    {
      path: "/settings",
      redirect: "/admin/settings"
    },
    {
      path: "/users",
      redirect: "/admin/users"
    },
    {
      path: "/mappings",
      redirect: "/admin/mappings"
    },
    {
      path: "/sample-questions",
      redirect: "/admin/sample-questions"
    },
    {
      path: "/intent-tree",
      redirect: "/admin/intent-tree"
    },
    {
      path: "/ingestion",
      redirect: "/admin/ingestion"
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView
    }
  ]
});

router.beforeEach((to) => {
  const token = getStoredAuthToken();
  const user = getStoredAuthUser();
  const isAuthenticated = Boolean(token);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  if (requiresAuth && !isAuthenticated) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    };
  }

  if (requiresAdmin && !isAdminUser(user)) {
    return "/chat";
  }

  if (to.name === "login" && isAuthenticated) {
    return resolveRedirectTarget(to.query.redirect);
  }

  return true;
});

export default router;
