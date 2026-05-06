<script setup>
import { computed, ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { adminNavGroups } from "./adminShared";
import { clearStoredAuth, getStoredAuthUser } from "../../utils/auth";

const router = useRouter();
const currentUser = ref(getStoredAuthUser());

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "Current User";
});

const currentUserRole = computed(() => currentUser.value?.role || "member");

function logout() {
  clearStoredAuth();
  router.push("/login");
}
</script>

<template>
  <section class="admin-shell">
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <small>Independent Admin</small>
          <h1>RAG Console</h1>
          <p>与参考前端对齐的问答管理台，保留当前项目的国风质感，并补齐主要模块入口与常用操作。</p>
        </div>

        <nav class="admin-nav">
          <section v-for="group in adminNavGroups" :key="group.title" class="admin-nav-group">
            <h2>{{ group.title }}</h2>
            <RouterLink v-for="item in group.items" :key="item.to" :to="item.to">
              <span>{{ item.label }}</span>
              <span aria-hidden="true">›</span>
            </RouterLink>
          </section>
        </nav>

        <div class="admin-sidebar-footer">
          <div class="admin-user-card">
            <strong>{{ currentUserName }}</strong>
            <span>{{ currentUserRole }}</span>
          </div>
          <div class="admin-button-row">
            <button class="admin-button--ghost" type="button" @click="router.push('/workspace')">
              Workspace
            </button>
            <button class="admin-button--ghost" type="button" @click="router.push('/rag')">
              Chat
            </button>
            <button class="admin-button--danger" type="button" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </section>
</template>
