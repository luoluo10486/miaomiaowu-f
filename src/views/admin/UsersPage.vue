<script setup>
import { onMounted, ref } from "vue";
import {
  changeCurrentUserPassword,
  createUser,
  deleteUser,
  getUsersPage,
  updateUser
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const successText = ref("");
const keyword = ref("");
const page = ref({ records: [], total: 0 });

async function loadUsers() {
  loading.value = true;
  errorText.value = "";
  successText.value = "";

  try {
    page.value = await getUsersPage(1, 50, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载用户失败。";
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const username = askText("请输入用户名");
  if (!username) {
    return;
  }

  const password = askText("请输入密码");
  if (!password) {
    return;
  }

  const role = askText("请输入角色", "user");
  if (!role) {
    return;
  }

  try {
    await createUser({ username, password, role });
    successText.value = "用户已创建。";
    await loadUsers();
  } catch (error) {
    errorText.value = error?.message || "创建用户失败。";
  }
}

async function handleEdit(item) {
  const username = askText("编辑用户名", item.username || "");
  if (!username) {
    return;
  }

  const role = askText("编辑角色", item.role || "user");
  if (!role) {
    return;
  }

  const password = askText("如需重置密码请输入新密码，可留空", "");
  if (password === null) {
    return;
  }

  try {
    await updateUser(item.id, {
      username,
      role,
      ...(password ? { password } : {})
    });
    successText.value = "用户信息已更新。";
    await loadUsers();
  } catch (error) {
    errorText.value = error?.message || "更新用户失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction(`确认删除用户“${item.username || item.id}”吗？`)) {
    return;
  }

  try {
    await deleteUser(item.id);
    successText.value = "用户已删除。";
    await loadUsers();
  } catch (error) {
    errorText.value = error?.message || "删除用户失败。";
  }
}

async function handleChangeMyPassword() {
  const currentPassword = askText("请输入当前密码");
  if (!currentPassword) {
    return;
  }

  const newPassword = askText("请输入新密码");
  if (!newPassword) {
    return;
  }

  try {
    await changeCurrentUserPassword({ currentPassword, newPassword });
    successText.value = "当前登录用户密码已更新。";
  } catch (error) {
    errorText.value = error?.message || "修改密码失败。";
  }
}

onMounted(() => {
  void loadUsers();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Users</span>
        <h2 class="admin-page-title">用户管理</h2>
        <p class="admin-page-subtitle">补齐用户列表、创建、角色修改、密码重置和当前账号改密入口。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="handleChangeMyPassword">Change My Password</button>
        <button class="admin-button" type="button" @click="handleCreate">Create User</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>
    <p v-if="successText" class="admin-notice is-success">{{ successText }}</p>

    <article class="admin-toolbar-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <input
            v-model="keyword"
            class="admin-input"
            type="search"
            placeholder="搜索用户名"
            @keydown.enter.prevent="loadUsers"
          />
          <button class="admin-button--ghost" type="button" @click="loadUsers">Search</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} user(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadUsers">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无用户数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>{{ item.username || "--" }}</td>
              <td><span class="admin-badge">{{ item.role || "--" }}</span></td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.updateTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="handleEdit(item)">Edit</button>
                  <button class="admin-button--danger" type="button" @click="handleDelete(item)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
