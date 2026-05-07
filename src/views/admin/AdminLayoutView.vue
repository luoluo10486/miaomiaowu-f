<script setup>
import { computed, ref } from "vue";
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { adminNavGroups } from "./adminShared";
import { clearStoredAuth, getStoredAuthUser } from "../../utils/auth";

const router = useRouter();
const route = useRoute();
const currentUser = ref(getStoredAuthUser());
const sidebarCollapsed = ref(false);

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "Admin";
});

const currentUserRole = computed(() => currentUser.value?.role || "member");

const userInitial = computed(() => {
  return currentUserName.value.slice(0, 1).toUpperCase();
});

const currentPageTitle = computed(() => {
  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (route.path.startsWith(item.to)) return item.label;
    }
  }
  return "Dashboard";
});

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

function logout() {
  clearStoredAuth();
  router.push("/login");
}
</script>

<template>
  <section class="admin-shell">
    <aside :class="['admin-sidebar', { 'is-collapsed': sidebarCollapsed }]">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div class="brand-text" v-if="!sidebarCollapsed">
          <h1>RAG Console</h1>
          <p>管理控制台</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <section v-for="group in adminNavGroups" :key="group.title" class="nav-group">
          <h2 v-if="!sidebarCollapsed">{{ group.title }}</h2>
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            :title="sidebarCollapsed ? item.label : undefined"
          >
            <span class="nav-dot"></span>
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </RouterLink>
        </section>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info" v-if="!sidebarCollapsed">
            <strong>{{ currentUserName }}</strong>
            <span>{{ currentUserRole }}</span>
          </div>
        </div>
        <div class="sidebar-actions">
          <button class="sidebar-btn" type="button" @click="router.push('/rag')" title="Chat">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button class="sidebar-btn sidebar-btn--danger" type="button" @click="logout" title="Logout">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <div class="admin-body">
      <header class="admin-topbar">
        <button class="topbar-toggle" type="button" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div class="topbar-title">
          <span class="topbar-breadcrumb">Admin</span>
          <span class="topbar-sep">/</span>
          <strong>{{ currentPageTitle }}</strong>
        </div>
        <div class="topbar-right">
          <button class="topbar-btn" type="button" @click="router.push('/workspace')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Workspace</span>
          </button>
        </div>
      </header>

      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </section>
</template>
