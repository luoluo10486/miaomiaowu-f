<script setup>
import { onMounted, ref, watch } from "vue";
import {
  createUser,
  deleteUser,
  getUsersPage,
  updateUser
} from "../../services/adminService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0 });

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({
  username: "",
  nickname: "",
  role: "USER",
  enabled: true
});
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

async function loadData() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getUsersPage(pageNo.value, pageSize, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载用户列表失败。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  loadData();
}

function handleRefresh() {
  pageNo.value = 1;
  loadData();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value--;
    loadData();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value++;
    loadData();
  }
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = { username: "", nickname: "", role: "USER", enabled: true };
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = {
    username: item.username || "",
    nickname: item.nickname || "",
    role: item.role || "USER",
    enabled: item.enabled ?? true
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.username.trim()) return;
  submitting.value = true;
  try {
    const payload = {
      username: form.value.username.trim(),
      nickname: form.value.nickname.trim() || null,
      role: form.value.role,
      enabled: form.value.enabled
    };
    if (dialogMode.value === "create") {
      await createUser(payload);
      pageNo.value = 1;
      await loadData();
    } else if (dialogTarget.value) {
      await updateUser(dialogTarget.value.id, payload);
      await loadData();
    }
    dialogOpen.value = false;
  } catch (error) {
    errorText.value = error?.message || "保存失败。";
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
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    pageNo.value = 1;
    await loadData();
  } catch (error) {
    errorText.value = error?.message || "删除失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

watch(keyword, () => {
  pageNo.value = 1;
  loadData();
});

onMounted(() => {
  void loadData();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Users</span>
        <h2 class="admin-page-title">用户管理</h2>
        <p class="admin-page-subtitle">管理后台账号与角色权限</p>
      </div>
      <div class="admin-page-actions">
        <input
          v-model="searchInput"
          class="admin-input"
          type="search"
          placeholder="搜索用户名或角色"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增用户</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div v-if="loading && pageRecords(page).length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="pageRecords(page).length === 0" class="admin-empty">暂无用户</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>昵称</th>
              <th>角色</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>{{ item.username }}</td>
              <td>{{ item.nickname || "--" }}</td>
              <td>
                <span :class="['admin-badge', item.role === 'ADMIN' ? 'is-accent' : 'is-muted']">
                  {{ item.role === 'ADMIN' ? '管理员' : '普通用户' }}
                </span>
              </td>
              <td>
                <span :class="['admin-badge', item.enabled ? 'is-success' : 'is-muted']">
                  {{ item.enabled ? '启用' : '禁用' }}
                </span>
              </td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.updateTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pageRecords(page).length > 0" class="admin-pagination">
        <span>共 {{ pageTotal(page) }} 条</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
        </div>
      </div>
    </article>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新增用户" : "编辑用户" }}</h3>
        <p>{{ dialogMode === "create" ? "配置账号基本信息" : "更新账号信息" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>用户名</label>
            <input v-model="form.username" class="admin-input" placeholder="请输入用户名" />
          </div>
          <div class="admin-dialog-field">
            <label>昵称</label>
            <input v-model="form.nickname" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>角色</label>
            <select v-model="form.role" class="admin-select">
              <option value="ADMIN">管理员</option>
              <option value="USER">普通用户</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>启用</label>
            <select v-model="form.enabled" class="admin-select">
              <option :value="true">启用</option>
              <option :value="false">禁用</option>
            </select>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.username.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">删除后该用户将无法登录，是否继续？</p>
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
