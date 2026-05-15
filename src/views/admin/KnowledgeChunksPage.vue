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

const PAGE_SIZE = 10;

const route = useRoute();
const router = useRouter();
const kbId = computed(() => String(route.params.kbId || ""));
const docId = computed(() => String(route.params.docId || ""));

const loading = ref(false);
const errorText = ref("");
const enabledFilter = ref("");
const pageNo = ref(1);
const doc = ref(null);
const chunksPage = ref({ records: [], total: 0, pages: 1, current: 1, size: PAGE_SIZE });
const logsPage = ref({ records: [], total: 0 });
const selectedIds = ref(new Set());
const previewTarget = ref(null);

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({ content: "", index: "" });
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function isEnabled(item) {
  return item?.enabled === 1 || item?.enabled === true;
}

function enabledBadgeClass(item) {
  return isEnabled(item) ? "is-success" : "is-muted";
}

function truncateContent(content, maxLen = 120) {
  if (!content) return "--";
  const text = String(content).replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

function statusDotClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "success") return "is-success";
  if (normalized === "failed") return "is-danger";
  if (normalized === "running") return "is-warn";
  return "is-muted";
}

const chunks = computed(() => pageRecords(chunksPage.value));
const selectedList = computed(() => Array.from(selectedIds.value));
const recentLogs = computed(() => pageRecords(logsPage.value).slice(0, 3));

const stats = computed(() => {
  const records = chunks.value;
  const total = pageTotal(chunksPage.value);
  const enabledCount = records.filter((item) => isEnabled(item)).length;
  const selectedCount = selectedIds.value.size;
  const tokenCount = records.reduce((sum, item) => sum + Number(item.tokenCount || 0), 0);

  return [
    { title: "Chunks", value: total, hint: "当前文档切片总数", tone: "indigo" },
    { title: "Enabled", value: enabledCount, hint: "当前页已启用切片", tone: "emerald" },
    { title: "Selected", value: selectedCount, hint: "当前已选切片数", tone: "amber" },
    { title: "Tokens", value: tokenCount, hint: "当前页 token 总量", tone: "blue" }
  ];
});

async function loadDocument() {
  if (!docId.value) return;
  try {
    doc.value = await getKnowledgeDocument(docId.value);
  } catch (error) {
    errorText.value = getErrorMessage(error, "加载文档信息失败，请稍后重试。");
  }
}

async function loadChunks() {
  if (!docId.value) return;

  loading.value = true;
  errorText.value = "";
  selectedIds.value = new Set();

  try {
    const params = {
      current: pageNo.value,
      size: PAGE_SIZE
    };
    if (enabledFilter.value === "1") params.enabled = 1;
    if (enabledFilter.value === "0") params.enabled = 0;

    const [chunkData, logData] = await Promise.all([
      getKnowledgeChunksPage(docId.value, params),
      getKnowledgeChunkLogsPage(docId.value, 1, 10)
    ]);

    chunksPage.value = chunkData || { records: [], total: 0, pages: 1, current: 1, size: PAGE_SIZE };
    logsPage.value = logData || { records: [], total: 0 };
  } catch (error) {
    errorText.value = getErrorMessage(error, "加载切片数据失败，请稍后重试。");
  } finally {
    loading.value = false;
  }
}

function refreshAll() {
  pageNo.value = 1;
  void loadChunks();
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

function handleFilterChange() {
  pageNo.value = 1;
  void loadChunks();
}

function toggleSelect(id) {
  const next = new Set(selectedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  selectedIds.value = next;
}

function toggleSelectAll() {
  const records = chunks.value;
  const next = new Set(selectedIds.value);
  const allSelected = records.length > 0 && records.every((item) => next.has(String(item.id)));
  if (allSelected) {
    records.forEach((item) => next.delete(String(item.id)));
  } else {
    records.forEach((item) => next.add(String(item.id)));
  }
  selectedIds.value = next;
}

async function handleBatchToggle(enable) {
  if (!docId.value) return;
  if (selectedList.value.length === 0) {
    errorText.value = "请选择需要操作的切片。";
    return;
  }

  loading.value = true;
  errorText.value = "";

  try {
    await batchToggleKnowledgeChunks(docId.value, enable, selectedList.value);
    selectedIds.value = new Set();
    await loadChunks();
  } catch (error) {
    errorText.value = getErrorMessage(error, enable ? "批量启用失败。" : "批量禁用失败。");
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
  form.value = {
    content: item.content || "",
    index: item.chunkIndex ?? ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  const content = form.value.content.trim();
  if (!content) {
    errorText.value = "请输入切片内容。";
    return;
  }

  const indexRaw = String(form.value.index ?? "").trim();
  const indexValue = indexRaw === "" ? null : Number(indexRaw);
  if (
    dialogMode.value === "create" &&
    indexRaw !== "" &&
    (!Number.isInteger(indexValue) || indexValue < 0)
  ) {
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
      await updateKnowledgeChunk(docId.value, dialogTarget.value.id, { content });
    }
    closeDialog();
    await loadChunks();
  } catch (error) {
    errorText.value = getErrorMessage(error, dialogMode.value === "create" ? "创建切片失败。" : "更新切片失败。");
  } finally {
    submitting.value = false;
  }
}

async function handleToggleEnabled(item) {
  try {
    await toggleKnowledgeChunk(docId.value, item.id, !isEnabled(item));
    await loadChunks();
  } catch (error) {
    errorText.value = getErrorMessage(error, "切换切片状态失败。");
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
    errorText.value = getErrorMessage(error, "删除切片失败。");
  } finally {
    deleteSubmitting.value = false;
  }
}

watch([docId, enabledFilter], () => {
  pageNo.value = 1;
  void loadDocument();
  void loadChunks();
});

onMounted(() => {
  void loadDocument();
  void loadChunks();
});
</script>

<template>
  <section class="admin-page admin-chunks">
    <PageHeader
      tag="Knowledge Chunks"
      :title="doc?.docName || '切片管理'"
      :description="`文档 ID: ${docId}${kbId ? ` · 知识库 ${kbId}` : ''}`"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="router.push(`/admin/knowledge/${kbId}`)">
          返回文档
        </button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="refreshAll">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建切片</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </div>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>Chunk 列表</h2>
            <p>支持筛选、批量操作、启停、编辑和预览。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(chunksPage) }} 条</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <select v-model="enabledFilter" class="admin-select" @change="handleFilterChange">
              <option value="">全部状态</option>
              <option value="1">启用</option>
              <option value="0">禁用</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <template v-if="selectedIds.size > 0">
              <span class="admin-page-count">已选 {{ selectedIds.size }} 条</span>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(true)">批量启用</button>
              <button class="admin-button--ghost" type="button" @click="handleBatchToggle(false)">批量禁用</button>
            </template>
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="refreshAll">刷新</button>
            <button class="admin-button" type="button" @click="openCreateDialog">新建切片</button>
          </div>
        </div>

        <div v-if="loading && chunks.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="chunks.length === 0" class="admin-empty">暂无切片</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th class="w-[48px]">
                  <input
                    type="checkbox"
                    :checked="chunks.length > 0 && chunks.every((item) => selectedIds.has(String(item.id)))"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="w-[72px]">#</th>
                <th>内容</th>
                <th class="w-[96px]">状态</th>
                <th class="w-[96px]">字符</th>
                <th class="w-[96px]">Token</th>
                <th class="w-[170px]">更新时间</th>
                <th class="w-[170px]">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in chunks" :key="item.id">
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
                    <button class="admin-button--ghost" type="button" @click="handleToggleEnabled(item)">
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
            <button
              class="admin-button--ghost"
              type="button"
              :disabled="loading || (chunksPage.current || pageNo) >= pageCount(chunksPage)"
              @click="goNext"
            >
              下一页
            </button>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>文档摘要</h3>
          <p class="admin-detail-card-desc">查看当前文档的基础信息和处理状态。</p>
          <div class="admin-kv">
            <div><dt>名称</dt><dd>{{ doc?.docName || docId }}</dd></div>
            <div><dt>切片数</dt><dd>{{ pageTotal(chunksPage) }}</dd></div>
            <div><dt>已启用</dt><dd>{{ chunks.filter((item) => isEnabled(item)).length }}</dd></div>
            <div><dt>已选中</dt><dd>{{ selectedIds.size }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>最近日志</h3>
          <p class="admin-detail-card-desc">切片执行记录会显示在这里。</p>
          <div v-if="recentLogs.length === 0" class="admin-empty-sm">暂无日志</div>
          <div v-else class="admin-card-list">
            <div v-for="item in recentLogs" :key="item.id" class="admin-card-item">
              <h3>{{ item.status || "unknown" }}</h3>
              <p>{{ item.chunkStrategy || item.processMode || "--" }}</p>
              <p>{{ formatDateTime(item.createTime || item.startTime) }}</p>
              <p>{{ item.remark || item.errorMessage || "--" }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>

    <div v-if="previewTarget" class="admin-dialog-overlay" @click.self="previewTarget = null">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="previewTarget = null">&times;</button>
        <h3>Chunk #{{ previewTarget.chunkIndex ?? "--" }}</h3>
        <div class="admin-dialog-body">
          <div class="admin-card-item">
            <pre class="admin-chunk-preview">{{ previewTarget.content || "--" }}</pre>
          </div>
          <div class="admin-kv">
            <div><dt>字符数</dt><dd>{{ previewTarget.charCount ?? "--" }}</dd></div>
            <div><dt>Token</dt><dd>{{ previewTarget.tokenCount ?? "--" }}</dd></div>
            <div>
              <dt>状态</dt>
              <dd><span :class="['admin-badge', enabledBadgeClass(previewTarget)]">{{ isEnabled(previewTarget) ? "启用" : "禁用" }}</span></dd>
            </div>
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
          <div v-if="dialogMode === 'create'" class="admin-dialog-field">
            <label>序号</label>
            <input v-model="form.index" class="admin-input" type="number" min="0" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>内容</label>
            <textarea v-model="form.content" class="admin-textarea" rows="10" placeholder="请输入切片内容" />
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
        <p class="admin-confirm-text">确认删除这个切片吗？该操作不可恢复。</p>
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
.admin-chunk-preview {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--admin-mono);
  font-size: 12px;
  line-height: 1.7;
  color: var(--admin-ink);
}
</style>
