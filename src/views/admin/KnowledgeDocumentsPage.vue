<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  getKnowledgeBase,
  getKnowledgeDocumentsPage,
  getKnowledgeDocument,
  updateKnowledgeDocument,
  startKnowledgeDocumentChunk,
  uploadKnowledgeDocument,
  deleteKnowledgeDocument,
  setKnowledgeDocumentEnabled,
  getChunkStrategies,
  getKnowledgeChunkLogsPage
} from "../../services/knowledgeService";
import { getIngestionPipelines } from "../../services/ingestionService";
import { formatDateTime, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const statusFilter = ref("");
const base = ref(null);
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: 10 });
const pageNo = ref(1);
const pageSize = 10;

const strategies = ref([]);
const pipelines = ref([]);

const uploadDialogOpen = ref(false);
const uploadSubmitting = ref(false);
const uploadFileRef = ref(null);
const uploadForm = ref({
  sourceType: "file",
  processMode: "chunk",
  chunkStrategy: "structure_aware",
  pipelineId: "",
  url: ""
});
const uploadFile = ref(null);

const detailDialogOpen = ref(false);
const detailLoading = ref(false);
const detailSaving = ref(false);
const detailTarget = ref(null);
const detailForm = ref({
  docName: "",
  processMode: "chunk",
  chunkStrategy: "structure_aware",
  pipelineId: "",
  sourceLocation: "",
  scheduleEnabled: false,
  scheduleCron: ""
});
const detailChunkConfig = ref({});
const detailStrategies = ref([]);
const detailPipelines = ref([]);

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

const documents = computed(() => pageRecords(page.value));

const documentStats = computed(() => [
  {
    title: "Documents",
    value: pageTotal(page.value),
    hint: "当前知识库下的文档总数",
    tone: "indigo"
  },
  {
    title: "Shown",
    value: documents.value.filter((item) => Boolean(item.enabled)).length,
    hint: "当前页启用中的文档数",
    tone: "emerald"
  },
  {
    title: "Chunks",
    value: documents.value.reduce((sum, item) => sum + Number(item.chunkCount || 0), 0),
    hint: "当前页切片总数汇总",
    tone: "blue"
  },
  {
    title: "Strategies",
    value: strategies.value.length,
    hint: "可用切片策略数量",
    tone: "amber"
  }
]);

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
  { value: "chunk", label: "直接切片" },
  { value: "pipeline", label: "数据通道" }
];

function formatSize(size) {
  if (size == null) return "--";
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

function statusBadgeClass(status, enabled) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "success") return "is-success";
  if (normalized === "failed") return "is-danger";
  if (normalized === "running") return "is-warn";
  if (enabled) return "is-success";
  return "is-muted";
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

function stringifyJson(value) {
  if (value == null) return "-";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function loadMeta() {
  try {
    const [strategyData, pipelineData] = await Promise.all([
      getChunkStrategies().catch(() => []),
      getIngestionPipelines(1, 200).catch(() => ({ records: [] }))
    ]);
    strategies.value = Array.isArray(strategyData) ? strategyData : [];
    pipelines.value = Array.isArray(pipelineData?.records) ? pipelineData.records : [];
  } catch {
    strategies.value = [];
    pipelines.value = [];
  }
}

async function loadDocuments() {
  if (!kbId.value) return;
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
    page.value = pageData || { records: [], total: 0, pages: 1, current: 1, size: pageSize };
  } catch (error) {
    errorText.value = error?.message || "加载文档失败。";
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
  if (pageNo.value >= page.value.pages) return;
  pageNo.value += 1;
  void loadDocuments();
}

function openUploadDialog() {
  uploadDialogOpen.value = true;
  uploadForm.value = {
    sourceType: "file",
    processMode: "chunk",
    chunkStrategy: "structure_aware",
    pipelineId: pipelines.value[0]?.id || "",
    url: ""
  };
  uploadFile.value = null;
}

function closeUploadDialog() {
  uploadDialogOpen.value = false;
}

function openFilePicker() {
  uploadForm.value.sourceType = "file";
  uploadFileRef.value?.click();
}

function handleFileChange(event) {
  uploadFile.value = event.target?.files?.[0] || null;
}

async function handleUploadSubmit() {
  if (uploadForm.value.sourceType === "url" && !uploadForm.value.url.trim()) return;
  if (uploadForm.value.sourceType === "file" && !uploadFile.value) return;

  uploadSubmitting.value = true;
  errorText.value = "";
  try {
    if (uploadForm.value.sourceType === "file") {
      await uploadKnowledgeDocument(kbId.value, {
        sourceType: "file",
        file: uploadFile.value,
        processMode: uploadForm.value.processMode || "chunk",
        chunkStrategy: uploadForm.value.chunkStrategy || "structure_aware",
        pipelineId: uploadForm.value.processMode === "pipeline" ? uploadForm.value.pipelineId || null : null
      });
    } else {
      await uploadKnowledgeDocument(kbId.value, {
        sourceType: "url",
        sourceLocation: uploadForm.value.url.trim(),
        processMode: uploadForm.value.processMode || "chunk",
        chunkStrategy: uploadForm.value.chunkStrategy || "structure_aware",
        pipelineId: uploadForm.value.processMode === "pipeline" ? uploadForm.value.pipelineId || null : null
      });
    }
    closeUploadDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "上传文档失败。";
  } finally {
    uploadSubmitting.value = false;
  }
}

async function openDetailDialog(item) {
  detailDialogOpen.value = true;
  detailLoading.value = true;
  detailTarget.value = null;
  errorText.value = "";
  try {
    const detail = await getKnowledgeDocument(item.id);
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
    detailStrategies.value = strategies.value;
    detailPipelines.value = pipelines.value;
  } catch (error) {
    errorText.value = error?.message || "加载文档详情失败。";
  } finally {
    detailLoading.value = false;
  }
}

function closeDetailDialog() {
  detailDialogOpen.value = false;
  detailTarget.value = null;
}

async function handleDetailSave() {
  if (!detailTarget.value || !detailForm.value.docName.trim()) return;
  detailSaving.value = true;
  errorText.value = "";
  try {
    const payload = {
      docName: detailForm.value.docName.trim(),
      processMode: detailForm.value.processMode || "chunk",
      chunkStrategy: detailForm.value.processMode === "chunk" ? detailForm.value.chunkStrategy : undefined,
      pipelineId: detailForm.value.processMode === "pipeline" ? detailForm.value.pipelineId || null : null,
      sourceLocation: detailForm.value.sourceLocation.trim() || null,
      scheduleEnabled: detailForm.value.scheduleEnabled,
      scheduleCron: detailForm.value.scheduleEnabled ? detailForm.value.scheduleCron.trim() || null : null
    };
    if (detailForm.value.processMode === "chunk") {
      const strategy = detailStrategies.value.find((item) => item.value === detailForm.value.chunkStrategy);
      if (strategy?.defaultConfig) {
        const chunkConfig = {};
        for (const [key, value] of Object.entries(strategy.defaultConfig)) {
          chunkConfig[key] = Number(detailChunkConfig.value[key] ?? value);
        }
        payload.chunkConfig = JSON.stringify(chunkConfig);
      }
    }
    await updateKnowledgeDocument(detailTarget.value.id, payload);
    closeDetailDialog();
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "保存文档失败。";
  } finally {
    detailSaving.value = false;
  }
}

async function handleToggleEnabled(item) {
  try {
    await setKnowledgeDocumentEnabled(item.id, !item.enabled);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "切换文档状态失败。";
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
    errorText.value = error?.message || "触发切片失败。";
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
    errorText.value = error?.message || "删除文档失败。";
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
      errorText.value = error?.message || "加载日志失败。";
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

watch([kbId, statusFilter], () => {
  pageNo.value = 1;
  void loadDocuments();
});

onMounted(() => {
  void loadMeta();
  void loadDocuments();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Knowledge Docs"
      :title="base?.name || '知识库文档'"
      :description="`知识库: ${kbId}${base?.collectionName ? ` · ${base.collectionName}` : ''}`"
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
            <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">共 {{ pageTotal(page).toLocaleString("zh-CN") }} 条</span>
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
                <button class="admin-link" type="button" @click="router.push(`/admin/knowledge/${kbId}/docs/${item.id}`)">
                  {{ item.docName || item.id }}
                </button>
              </td>
              <td>{{ formatSourceLabel(item.sourceType) }}</td>
              <td>{{ item.processMode || "-" }}</td>
              <td>
                <span :class="['admin-badge', statusBadgeClass(item.status, item.enabled)]">
                  {{ item.status || "-" }}
                </span>
              </td>
              <td>
                <span :class="['admin-badge', item.enabled ? 'is-success' : 'is-muted']">
                  {{ item.enabled ? "启用" : "禁用" }}
                </span>
              </td>
              <td>{{ item.chunkCount ?? 0 }}</td>
              <td>{{ item.chunkStrategy || "-" }}</td>
              <td>{{ formatSize(item.fileSize) }}</td>
              <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="openDetailDialog(item)">详情</button>
                  <button class="admin-button--ghost" type="button" @click="openChunkDialog(item)">切片</button>
                  <button class="admin-button--ghost" type="button" @click="openLogDialog(item)">日志</button>
                  <button class="admin-button--ghost" type="button" @click="handleToggleEnabled(item)">
                    {{ item.enabled ? "禁用" : "启用" }}
                  </button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="documents.length > 0" class="admin-pagination">
        <span class="admin-page-count">第 {{ page.current || pageNo }} / {{ page.pages || pageCount(page) }} 页</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="loading || (page.current || pageNo) <= 1" @click="goPrev">上一页</button>
          <button class="admin-button--ghost" type="button" :disabled="loading || (page.current || pageNo) >= (page.pages || pageCount(page))" @click="goNext">下一页</button>
        </div>
      </div>
    </article>

    <div v-if="uploadDialogOpen" class="admin-dialog-overlay" @click.self="closeUploadDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <h3>上传文档</h3>
        <p>支持本地文件或远程 URL，并可选择 chunk / pipeline 处理方式。</p>
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
          <div v-if="uploadForm.sourceType === 'file'" class="admin-dialog-field">
            <label>本地文件</label>
            <input type="file" class="admin-input" @change="handleFileChange" />
          </div>
          <div class="admin-dialog-field">
            <label>处理模式</label>
            <select v-model="uploadForm.processMode" class="admin-select">
              <option v-for="opt in PROCESS_MODE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
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
              <option v-for="opt in PROCESS_MODE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div v-if="detailForm.processMode === 'chunk'" class="admin-dialog-field">
            <label>切片策略</label>
            <select v-model="detailForm.chunkStrategy" class="admin-select">
              <option v-if="detailStrategies.length === 0" value="structure_aware">structure_aware</option>
              <option v-for="item in detailStrategies" :key="item.value || item" :value="item.value || item">
                {{ item.label || item.value || item }}
              </option>
            </select>
          </div>
          <div v-if="detailForm.processMode === 'pipeline'" class="admin-dialog-field">
            <label>数据通道</label>
            <select v-model="detailForm.pipelineId" class="admin-select">
              <option value="">请选择 pipeline</option>
              <option v-for="pipeline in detailPipelines" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>源地址</label>
            <input v-model="detailForm.sourceLocation" class="admin-input" placeholder="可选" />
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

          <div v-if="detailForm.processMode === 'chunk' && detailStrategies.length > 0" class="admin-dialog-field">
            <label>chunkConfig</label>
            <pre class="admin-pre">{{ stringifyJson(detailChunkConfig) }}</pre>
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
        <p class="admin-confirm-text">确认对文档 "{{ chunkTarget?.docName || chunkTarget?.id }}" 执行切片？</p>
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
        <p class="admin-confirm-text">确认删除文档 "{{ deleteTarget?.docName || deleteTarget?.id }}" 吗？</p>
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
                  <th>分块数</th>
                  <th>耗时</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in pageRecords(logPage)" :key="log.id">
                  <td>{{ formatDateTime(log.createTime || log.startTime) }}</td>
                  <td>
                    <span :class="['admin-badge', statusBadgeClass(log.status)]">{{ log.status || "--" }}</span>
                  </td>
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
