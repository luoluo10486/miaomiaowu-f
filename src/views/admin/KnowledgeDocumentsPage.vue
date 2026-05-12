<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getKnowledgeBase,
  getKnowledgeDocumentsPage,
  startKnowledgeDocumentChunk,
  setKnowledgeDocumentEnabled,
  updateKnowledgeDocument,
  deleteKnowledgeDocument,
  uploadKnowledgeDocument,
  getChunkStrategies,
  getIngestionPipelines,
  getKnowledgeChunkLogsPage
} from "../../services/adminService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const base = ref(null);
const page = ref({ records: [], total: 0 });
const fileRef = ref(null);
const pageNo = ref(1);
const pageSize = 10;
const statusFilter = ref("");

const strategies = ref([]);
const pipelines = ref([]);

const uploadDialogOpen = ref(false);
const uploadForm = ref({
  sourceType: "file",
  processMode: "chunk",
  chunkStrategy: "structure_aware",
  pipelineId: "",
  url: ""
});
const uploadSubmitting = ref(false);

const dialogOpen = ref(false);
const dialogMode = ref("edit");
const dialogTarget = ref(null);
const form = ref({
  docName: "",
  processMode: "chunk",
  chunkStrategy: "structure_aware",
  pipelineId: ""
});
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const chunkDialogOpen = ref(false);
const chunkTarget = ref(null);
const chunkSubmitting = ref(false);

const logDialogOpen = ref(false);
const logTarget = ref(null);
const logPage = ref({ records: [], total: 0 });
const logLoading = ref(false);

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "pending", label: "pending" },
  { value: "running", label: "running" },
  { value: "failed", label: "failed" },
  { value: "success", label: "success" }
];

const SOURCE_OPTIONS = [
  { value: "file", label: "Local File" },
  { value: "url", label: "Remote URL" }
];

const PROCESS_MODE_OPTIONS = [
  { value: "chunk", label: "直接分块" },
  { value: "pipeline", label: "数据通道" }
];

function formatSize(size) {
  if (!size && size !== 0) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatSourceLabel(sourceType) {
  const n = String(sourceType || "").toLowerCase();
  if (n === "url") return "Remote URL";
  if (n === "file") return "Local File";
  return sourceType || "--";
}

function statusDotClass(status) {
  const n = String(status || "").toLowerCase();
  if (n === "success") return "is-success";
  if (n === "failed") return "is-error";
  if (n === "running") return "is-warning";
  if (n === "pending") return "is-muted";
  return "is-muted";
}

async function loadDocuments() {
  loading.value = true;
  errorText.value = "";
  try {
    const [baseData, pageData] = await Promise.all([
      getKnowledgeBase(kbId.value),
      getKnowledgeDocumentsPage(kbId.value, {
        current: pageNo.value,
        size: pageSize,
        keyword: keyword.value || undefined,
        status: statusFilter.value || undefined
      })
    ]);
    base.value = baseData;
    page.value = pageData;
  } catch (error) {
    errorText.value = error?.message || "加载知识库文档失败。";
  } finally {
    loading.value = false;
  }
}

async function loadMeta() {
  try {
    const [s, p] = await Promise.all([
      getChunkStrategies().catch(() => []),
      getIngestionPipelines(1, 200).catch(() => ({ records: [] }))
    ]);
    strategies.value = Array.isArray(s) ? s : [];
    pipelines.value = Array.isArray(p?.records) ? p.records : [];
  } catch {
    strategies.value = [];
    pipelines.value = [];
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  loadDocuments();
}

function handleStatusChange() {
  pageNo.value = 1;
  loadDocuments();
}

function handleRefresh() {
  pageNo.value = 1;
  loadDocuments();
}

function openUploadDialog() {
  uploadForm.value = { sourceType: "file", processMode: "chunk", chunkStrategy: "structure_aware", pipelineId: "", url: "" };
  uploadDialogOpen.value = true;
}

function closeUploadDialog() {
  uploadDialogOpen.value = false;
}

function openFilePicker() {
  uploadForm.value.sourceType = "file";
  fileRef.value?.click();
}

async function handleFileChange(event) {
  const file = event.target?.files?.[0];
  if (!file) return;
  try {
    const payload = {
      sourceType: "file",
      file,
      processMode: uploadForm.value.processMode || "chunk",
      chunkStrategy: uploadForm.value.chunkStrategy || "structure_aware"
    };
    if (uploadForm.value.processMode === "pipeline" && uploadForm.value.pipelineId) {
      payload.pipelineId = uploadForm.value.pipelineId;
    }
    await uploadKnowledgeDocument(kbId.value, payload);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "上传文件失败。";
  } finally {
    event.target.value = "";
  }
}

async function handleUploadSubmit() {
  if (uploadForm.value.sourceType === "url" && !uploadForm.value.url.trim()) return;
  uploadSubmitting.value = true;
  try {
    const payload = {
      sourceType: "url",
      sourceLocation: uploadForm.value.url.trim(),
      processMode: uploadForm.value.processMode || "chunk",
      chunkStrategy: uploadForm.value.chunkStrategy || "structure_aware"
    };
    if (uploadForm.value.processMode === "pipeline" && uploadForm.value.pipelineId) {
      payload.pipelineId = uploadForm.value.pipelineId;
    }
    await uploadKnowledgeDocument(kbId.value, payload);
    uploadDialogOpen.value = false;
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "添加 URL 文档失败。";
  } finally {
    uploadSubmitting.value = false;
  }
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = {
    docName: item.docName || "",
    processMode: item.processMode || "chunk",
    chunkStrategy: item.chunkStrategy || "structure_aware",
    pipelineId: item.pipelineId ? String(item.pipelineId) : ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleEdit() {
  if (!form.value.docName.trim() || !dialogTarget.value) return;
  submitting.value = true;
  try {
    const payload = {
      docName: form.value.docName.trim(),
      processMode: form.value.processMode || "chunk",
      chunkStrategy: form.value.chunkStrategy || "structure_aware",
      sourceLocation: dialogTarget.value.sourceLocation || undefined
    };
    if (form.value.processMode === "pipeline" && form.value.pipelineId) {
      payload.pipelineId = form.value.pipelineId;
    }
    await updateKnowledgeDocument(dialogTarget.value.id, payload);
    dialogOpen.value = false;
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "更新文档失败。";
  } finally {
    submitting.value = false;
  }
}

function openChunkDialog(item) {
  chunkTarget.value = item;
  chunkDialogOpen.value = true;
}

function closeChunkDialog() {
  chunkDialogOpen.value = false;
  chunkTarget.value = null;
}

async function handleChunk() {
  if (!chunkTarget.value) return;
  chunkSubmitting.value = true;
  try {
    await startKnowledgeDocumentChunk(chunkTarget.value.id);
    chunkDialogOpen.value = false;
    chunkTarget.value = null;
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "执行文档切分失败。";
  } finally {
    chunkSubmitting.value = false;
  }
}

async function handleToggle(item) {
  try {
    await setKnowledgeDocumentEnabled(item.id, !item.enabled);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "切换文档状态失败。";
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
    await deleteKnowledgeDocument(deleteTarget.value.id);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    pageNo.value = 1;
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "删除文档失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

async function openLogDialog(item) {
  logTarget.value = item;
  logDialogOpen.value = true;
  logLoading.value = true;
  try {
    logPage.value = await getKnowledgeChunkLogsPage(item.id, 1, 20);
  } catch {
    logPage.value = { records: [], total: 0 };
  } finally {
    logLoading.value = false;
  }
}

function closeLogDialog() {
  logDialogOpen.value = false;
  logTarget.value = null;
  logPage.value = { records: [], total: 0 };
}

onMounted(() => {
  void loadDocuments();
  void loadMeta();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge Docs</span>
        <h2 class="admin-page-title">{{ base?.name || "知识库文档" }}</h2>
        <p class="admin-page-subtitle">支持文件上传、URL 文档接入、切分、启停和跳转到文档分块详情。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/knowledge')">返回</button>
        <button class="admin-button--ghost" type="button" @click="openUploadDialog">添加 URL</button>
        <button class="admin-button" type="button" @click="openFilePicker">上传文件</button>
        <input ref="fileRef" class="admin-hidden-file" type="file" @change="handleFileChange" />
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <input
            v-model="searchInput"
            class="admin-input"
            type="search"
            placeholder="搜索文档名称"
            @keydown.enter.prevent="handleSearch"
          />
          <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
          <select v-model="statusFilter" class="admin-select" @change="handleStatusChange">
            <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} document(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="handleRefresh">
            {{ loading ? "刷新中..." : "刷新" }}
          </button>
        </div>
      </div>

      <div v-if="loading && pageRecords(page).length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="pageRecords(page).length === 0" class="admin-empty">暂无文档数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>文档</th>
              <th>来源</th>
              <th>状态</th>
              <th>分块数</th>
              <th>大小</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>
                <p>{{ item.docName || "--" }}</p>
                <small class="admin-list-meta">{{ item.processMode || "chunk" }} · {{ item.chunkStrategy || "--" }}</small>
              </td>
              <td>
                <span class="admin-badge is-outline">{{ formatSourceLabel(item.sourceType) }}</span>
              </td>
              <td>
                <span :class="['admin-badge', statusDotClass(item.status)]">
                  {{ item.status || (item.enabled ? "启用" : "禁用") }}
                </span>
              </td>
              <td>{{ item.chunkCount ?? 0 }}</td>
              <td>{{ formatSize(item.fileSize) }}</td>
              <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button
                    class="admin-button--ghost"
                    type="button"
                    @click="router.push(`/admin/knowledge/${kbId}/docs/${item.id}`)"
                  >分块</button>
                  <button class="admin-button--ghost" type="button" @click="openChunkDialog(item)">切分</button>
                  <button class="admin-button--ghost" type="button" @click="openLogDialog(item)">日志</button>
                  <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                    {{ item.enabled ? "禁用" : "启用" }}
                  </button>
                  <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <div v-if="uploadDialogOpen" class="admin-dialog-overlay" @click.self="closeUploadDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <h3>添加文档</h3>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>来源类型</label>
            <select v-model="uploadForm.sourceType" class="admin-select">
              <option v-for="opt in SOURCE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div v-if="uploadForm.sourceType === 'url'" class="admin-dialog-field">
            <label>文档 URL</label>
            <input v-model="uploadForm.url" class="admin-input" placeholder="https://example.com/doc" />
          </div>
          <div class="admin-dialog-field">
            <label>处理模式</label>
            <select v-model="uploadForm.processMode" class="admin-select">
              <option v-for="opt in PROCESS_MODE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div v-if="uploadForm.processMode === 'chunk'" class="admin-dialog-field">
            <label>分块策略</label>
            <select v-model="uploadForm.chunkStrategy" class="admin-select">
              <option v-for="s in strategies" :key="s.value || s" :value="s.value || s">{{ s.label || s }}</option>
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
            </select>
          </div>
          <div v-if="uploadForm.processMode === 'pipeline'" class="admin-dialog-field">
            <label>数据通道</label>
            <select v-model="uploadForm.pipelineId" class="admin-select">
              <option value="">请选择</option>
              <option v-for="p in pipelines" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
            </select>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeUploadDialog">取消</button>
          <button class="admin-button" type="button" :disabled="uploadSubmitting" @click="handleUploadSubmit">
            {{ uploadSubmitting ? "添加中..." : "添加" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>编辑文档</h3>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>文档名称</label>
            <input v-model="form.docName" class="admin-input" placeholder="请输入文档名称" />
          </div>
          <div class="admin-dialog-field">
            <label>处理模式</label>
            <select v-model="form.processMode" class="admin-select">
              <option v-for="opt in PROCESS_MODE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div v-if="form.processMode === 'chunk'" class="admin-dialog-field">
            <label>分块策略</label>
            <select v-model="form.chunkStrategy" class="admin-select">
              <option v-for="s in strategies" :key="s.value || s" :value="s.value || s">{{ s.label || s }}</option>
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
            </select>
          </div>
          <div v-if="form.processMode === 'pipeline'" class="admin-dialog-field">
            <label>数据通道</label>
            <select v-model="form.pipelineId" class="admin-select">
              <option value="">请选择</option>
              <option v-for="p in pipelines" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
            </select>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.docName.trim()" @click="handleEdit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="chunkDialogOpen" class="admin-dialog-overlay" @click.self="closeChunkDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeChunkDialog">&times;</button>
        <h3>确认切分</h3>
        <p class="admin-confirm-text">确认对文档"{{ chunkTarget?.docName }}"执行切分操作？</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeChunkDialog">取消</button>
          <button class="admin-button" type="button" :disabled="chunkSubmitting" @click="handleChunk">
            {{ chunkSubmitting ? "切分中..." : "确认切分" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">确认删除文档"{{ deleteTarget?.docName || deleteTarget?.id }}"吗？</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDeleteDialog">取消</button>
          <button class="admin-button--danger" type="button" :disabled="deleteSubmitting" @click="handleDelete">
            {{ deleteSubmitting ? "删除中..." : "删除" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="logDialogOpen" class="admin-dialog-overlay" @click.self="closeLogDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeLogDialog">&times;</button>
        <h3>切分日志 · {{ logTarget?.docName }}</h3>
        <div class="admin-dialog-body">
          <div v-if="logLoading" class="admin-empty">加载中...</div>
          <div v-else-if="pageRecords(logPage).length === 0" class="admin-empty">暂无切分日志</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>状态</th>
                  <th>分块数</th>
                  <th>耗时</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in pageRecords(logPage)" :key="log.id">
                  <td>{{ formatDateTime(log.createTime) }}</td>
                  <td>
                    <span :class="['admin-badge', statusDotClass(log.status)]">{{ log.status || "--" }}</span>
                  </td>
                  <td>{{ log.chunkCount ?? "--" }}</td>
                  <td>{{ log.durationMs != null ? log.durationMs + "ms" : "--" }}</td>
                  <td>{{ log.remark || "--" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeLogDialog">关闭</button>
        </div>
      </div>
    </div>
  </section>
</template>
