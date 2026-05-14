<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createKnowledgeChunk,
  deleteKnowledgeChunk,
  getKnowledgeChunkLogsPage,
  getKnowledgeChunksPage,
  getKnowledgeDocument,
  toggleKnowledgeChunk,
  updateKnowledgeChunk,
  batchToggleKnowledgeChunks
} from "../../services/knowledgeService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);
const docId = computed(() => route.params.docId);
const loading = ref(false);
const errorText = ref("");
const doc = ref(null);
const chunksPage = ref({ records: [], total: 0 });
const logsPage = ref({ records: [], total: 0 });
const enabledFilter = ref("");
const selectedIds = ref(new Set());
const previewTarget = ref(null);

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({ content: "" });
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const ENABLED_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "1", label: "启用" },
  { value: "0", label: "禁用" }
];

function isEnabled(item) {
  return item.enabled === 1 || item.enabled === true;
}

function truncateContent(content, maxLen = 120) {
  if (!content) return "--";
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

async function loadChunks() {
  loading.value = true;
  errorText.value = "";
  selectedIds.value = new Set();
  try {
    const params = { current: 1, size: 200 };
    if (enabledFilter.value === "1") params.enabled = true;
    else if (enabledFilter.value === "0") params.enabled = false;
    const [docData, chunkData, logData] = await Promise.all([
      getKnowledgeDocument(docId.value),
      getKnowledgeChunksPage(docId.value, params),
      getKnowledgeChunkLogsPage(docId.value, 1, 10)
    ]);
    doc.value = docData;
    chunksPage.value = chunkData;
    logsPage.value = logData;
  } catch (error) {
    errorText.value = error?.message || "加载分块数据失败。";
  } finally {
    loading.value = false;
  }
}

function handleFilterChange() {
  loadChunks();
}

function handleRefresh() {
  loadChunks();
}

function toggleSelect(id) {
  const s = new Set(selectedIds.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selectedIds.value = s;
}

function toggleSelectAll() {
  const records = pageRecords(chunksPage.value);
  const s = new Set(selectedIds.value);
  const allSelected = records.length > 0 && records.every((r) => s.has(r.id));
  if (allSelected) {
    for (const r of records) s.delete(r.id);
  } else {
    for (const r of records) s.add(r.id);
  }
  selectedIds.value = s;
}

async function handleBatchToggle(enable) {
  const ids = Array.from(selectedIds.value);
  if (ids.length === 0) return;
  try {
    await batchToggleKnowledgeChunks(docId.value, enable, ids);
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "批量操作失败。";
  }
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = { content: "" };
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = { content: item.content || "" };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.content.trim()) return;
  submitting.value = true;
  try {
    if (dialogMode.value === "create") {
      await createKnowledgeChunk(docId.value, { content: form.value.content.trim() });
    } else if (dialogTarget.value) {
      await updateKnowledgeChunk(docId.value, dialogTarget.value.id, { content: form.value.content.trim() });
    }
    dialogOpen.value = false;
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "保存分块失败。";
  } finally {
    submitting.value = false;
  }
}

async function handleToggle(item) {
  try {
    await toggleKnowledgeChunk(docId.value, item.id, !isEnabled(item));
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "切换分块状态失败。";
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
    await deleteKnowledgeChunk(docId.value, deleteTarget.value.id);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "删除分块失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

onMounted(() => {
  void loadChunks();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge Chunks</span>
        <h2 class="admin-page-title">{{ doc?.docName || "文档分块" }}</h2>
        <p class="admin-page-subtitle">查看 chunk、手工新增、编辑、启停和最近切分日志。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push(`/admin/knowledge/${kbId}`)">返回</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增 Chunk</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <h3>分块列表</h3>
            <select v-model="enabledFilter" class="admin-select" @change="handleFilterChange">
              <option v-for="opt in ENABLED_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <template v-if="selectedIds.size > 0">
              <span class="admin-page-count">{{ selectedIds.size }} 已选中</span>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(true)">批量启用</button>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(false)">批量禁用</button>
            </template>
            <span class="admin-page-count">{{ pageTotal(chunksPage) }} chunk(s)</span>
            <button class="admin-button" type="button" :disabled="loading" @click="handleRefresh">
              {{ loading ? "刷新中..." : "刷新" }}
            </button>
          </div>
        </div>

        <div v-if="loading && pageRecords(chunksPage).length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pageRecords(chunksPage).length === 0" class="admin-empty">暂无 chunk 数据</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    :checked="pageRecords(chunksPage).length > 0 && pageRecords(chunksPage).every((r) => selectedIds.has(r.id))"
                    @change="toggleSelectAll"
                  />
                </th>
                <th>#</th>
                <th>内容</th>
                <th>字符数</th>
                <th>Token</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pageRecords(chunksPage)" :key="item.id">
                <td>
                  <input type="checkbox" :checked="selectedIds.has(item.id)" @change="toggleSelect(item.id)" />
                </td>
                <td>{{ item.chunkIndex ?? "--" }}</td>
                <td>
                  <span class="admin-chunk-content" @click="previewTarget = item">{{ truncateContent(item.content) }}</span>
                </td>
                <td>{{ item.charCount ?? "--" }}</td>
                <td>{{ item.tokenCount ?? "--" }}</td>
                <td>
                  <span :class="['admin-badge', isEnabled(item) ? 'is-success' : 'is-muted']">
                    {{ isEnabled(item) ? "启用" : "禁用" }}
                  </span>
                </td>
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
      </article>

      <article class="admin-detail-card">
        <h3>最近切分日志</h3>
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
            <span :class="['admin-badge', isEnabled(previewTarget) ? 'is-success' : 'is-muted']">
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
        <h3>{{ dialogMode === "create" ? "新增 Chunk" : "编辑 Chunk" }}</h3>
        <p>{{ dialogMode === "create" ? "输入 chunk 内容" : "修改 chunk 内容" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>内容</label>
            <textarea v-model="form.content" class="admin-textarea" placeholder="请输入 chunk 内容" rows="8" />
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
