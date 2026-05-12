<script setup>
import { computed, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { adminNavGroups } from "./adminShared";
import { clearStoredAuth, getStoredAuthUser } from "../../utils/auth";
import {
  changeCurrentUserPassword,
  getKnowledgeBases,
  searchKnowledgeDocuments
} from "../../services/adminService";

const route = useRoute();
const router = useRouter();
const currentUser = ref(getStoredAuthUser());
const collapsed = ref(false);
const openGroups = ref({});
const kbQuery = ref("");
const searchFocused = ref(false);
const kbOptions = ref([]);
const docOptions = ref([]);
const searchLoading = ref(false);
let searchTimeout = null;

const passwordOpen = ref(false);
const passwordSubmitting = ref(false);
const passwordForm = ref({ currentPassword: "", newPassword: "", confirmPassword: "" });

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "Admin";
});
const currentUserRole = computed(() => {
  const role = currentUser.value?.role || "member";
  return role === "admin" ? "管理员" : "成员";
});
const avatarInitial = computed(() => {
  const name = currentUserName.value;
  return name ? name.charAt(0).toUpperCase() : "A";
});

const breadcrumbMap = {
  dashboard: "Dashboard",
  knowledge: "知识库管理",
  "intent-tree": "意图树配置",
  "intent-list": "意图列表",
  ingestion: "数据通道",
  traces: "链路追踪",
  "sample-questions": "示例问题",
  mappings: "关键词映射",
  settings: "系统设置",
  users: "用户管理"
};

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  const items = [{ label: "首页", to: "/admin/dashboard" }];

  if (segments[0] !== "admin") return items;
  const section = segments[1];

  if (section === "intent-tree" || section === "intent-list") {
    items.push({ label: "意图管理", to: "/admin/intent-tree" });
    if (section === "intent-list" && segments.length > 2) {
      items.push({ label: "意图列表", to: "/admin/intent-list" });
      items.push({ label: "编辑节点" });
    } else {
      items.push({ label: breadcrumbMap[section] || section });
    }
  } else if (section) {
    items.push({
      label: breadcrumbMap[section] || section,
      to: `/admin/${section}`
    });
  }

  if (section === "ingestion") {
    const tab = route.query?.tab;
    if (tab === "tasks") items.push({ label: "流水线任务" });
    else if (tab === "pipelines") items.push({ label: "流水线管理" });
  }
  if (section === "knowledge" && segments.length > 2) items.push({ label: "文档管理" });
  if (section === "knowledge" && segments.includes("docs")) items.push({ label: "切片管理" });
  if (section === "traces" && segments.length > 2) items.push({ label: "链路详情" });

  return items;
});

const activePath = computed(() => route.path);

function isActive(path) {
  return activePath.value === path || activePath.value.startsWith(`${path}/`);
}

function isItemActive(item) {
  if (item.children?.length) {
    return item.children.some((child) => {
      const childPath = child.to.split("?")[0];
      return activePath.value === childPath || activePath.value.startsWith(`${childPath}/`);
    });
  }
  return isActive(item.to);
}

function toggleGroup(title) {
  openGroups.value[title] = !openGroups.value[title];
}

function toggleNavGroup(groupId) {
  openGroups.value[groupId] = !openGroups.value[groupId];
}

watch(
  () => route.path,
  () => {
    adminNavGroups.forEach((group) => {
      if (group.items.some((item) => isItemActive(item)) && !openGroups.value[group.title]) {
        openGroups.value[group.title] = true;
      }
      group.items.forEach((item) => {
        if (item.id && item.children?.some((child) => {
          const childPath = child.to.split("?")[0];
          return activePath.value === childPath || activePath.value.startsWith(`${childPath}/`);
        })) {
          openGroups.value[item.id] = true;
        }
      });
    });
  },
  { immediate: true }
);

function logout() {
  clearStoredAuth();
  router.push("/login");
}

function handleSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  const keyword = kbQuery.value.trim();
  if (!keyword) {
    kbOptions.value = [];
    docOptions.value = [];
    searchLoading.value = false;
    return;
  }
  searchLoading.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const [kbData, docData] = await Promise.all([
        getKnowledgeBases(1, 6, keyword),
        searchKnowledgeDocuments(keyword, 6)
      ]);
      kbOptions.value = Array.isArray(kbData?.records) ? kbData.records : (Array.isArray(kbData) ? kbData : []);
      docOptions.value = Array.isArray(docData) ? docData : [];
    } catch {
      kbOptions.value = [];
      docOptions.value = [];
    } finally {
      searchLoading.value = false;
    }
  }, 200);
}

function handleSearchSelect(kb) {
  searchFocused.value = false;
  kbQuery.value = "";
  kbOptions.value = [];
  docOptions.value = [];
  router.push(`/admin/knowledge/${kb.id}`);
}

function handleDocumentSelect(doc) {
  searchFocused.value = false;
  kbQuery.value = "";
  kbOptions.value = [];
  docOptions.value = [];
  router.push(`/admin/knowledge/${doc.kbId}/docs/${doc.id}`);
}

function handleSearchKeyDown(event) {
  if (event.key === "Enter") {
    const keyword = kbQuery.value.trim();
    if (kbOptions.value.length > 0) {
      handleSearchSelect(kbOptions.value[0]);
      return;
    }
    if (docOptions.value.length > 0) {
      handleDocumentSelect(docOptions.value[0]);
      return;
    }
    if (keyword) {
      searchFocused.value = false;
      router.push(`/admin/knowledge?name=${encodeURIComponent(keyword)}`);
    }
  }
  if (event.key === "Escape") {
    searchFocused.value = false;
  }
}

const showSuggest = computed(() => searchFocused.value && kbQuery.value.trim().length > 0);

async function handlePasswordSubmit() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) return;
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("两次输入的新密码不一致");
    return;
  }
  passwordSubmitting.value = true;
  try {
    await changeCurrentUserPassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    passwordOpen.value = false;
    passwordForm.value = { currentPassword: "", newPassword: "", confirmPassword: "" };
  } catch (error) {
    alert(error?.message || "修改密码失败");
  } finally {
    passwordSubmitting.value = false;
  }
}
</script>

<template>
  <div class="admin-shell">
    <aside :class="['admin-sidebar', { 'admin-sidebar--collapsed': collapsed }]">
      <div class="admin-brand">
        <div :class="['admin-brand-inner', { 'is-collapsed': collapsed }]">
          <div class="admin-brand-logo">R</div>
          <template v-if="!collapsed">
            <div>
              <h1>RAG Console</h1>
              <small>Knowledge Console</small>
            </div>
          </template>
        </div>
      </div>

      <nav class="admin-nav">
        <section v-for="group in adminNavGroups" :key="group.title" class="admin-nav-group">
          <h2 v-if="!collapsed">{{ group.title }}</h2>
          <div class="admin-nav-group-items">
            <template v-for="item in group.items" :key="item.to">
              <template v-if="item.children?.length">
                <button
                  type="button"
                  :class="['admin-nav-item', 'admin-nav-item--group', { 'admin-nav-item--active': isItemActive(item) }]"
                  @click="toggleNavGroup(item.id)"
                >
                  <span :class="['admin-nav-item-indicator', { 'is-active': isItemActive(item) }]" />
                  <span class="admin-nav-item-icon">{{ item.icon || "●" }}</span>
                  <span v-if="!collapsed" class="admin-nav-item-label">{{ item.label }}</span>
                  <span v-if="!collapsed" class="admin-nav-item-arrow">{{ openGroups[item.id] ? "▾" : "▸" }}</span>
                </button>
                <template v-if="openGroups[item.id] && !collapsed">
                  <RouterLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    :class="['admin-nav-item', 'admin-nav-item--child', { 'admin-nav-item--active': activePath === child.to.split('?')[0] }]"
                  >
                    <span :class="['admin-nav-item-indicator', { 'is-active': activePath === child.to.split('?')[0] }]" />
                    <span class="admin-nav-item-icon">{{ child.icon || "●" }}</span>
                    <span>{{ child.label }}</span>
                  </RouterLink>
                </template>
              </template>
              <template v-else>
                <RouterLink
                  :to="item.to"
                  :title="collapsed ? item.label : undefined"
                  :class="['admin-nav-item', { 'admin-nav-item--active': isActive(item.to) }]"
                >
                  <span :class="['admin-nav-item-indicator', { 'is-active': isActive(item.to) }]" />
                  <span class="admin-nav-item-icon">{{ item.icon || "●" }}</span>
                  <span v-if="!collapsed">{{ item.label }}</span>
                </RouterLink>
              </template>
            </template>
          </div>
        </section>
      </nav>

      <div class="admin-sidebar-footer">
        <button type="button" class="admin-collapse-btn" @click="collapsed = !collapsed">
          {{ collapsed ? "»" : "« 收起侧边栏" }}
        </button>
        <div class="admin-user-card">
          <div class="admin-user-avatar">{{ avatarInitial }}</div>
          <div v-if="!collapsed" class="admin-user-info">
            <strong>{{ currentUserName }}</strong>
            <span>{{ currentUserRole }}</span>
          </div>
        </div>
        <div class="admin-button-row">
          <button class="admin-button--sidebar" type="button" @click="router.push('/workspace')">
            {{ collapsed ? "W" : "Workspace" }}
          </button>
          <button class="admin-button--sidebar" type="button" @click="router.push('/rag')">
            {{ collapsed ? "C" : "Chat" }}
          </button>
          <button class="admin-button--sidebar-logout" type="button" @click="logout">
            {{ collapsed ? "✕" : "退出登录" }}
          </button>
        </div>
      </div>
    </aside>

    <main class="admin-main">
      <header class="admin-topbar">
        <div class="admin-topbar-inner">
          <div class="admin-topbar-search-wrap">
            <div class="admin-topbar-search">
              <input
                v-model="kbQuery"
                class="admin-topbar-search-input"
                placeholder="筛选知识库..."
                @input="handleSearchInput"
                @focus="searchFocused=true"
                @blur="setTimeout(()=>{searchFocused=false},150)"
                @keydown="handleSearchKeyDown"
              />
              <span class="admin-topbar-kbd">Ctrl K</span>
              <div v-if="showSuggest" class="admin-topbar-suggest" @mousedown.prevent>
                <div v-if="searchLoading && kbOptions.length===0 && docOptions.length===0" class="admin-topbar-suggest-item admin-muted">搜索中...</div>
                <template v-if="kbOptions.length > 0">
                  <div class="admin-topbar-suggest-group">知识库</div>
                  <button
                    v-for="kb in kbOptions"
                    :key="kb.id"
                    type="button"
                    class="admin-topbar-suggest-item"
                    @mousedown.prevent="handleSearchSelect(kb)"
                  >
                    <span style="font-weight:600;color:var(--admin-ink,#1e293b);">{{ kb.name }}</span>
                    <small class="admin-muted">{{ kb.collectionName || "未设置 Collection" }}</small>
                  </button>
                </template>
                <template v-if="docOptions.length > 0">
                  <div class="admin-topbar-suggest-group">文档</div>
                  <button
                    v-for="doc in docOptions"
                    :key="doc.id"
                    type="button"
                    class="admin-topbar-suggest-item"
                    @mousedown.prevent="handleDocumentSelect(doc)"
                  >
                    <span style="font-weight:600;color:var(--admin-ink,#1e293b);">{{ doc.docName }}</span>
                    <small class="admin-muted">{{ doc.kbName || `知识库 ${doc.kbId}` }}</small>
                  </button>
                </template>
                <div v-if="!searchLoading && kbOptions.length===0 && docOptions.length===0" class="admin-topbar-suggest-item admin-muted">暂无匹配结果</div>
              </div>
            </div>
          </div>
          <div class="admin-topbar-actions">
            <button class="admin-button--ghost" type="button" @click="router.push('/rag')">返回聊天</button>
            <button class="admin-button--ghost" type="button" @click="passwordOpen=true">修改密码</button>
            <div class="admin-topbar-user">
              <div class="admin-topbar-avatar">{{ avatarInitial }}</div>
              <span>{{ currentUserName }}</span>
            </div>
          </div>
        </div>
      </header>

      <nav class="admin-breadcrumbs" aria-label="面包屑">
        <template v-for="(crumb, index) in breadcrumbs" :key="`${crumb.label}-${index}`">
          <RouterLink v-if="crumb.to && index < breadcrumbs.length - 1" :to="crumb.to">
            {{ crumb.label }}
          </RouterLink>
          <span v-else :class="{ 'is-current': index === breadcrumbs.length - 1 }">{{ crumb.label }}</span>
          <span v-if="index < breadcrumbs.length - 1" class="admin-breadcrumbs-sep">/</span>
        </template>
      </nav>

      <div class="admin-content">
        <RouterView />
      </div>
    </main>

    <div v-if="passwordOpen" class="admin-dialog-overlay" @click.self="passwordOpen=false">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="passwordOpen=false">&times;</button>
        <h3>修改密码</h3>
        <p>请输入当前密码与新密码</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>当前密码</label>
            <input v-model="passwordForm.currentPassword" type="password" class="admin-input" placeholder="请输入当前密码" />
          </div>
          <div class="admin-dialog-field">
            <label>新密码</label>
            <input v-model="passwordForm.newPassword" type="password" class="admin-input" placeholder="请输入新密码" />
          </div>
          <div class="admin-dialog-field">
            <label>确认新密码</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="admin-input" placeholder="再次输入新密码" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="passwordOpen=false">取消</button>
          <button class="admin-button" type="button" :disabled="passwordSubmitting || !passwordForm.currentPassword || !passwordForm.newPassword" @click="handlePasswordSubmit">
            {{ passwordSubmitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
