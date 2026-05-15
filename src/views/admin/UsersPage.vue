<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  createUser,
  deleteUser,
  getUsersPage,
  updateUser
} from "../../services/userService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keywordInput = ref("");
const keyword = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, size: pageSize });
const selectedUserId = ref(null);

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref(buildEmptyForm());
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const pageUsers = computed(() => pageRecords(page.value));
const totalUsers = computed(() => pageTotal(page.value));
const adminCount = computed(() => pageUsers.value.filter((item) => normalizeRole(item.role) === "ADMIN").length);
const enabledCount = computed(() => pageUsers.value.filter((item) => item.enabled !== false).length);
const activeFilterLabel = computed(() => (keyword.value ? keyword.value : "全部用户"));
const selectedUser = computed(() => {
  if (selectedUserId.value) {
    return pageUsers.value.find((item) => item.id === selectedUserId.value) || pageUsers.value[0] || null;
  }
  return pageUsers.value[0] || null;
});
const currentPageLabel = computed(() => `${pageNo.value} / ${pageCount(page)}`);
const selectedUserLabel = computed(() => {
  if (!selectedUser.value) return "--";
  return `${userDisplayName(selectedUser.value)} · ${roleLabel(selectedUser.value.role)}`;
});

const stats = computed(() => [
  {
    title: "Total",
    value: String(totalUsers.value),
    hint: "用户总数",
    tone: "indigo"
  },
  {
    title: "Page",
    value: String(pageUsers.value.length),
    hint: "当前页数量",
    tone: "cyan"
  },
  {
    title: "Admins",
    value: String(adminCount.value),
    hint: "当前页管理员",
    tone: "emerald"
  },
  {
    title: "Enabled",
    value: String(enabledCount.value),
    hint: "当前页启用账号",
    tone: "amber"
  }
]);

function buildEmptyForm() {
  return {
    username: "",
    password: "",
    nickname: "",
    avatar: "",
    role: "USER",
    enabled: true
  };
}

function normalizeRole(role) {
  return String(role || "USER").trim().toUpperCase();
}

function isProtectedUser(item) {
  return String(item?.username || "").trim().toLowerCase() === "admin";
}

function userDisplayName(item) {
  return item?.nickname?.trim() || item?.username || "--";
}

function userAvatarInitial(item) {
  const source = userDisplayName(item).trim();
  return source ? source.slice(0, 1).toUpperCase() : "U";
}

function roleLabel(role) {
  return normalizeRole(role) === "ADMIN" ? "管理员" : "普通用户";
}

async function loadData(currentPage = pageNo.value, currentKeyword = keyword.value) {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getUsersPage(currentPage, pageSize, currentKeyword);
    if (!selectedUserId.value && pageUsers.value.length > 0) {
      selectedUserId.value = pageUsers.value[0].id;
    }
  } catch (error) {
    errorText.value = error?.message || "加载用户列表失败。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  const nextKeyword = keywordInput.value.trim();
  keyword.value = nextKeyword;
  pageNo.value = 1;
  void loadData(1, nextKeyword);
}

function handleRefresh() {
  void loadData(pageNo.value, keyword.value);
}

function resetSearch() {
  keywordInput.value = "";
  keyword.value = "";
  pageNo.value = 1;
  void loadData(1, "");
}

function goPrev() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadData(pageNo.value, keyword.value);
}

function goNext() {
  const nextPage = pageCount(page);
  if (pageNo.value >= nextPage) return;
  pageNo.value += 1;
  void loadData(pageNo.value, keyword.value);
}

function selectUser(item) {
  selectedUserId.value = item.id;
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = buildEmptyForm();
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = {
    username: item.username || "",
    password: "",
    nickname: item.nickname || "",
    avatar: item.avatar || "",
    role: normalizeRole(item.role),
    enabled: item.enabled !== false
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.username.trim()) return;
  if (dialogMode.value === "create" && !form.value.password.trim()) return;

  submitting.value = true;
  errorText.value = "";
  try {
    const payload = {
      username: form.value.username.trim(),
      nickname: form.value.nickname.trim() || null,
      avatar: form.value.avatar.trim() || null,
      role: normalizeRole(form.value.role),
      enabled: form.value.enabled
    };

    if (dialogMode.value === "create") {
      payload.password = form.value.password.trim();
      await createUser(payload);
      pageNo.value = 1;
      await loadData(1, keyword.value);
    } else if (dialogTarget.value) {
      if (form.value.password.trim()) {
        payload.password = form.value.password.trim();
      }
      await updateUser(dialogTarget.value.id, payload);
      await loadData(pageNo.value, keyword.value);
    }

    closeDialog();
  } catch (error) {
    errorText.value = error?.message || "保存用户失败。";
  } finally {
    submitting.value = false;
  }
}

function openDeleteDialog(item) {
  deleteTarget.value = item;
  deleteDialogOpen.value = true;
}

function closeDeleteDialog() {
  deleteDialogOpen.value = false;
  deleteTarget.value = null;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleteSubmitting.value = true;
  errorText.value = "";
  try {
    await deleteUser(deleteTarget.value.id);
    closeDeleteDialog();
    pageNo.value = 1;
    await loadData(1, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "删除用户失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

onMounted(() => {
  void loadData();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Users"
      title="用户管理"
      description="管理后台账号、角色、启用状态和头像信息，支持新建、编辑、禁用与删除。"
    >
      <template #meta>
        <div class="admin-header-meta">
          <span class="admin-badge is-muted">筛选：{{ activeFilterLabel }}</span>
          <span class="admin-badge is-muted">总数：{{ totalUsers }}</span>
          <span class="admin-badge is-muted">当前页：{{ pageUsers.length }}</span>
          <span class="admin-badge is-muted">管理员：{{ adminCount }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建用户</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </section>

    <section class="admin-detail-card users-hero">
      <div class="users-hero-copy">
        <p class="trace-hero-tag">User Center</p>
        <h2>账号与权限概览</h2>
        <p>快速检索后台账号，查看角色、状态和头像，并在右侧锁定当前选中用户的完整资料。</p>
      </div>
      <div class="users-hero-side">
        <div class="users-hero-cardline">
          <span class="users-hero-cardlabel">当前筛选</span>
          <strong>{{ activeFilterLabel }}</strong>
        </div>
        <div class="users-hero-cardline">
          <span class="users-hero-cardlabel">当前页</span>
          <strong>{{ currentPageLabel }}</strong>
        </div>
        <div class="users-hero-cardline">
          <span class="users-hero-cardlabel">选中用户</span>
          <strong>{{ selectedUserLabel }}</strong>
        </div>
        <div class="users-hero-cardline">
          <span class="users-hero-cardlabel">管理员 / 启用</span>
          <strong>{{ adminCount }} / {{ enabledCount }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>用户列表</h2>
            <p>查看账号、昵称、角色和状态，支持快速编辑密码与头像。</p>
          </div>
          <span class="admin-page-count">共 {{ totalUsers }} 条</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <input
              v-model="keywordInput"
              class="admin-input admin-search-input"
              type="search"
              placeholder="搜索用户名或昵称..."
              @keydown.enter.prevent="handleSearch"
            />
            <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
            <button class="admin-button--ghost" type="button" @click="resetSearch">重置</button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
            <button class="admin-button" type="button" @click="openCreateDialog">新建用户</button>
          </div>
        </div>

        <div v-if="loading && pageUsers.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pageUsers.length === 0" class="admin-empty">暂无用户</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:260px;">用户</th>
                <th style="width:120px;">角色</th>
                <th style="width:120px;">状态</th>
                <th style="width:160px;">创建时间</th>
                <th style="width:160px;">更新时间</th>
                <th style="width:160px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in pageUsers"
                :key="item.id"
                :class="selectedUser?.id === item.id ? 'is-active-row' : ''"
                @click="selectUser(item)"
              >
                <td>
                  <div class="admin-user-row">
                    <div class="admin-user-avatar">{{ userAvatarInitial(item) }}</div>
                    <div>
                      <p class="admin-cell-title">{{ userDisplayName(item) }}</p>
                      <p class="admin-cell-subtitle is-secondary">{{ item.username || "--" }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['admin-badge', normalizeRole(item.role) === 'ADMIN' ? 'is-outline' : 'is-success']">
                    {{ roleLabel(item.role) }}
                  </span>
                </td>
                <td>
                  <span :class="['admin-badge', item.enabled === false ? 'is-outline' : 'is-success']">
                    {{ item.enabled === false ? "禁用" : "启用" }}
                  </span>
                </td>
                <td>{{ formatDateTime(item.createTime) }}</td>
                <td>{{ formatDateTime(item.updateTime) }}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button
                      class="admin-button--ghost"
                      type="button"
                      :disabled="isProtectedUser(item)"
                      @click.stop="openEditDialog(item)"
                    >
                      编辑
                    </button>
                    <button
                      class="admin-button--danger"
                      type="button"
                      :disabled="isProtectedUser(item)"
                      @click.stop="openDeleteDialog(item)"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pageUsers.length > 0" class="admin-pagination">
          <span>共 {{ totalUsers }} 条</span>
          <div class="admin-pagination-right">
            <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
            <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
            <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>用户预览</h3>
          <p class="admin-detail-card-desc">点击一行查看完整资料和账号状态。</p>
          <div v-if="selectedUser" class="admin-kv">
            <div class="admin-user-preview">
              <div class="admin-user-avatar">{{ userAvatarInitial(selectedUser) }}</div>
              <div>
                <p class="admin-cell-title">{{ userDisplayName(selectedUser) }}</p>
                <p class="admin-cell-subtitle is-secondary">
                  {{ roleLabel(selectedUser.role) }} · {{ selectedUser.enabled === false ? "已禁用" : "已启用" }}
                </p>
              </div>
            </div>
            <div><dt>用户名</dt><dd>{{ selectedUser.username }}</dd></div>
            <div><dt>昵称</dt><dd>{{ selectedUser.nickname || "--" }}</dd></div>
            <div><dt>角色</dt><dd>{{ roleLabel(selectedUser.role) }}</dd></div>
            <div><dt>状态</dt><dd>{{ selectedUser.enabled === false ? "禁用" : "启用" }}</dd></div>
            <div><dt>创建时间</dt><dd>{{ formatDateTime(selectedUser.createTime) }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDateTime(selectedUser.updateTime) }}</dd></div>
            <div><dt>头像</dt><dd>{{ selectedUser.avatar || "--" }}</dd></div>
            <div><dt>保护账号</dt><dd>{{ isProtectedUser(selectedUser) ? "是" : "否" }}</dd></div>
          </div>
          <div v-else class="admin-empty-sm">暂无选中用户</div>
        </article>
      </aside>
    </section>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新建用户" : "编辑用户" }}</h3>
        <p>{{ dialogMode === "create" ? "填写账号基础信息和初始密码。" : "可修改昵称、头像、角色和密码，留空密码则不改动。 " }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>用户名</label>
            <input v-model="form.username" class="admin-input" placeholder="请输入用户名" />
          </div>
          <div class="admin-dialog-field">
            <label>密码</label>
            <input
              v-model="form.password"
              class="admin-input"
              type="password"
              :placeholder="dialogMode === 'create' ? '设置初始密码' : '留空则不修改密码'"
            />
          </div>
          <div class="admin-dialog-field">
            <label>昵称</label>
            <input v-model="form.nickname" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>头像 URL</label>
            <input v-model="form.avatar" class="admin-input" placeholder="可选，填写头像链接" />
          </div>
          <div class="admin-dialog-field">
            <label>角色</label>
            <select v-model="form.role" class="admin-select">
              <option value="ADMIN">管理员</option>
              <option value="USER">普通用户</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>状态</label>
            <select v-model="form.enabled" class="admin-select">
              <option :value="true">启用</option>
              <option :value="false">禁用</option>
            </select>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button
            class="admin-button"
            type="button"
            :disabled="submitting || !form.username.trim() || (dialogMode === 'create' && !form.password.trim())"
            @click="handleSubmit"
          >
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">删除后该账号将无法登录，是否继续？</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDeleteDialog">取消</button>
          <button class="admin-button--danger" type="button" :disabled="deleteSubmitting" @click="handleDelete">
            {{ deleteSubmitting ? "删除中..." : "删除" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.is-active-row {
  background: rgba(79, 70, 229, 0.05);
}

.admin-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-user-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-user-preview {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid var(--admin-line);
  border-radius: 14px;
  background: var(--admin-bg-soft);
}

.users-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.users-hero-copy {
  display: grid;
  gap: 8px;
}

.users-hero-copy h2 {
  margin: 0;
  font-size: 24px;
}

.users-hero-copy p,
.users-hero-side p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.users-hero-side {
  display: grid;
  gap: 12px;
  min-width: 280px;
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.76);
}

.users-hero-cardline {
  display: grid;
  gap: 4px;
}

.users-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.users-hero-cardline strong {
  color: var(--admin-ink);
  font-size: 14px;
  word-break: break-word;
}

@media (max-width: 960px) {
  .users-hero {
    flex-direction: column;
  }

  .users-hero-side {
    min-width: 0;
  }
}
</style>
