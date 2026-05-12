<script setup>
import { onMounted, ref, watch } from "vue";
import {
  createQueryTermMapping,
  deleteQueryTermMapping,
  getQueryTermMappingsPage,
  updateQueryTermMapping
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
  sourceTerm: "",
  targetTerm: "",
  matchType: "EXACT",
  enabled: true,
  priority: 0,
  remark: ""
});
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

async function loadData() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getQueryTermMappingsPage(pageNo.value, pageSize, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载映射规则失败。";
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
  form.value = { sourceTerm: "", targetTerm: "", matchType: "EXACT", enabled: true, priority: 0, remark: "" };
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = {
    sourceTerm: item.sourceTerm || "",
    targetTerm: item.targetTerm || "",
    matchType: item.matchType || "EXACT",
    enabled: item.enabled ?? true,
    priority: item.priority ?? 0,
    remark: item.remark || ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.sourceTerm.trim() || !form.value.targetTerm.trim()) return;
  submitting.value = true;
  try {
    const payload = {
      sourceTerm: form.value.sourceTerm.trim(),
      targetTerm: form.value.targetTerm.trim(),
      matchType: form.value.matchType,
      enabled: form.value.enabled,
      priority: Number(form.value.priority) || 0,
      remark: form.value.remark.trim() || null
    };
    if (dialogMode.value === "create") {
      await createQueryTermMapping(payload);
      pageNo.value = 1;
      await loadData();
    } else if (dialogTarget.value) {
      await updateQueryTermMapping(dialogTarget.value.id, payload);
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
    await deleteQueryTermMapping(deleteTarget.value.id);
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
        <span class="admin-page-eyebrow">Query Term Mapping</span>
        <h2 class="admin-page-title">关键词映射管理</h2>
        <p class="admin-page-subtitle">配置查询归一化的关键词映射规则</p>
      </div>
      <div class="admin-page-actions">
        <input
          v-model="searchInput"
          class="admin-input"
          type="search"
          placeholder="搜索原始词/目标词"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增映射</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div v-if="loading && pageRecords(page).length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="pageRecords(page).length === 0" class="admin-empty">暂无映射规则，点击上方按钮新增</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>原始词</th>
              <th>目标词</th>
              <th>匹配类型</th>
              <th>优先级</th>
              <th>状态</th>
              <th>备注</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>{{ item.sourceTerm }}</td>
              <td>{{ item.targetTerm }}</td>
              <td>
                <span class="admin-badge is-muted">{{ item.matchType }}</span>
              </td>
              <td>{{ item.priority }}</td>
              <td>
                <span :class="['admin-badge', item.enabled ? 'is-success' : 'is-muted']">
                  {{ item.enabled ? "启用" : "禁用" }}
                </span>
              </td>
              <td>{{ item.remark || "--" }}</td>
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
        <h3>{{ dialogMode === "create" ? "新增映射规则" : "编辑映射规则" }}</h3>
        <p>{{ dialogMode === "create" ? "配置查询归一化的关键词映射规则" : "修改映射规则" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>原始词</label>
            <input v-model="form.sourceTerm" class="admin-input" placeholder="请输入原始词" />
          </div>
          <div class="admin-dialog-field">
            <label>目标词</label>
            <input v-model="form.targetTerm" class="admin-input" placeholder="请输入目标词" />
          </div>
          <div class="admin-dialog-field">
            <label>匹配类型</label>
            <select v-model="form.matchType" class="admin-select">
              <option value="EXACT">精确匹配</option>
              <option value="REGEX">正则匹配</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>优先级</label>
            <input v-model.number="form.priority" class="admin-input" type="number" min="0" />
          </div>
          <div class="admin-dialog-field">
            <label>启用</label>
            <select v-model="form.enabled" class="admin-select">
              <option :value="true">启用</option>
              <option :value="false">禁用</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>备注</label>
            <input v-model="form.remark" class="admin-input" placeholder="可选" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.sourceTerm.trim() || !form.targetTerm.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">删除后该映射规则将失效，是否继续？</p>
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
