<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import { getIngestionPipelines } from "../../services/ingestionService";
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
import { formatDateTime, pageRecords, pageTotal } from "./adminShared";

const PAGE_SIZE = 10;

const route = useRoute();
const router = useRouter();
const kbId = computed(() => String(route.params.kbId || ""));

const loading = ref(false);
const errorText = ref("");
const searchInput = ref("");
const keyword = ref("");
const statusFilter = ref("");
const pageNo = ref(1);

const kb = ref(null);
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: PAGE_SIZE });
const logs = ref([]);

const strategies = ref([]);
const pipelines = ref([]);
const metaLoading = ref(false);

const uploadDialogOpen = ref(false);
const uploadSubmitting = ref(false);
const uploadFileRef = ref(null);
const uploadFile = ref(null);
const uploadForm = ref(createUploadForm());
const uploadChunkConfig = ref({});

const detailDialogOpen = ref(false);
const detailLoading = ref(false);
const detailSaving = ref(false);
const detailTarget = ref(null);
const detailForm = ref(createDetailForm());
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

function createUploadForm() {
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

function createDetailForm() {
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

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
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

function getStrategyOption(value) {
  const normalized = String(value || "").trim();
  return safeArray(strategies.value).find((item) => String(item?.value || item).trim() === normalized) || null;
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

function syncConfigDefaults(targetRef, strategyValue, preserveExisting = true) {
  const strategy = getStrategyOption(strategyValue);
  const defaults = strategy?.defaultConfig || {};
  const current = targetRef.value || {};
  const next = {};

  Object.entries(defaults).forEach(([key, value]) => {
    const baseValue = preserveExisting ? current[key] : undefined;
    next[key] = normalizeConfigValue(baseValue ?? value, value);
  });

  targetRef.value = next;
}

function buildConfigPayload(config, strategyValue) {
  const strategy = getStrategyOption(strategyValue);
  const defaults = strategy?.defaultConfig || {};
  const payload = {};

  Object.entries(defaults).forEach(([key, value]) => {
    payload[key] = normalizeConfigValue(config[key], value);
  });

  return payload;
}

const latestLog = computed(() => recentLogs.value[0] || null);
const detailSourceType = computed(() => String(detailTarget.value?.sourceType || "").toLowerCase());
const detailIsUrlSource = computed(() => detailSourceType.value === "url");

function formatSize(size) {
  if (size === null || size === undefined) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function formatDuration(duration) {
  if (duration === null || duration === undefined) return "--";
  const value = Number(duration);
  if (!Number.isFinite(value)) return String(duration);
  if (value < 1000) return `${value}ms`;
  return `${(value / 1000).toFixed(2)}s`;
}

function formatSourceLabel(sourceType) {
  const normalized = String(sourceType || "").toLowerCase();
  if (normalized === "url") return "Remote URL";
  if (normalized === "file") return "Local File";
  if (normalized === "feishu") return "Feishu";
  if (normalized === "s3") return "S3";
  return sourceType || "--";
}

function formatModeLabel(mode) {
  const normalized = String(mode || "").toLowerCase();
  if (normalized === "pipeline") return "数据通道";
  if (normalized === "chunk") return "直接切片";
  return mode || "--";
}

function formatStrategyLabel(strategy) {
  const normalized = String(strategy || "").toLowerCase();
  if (normalized === "fixed_size") return "固定大小";
  if (normalized === "structure_aware") return "结构感知";
  return strategy || "--";
}

function statusDotClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "success") return "is-success";
  if (normalized === "failed") return "is-danger";
  if (normalized === "running") return "is-warn";
  if (normalized === "pending") return "is-muted";
  return "is-muted";
}

const documents = computed(() => pageRecords(page.value));
const latestDocument = computed(() => documents.value[0] || null);
const visibleDocumentCount = computed(() => pageTotal(page.value));
const currentStatusLabel = computed(() => statusFilter.value || "全部");
const currentFilterSummary = computed(() => {
  const parts = [];
  if (statusFilter.value) parts.push(`状态: ${statusFilter.value}`);
  if (keyword.value) parts.push(`关键词: ${keyword.value}`);
  return parts.length > 0 ? parts.join(" · ") : "全部";
});
const latestDocumentLabel = computed(() => {
  if (!latestDocument.value) return "--";
  return `${latestDocument.value.docName || latestDocument.value.id} · ${formatSourceLabel(latestDocument.value.sourceType)}`;
});
const documentsHeroSummary = computed(() => [
  { label: "知识库", value: kb.value?.name || kbId.value || "--" },
  { label: "文档总数", value: String(visibleDocumentCount.value) },
  { label: "当前筛选", value: currentFilterSummary.value },
  { label: "最新文档", value: latestDocumentLabel.value },
  { label: "最近日志", value: latestLog.value ? latestLog.value.status || "--" : "--" }
]);

const stats = computed(() => {
  const records = documents.value;
  const enabledCount = records.filter((item) => Boolean(item.enabled)).length;
  const chunkCount = records.reduce((sum, item) => sum + Number(item.chunkCount || 0), 0);
  const fileCount = records.filter((item) => String(item.sourceType || "").toLowerCase() === "file").length;
  const urlCount = records.filter((item) => String(item.sourceType || "").toLowerCase() === "url").length;

  return [
    { title: "Documents", value: pageTotal(page.value), hint: "当前知识库文档总数", tone: "indigo" },
    { title: "Enabled", value: enabledCount, hint: "当前页已启用文档", tone: "emerald" },
    { title: "Chunks", value: chunkCount, hint: "当前页切片总数", tone: "blue" },
    { title: "Sources", value: `${fileCount}/${urlCount}`, hint: "文件 / URL", tone: "amber" }
  ];
});

const uploadStrategy = computed(() => getStrategyOption(uploadForm.value.chunkStrategy));
const detailStrategy = computed(() => getStrategyOption(detailForm.value.chunkStrategy));
const uploadConfigFields = computed(() => Object.entries(uploadStrategy.value?.defaultConfig || {}));
const detailConfigFields = computed(() => Object.entries(detailStrategy.value?.defaultConfig || {}));
const recentLogs = computed(() => safeArray(logs.value).slice(0, 3));

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
  uploadForm.value = createUploadForm();
  syncConfigDefaults(uploadChunkConfig, uploadForm.value.chunkStrategy, false);
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
      const isUrlSource = String(detail.sourceType || "").toLowerCase() === "url";
      detailForm.value = {
        docName: detail.docName || "",
        processMode: detail.processMode || "chunk",
        chunkStrategy: detail.chunkStrategy || "structure_aware",
        pipelineId: detail.pipelineId ? String(detail.pipelineId) : "",
        sourceLocation: isUrlSource ? detail.sourceLocation || "" : "",
        scheduleEnabled: isUrlSource ? Boolean(detail.scheduleEnabled) : false,
        scheduleCron: isUrlSource ? detail.scheduleCron || "" : ""
      };
      detailChunkConfig.value = parseChunkConfig(detail.chunkConfig);
      syncConfigDefaults(detailChunkConfig, detailForm.value.chunkStrategy, true);
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
  const isUrlSource = sourceType === "url";

  if (sourceType === "file" && !uploadFile.value) {
    errorText.value = "请选择要上传的文件。";
    return;
  }
  if (isUrlSource && !uploadForm.value.sourceLocation.trim()) {
    errorText.value = "请输入文档地址。";
    return;
  }

  uploadSubmitting.value = true;
  errorText.value = "";

  try {
    const payload = {
      sourceType,
      sourceLocation: isUrlSource ? uploadForm.value.sourceLocation.trim() || null : null,
      processMode,
      chunkStrategy: processMode === "chunk" ? uploadForm.value.chunkStrategy : undefined,
      pipelineId: processMode === "pipeline" ? uploadForm.value.pipelineId || null : null,
      scheduleEnabled: isUrlSource && uploadForm.value.scheduleEnabled,
      scheduleCron: isUrlSource && uploadForm.value.scheduleEnabled ? uploadForm.value.scheduleCron.trim() || null : null
    };

    if (sourceType === "file") {
      payload.file = uploadFile.value;
    }

    if (processMode === "chunk") {
      payload.chunkConfig = JSON.stringify(
        buildConfigPayload(uploadChunkConfig.value, uploadForm.value.chunkStrategy)
      );
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
      sourceLocation: detailIsUrlSource.value ? detailForm.value.sourceLocation.trim() || null : null,
      scheduleEnabled: detailIsUrlSource.value && detailForm.value.scheduleEnabled,
      scheduleCron:
        detailIsUrlSource.value && detailForm.value.scheduleEnabled
          ? detailForm.value.scheduleCron.trim() || null
          : null
    };

    if (detailForm.value.processMode === "chunk") {
      payload.chunkConfig = JSON.stringify(
        buildConfigPayload(detailChunkConfig.value, detailForm.value.chunkStrategy)
      );
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
  getKnowledgeChunkLogsPage(item.id, 1, 10)
    .then((data) => {
      logPage.value = data || { records: [], total: 0 };
      logs.value = pageRecords(logPage.value);
    })
    .catch((error) => {
      errorText.value = getErrorMessage(error, "加载切片日志失败。");
      logPage.value = { records: [], total: 0 };
      logs.value = [];
    })
    .finally(() => {
      logLoading.value = false;
    });
}

function closeLogDialog() {
  logDialogOpen.value = false;
  logTarget.value = null;
  logPage.value = { records: [], total: 0 };
  logs.value = [];
}

watch([kbId, statusFilter], () => {
  pageNo.value = 1;
  void loadDocuments();
});

watch(
  () => uploadForm.value.chunkStrategy,
  (value) => {
    if (uploadDialogOpen.value) {
      syncConfigDefaults(uploadChunkConfig, value, true);
    }
  }
);

watch(
  () => detailForm.value.chunkStrategy,
  (value) => {
    if (detailDialogOpen.value) {
      syncConfigDefaults(detailChunkConfig, value, true);
    }
  }
);

watch(strategies, () => {
  if (uploadDialogOpen.value) {
    syncConfigDefaults(uploadChunkConfig, uploadForm.value.chunkStrategy, true);
  }
  if (detailDialogOpen.value) {
    syncConfigDefaults(detailChunkConfig, detailForm.value.chunkStrategy, true);
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
      tag="知识文档"
      :title="kb?.name || '文档管理'"
      :description="`知识库 ${kbId}${kb?.collectionName ? ` · ${kb.collectionName}` : ''}`"
    >
      <template #meta>
        <div class="admin-header-meta">
          <span class="admin-badge is-muted">Collection：{{ kb?.collectionName || "--" }}</span>
          <span class="admin-badge is-muted">筛选：{{ currentFilterSummary }}</span>
          <span class="admin-badge is-muted">文档：{{ visibleDocumentCount }}</span>
          <span class="admin-badge is-muted">最新：{{ latestDocumentLabel }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/knowledge')">返回知识库</button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button--ghost" type="button" @click="openUploadDialog">添加 URL</button>
        <button class="admin-button" type="button" @click="openFilePicker">上传文件</button>
        <input ref="uploadFileRef" class="admin-hidden-file" type="file" @change="handleFileChange" />
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

    <section class="admin-detail-card docs-hero">
      <div class="docs-hero-copy">
        <p class="trace-hero-tag">Document Flow</p>
        <h2>文档管理与切片调度</h2>
        <p>在一个页面里完成上传、详情编辑、切片触发和日志追踪。</p>
      </div>
      <div class="docs-hero-side">
        <div class="docs-hero-cardline">
          <span class="docs-hero-cardlabel">Collection</span>
          <strong>{{ kb?.collectionName || "未设置 Collection" }}</strong>
        </div>
        <div class="docs-hero-cardline">
          <span class="docs-hero-cardlabel">当前筛选</span>
          <strong>{{ currentFilterSummary }}</strong>
        </div>
        <div class="docs-hero-cardline">
          <span class="docs-hero-cardlabel">文档总数</span>
          <strong>{{ visibleDocumentCount }}</strong>
        </div>
        <div class="docs-hero-cardline">
          <span class="docs-hero-cardlabel">最新文档</span>
          <strong>{{ latestDocumentLabel }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-detail-card docs-summary">
      <div class="docs-summary__copy">
        <p class="trace-hero-tag">Documents Summary</p>
        <h2>文档状态概览</h2>
        <p>对齐 frontend 的知识文档页，先展示知识库、筛选和最新状态，再进入文档表格与详情弹窗。</p>
      </div>
      <div class="docs-summary__grid">
        <div v-for="item in documentsHeroSummary" :key="item.label" class="docs-summary__item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>文档列表</h2>
            <p>支持搜索、筛选、启停、切片和详情编辑。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
        </div>

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
            <select v-model="statusFilter" class="admin-select" @change="handleRefresh">
              <option value="">全部状态</option>
              <option value="pending">pending</option>
              <option value="running">running</option>
              <option value="failed">failed</option>
              <option value="success">success</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
            <button class="admin-button" type="button" @click="openUploadDialog">上传文档</button>
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
                    <span :class="['dot', statusDotClass(item.status)]" />
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
                <td>{{ formatStrategyLabel(item.chunkStrategy) }}</td>
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
          <p class="admin-detail-card-desc">展示当前知识库的基础信息与处理概况。</p>
          <div class="admin-kv">
            <div><dt>名称</dt><dd>{{ kb?.name || kbId }}</dd></div>
            <div><dt>Collection</dt><dd>{{ kb?.collectionName || "--" }}</dd></div>
            <div><dt>文档数</dt><dd>{{ pageTotal(page) }}</dd></div>
            <div><dt>策略数</dt><dd>{{ metaLoading ? "--" : strategies.length }}</dd></div>
            <div><dt>当前筛选</dt><dd>{{ currentFilterSummary }}</dd></div>
            <div><dt>最近文档</dt><dd>{{ latestDocumentLabel }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>最近日志</h3>
          <p class="admin-detail-card-desc">打开日志弹窗可以查看完整切片记录。</p>
          <div v-if="latestLog" class="admin-kv admin-kv--compact">
            <div><dt>状态</dt><dd>{{ latestLog.status || "--" }}</dd></div>
            <div><dt>切片数</dt><dd>{{ latestLog.chunkCount ?? "--" }}</dd></div>
            <div>
              <dt>耗时</dt>
              <dd>{{ formatDuration(latestLog.totalDuration ?? latestLog.chunkDuration ?? latestLog.extractDuration) }}</dd>
            </div>
            <div><dt>开始时间</dt><dd>{{ formatDateTime(latestLog.startTime || latestLog.createTime) }}</dd></div>
          </div>
          <div v-if="recentLogs.length === 0" class="admin-empty-sm">暂无日志</div>
          <div v-else class="admin-card-list">
            <div v-for="item in recentLogs" :key="item.id" class="admin-card-item">
              <h3>{{ item.status || "unknown" }}</h3>
              <p>{{ item.chunkStrategy || item.processMode || "--" }}</p>
              <p>切片数 {{ item.chunkCount ?? "--" }} · 耗时 {{ formatDuration(item.totalDuration ?? item.chunkDuration ?? item.extractDuration) }}</p>
              <p>{{ formatDateTime(item.createTime || item.startTime) }}</p>
              <p>{{ item.remark || item.errorMessage || "--" }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>

    <div v-if="uploadDialogOpen" class="admin-dialog-overlay" @click.self="closeUploadDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <h3>上传文档</h3>
        <p>支持本地文件与 URL 两种来源，并可配置切片或数据通道处理方式。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>来源类型</label>
            <select v-model="uploadForm.sourceType" class="admin-select">
              <option value="file">Local File</option>
              <option value="url">Remote URL</option>
            </select>
          </div>
          <div v-if="uploadForm.sourceType === 'url'" class="admin-dialog-field">
            <label>文档地址</label>
            <input v-model="uploadForm.sourceLocation" class="admin-input" placeholder="https://example.com/doc" />
          </div>
          <div v-if="uploadForm.sourceType === 'file'" class="admin-dialog-field">
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
          <div v-if="uploadForm.processMode === 'chunk'" class="admin-dialog-field">
            <label>切片策略</label>
            <select v-model="uploadForm.chunkStrategy" class="admin-select">
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
              <option v-for="item in strategies" :key="item.value || item" :value="item.value || item">
                {{ item.label || item.value || item }}
              </option>
            </select>
          </div>
          <div v-if="uploadForm.processMode === 'pipeline'" class="admin-dialog-field">
            <label>数据通道</label>
            <select v-model="uploadForm.pipelineId" class="admin-select">
              <option value="">请选择 pipeline</option>
              <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div v-if="uploadForm.processMode === 'chunk' && uploadConfigFields.length > 0" class="admin-form-grid-2">
            <div v-for="([key, value]) in uploadConfigFields" :key="key" class="admin-dialog-field">
              <label>{{ key }}</label>
              <input v-model="uploadChunkConfig[key]" class="admin-input" :placeholder="String(value)" />
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
            <div v-if="uploadForm.scheduleEnabled" class="admin-dialog-field">
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
          <div v-if="detailForm.processMode === 'chunk'" class="admin-dialog-field">
            <label>切片策略</label>
            <select v-model="detailForm.chunkStrategy" class="admin-select">
              <option v-if="strategies.length === 0" value="structure_aware">structure_aware</option>
              <option v-for="item in strategies" :key="item.value || item" :value="item.value || item">
                {{ item.label || item.value || item }}
              </option>
            </select>
          </div>
          <div v-if="detailForm.processMode === 'pipeline'" class="admin-dialog-field">
            <label>数据通道</label>
            <select v-model="detailForm.pipelineId" class="admin-select">
              <option value="">请选择 pipeline</option>
              <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-kv admin-kv--compact">
            <div><dt>来源类型</dt><dd>{{ formatSourceLabel(detailTarget?.sourceType) }}</dd></div>
            <div><dt>当前状态</dt><dd>{{ detailTarget?.status || "--" }}</dd></div>
            <div><dt>处理模式</dt><dd>{{ detailForm.processMode || "--" }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDate(detailTarget?.updateTime || detailTarget?.createTime) }}</dd></div>
          </div>
          <div v-if="detailIsUrlSource" class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>源地址</label>
              <input v-model="detailForm.sourceLocation" class="admin-input" placeholder="https://example.com/doc" />
            </div>
            <div class="admin-dialog-field">
              <label>定时同步</label>
              <select v-model="detailForm.scheduleEnabled" class="admin-select">
                <option :value="true">启用</option>
                <option :value="false">禁用</option>
              </select>
            </div>
            <div v-if="detailForm.scheduleEnabled" class="admin-dialog-field">
              <label>Cron</label>
              <input v-model="detailForm.scheduleCron" class="admin-input" placeholder="0 0 * * ?" />
            </div>
          </div>
          <div v-else class="admin-empty-sm">本地文件来源不展示 URL 和定时同步配置。</div>
          <div v-if="detailForm.processMode === 'chunk' && detailConfigFields.length > 0" class="admin-form-grid-2">
            <div v-for="([key, value]) in detailConfigFields" :key="key" class="admin-dialog-field">
              <label>{{ key }}</label>
              <input v-model="detailChunkConfig[key]" class="admin-input" :placeholder="String(value)" />
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
        <p class="admin-confirm-text">确认对文档「{{ chunkTarget?.docName || chunkTarget?.id }}」触发切片任务？</p>
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
        <p class="admin-confirm-text">确认删除文档「{{ deleteTarget?.docName || deleteTarget?.id }}」？该操作无法恢复。</p>
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

<style scoped>
.docs-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.docs-hero-copy {
  display: grid;
  gap: 8px;
}

.docs-hero-copy h2 {
  margin: 0;
  font-size: 24px;
}

.docs-hero-copy p,
.docs-hero-side p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.trace-hero-tag {
  margin: 0;
  color: var(--admin-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.docs-hero-side {
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 280px;
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.76);
}

.docs-hero-cardline {
  display: grid;
  gap: 4px;
}

.docs-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.docs-hero-cardline strong {
  color: var(--admin-ink);
  font-size: 14px;
  word-break: break-word;
}

.docs-summary {
  display: grid;
  gap: 16px;
  margin: 20px 0;
}

.docs-summary__copy {
  display: grid;
  gap: 8px;
}

.docs-summary__copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.docs-summary__copy p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.docs-summary__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.docs-summary__item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.docs-summary__item span {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.docs-summary__item strong {
  color: var(--admin-ink);
  font-size: 15px;
  word-break: break-word;
}

.admin-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .docs-hero {
    flex-direction: column;
  }

  .docs-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .docs-hero-side {
    min-width: 0;
  }
}
</style>

<style scoped>
.dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
}

.dot.is-success {
  background: #10b981;
}

.dot.is-danger {
  background: #ef4444;
}

.dot.is-warn {
  background: #f59e0b;
}

.dot.is-muted {
  background: #94a3b8;
}
</style>
