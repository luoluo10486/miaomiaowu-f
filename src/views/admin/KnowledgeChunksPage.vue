<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  batchToggleKnowledgeChunks,
  createKnowledgeChunk,
  deleteKnowledgeChunk,
  getKnowledgeChunkLogsPage,
  getKnowledgeChunksPage,
  getKnowledgeDocument,
  toggleKnowledgeChunk,
  updateKnowledgeChunk
} from "../../services/knowledgeService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);
const docId = computed(() => route.params.docId);

const loading = ref(false);
const errorText = ref("");
const doc = ref(null);
const chunksPage = ref({ records: [], total: 0, pages: 1, current: 1, size: 10 });
const logsPage = ref({ records: [], total: 0 });
const enabledFilter = ref("");
const selectedIds = ref(new Set());
const previewTarget = ref(null);

const pageNo = ref(1);
const pageSize = 10;

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({ content: "", index: "" });
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const ENABLED_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "1", label: "启用" },
  { value: "0", label: "禁用" }
];

const chunkStats = computed(() => [
  {
    title: "Chunks",
    value: pageTotal(chunksPage.value),
    hint: "当前文档的切片总数",
    tone: "indigo"
  },
  {
    title: "Enabled",
    value: pageRecords(chunksPage.value).filter((item) => isEnabled(item)).length,
    hint: "当前页已启用切片数",
    tone: "emerald"
  },
  {
    title: "Selected",
    value: selectedIds.value.size,
    hint: "当前已选中的切片数",
    tone: "amber"
  }
]);

function isEnabled(item) {
  return item.enabled === 1 || item.enabled === true;
}

function truncateContent(content, maxLen = 120) {
  if (!content) return "--";
  const text = String(content).replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

function enabledBadgeClass(item) {
  return isEnabled(item) ? "is-success" : "is-muted";
}

async function loadDocument() {
  if (!docId.value) return;
  try {
    doc.value = await getKnowledgeDocument(docId.value);
  } catch (error) {
    errorText.value = error?.message || "加载文档失败。";
  }
}

async function loadChunks() {
  if (!docId.value) return;
  loading.value = true;
  errorText.value = "";
  selectedIds.value = new Set();
  try {
    const params = { current: pageNo.value, size: pageSize };
    if (enabledFilter.value === "1") params.enabled = true;
    if (enabledFilter.value === "0") params.enabled = false;
    const [chunkData, logData] = await Promise.all([
      getKnowledgeChunksPage(docId.value, params),
      getKnowledgeChunkLogsPage(docId.value, 1, 10)
    ]);
    chunksPage.value = chunkData || { records: [], total: 0, pages: 1, current: 1, size: pageSize };
    logsPage.value = logData || { records: [], total: 0 };
  } catch (error) {
    errorText.value = error?.message || "加载切片数据失败。";
  } finally {
    loading.value = false;
  }
}

function refreshAll() {
  pageNo.value = 1;
  void loadChunks();
}

watch([docId, enabledFilter], () => {
  pageNo.value = 1;
  void loadChunks();
});

function handleFilterChange() {
  pageNo.value = 1;
  void loadChunks();
}

function handleSearchRefresh() {
  pageNo.value = 1;
  void loadChunks();
}

function toggleSelect(id) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
}

function toggleSelectAll() {
  const records = pageRecords(chunksPage.value);
  const next = new Set(selectedIds.value);
  const allSelected = records.length > 0 && records.every((chunk) => next.has(String(chunk.id)));
  if (allSelected) {
    records.forEach((chunk) => next.delete(String(chunk.id)));
  } else {
    records.forEach((chunk) => next.add(String(chunk.id)));
  }
  selectedIds.value = next;
}

async function handleBatchToggle(enable) {
  const ids = Array.from(selectedIds.value);
  if (ids.length === 0) return;
  loading.value = true;
  errorText.value = "";
  try {
    await batchToggleKnowledgeChunks(docId.value, enable, ids);
    selectedIds.value = new Set();
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || (enable ? "批量启用失败。" : "批量禁用失败。");
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = { content: "", index: "" };
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = { content: item.content || "", index: item.chunkIndex ?? "" };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  const content = form.value.content.trim();
  if (!content) return;

  const indexRaw = String(form.value.index ?? "").trim();
  const indexValue = indexRaw ? Number(indexRaw) : null;
  if (indexRaw && (!Number.isInteger(indexValue) || indexValue < 0)) {
    errorText.value = "序号必须是非负整数。";
    return;
  }

  submitting.value = true;
  errorText.value = "";
  try {
    if (dialogMode.value === "create") {
      await createKnowledgeChunk(docId.value, {
        content,
        index: indexValue
      });
    } else if (dialogTarget.value) {
      await updateKnowledgeChunk(docId.value, dialogTarget.value.id, {
        content
      });
    }
    closeDialog();
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || (dialogMode.value === "create" ? "创建切片失败。" : "更新切片失败。");
  } finally {
    submitting.value = false;
  }
}

async function handleToggle(item) {
  try {
    await toggleKnowledgeChunk(docId.value, item.id, !isEnabled(item));
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "切换切片状态失败。";
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
    await deleteKnowledgeChunk(docId.value, deleteTarget.value.id);
    closeDeleteDialog();
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "删除切片失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

function goPrev() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadChunks();
}

function goNext() {
  if (pageNo.value >= pageCount(chunksPage.value)) return;
  pageNo.value += 1;
  void loadChunks();
}

onMounted(() => {
  void loadDocument();
  void loadChunks();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Knowledge Chunks"
      :title="doc?.docName || '文档切片'"
      :description="`文档 ID: ${docId}${kbId ? ` · 知识库: ${kbId}` : ''}`"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="router.push(`/admin/knowledge/${kbId}`)">
          返回文档
        </button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="refreshAll">
          刷新
        </button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建切片</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard
        v-for="stat in chunkStats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-card-header">
          <div>
            <h3>切片列表</h3>
            <p class="admin-detail-card-desc">支持筛选、批量启用/禁用、单条编辑和详情预览。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(chunksPage).toLocaleString("zh-CN") }} 条</span>
        </div>

        <div class="admin-toolbar" style="margin-bottom: 16px;">
          <div class="admin-toolbar-left">
            <select v-model="enabledFilter" class="admin-select" @change="handleFilterChange">
              <option v-for="opt in ENABLED_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <template v-if="selectedIds.size > 0">
              <span class="admin-page-count">{{ selectedIds.size }} 已选择</span>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(true)">批量启用</button>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(false)">批量禁用</button>
            </template>
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleSearchRefresh">
              刷新
            </button>
            <button class="admin-button" type="button" @click="openCreateDialog">新建切片</button>
          </div>
        </div>

        <div v-if="loading && pageRecords(chunksPage).length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pageRecords(chunksPage).length === 0" class="admin-empty">暂无切片</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="w-[48px]">
                  <input
                    type="checkbox"
                    :checked="pageRecords(chunksPage).length > 0 && pageRecords(chunksPage).every((item) => selectedIds.has(String(item.id)))"
                    @change="toggleSelectAll"
                  />
                </th>
                <th>#</th>
                <th>内容</th>
                <th>状态</th>
                <th>字符</th>
                <th>Token</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pageRecords(chunksPage)" :key="item.id">
                <td>
                  <input type="checkbox" :checked="selectedIds.has(String(item.id))" @change="toggleSelect(String(item.id))" />
                </td>
                <td>{{ item.chunkIndex ?? "-" }}</td>
                <td>
                  <button class="admin-link" type="button" @click="previewTarget = item">
                    {{ truncateContent(item.content) }}
                  </button>
                </td>
                <td>
                  <span :class="['admin-badge', enabledBadgeClass(item)]">
                    {{ isEnabled(item) ? "启用" : "禁用" }}
                  </span>
                </td>
                <td>{{ item.charCount ?? "-" }}</td>
                <td>{{ item.tokenCount ?? "-" }}</td>
                <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
                    <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                      {{ isEnabled(item) ? "禁用" : "启用" }}
                    </button>
                    <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="admin-pagination">
          <span class="admin-page-count">第 {{ chunksPage.current || pageNo }} / {{ pageCount(chunksPage) }} 页</span>
          <div class="admin-pagination-controls">
            <button class="admin-button--ghost" type="button" :disabled="loading || (chunksPage.current || pageNo) <= 1" @click="goPrev">
              上一页
            </button>
            <button class="admin-button--ghost" type="button" :disabled="loading || (chunksPage.current || pageNo) >= pageCount(chunksPage)" @click="goNext">
              下一页
            </button>
          </div>
        </div>
      </article>

      <article class="admin-detail-card">
        <h3>最近切片日志</h3>
        <div v-if="pageRecords(logsPage).length === 0" class="admin-empty">暂无日志</div>
        <div v-else class="admin-card-list">
          <div v-for="item in pageRecords(logsPage)" :key="item.id" class="admin-card-item">
            <h3>{{ item.status || "unknown" }}</h3>
            <p>{{ item.chunkStrategy || item.processMode || "--" }}</p>
            <p>{{ formatDateTime(item.createTime || item.startTime) }}</p>
            <p>{{ item.errorMessage || "No error message" }}</p>
          </div>
        </div>
      </article>
    </section>

    <div v-if="previewTarget" class="admin-dialog-overlay" @click.self="previewTarget = null">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="previewTarget = null">&times;</button>
        <h3>Chunk #{{ previewTarget.chunkIndex ?? "--" }}</h3>
        <div class="admin-dialog-body">
          <div class="admin-chunk-preview">
            <pre>{{ previewTarget.content || "--" }}</pre>
          </div>
          <div class="admin-chunk-meta">
            <span>字符数: {{ previewTarget.charCount ?? "--" }}</span>
            <span>Token: {{ previewTarget.tokenCount ?? "--" }}</span>
            <span :class="['admin-badge', enabledBadgeClass(previewTarget)]">
              {{ isEnabled(previewTarget) ? "启用" : "禁用" }}
            </span>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="previewTarget = null">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新建切片" : "编辑切片" }}</h3>
        <p>{{ dialogMode === "create" ? "手动维护切片内容" : "修改切片内容" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>内容</label>
            <textarea v-model="form.content" class="admin-textarea" rows="8" placeholder="请输入切片内容" />
          </div>
          <div class="admin-dialog-field" v-if="dialogMode === 'create'">
            <label>序号</label>
            <input v-model="form.index" class="admin-input" type="number" min="0" placeholder="可选" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.content.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">确认删除这个 chunk 吗？此操作不可撤销。</p>
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
