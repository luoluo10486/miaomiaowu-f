<script setup>
import { computed, ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { adminNavGroups } from "./adminShared";
import { clearStoredAuth, getStoredAuthUser } from "../../utils/auth";
import {
  changeCurrentUserPassword,
  getKnowledgeBases,
  searchKnowledgeDocuments
} from "../../services/adminService";

const route = useRoute();
const router = useRouter();
const route = useRoute();
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
