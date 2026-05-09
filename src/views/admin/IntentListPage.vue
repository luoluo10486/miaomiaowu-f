<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  batchDeleteIntentNodes,
  batchDisableIntentNodes,
  batchEnableIntentNodes,
  getIntentTree
} from "../../services/adminService";
import {
  confirmAction,
  flattenIntentTree,
  formatDateTime,
  pageRecords,
  pageTotal,
  parseIntentExamples,
  resolveIntentKindBadgeClass,
  resolveIntentKindLabel,
  resolveIntentLevelLabel
} from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const levelFilter = ref("");
const kindFilter = ref("");
const statusFilter = ref("");
const parentFilter = ref("");
const pageSize = ref(10);
const pageNo = ref(1);
const selectedIds = ref([]);
const batchSubmitting = ref("");
const tree = ref([]);

const rows = computed(() => flattenIntentTree(tree.value));

const parentOptions = computed(() => [
  { value: "", label: "全部父节点" },
  { value: "__ROOT__", label: "ROOT（根节点）" },
  ...rows.value.map((row) => ({
    value: row.intentCode,
    label: row.pathText || row.name
  }))
]);

const filteredRows = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase();
  return rows.value.filter((row) => {
    if (normalizedKeyword) {
      const searchable = [row.name, row.intentCode, String(row.id), row.pathText].join(" ").toLowerCase();
      if (!searchable.includes(normalizedKeyword)) {
        return false;
      }
    }

    if (levelFilter.value !== "" && String(row.level ?? "") !== levelFilter.value) {
      return false;
    }

    if (kindFilter.value !== "" && String(row.kind ?? "") !== kindFilter.value) {
      return false;
    }

    if (statusFilter.value === "enabled" && Number(row.enabled) === 0) {
      return false;
    }
    if (statusFilter.value === "disabled" && Number(row.enabled) !== 0) {
      return false;
    }

    if (parentFilter.value === "__ROOT__") {
      if (row.parentCode) {
        return false;
      }
    } else if (parentFilter.value && row.parentCode !== parentFilter.value) {
      return false;
    }

    return true;
  });
});

const total = computed(() => filteredRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const currentPage = computed(() => Math.min(pageNo.value, totalPages.value));
const pageRows = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredRows.value.slice(startIndex, startIndex + pageSize.value);
});
const selectedRows = computed(() => rows.value.filter((row) => selectedIds.value.includes(row.id)));
const selectedIdSet = computed(() => new Set(selectedIds.value));
const allPageSelected = computed(() => pageRows.value.length > 0 && pageRows.value.every((row) => selectedIdSet.value.has(row.id)));
const somePageSelected = computed(
  () => !allPageSelected.value && pageRows.value.some((row) => selectedIdSet.value.has(row.id))
);

async function loadTree() {
  loading.value = true;
  errorText.value = "";

  try {
    tree.value = await getIntentTree();
  } catch (error) {
    errorText.value = error?.message || "加载意图列表失败。";
  } finally {
    loading.value = false;
  }
}

function resetSelection() {
  selectedIds.value = [];
}

function toggleRowSelect(id, checked) {
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id];
    }
  } else {
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
  }
}

function togglePageSelect(checked) {
  const ids = pageRows.value.map((row) => row.id);
  if (checked) {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]));
    return;
  }
  selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
}

async function runBatchUpdateEnabled(enabled) {
  if (selectedRows.value.length === 0 || batchSubmitting.value) {
    return;
  }

  batchSubmitting.value = enabled ? "enable" : "disable";
  try {
    const ids = selectedRows.value.map((row) => row.id);
    if (enabled) {
      await batchEnableIntentNodes(ids);
    } else {
      await batchDisableIntentNodes(ids);
    }
    await loadTree();
    resetSelection();
  } catch (error) {
    errorText.value = error?.message || "批量更新失败。";
  } finally {
    batchSubmitting.value = "";
  }
}

async function runBatchDelete() {
  if (selectedRows.value.length === 0 || batchSubmitting.value) {
    return;
  }

  if (!confirmAction(`确认删除已选中的 ${selectedRows.value.length} 个意图节点吗？`)) {
    return;
  }

  batchSubmitting.value = "delete";
  try {
    await batchDeleteIntentNodes(selectedRows.value.map((row) => row.id));
    await loadTree();
    resetSelection();
  } catch (error) {
    errorText.value = error?.message || "批量删除失败。";
  } finally {
    batchSubmitting.value = "";
  }
}

function resolveResourceText(row) {
  if (Number(row.kind) === 0) {
    return row.collectionName || "-";
  }
  if (Number(row.kind) === 2) {
    return row.mcpToolId || "-";
  }
  return "系统策略";
}

onMounted(() => {
  void loadTree();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Intent List</span>
        <h2 class="admin-page-title">意图列表</h2>
        <p class="admin-page-subtitle">支持筛选、分页、批量启停和跳转编辑页。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="loadTree">Refresh</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-toolbar-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <input v-model="keyword" class="admin-input" type="search" placeholder="搜索名称 / ID / 路径" @keydown.enter.prevent="pageNo = 1" />
          <select v-model="levelFilter" class="admin-select">
            <option value="">全部层级</option>
            <option value="0">DOMAIN</option>
            <option value="1">CATEGORY</option>
            <option value="2">TOPIC</option>
          </select>
          <select v-model="kindFilter" class="admin-select">
            <option value="">全部类型</option>
            <option value="0">KB</option>
            <option value="1">SYSTEM</option>
            <option value="2">MCP</option>
          </select>
          <select v-model="statusFilter" class="admin-select">
            <option value="">全部状态</option>
            <option value="enabled">仅启用</option>
            <option value="disabled">仅禁用</option>
          </select>
          <select v-model="parentFilter" class="admin-select">
            <option v-for="option in parentOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <button class="admin-button--ghost" type="button" @click="loadTree">Search</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal({ records: filteredRows }) }} item(s)</span>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="selectedRows.length > 0" class="admin-toolbar-card" style="margin-bottom: 12px;">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <strong>已选 {{ selectedRows.length }} 项</strong>
          </div>
          <div class="admin-inline-actions">
            <button class="admin-button--ghost" type="button" :disabled="batchSubmitting" @click="runBatchUpdateEnabled(true)">批量启用</button>
            <button class="admin-button--ghost" type="button" :disabled="batchSubmitting" @click="runBatchUpdateEnabled(false)">批量禁用</button>
            <button class="admin-button--danger" type="button" :disabled="batchSubmitting" @click="runBatchDelete">批量删除</button>
          </div>
        </div>
      </div>

      <div v-if="pageRows.length === 0" class="admin-empty">暂无意图数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" :checked="allPageSelected" :indeterminate="somePageSelected" @change="togglePageSelect($event.target.checked)" /></th>
              <th>节点</th>
              <th>层级</th>
              <th>类型</th>
              <th>路径</th>
              <th>资源</th>
              <th>示例数</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pageRows" :key="row.id">
              <td><input type="checkbox" :checked="selectedIdSet.has(row.id)" @change="toggleRowSelect(row.id, $event.target.checked)" /></td>
              <td>
                <p>{{ row.name }}</p>
                <small class="admin-list-meta is-code">{{ row.intentCode }}</small>
              </td>
              <td><span class="admin-badge">{{ resolveIntentLevelLabel(row.level) }}</span></td>
              <td><span :class="['admin-badge', resolveIntentKindBadgeClass(row.kind)]">{{ resolveIntentKindLabel(row.kind) }}</span></td>
              <td>{{ row.pathText || row.name }}</td>
              <td>{{ resolveResourceText(row) }}</td>
              <td>{{ parseIntentExamples(row.examples).length }}</td>
              <td><span class="admin-badge">{{ Number(row.enabled) === 0 ? "Disabled" : "Enabled" }}</span></td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="router.push(`/admin/intent-list/${row.id}/edit?from=${encodeURIComponent('/admin/intent-list')}`)">Edit</button>
                  <button class="admin-button--ghost" type="button" @click="router.push(`/admin/intent-tree?intentCode=${encodeURIComponent(row.intentCode)}`)">Locate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
