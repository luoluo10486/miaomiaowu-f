<script setup>
import { onMounted, ref } from "vue";
import {
  createQueryTermMapping,
  deleteQueryTermMapping,
  getQueryTermMappingsPage,
  updateQueryTermMapping
} from "../../services/adminService";
import { askNumber, askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const page = ref({ records: [], total: 0 });

async function loadMappings() {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getQueryTermMappingsPage(1, 50, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载 query mapping 失败。";
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const sourceTerm = askText("请输入 source term");
  if (!sourceTerm) {
    return;
  }

  const targetTerm = askText("请输入 target term");
  if (!targetTerm) {
    return;
  }

  const matchType = askNumber("请输入 matchType", 0);
  const priority = askNumber("请输入 priority", 0);
  const remark = askText("请输入备注", "");

  try {
    await createQueryTermMapping({
      sourceTerm,
      targetTerm,
      matchType: matchType || 0,
      priority: priority || 0,
      enabled: true,
      remark: remark || ""
    });
    await loadMappings();
  } catch (error) {
    errorText.value = error?.message || "创建 mapping 失败。";
  }
}

async function handleEdit(item) {
  const sourceTerm = askText("编辑 source term", item.sourceTerm || "");
  if (!sourceTerm) {
    return;
  }

  const targetTerm = askText("编辑 target term", item.targetTerm || "");
  if (!targetTerm) {
    return;
  }

  const matchType = askNumber("编辑 matchType", item.matchType ?? 0);
  const priority = askNumber("编辑 priority", item.priority ?? 0);
  const remark = askText("编辑备注", item.remark || "");

  try {
    await updateQueryTermMapping(item.id, {
      sourceTerm,
      targetTerm,
      matchType: matchType || 0,
      priority: priority || 0,
      enabled: item.enabled,
      remark: remark || ""
    });
    await loadMappings();
  } catch (error) {
    errorText.value = error?.message || "更新 mapping 失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction("确认删除这个 mapping 吗？")) {
    return;
  }

  try {
    await deleteQueryTermMapping(item.id);
    await loadMappings();
  } catch (error) {
    errorText.value = error?.message || "删除 mapping 失败。";
  }
}

onMounted(() => {
  void loadMappings();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Mappings</span>
        <h2 class="admin-page-title">查询词映射</h2>
        <p class="admin-page-subtitle">补齐查询词映射的搜索、创建、编辑、删除入口，用来做 query rewrite 前的术语对齐。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button" type="button" @click="handleCreate">Create Mapping</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-toolbar-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <input
            v-model="keyword"
            class="admin-input"
            type="search"
            placeholder="搜索 source / target"
            @keydown.enter.prevent="loadMappings"
          />
          <button class="admin-button--ghost" type="button" @click="loadMappings">Search</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} mapping(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadMappings">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无 mapping 数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Target</th>
              <th>Match Type</th>
              <th>Priority</th>
              <th>Remark</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>{{ item.sourceTerm || "--" }}</td>
              <td>{{ item.targetTerm || "--" }}</td>
              <td>{{ item.matchType ?? "--" }}</td>
              <td>{{ item.priority ?? "--" }}</td>
              <td>{{ item.remark || "--" }}</td>
              <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
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
