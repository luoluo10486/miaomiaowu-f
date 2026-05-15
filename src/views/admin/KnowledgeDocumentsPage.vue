<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  deleteKnowledgeDocument,
  getChunkStrategies,
  getKnowledgeBase,
  getKnowledgeChunkLogsPage,
  getKnowledgeDocument,
  getKnowledgeDocumentsPage,
  setKnowledgeDocumentEnabled,
  startKnowledgeDocumentChunk,
  updateKnowledgeDocument,
  uploadKnowledgeDocument
} from "../../services/knowledgeService";
import { getIngestionPipelines } from "../../services/ingestionService";
import { formatDateTime, pageRecords, pageTotal } from "./adminShared";

const PAGE_SIZE = 10;

const route = useRoute();
const router = useRouter();
const kbId = computed(() => String(route.params.kbId || ""));

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const statusFilter = ref("");
const pageNo = ref(1);

const kb = ref(null);
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: PAGE_SIZE });

const strategies = ref([]);
const pipelines = ref([]);
const metaLoading = ref(false);

const uploadDialogOpen = ref(false);
const uploadSubmitting = ref(false);
const uploadFileRef = ref(null);
const uploadFile = ref(null);
const uploadForm = ref(createEmptyUploadForm());
const uploadChunkConfig = ref({});

const detailDialogOpen = ref(false);
const detailLoading = ref(false);
const detailSaving = ref(false);
const detailTarget = ref(null);
const detailForm = ref(createEmptyDetailForm());
const detailChunkConfig = ref({});

const chunkDialogOpen = ref(false);
const chunkTarget = ref(null);
const chunkSubmitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const logDialogOpen = ref(false);
const logTarget = ref(null);
const logPage = ref({ records: [], total: 0 });
const logLoading = ref(false);

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function createEmptyUploadForm() {
  return {
    sourceType: "file",
    sourceLocation: "",
    processMode: "chunk",
    chunkStrategy: "structure_aware",
    pipelineId: "",
    scheduleEnabled: false,
    scheduleCron: ""
  };
}

function createEmptyDetailForm() {
  return {
    docName: "",
    processMode: "chunk",
    chunkStrategy: "structure_aware",
    pipelineId: "",
    sourceLocation: "",
    scheduleEnabled: false,
    scheduleCron: ""
  };
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function parseChunkConfig(raw) {
  if (!raw) return {};
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function statusDotClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "success") return "bg-emerald-500";
  if (normalized === "failed") return "bg-red-500";
  if (normalized === "running") return "bg-amber-500";
  if (normalized === "pending") return "bg-slate-400";
  return "bg-slate-300";
}

function formatSize(size) {
  if (size === null || size === undefined) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatSourceLabel(sourceType) {
  const normalized = String(sourceType || "").toLowerCase();
  if (normalized === "url") return "Remote URL";
  if (normalized === "file") return "Local File";
  return sourceType || "--";
}

function formatModeLabel(mode) {
  const normalized = String(mode || "").toLowerCase();
  if (normalized === "pipeline") return "数据通道";
  if (normalized === "chunk") return "直接切片";
  return mode || "--";
}

function formatChunkStrategy(strategy) {
  const normalized = String(strategy || "").toLowerCase();
  if (normalized === "fixed_size") return "固定大小";
  if (normalized === "structure_aware") return "结构感知";
  return strategy || "--";
}

function getStrategyDefinition(value, list) {
  const normalized = String(value || "").trim();
  return safeArray(list).find((item) => String(item?.value || item).trim() === normalized) || null;
}

function normalizeConfigValue(raw, defaultValue) {
  if (typeof defaultValue === "number") {
    const num = Number(raw);
    return Number.isFinite(num) ? num : defaultValue;
  }
  if (typeof defaultValue === "boolean") {
    return raw === true || raw === "true" || raw === 1 || raw === "1";
  }
  return raw === null || raw === undefined ? defaultValue : String(raw);
}

function syncConfigDefaults(targetRef, strategyValue, list, preserveExisting = true) {
  const strategy = getStrategyDefinition(strategyValue, list);
  const defaults = strategy?.defaultConfig || {};
  const existing = targetRef.value || {};
  const next = {};

  Object.entries(defaults).forEach(([key, value]) => {
    const current = preserveExisting ? existing[key] : undefined;
    next[key] = normalizeConfigValue(current ?? value, value);
  });

  targetRef.value = next;
}

function buildConfigPayload(config, strategyValue, list) {
  const strategy = getStrategyDefinition(strategyValue, list);
  const defaults = strategy?.defaultConfig || {};
  const payload = {};

  Object.entries(defaults).forEach(([key, value]) => {
    payload[key] = normalizeConfigValue(config[key], value);
  });

  return payload;
}

const documents = computed(() => pageRecords(page.value));

const documentStats = computed(() => {
  const records = documents.value;
  const enabledCount = records.filter((item) => Boolean(item.enabled)).length;
  const chunkCount = records.reduce((sum, item) => sum + Number(item.chunkCount || 0), 0);
  const fileCount = records.filter((item) => String(item.sourceType || "").toLowerCase() === "file").length;
  const urlCount = records.filter((item) => String(item.sourceType || "").toLowerCase() === "url").length;

  return [
    { title: "Documents", value: pageTotal(page.value), hint: "当前知识库文档总数", tone: "indigo" },
    { title: "Enabled", value: enabledCount, hint: "当前页已启用文档数", tone: "emerald" },
    { title: "Chunks", value: chunkCount, hint: "当前页切片总数", tone: "blue" },
    { title: "Sources", value: `${fileCount}/${urlCount}`, hint: "文件 / URL", tone: "amber" }
  ];
});

const uploadStrategy = computed(() => getStrategyDefinition(uploadForm.value.chunkStrategy, strategies.value));
const detailStrategy = computed(() => getStrategyDefinition(detailForm.value.chunkStrategy, strategies.value));
const uploadConfigFields = computed(() => Object.entries(uploadStrategy.value?.defaultConfig || {}).map(([key, value]) => ({
  key,
  value
})));
const detailConfigFields = computed(() => Object.entries(detailStrategy.value?.defaultConfig || {}).map(([key, value]) => ({
  key,
  value
})));

async function loadMeta() {
  metaLoading.value = true;
  try {
    const [strategyData, pipelineData] = await Promise.all([
      getChunkStrategies().catch(() => []),
      getIngestionPipelines(1, 200).catch(() => ({ records: [] }))
    ]);
    strategies.value = safeArray(strategyData);
    pipelines.value = safeArray(pipelineData?.records);
  } catch (error) {
    console.error(error);
    strategies.value = [];
    pipelines.value = [];
  } finally {
    metaLoading.value = false;
  }
}

async function loadDocuments() {
  if (!kbId.value) return;
  loading.value = true;
  errorText.value = "";

  try {
    const [kbData, pageData] = await Promise.all([
      getKnowledgeBase(kbId.value),
      getKnowledgeDocumentsPage(kbId.value, {
        current: pageNo.value,
        size: PAGE_SIZE,
        keyword: keyword.value || undefined,
        status: statusFilter.value || undefined
      })
    ]);
    kb.value = kbData;
    page.value = pageData || { records: [], total: 0, pages: 1, current: 1, size: PAGE_SIZE };
  } catch (error) {
    errorText.value = getErrorMessage(error, "加载文档列表失败，请稍后重试。");
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  void loadDocuments();
}

function handleRefresh() {
  pageNo.value = 1;
  void loadDocuments();
}

function goPrev() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadDocuments();
}

function goNext() {
  if (pageNo.value >= (page.value.pages || 1)) return;
  pageNo.value += 1;
  void loadDocuments();
}

function openFilePicker() {
  uploadForm.value.sourceType = "file";
  uploadFileRef.value?.click();
}

function handleFileChange(event) {
  uploadFile.value = event.target?.files?.[0] || null;
}

function openUploadDialog() {
  uploadDialogOpen.value = true;
  uploadFile.value = null;
  uploadForm.value = createEmptyUploadForm();
  syncConfigDefaults(uploadChunkConfig, uploadForm.value.chunkStrategy, strategies.value, false);
}

function closeUploadDialog() {
  uploadDialogOpen.value = false;
}

function openDetailDialog(item) {
  detailTarget.value = item;
  detailDialogOpen.value = true;
  detailLoading.value = true;
  errorText.value = "";
  getKnowledgeDocument(item.id)
    .then((detail) => {
      detailTarget.value = detail;
      detailForm.value = {
        docName: detail.docName || "",
        processMode: detail.processMode || "chunk",
        chunkStrategy: detail.chunkStrategy || "structure_aware",
        pipelineId: detail.pipelineId ? String(detail.pipelineId) : "",
        sourceLocation: detail.sourceLocation || "",
        scheduleEnabled: Boolean(detail.scheduleEnabled),
        scheduleCron: detail.scheduleCron || ""
      };
      detailChunkConfig.value = parseChunkConfig(detail.chunkConfig);
      syncConfigDefaults(detailChunkConfig, detailForm.value.chunkStrategy, strategies.value, true);
    })
    .catch((error) => {
      errorText.value = getErrorMessage(error, "加载文档详情失败，请稍后重试。");
      detailDialogOpen.value = false;
      detailTarget.value = null;
    })
    .finally(() => {
      detailLoading.value = false;
    });
}

function closeDetailDialog() {
  detailDialogOpen.value = false;
  detailTarget.value = null;
}

async function handleUploadSubmit() {
  const sourceType = String(uploadForm.value.sourceType || "file").toLowerCase();
  const processMode = String(uploadForm.value.processMode || "chunk").toLowerCase();
  const chunkStrategyValue = processMode === "chunk" ? uploadForm.value.chunkStrategy : undefined;
  const pipelineId = processMode === "pipeline" ? uploadForm.value.pipelineId || null : null;

  if (sourceType === "file" && !uploadFile.value) {
    errorText.value = "请选择要上传的文件。";
    return;
  }
  if (sourceType === "url" && !uploadForm.value.sourceLocation.trim()) {
    errorText.value = "请输入文档地址。";
    return;
  }

  uploadSubmitting.value = true;
  errorText.value = "";

  try {
    const payload = {
      sourceType,
      sourceLocation: uploadForm.value.sourceLocation.trim() || null,
      processMode,
      chunkStrategy: chunkStrategyValue,
      pipelineId,
      scheduleEnabled: uploadForm.value.scheduleEnabled,
      scheduleCron: uploadForm.value.scheduleEnabled ? uploadForm.value.scheduleCron.trim() || null : null
    };

    if (sourceType === "file") {
      payload.file = uploadFile.value;
    }

    if (processMode === "chunk") {
      payload.chunkConfig = JSON.stringify(buildConfigPayload(uploadChunkConfig.value, uploadForm.value.chunkStrategy, strategies.value));
    }

    await uploadKnowledgeDocument(kbId.value, payload);
    closeUploadDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = getErrorMessage(error, "上传文档失败，请稍后重试。");
  } finally {
    uploadSubmitting.value = false;
  }
}

async function handleDetailSave() {
  if (!detailTarget.value) return;
  const name = detailForm.value.docName.trim();
  if (!name) {
    errorText.value = "请输入文档名称。";
    return;
  }

  detailSaving.value = true;
  errorText.value = "";

  try {
    const payload = {
      docName: name,
      processMode: detailForm.value.processMode,
      chunkStrategy: detailForm.value.processMode === "chunk" ? detailForm.value.chunkStrategy : undefined,
      pipelineId: detailForm.value.processMode === "pipeline" ? detailForm.value.pipelineId || null : null,
      sourceLocation: detailForm.value.sourceLocation.trim() || null,
      scheduleEnabled: detailForm.value.scheduleEnabled,
      scheduleCron: detailForm.value.scheduleEnabled ? detailForm.value.scheduleCron.trim() || null : null
    };

    if (detailForm.value.processMode === "chunk") {
      payload.chunkConfig = JSON.stringify(buildConfigPayload(detailChunkConfig.value, detailForm.value.chunkStrategy, strategies.value));
    }

    await updateKnowledgeDocument(detailTarget.value.id, payload);
    closeDetailDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = getErrorMessage(error, "保存文档失败，请稍后重试。");
  } finally {
    detailSaving.value = false;
  }
}

async function handleToggleEnabled(docItem) {
  try {
    await setKnowledgeDocumentEnabled(docItem.id, !Boolean(docItem.enabled));
    await loadDocuments();
  } catch (error) {
    errorText.value = getErrorMessage(error, "切换启用状态失败。");
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
  errorText.value = "";

  try {
    await startKnowledgeDocumentChunk(chunkTarget.value.id);
    closeChunkDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = getErrorMessage(error, "触发切片失败，请稍后重试。");
  } finally {
    chunkSubmitting.value = false;
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
    await deleteKnowledgeDocument(deleteTarget.value.id);
    closeDeleteDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = getErrorMessage(error, "删除文档失败，请稍后重试。");
  } finally {
    deleteSubmitting.value = false;
  }
}

function openLogDialog(item) {
  logTarget.value = item;
  logDialogOpen.value = true;
  logLoading.value = true;
  errorText.value = "";

  getKnowledgeChunkLogsPage(item.id, 1, 20)
    .then((data) => {
      logPage.value = data || { records: [], total: 0 };
    })
    .catch((error) => {
      errorText.value = getErrorMessage(error, "加载切片日志失败。");
      logPage.value = { records: [], total: 0 };
    })
    .finally(() => {
      logLoading.value = false;
    });
}

function closeLogDialog() {
  logDialogOpen.value = false;
  logTarget.value = null;
  logPage.value = { records: [], total: 0 };
}

function handleUploadStrategyChange(value) {
  uploadForm.value.chunkStrategy = value;
  syncConfigDefaults(uploadChunkConfig, value, strategies.value, true);
}

function handleDetailStrategyChange(value) {
  detailForm.value.chunkStrategy = value;
  syncConfigDefaults(detailChunkConfig, value, strategies.value, true);
}

watch([kbId, statusFilter], () => {
  pageNo.value = 1;
  void loadDocuments();
});

watch(
  () => uploadForm.value.chunkStrategy,
  (value) => {
    if (uploadDialogOpen.value) {
      syncConfigDefaults(uploadChunkConfig, value, strategies.value, true);
    }
  }
);

watch(
  () => detailForm.value.chunkStrategy,
  (value) => {
    if (detailDialogOpen.value) {
      syncConfigDefaults(detailChunkConfig, value, strategies.value, true);
    }
  }
);

watch(strategies, () => {
  if (uploadDialogOpen.value) {
    syncConfigDefaults(uploadChunkConfig, uploadForm.value.chunkStrategy, strategies.value, true);
  }
  if (detailDialogOpen.value) {
    syncConfigDefaults(detailChunkConfig, detailForm.value.chunkStrategy, strategies.value, true);
  }
});

onMounted(() => {
  void loadMeta();
  void loadDocuments();
});
</script>

<template>
  <section class="admin-page admin-documents">
    <PageHeader
      tag="Knowledge Docs"
      :title="kb?.name || '文档管理'"
      :description="`知识库: ${kbId}${kb?.collectionName ? ` · ${kb.collectionName}` : ''}`"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/knowledge')">返回知识库</button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button--ghost" type="button" @click="openUploadDialog">添加 URL</button>
        <button class="admin-button" type="button" @click="openFilePicker">上传文件</button>
        <input ref="uploadFileRef" class="admin-hidden-file" type="file" @change="handleFileChange" />
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard
        v-for="stat in documentStats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-toolbar" style="margin-bottom: 16px;">
          <div class="admin-toolbar-left">
            <input
              v-model="searchInput"
              class="admin-input"
              type="search"
              placeholder="搜索文档名称"
              @keydown.enter.prevent="handleSearch"
            />
            <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
            <select v-model="statusFilter" class="admin-select" @change="handleRefresh">
              <option value="">全部状态</option>
              <option value="pending">pending</option>
              <option value="running">running</option>
              <option value="failed">failed</option>
              <option value="success">success</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
          </div>
        </div>

        <div v-if="loading && documents.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="documents.length === 0" class="admin-empty">暂无文档</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>文档</th>
                <th>来源</th>
                <th>处理模式</th>
                <th>状态</th>
                <th>启用</th>
                <th>切片数</th>
                <th>策略</th>
                <th>大小</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in documents" :key="item.id">
                <td>
                  <button class="admin-link" type="button" @click="openDetailDialog(item)">
                    {{ item.docName || item.id }}
                  </button>
                </td>
                <td>{{ formatSourceLabel(item.sourceType) }}</td>
                <td>{{ formatModeLabel(item.processMode) }}</td>
                <td>
                  <span class="inline-flex items-center gap-2">
                    <span :class="['h-2 w-2 rounded-full', statusDotClass(item.status)]" />
                    <span>{{ item.status || "--" }}</span>
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    class="admin-badge"
                    :class="item.enabled ? 'is-success' : 'is-muted'"
                    @click="handleToggleEnabled(item)"
                  >
                    {{ item.enabled ? "启用" : "禁用" }}
                  </button>
                </td>
                <td>{{ item.chunkCount ?? "-" }}</td>
                <td>{{ formatChunkStrategy(item.chunkStrategy) }}</td>
                <td>{{ formatSize(item.fileSize) }}</td>
                <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click="openDetailDialog(item)">详情</button>
                    <button class="admin-button--ghost" type="button" @click="openChunkDialog(item)">切片</button>
                    <button class="admin-button--ghost" type="button" @click="openLogDialog(item)">日志</button>
                    <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="documents.length > 0" class="admin-pagination">
          <span class="admin-page-count">第 {{ page.current || pageNo }} / {{ page.pages || 1 }} 页</span>
          <div class="admin-pagination-controls">
            <button class="admin-button--ghost" type="button" :disabled="loading || (page.current || pageNo) <= 1" @click="goPrev">
              上一页
            </button>
            <button
              class="admin-button--ghost"
              type="button"
              :disabled="loading || (page.current || pageNo) >= (page.pages || 1)"
              @click="goNext"
            >
              下一页
            </button>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>知识库摘要</h3>
          <p class="admin-detail-card-desc">当前知识库的基础信息和处理模式。</p>
          <div class="admin-kv">
            <div>
              <dt>名称</dt>
              <dd>{{ kb?.name || kbId }}</dd>
            </div>
            <div>
              <dt>Collection</dt>
              <dd>{{ kb?.collectionName || "--" }}</dd>
            </div>
            <div>
              <dt>文档数</dt>
              <dd>{{ pageTotal(page) }}</dd>
            </div>
            <div>
              <dt>策略数</dt>
              <dd>{{ metaLoading ? "--" : strategies.length }}</dd>
            </div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>最近日志</h3>
          <p class="admin-detail-card-desc">打开日志弹窗查看完整切片记录。</p>
          <p class="admin-page-count">从列表中点击“日志”查看完整记录。</p>
          <div v-if="recentLogs.length === 0" class="admin-empty">暂无日志</div>
          <div v-else class="admin-card-list">
            <div class="admin-card-item" v-for="item in recentLogs" :key="item.id">
              <h3>{{ item.status || "unknown" }}</h3>
              <p>{{ item.chunkStrategy || item.processMode || "--" }}</p>
              <p>{{ formatDateTime(item.createTime || item.startTime) }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>

    <div v-if="uploadDialogOpen" class="admin-dialog-overlay" @click.self="closeUploadDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <h3>上传文档</h3>
        <p>支持本地文件和 URL，两种来源都可以选择切片或数据通道处理方式。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>来源类型</label>
            <select v-model="uploadForm.sourceType" class="admin-select">
              <option value="file">Local File</option>
              <option value="url">Remote URL</option>
            </select>
          </div>
          <div class="admin-dialog-field" v-if="uploadForm.sourceType === 'url'">
            <label>文档地址</label>
            <input v-model="uploadForm.sourceLocation" class="admin-input" placeholder="https://example.com/doc" />
          </div>
          <div class="admin-dialog-field" v-if="uploadForm.sourceType === 'file'">
            <label>本地文件</label>
            <input type="file" class="admin-input" @change="handleFileChange" />
          </div>
          <div class="admin-dialog-field">
            <label>处理模式</label>
            <select v-model="uploadForm.processMode" class="admin-select">
              <option value="chunk">直接切片</option>
              <option value="pipeline">数据通道</option>
            </select>
          </div>
          <div class="admin-dialog-field" v-if="uploadForm.processMode === 'chunk'">
            <label>切片策略</label>
            <select v-model="uploadForm.chunkStrategy" class="admin-select" @change="handleUploadStrategyChange($event.target.value)">
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
              <option v-for="item in strategies" :key="item.value || item" :value="item.value || item">
                {{ item.label || item.value || item }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field" v-if="uploadForm.processMode === 'pipeline'">
            <label>数据通道</label>
            <select v-model="uploadForm.pipelineId" class="admin-select">
              <option value="">请选择 pipeline</option>
              <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-form-grid-2" v-if="uploadForm.processMode === 'chunk' && uploadConfigFields.length > 0">
            <div v-for="field in uploadConfigFields" :key="field.key" class="admin-dialog-field">
              <label>{{ field.key }}</label>
              <input v-model="uploadChunkConfig[field.key]" class="admin-input" :placeholder="String(field.value)" />
            </div>
          </div>
          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>定时同步</label>
              <select v-model="uploadForm.scheduleEnabled" class="admin-select">
                <option :value="true">启用</option>
                <option :value="false">禁用</option>
              </select>
            </div>
            <div class="admin-dialog-field" v-if="uploadForm.scheduleEnabled">
              <label>Cron</label>
              <input v-model="uploadForm.scheduleCron" class="admin-input" placeholder="0 0 * * ?" />
            </div>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeUploadDialog">取消</button>
          <button class="admin-button" type="button" :disabled="uploadSubmitting" @click="handleUploadSubmit">
            {{ uploadSubmitting ? "提交中..." : "提交" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="detailDialogOpen" class="admin-dialog-overlay" @click.self="closeDetailDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeDetailDialog">&times;</button>
        <h3>文档详情</h3>
        <p>{{ detailTarget?.docName || detailTarget?.id }}</p>
        <div v-if="detailLoading" class="admin-empty">加载中...</div>
        <div v-else class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>文档名称</label>
            <input v-model="detailForm.docName" class="admin-input" placeholder="请输入文档名称" />
          </div>
          <div class="admin-dialog-field">
            <label>处理模式</label>
            <select v-model="detailForm.processMode" class="admin-select">
              <option value="chunk">直接切片</option>
              <option value="pipeline">数据通道</option>
            </select>
          </div>
          <div class="admin-dialog-field" v-if="detailForm.processMode === 'chunk'">
            <label>切片策略</label>
            <select v-model="detailForm.chunkStrategy" class="admin-select" @change="handleDetailStrategyChange($event.target.value)">
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
              <option v-for="item in strategies" :key="item.value || item" :value="item.value || item">
                {{ item.label || item.value || item }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field" v-if="detailForm.processMode === 'pipeline'">
            <label>数据通道</label>
            <select v-model="detailForm.pipelineId" class="admin-select">
              <option value="">请选择 pipeline</option>
              <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>源地址</label>
            <input v-model="detailForm.sourceLocation" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>定时同步</label>
              <select v-model="detailForm.scheduleEnabled" class="admin-select">
                <option :value="true">启用</option>
                <option :value="false">禁用</option>
              </select>
            </div>
            <div class="admin-dialog-field" v-if="detailForm.scheduleEnabled">
              <label>Cron</label>
              <input v-model="detailForm.scheduleCron" class="admin-input" placeholder="0 0 * * ?" />
            </div>
          </div>
          <div class="admin-form-grid-2" v-if="detailForm.processMode === 'chunk' && detailConfigFields.length > 0">
            <div v-for="field in detailConfigFields" :key="field.key" class="admin-dialog-field">
              <label>{{ field.key }}</label>
              <input v-model="detailChunkConfig[field.key]" class="admin-input" :placeholder="String(field.value)" />
            </div>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDetailDialog">取消</button>
          <button class="admin-button" type="button" :disabled="detailSaving || !detailForm.docName.trim()" @click="handleDetailSave">
            {{ detailSaving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="chunkDialogOpen" class="admin-dialog-overlay" @click.self="closeChunkDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeChunkDialog">&times;</button>
        <h3>确认切片</h3>
        <p class="admin-confirm-text">确认对文档 “{{ chunkTarget?.docName || chunkTarget?.id }}” 触发切片任务？</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeChunkDialog">取消</button>
          <button class="admin-button" type="button" :disabled="chunkSubmitting" @click="handleChunk">
            {{ chunkSubmitting ? "执行中..." : "确认切片" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">确认删除文档 “{{ deleteTarget?.docName || deleteTarget?.id }}”？该操作无法撤销。</p>
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
        <h3>切片日志 · {{ logTarget?.docName || logTarget?.id }}</h3>
        <div class="admin-dialog-body">
          <div v-if="logLoading" class="admin-empty">加载中...</div>
          <div v-else-if="pageRecords(logPage).length === 0" class="admin-empty">暂无日志</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>状态</th>
                  <th>切片数</th>
                  <th>耗时</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in pageRecords(logPage)" :key="log.id">
                  <td>{{ formatDateTime(log.createTime || log.startTime) }}</td>
                  <td>{{ log.status || "--" }}</td>
                  <td>{{ log.chunkCount ?? "--" }}</td>
                  <td>{{ log.durationMs != null ? `${log.durationMs}ms` : "--" }}</td>
                  <td>{{ log.remark || log.errorMessage || "--" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
