<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  batchDeleteIntentNodes,
  batchDisableIntentNodes,
  batchEnableIntentNodes,
  getIntentTree
} from "../../services/intentTreeService";
import { flattenIntentTree, formatDateTime } from "./adminShared";

const router = useRouter();

const loading = ref(false);
const errorText = ref("");
const tree = ref([]);
const keyword = ref("");
const keywordInput = ref("");
const levelFilter = ref("ALL");
const kindFilter = ref("ALL");
const statusFilter = ref("ALL");
const parentFilter = ref("ALL");
const pageNo = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 50];
const selectedIds = ref([]);
const batchSubmitting = ref(null);

const deleteDialogOpen = ref(false);
const deleteDialogTarget = ref(null);
const deleteDialogSubmitting = ref(false);

const LEVEL_OPTIONS = [
  { value: 0, label: "DOMAIN" },
  { value: 1, label: "CATEGORY" },
  { value: 2, label: "TOPIC" }
];

const KIND_OPTIONS = [
  { value: 0, label: "KB" },
  { value: 1, label: "SYSTEM" },
  { value: 2, label: "MCP" }
];

const rows = computed(() => flattenIntentTree(tree.value));

const parentOptions = computed(() => [
  { value: "ALL", label: "全部父节点" },
  { value: "ROOT", label: "ROOT（根节点）" },
  ...rows.value.map((row) => ({
    value: row.intentCode,
    label: row.pathText
  }))
]);

const filteredRows = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase();
  return rows.value.filter((row) => {
    if (normalizedKeyword) {
      const searchable = [row.name, row.intentCode, String(row.id), row.pathText].join(" ").toLowerCase();
      if (!searchable.includes(normalizedKeyword)) return false;
    }
    if (levelFilter.value !== "ALL" && row.level !== Number(levelFilter.value)) return false;
    if (kindFilter.value !== "ALL" && row.kind !== Number(kindFilter.value)) return false;
    if (statusFilter.value === "enabled" && row.enabled === 0) return false;
    if (statusFilter.value === "disabled" && row.enabled !== 0) return false;
    if (parentFilter.value !== "ALL") {
      if (parentFilter.value === "ROOT") {
        if (row.parentCode) return false;
      } else if (row.parentCode !== parentFilter.value) {
        return false;
      }
    }
    return true;
  });
});

const total = computed(() => filteredRows.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const currentPage = computed(() => Math.min(pageNo.value, totalPages.value));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const pageRows = computed(() => filteredRows.value.slice(startIndex.value, startIndex.value + pageSize.value));
const selectedIdSet = computed(() => new Set(selectedIds.value));
const pageRowIds = computed(() => pageRows.value.map((row) => row.id));
const allPageSelected = computed(() => pageRowIds.value.length > 0 && pageRowIds.value.every((id) => selectedIdSet.value.has(id)));
const somePageSelected = computed(() => !allPageSelected.value && pageRowIds.value.some((id) => selectedIdSet.value.has(id)));
const rangeStart = computed(() => (total.value === 0 ? 0 : startIndex.value + 1));
const rangeEnd = computed(() => (total.value === 0 ? 0 : Math.min(startIndex.value + pageRows.value.length, total.value)));
const focusRow = computed(() => pageRows.value[0] || filteredRows.value[0] || null);

const stats = computed(() => [
  {
    title: "Total",
    value: rows.value.length,
    hint: "意图树总节点数",
    tone: "indigo"
  },
  {
    title: "Visible",
    value: filteredRows.value.length,
    hint: "当前筛选命中的节点",
    tone: "cyan"
  },
  {
    title: "Enabled",
    value: filteredRows.value.filter((row) => row.enabled !== 0).length,
    hint: "当前筛选中已启用节点",
    tone: "emerald"
  },
  {
    title: "Selected",
    value: selectedIds.value.length,
    hint: "当前勾选节点数",
    tone: "amber"
  }
]);

function resolveLevelLabel(value) {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? "UNKNOWN";
}

function resolveKindLabel(value) {
  return KIND_OPTIONS.find((option) => option.value === value)?.label ?? "UNKNOWN";
}

function resolveLevelBadgeClass(value) {
  if (value === 0) return "is-info";
  if (value === 1) return "is-success";
  if (value === 2) return "is-warn";
  return "is-muted";
}

function resolveResourceText(row) {
  if (row.kind === 0) return row.collectionName || "-";
  if (row.kind === 2) return row.mcpToolId || "-";
  return "系统意图";
}

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

function resetFilters() {
  keyword.value = "";
  keywordInput.value = "";
  levelFilter.value = "ALL";
  kindFilter.value = "ALL";
  statusFilter.value = "ALL";
  parentFilter.value = "ALL";
  pageNo.value = 1;
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = keywordInput.value.trim();
}

function handleRefresh() {
  pageNo.value = 1;
  void loadTree();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value -= 1;
  }
}

function goNext() {
  if (pageNo.value < totalPages.value) {
    pageNo.value += 1;
  }
}

function toggleRowSelect(id, checked) {
  if (checked) {
    if (!selectedIds.value.includes(id)) selectedIds.value.push(id);
  } else {
    selectedIds.value = selectedIds.value.filter((item) => item !== id);
  }
}

function togglePageSelect(checked) {
  if (checked) {
    const next = new Set(selectedIds.value);
    pageRowIds.value.forEach((id) => next.add(id));
    selectedIds.value = Array.from(next);
  } else {
    const pageIdSet = new Set(pageRowIds.value);
    selectedIds.value = selectedIds.value.filter((id) => !pageIdSet.has(id));
  }
}

async function runBatchUpdateEnabled(enabled) {
  const selectedRows = rows.value.filter((row) => selectedIdSet.value.has(row.id));
  if (selectedRows.length === 0 || batchSubmitting.value) return;
  batchSubmitting.value = enabled === 1 ? "enable" : "disable";
  try {
    const targetIds = selectedRows.map((row) => row.id);
    if (enabled === 1) {
      await batchEnableIntentNodes(targetIds);
    } else {
      await batchDisableIntentNodes(targetIds);
    }
    await loadTree();
    selectedIds.value = [];
  } catch (error) {
    errorText.value = error?.message || "批量更新失败。";
  } finally {
    batchSubmitting.value = null;
  }
}

function openBatchDeleteDialog() {
  const selectedRows = rows.value.filter((row) => selectedIdSet.value.has(row.id));
  if (selectedRows.length === 0 || batchSubmitting.value) return;
  deleteDialogTarget.value = { count: selectedRows.length, ids: selectedRows.map((row) => row.id) };
  deleteDialogOpen.value = true;
}

async function handleBatchDelete() {
  if (!deleteDialogTarget.value) return;
  deleteDialogSubmitting.value = true;
  try {
    await batchDeleteIntentNodes(deleteDialogTarget.value.ids);
    deleteDialogOpen.value = false;
    deleteDialogTarget.value = null;
    await loadTree();
    selectedIds.value = [];
  } catch (error) {
    errorText.value = error?.message || "批量删除失败。";
  } finally {
    deleteDialogSubmitting.value = false;
  }
}

function handleEdit(row) {
  router.push(`/admin/intent-list/${row.id}/edit?from=${encodeURIComponent("/admin/intent-list")}`);
}

function handleLocateInTree(row) {
  router.push(`/admin/intent-tree?intentCode=${encodeURIComponent(row.intentCode)}`);
}

onMounted(() => {
  void loadTree();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Intent Tree"
      title="意图列表"
      description="支持多维筛选、批量操作和快速定位到意图树节点。"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="router.push('/admin/intent-tree')">返回树视图</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </div>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>意图节点</h2>
            <p>使用筛选条件、批量勾选和行内操作管理节点列表。</p>
          </div>
          <span class="admin-page-count">{{ rangeStart }}-{{ rangeEnd }} / {{ total }}</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left" style="flex-wrap:wrap;gap:8px;">
            <input v-model="keywordInput" class="admin-input admin-search-input" placeholder="搜索意图名称 / ID / 路径..." style="max-width:280px;" @keydown.enter.prevent="handleSearch" />
            <select v-model="levelFilter" class="admin-select" @change="pageNo = 1">
              <option value="ALL">全部层级</option>
              <option v-for="opt in LEVEL_OPTIONS" :key="opt.value" :value="String(opt.value)">{{ opt.label }}</option>
            </select>
            <select v-model="kindFilter" class="admin-select" @change="pageNo = 1">
              <option value="ALL">全部类型</option>
              <option v-for="opt in KIND_OPTIONS" :key="opt.value" :value="String(opt.value)">{{ opt.label }}</option>
            </select>
            <select v-model="statusFilter" class="admin-select" @change="pageNo = 1">
              <option value="ALL">全部状态</option>
              <option value="enabled">仅启用</option>
              <option value="disabled">仅禁用</option>
            </select>
            <select v-model="parentFilter" class="admin-select" @change="pageNo = 1" style="max-width:220px;">
              <option v-for="opt in parentOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleSearch">搜索</button>
            <button class="admin-button--ghost" type="button" style="color:var(--admin-warn,#dc2626);" @click="resetFilters">清空筛选</button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
          </div>
        </div>

        <div v-if="selectedIds.length > 0" class="admin-batch-bar">
          <span>已选 {{ selectedIds.length }} 项</span>
          <div class="admin-inline-actions">
            <button class="admin-button--ghost" type="button" :disabled="Boolean(batchSubmitting)" @click="runBatchUpdateEnabled(1)">批量启用</button>
            <button class="admin-button--ghost" type="button" :disabled="Boolean(batchSubmitting)" @click="runBatchUpdateEnabled(0)">批量禁用</button>
            <button class="admin-button--danger" type="button" :disabled="Boolean(batchSubmitting)" @click="openBatchDeleteDialog">批量删除</button>
          </div>
        </div>

        <div v-if="loading && pageRows.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pageRows.length === 0" class="admin-empty">
          {{ rows.length === 0 ? "暂无意图节点，请先在意图树中创建" : "没有匹配结果，请调整筛选条件" }}
        </div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:40px;">
                  <input type="checkbox" :checked="allPageSelected" :indeterminate="somePageSelected" @change="togglePageSelect($event.target.checked)" />
                </th>
                <th style="width:240px;">意图节点</th>
                <th style="width:100px;">层级</th>
                <th style="width:100px;">类型</th>
                <th style="width:260px;">路径</th>
                <th style="width:180px;">关联资源</th>
                <th style="width:80px;">示例数</th>
                <th style="width:80px;">状态</th>
                <th style="width:160px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pageRows" :key="row.id">
                <td>
                  <input type="checkbox" :checked="selectedIdSet.has(row.id)" @change="toggleRowSelect(row.id, $event.target.checked)" />
                </td>
                <td>
                  <div>
                    <strong style="color:var(--admin-ink,#1e293b);">{{ row.name }}</strong>
                    <small class="is-code" style="margin-left:6px;">{{ row.intentCode }}</small>
                  </div>
                </td>
                <td><span :class="['admin-badge', resolveLevelBadgeClass(row.level)]">{{ resolveLevelLabel(row.level) }}</span></td>
                <td><span class="admin-badge">{{ resolveKindLabel(row.kind) }}</span></td>
                <td>
                  <div class="admin-path-segments">
                    <template v-for="(segment, index) in row.pathNames" :key="`${row.id}-${segment}-${index}`">
                      <span v-if="index > 0" class="admin-path-sep">/</span>
                      <button
                        type="button"
                        :class="['admin-path-btn', index === row.pathNames.length - 1 ? 'is-current' : '']"
                        @click="router.push(`/admin/intent-tree?intentCode=${encodeURIComponent(row.pathCodes[index])}`)"
                      >
                        {{ segment }}
                      </button>
                    </template>
                  </div>
                </td>
                <td>
                  <div>
                    <span style="color:var(--admin-ink,#1e293b);">{{ resolveResourceText(row) }}</span>
                    <br />
                    <small class="admin-list-meta">TopK: {{ row.topK ?? "全局默认" }}</small>
                  </div>
                </td>
                <td>{{ row.exampleCount }}</td>
                <td>
                  <span :class="['admin-badge', row.enabled === 0 ? 'is-muted' : 'is-success']">
                    {{ row.enabled === 0 ? "禁用" : "启用" }}
                  </span>
                </td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click="handleEdit(row)">编辑</button>
                    <button class="admin-button--ghost" type="button" @click="handleLocateInTree(row)">定位树</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pageRows.length > 0" class="admin-pagination">
          <span>共 {{ total }} 条，显示 {{ rangeStart }}-{{ rangeEnd }}</span>
          <div class="admin-pagination-right">
            <span>每页</span>
            <select v-model.number="pageSize" class="admin-select" style="width:80px;" @change="pageNo = 1">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }} 条</option>
            </select>
            <button class="admin-button--ghost" type="button" :disabled="currentPage <= 1" @click="pageNo = 1">首页</button>
            <button class="admin-button--ghost" type="button" :disabled="currentPage <= 1" @click="goPrev">上一页</button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button class="admin-button--ghost" type="button" :disabled="currentPage >= totalPages" @click="goNext">下一页</button>
            <button class="admin-button--ghost" type="button" :disabled="currentPage >= totalPages" @click="pageNo = totalPages">末页</button>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>筛选概览</h3>
          <p class="admin-detail-card-desc">当前筛选条件与结果数量。</p>
          <div class="admin-kv">
            <div><dt>关键词</dt><dd>{{ keyword || "--" }}</dd></div>
            <div><dt>层级</dt><dd>{{ levelFilter === "ALL" ? "全部" : resolveLevelLabel(Number(levelFilter)) }}</dd></div>
            <div><dt>类型</dt><dd>{{ kindFilter === "ALL" ? "全部" : resolveKindLabel(Number(kindFilter)) }}</dd></div>
            <div><dt>状态</dt><dd>{{ statusFilter === "ALL" ? "全部" : statusFilter }}</dd></div>
            <div><dt>父节点</dt><dd>{{ parentFilter }}</dd></div>
            <div><dt>命中</dt><dd>{{ total }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>节点预览</h3>
          <p class="admin-detail-card-desc">展示当前分页的首个节点，帮助快速判断路径和资源归属。</p>
          <div v-if="focusRow" class="admin-kv">
            <div><dt>名称</dt><dd>{{ focusRow.name }}</dd></div>
            <div><dt>Intent Code</dt><dd class="is-code">{{ focusRow.intentCode }}</dd></div>
            <div><dt>路径</dt><dd>{{ focusRow.pathText }}</dd></div>
            <div><dt>资源</dt><dd>{{ resolveResourceText(focusRow) }}</dd></div>
            <div><dt>示例数</dt><dd>{{ focusRow.exampleCount }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDateTime(focusRow.updateTime || focusRow.createTime) }}</dd></div>
          </div>
          <div v-else class="admin-empty-sm">暂无预览节点</div>
        </article>
      </aside>
    </section>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="deleteDialogOpen = false; deleteDialogTarget = null;">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="deleteDialogOpen = false; deleteDialogTarget = null;">&times;</button>
        <h3>确认批量删除</h3>
        <p class="admin-confirm-text">将删除已选中的 {{ deleteDialogTarget?.count }} 个意图节点，该操作不可恢复。</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="deleteDialogOpen = false; deleteDialogTarget = null;">取消</button>
          <button class="admin-button--danger" type="button" :disabled="deleteDialogSubmitting" @click="handleBatchDelete">
            {{ deleteDialogSubmitting ? "删除中..." : "删除" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
