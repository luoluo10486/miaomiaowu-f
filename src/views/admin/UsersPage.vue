<script setup>
import { computed, onMounted, ref } from "vue";
import {
  createUser,
  deleteUser,
  getUsersPage,
  updateUser
} from "../../services/userService";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, size: pageSize });

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
const adminCount = computed(
  () => pageUsers.value.filter((item) => normalizeRole(item.role) === "ADMIN").length
);
const enabledCount = computed(() => pageUsers.value.filter((item) => item.enabled !== false).length);

const statCards = computed(() => [
  { title: "当前页用户", value: String(pageUsers.value.length), tone: "indigo", icon: "U" },
  { title: "总用户数", value: String(totalUsers.value), tone: "cyan", icon: "T" },
  { title: "管理员", value: String(adminCount.value), tone: "emerald", icon: "A" },
  { title: "启用账号", value: String(enabledCount.value), tone: "amber", icon: "E" }
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

function resetForm() {
  form.value = buildEmptyForm();
}

async function loadData(currentPage = pageNo.value, currentKeyword = keyword.value) {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getUsersPage(currentPage, pageSize, currentKeyword);
  } catch (error) {
    errorText.value = error?.message || "加载用户列表失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  const nextKeyword = searchInput.value.trim();
  keyword.value = nextKeyword;
  pageNo.value = 1;
  void loadData(1, nextKeyword);
}

function handleRefresh() {
  void loadData(pageNo.value, keyword.value);
}

function goPrev() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadData(pageNo.value, keyword.value);
}

function goNext() {
  const nextPage = pageCount(page.value);
  if (pageNo.value >= nextPage) return;
  pageNo.value += 1;
  void loadData(pageNo.value, keyword.value);
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  resetForm();
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
    errorText.value = error?.message || "保存用户失败，请稍后重试。";
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
  try {
    await deleteUser(deleteTarget.value.id);
    closeDeleteDialog();
    pageNo.value = 1;
    await loadData(1, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "删除用户失败，请稍后重试。";
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
      <template #actions>
        <input
          v-model="searchInput"
          class="admin-input admin-page-header-search"
          type="search"
          placeholder="搜索用户名或昵称"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建用户</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard v-for="card in statCards" :key="card.title" :title="card.title" :value="card.value" :tone="card.tone">
        <template #icon>{{ card.icon }}</template>
      </StatCard>
    </div>

    <section class="admin-table-card">
      <div class="admin-table-card__header">
        <div>
          <h2>用户列表</h2>
          <p>查看账号、昵称、角色与状态，支持快速编辑密码和头像。</p>
        </div>
        <span class="admin-page-count">{{ totalUsers }} 条</span>
      </div>

      <div v-if="loading && pageUsers.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="pageUsers.length === 0" class="admin-empty">暂无用户</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>角色</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageUsers" :key="item.id">
              <td>
                <div class="flex items-center gap-3">
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
                  {{ item.enabled === false ? '禁用' : '启用' }}
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
                    @click="openEditDialog(item)"
                  >
                    编辑
                  </button>
                  <button
                    class="admin-button--danger"
                    type="button"
                    :disabled="isProtectedUser(item)"
                    @click="openDeleteDialog(item)"
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
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">
            上一页
          </button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">
            下一页
          </button>
        </div>
      </div>
    </section>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新建用户" : "编辑用户" }}</h3>
        <p>
          {{ dialogMode === "create" ? "填写账号基础信息与初始密码" : "可更新昵称、头像、角色与密码，留空密码则不修改" }}
        </p>
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
