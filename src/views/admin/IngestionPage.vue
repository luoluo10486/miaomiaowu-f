<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  createIngestionPipeline,
  createIngestionTask,
  deleteIngestionPipeline,
  getIngestionPipeline,
  getIngestionTask,
  getIngestionTaskNodes,
  getIngestionTasks,
  getIngestionPipelines,
  updateIngestionPipeline,
  uploadIngestionTask
} from "../../services/ingestionService";
import { formatDateTime, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();

const PIPELINE_PAGE_SIZE = 10;
const TASK_PAGE_SIZE = 10;

const loading = ref(false);
const errorText = ref("");
const successText = ref("");

const activeTab = ref(route.query.tab === "tasks" ? "tasks" : "pipelines");

const pipelineKeyword = ref("");
const pipelineSearchInput = ref("");
const pipelinePageNo = ref(1);
const pipelines = ref({ records: [], total: 0, pages: 1, current: 1, size: PIPELINE_PAGE_SIZE });
const pipelineOptions = ref([]);

const taskStatus = ref("");
const taskPageNo = ref(1);
const tasks = ref({ records: [], total: 0, pages: 1, current: 1, size: TASK_PAGE_SIZE });

const pipelineDetailDialogOpen = ref(false);
const pipelineDetailLoading = ref(false);
const pipelineDetailTarget = ref(null);

const pipelineDialogOpen = ref(false);
const pipelineDialogMode = ref("create");
const pipelineTarget = ref(null);
const pipelineForm = ref({ name: "", description: "", nodesJson: "" });
const pipelineSubmitting = ref(false);

const taskDialogOpen = ref(false);
const taskDialogPipelineId = ref("");
const taskForm = ref({
  pipelineId: "",
  sourceType: "url",
  location: "",
  fileName: "",
  credentialsJson: "",
  metadataJson: ""
});
const taskFile = ref(null);
const taskSubmitting = ref(false);

const uploadDialogOpen = ref(false);
const uploadPipelineId = ref("");
const uploadFile = ref(null);
const uploadSubmitting = ref(false);

const taskDetailOpen = ref(false);
const taskDetailLoading = ref(false);
const taskDetailTarget = ref(null);
const taskDetailNodes = ref([]);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const uploadInputRef = ref(null);

const pipelineRecords = computed(() => pageRecords(pipelines.value));
const taskRecords = computed(() => pageRecords(tasks.value));

const pipelinePages = computed(() => Number(pipelines.value?.pages || 1));
const taskPages = computed(() => Number(tasks.value?.pages || 1));

const activePipelineCount = computed(() => pipelineRecords.value.length);
const activeTaskCount = computed(
  () => taskRecords.value.filter((item) => normalizeTaskStatus(item.status) === "RUNNING").length
);
const failedTaskCount = computed(
  () => taskRecords.value.filter((item) => normalizeTaskStatus(item.status) === "FAILED").length
);
const successTaskCount = computed(
  () => taskRecords.value.filter((item) => normalizeTaskStatus(item.status) === "SUCCESS").length
);

const pipelineStats = computed(() => [
  {
    title: "Pipelines",
    value: pageTotal(pipelines.value),
    hint: "当前页和搜索结果对应的流水线总数",
    tone: "indigo"
  },
  {
    title: "Tasks",
    value: pageTotal(tasks.value),
    hint: "当前过滤条件下的任务总数",
    tone: "blue"
  },
  {
    title: "Running",
    value: activeTaskCount.value,
    hint: "当前页正在执行的任务",
    tone: "amber"
  },
  {
    title: "Failed",
    value: failedTaskCount.value,
    hint: "当前页失败任务数量",
    tone: "rose"
  }
]);

watch(activeTab, (val) => {
  router.replace({ query: { ...route.query, tab: val } });
});

watch(
  () => route.query.tab,
  (val) => {
    if (val === "tasks" || val === "pipelines") {
      activeTab.value = val;
    }
  }
);

watch(taskDialogOpen, (open) => {
  if (open) {
    resetTaskForm(taskDialogPipelineId.value);
  }
});

watch(uploadDialogOpen, (open) => {
  if (open) {
    uploadFile.value = null;
  }
});

async function loadIngestion() {
  loading.value = true;
  errorText.value = "";
  try {
    const [pipelinePage, taskPage, pipelineOptionPage] = await Promise.all([
      getIngestionPipelines(pipelinePageNo.value, PIPELINE_PAGE_SIZE, pipelineKeyword.value),
      getIngestionTasks(taskPageNo.value, TASK_PAGE_SIZE, taskStatus.value),
      getIngestionPipelines(1, 200)
    ]);
    pipelines.value = pipelinePage || { records: [], total: 0, pages: 1, current: 1, size: PIPELINE_PAGE_SIZE };
    tasks.value = taskPage || { records: [], total: 0, pages: 1, current: 1, size: TASK_PAGE_SIZE };
    pipelineOptions.value = pipelineOptionPage?.records || [];
  } catch (error) {
    errorText.value = error?.message || "加载摄取数据失败。";
  } finally {
    loading.value = false;
  }
}

function normalizeTaskStatus(status) {
  return String(status || "").toUpperCase();
}

function taskStatusBadgeClass(status) {
  const normalized = normalizeTaskStatus(status);
  if (normalized === "SUCCESS" || normalized === "COMPLETED") return "is-success";
  if (normalized === "FAILED") return "is-danger";
  if (normalized === "RUNNING") return "is-warn";
  return "is-muted";
}

function safeJsonParse(raw, fallback = null) {
  const text = String(raw || "").trim();
  if (!text) return fallback;
  return JSON.parse(text);
}

function prettyJson(value) {
  if (value == null) return "-";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatNodeSettings(node) {
  const settings = node?.settings ?? node?.condition ?? null;
  return prettyJson(settings);
}

function resetPipelineForm(item = null) {
  pipelineTarget.value = item;
  pipelineForm.value = {
    name: item?.name || "",
    description: item?.description || "",
    nodesJson: item?.nodes?.length ? JSON.stringify(item.nodes, null, 2) : ""
  };
}

function openPipelineDialog(mode, item = null) {
  pipelineDialogMode.value = mode;
  resetPipelineForm(mode === "edit" ? item : null);
  pipelineDialogOpen.value = true;
}

function closePipelineDialog() {
  pipelineDialogOpen.value = false;
  pipelineTarget.value = null;
}

function parsePipelineNodes(raw) {
  if (!raw || !String(raw).trim()) return [];
  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) {
    throw new Error("节点配置必须是 JSON 数组。");
  }
  return parsed.map((node) => {
    const nodeId = String(node?.nodeId || "").trim();
    const nodeType = String(node?.nodeType || "").trim();
    if (!nodeId || !nodeType) {
      throw new Error("每个节点都必须包含 nodeId 和 nodeType。");
    }
    return {
      nodeId,
      nodeType,
      settings: node?.settings ?? null,
      condition: node?.condition ?? null,
      nextNodeId: node?.nextNodeId ? String(node.nextNodeId).trim() : null
    };
  });
}

async function handlePipelineSubmit() {
  const name = pipelineForm.value.name.trim();
  if (!name) return;

  pipelineSubmitting.value = true;
  errorText.value = "";

  try {
    const nodes = parsePipelineNodes(pipelineForm.value.nodesJson);
    const payload = {
      name,
      description: pipelineForm.value.description.trim() || "",
      nodes
    };

    if (pipelineDialogMode.value === "edit" && pipelineTarget.value) {
      await updateIngestionPipeline(pipelineTarget.value.id, payload);
      successText.value = "Pipeline 已更新。";
    } else {
      await createIngestionPipeline(payload);
      successText.value = "Pipeline 已创建。";
    }

    closePipelineDialog();
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || (pipelineDialogMode.value === "edit" ? "更新 pipeline 失败。" : "创建 pipeline 失败。");
  } finally {
    pipelineSubmitting.value = false;
  }
}

async function openPipelineDetail(item) {
  pipelineDetailTarget.value = item;
  pipelineDetailDialogOpen.value = true;
  pipelineDetailLoading.value = true;
  errorText.value = "";

  try {
    pipelineDetailTarget.value = await getIngestionPipeline(item.id);
  } catch (error) {
    errorText.value = error?.message || "加载 pipeline 详情失败。";
  } finally {
    pipelineDetailLoading.value = false;
  }
}

function closePipelineDetail() {
  pipelineDetailDialogOpen.value = false;
  pipelineDetailTarget.value = null;
}

function openDeleteDialog(item) {
  deleteTarget.value = item;
  deleteDialogOpen.value = true;
}

function closeDeleteDialog() {
  deleteDialogOpen.value = false;
  deleteTarget.value = null;
}

async function handleDeletePipeline() {
  if (!deleteTarget.value) return;
  deleteSubmitting.value = true;
  errorText.value = "";
  try {
    await deleteIngestionPipeline(deleteTarget.value.id);
    successText.value = "Pipeline 已删除。";
    closeDeleteDialog();
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "删除 pipeline 失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

function resetTaskForm(pipelineId = "") {
  taskForm.value = {
    pipelineId: pipelineId || pipelineOptions.value?.[0]?.id || pipelines.value?.records?.[0]?.id || "",
    sourceType: "url",
    location: "",
    fileName: "",
    credentialsJson: "",
    metadataJson: ""
  };
  taskFile.value = null;
}

function openTaskDialog(pipelineId = "") {
  taskDialogPipelineId.value = pipelineId || pipelineOptions.value?.[0]?.id || pipelines.value?.records?.[0]?.id || "";
  taskDialogOpen.value = true;
}

function closeTaskDialog() {
  taskDialogOpen.value = false;
  taskDialogPipelineId.value = "";
}

async function handleCreateTask() {
  const pipelineId = taskForm.value.pipelineId.trim();
  if (!pipelineId) return;

  taskSubmitting.value = true;
  errorText.value = "";

  try {
    const sourceType = String(taskForm.value.sourceType || "url").toUpperCase();
    let credentials;
    let metadata;

    try {
      credentials = safeJsonParse(taskForm.value.credentialsJson, undefined);
    } catch {
      throw new Error("凭证 JSON 格式错误。");
    }

    try {
      metadata = safeJsonParse(taskForm.value.metadataJson, undefined);
    } catch {
      throw new Error("元数据 JSON 格式错误。");
    }

    if (taskForm.value.sourceType !== "file") {
      const location = taskForm.value.location.trim();
      if (!location) {
        throw new Error("请输入来源地址。");
      }

      await createIngestionTask({
        pipelineId,
        source: {
          type: sourceType,
          location,
          fileName: taskForm.value.fileName.trim() || undefined,
          credentials: credentials && typeof credentials === "object" ? credentials : undefined
        },
        metadata: metadata && typeof metadata === "object" ? metadata : undefined
      });
      successText.value = "Ingestion task 已创建。";
    } else {
      if (!taskFile.value) {
        throw new Error("请选择本地文件。");
      }
      await uploadIngestionTask(pipelineId, taskFile.value);
      successText.value = "文件摄取任务已提交。";
    }

    closeTaskDialog();
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "创建 ingestion task 失败。";
  } finally {
    taskSubmitting.value = false;
  }
}

function openUploadDialog(pipelineId = "") {
  uploadPipelineId.value = pipelineId || pipelineOptions.value?.[0]?.id || pipelines.value?.records?.[0]?.id || "";
  uploadDialogOpen.value = true;
}

function closeUploadDialog() {
  uploadDialogOpen.value = false;
  uploadPipelineId.value = "";
  uploadFile.value = null;
}

function triggerUpload(pipelineId) {
  uploadPipelineId.value = pipelineId;
  uploadInputRef.value?.click();
}

async function handleUploadChange(event) {
  const file = event.target?.files?.[0];
  if (!file || !uploadPipelineId.value) {
    event.target.value = "";
    return;
  }

  uploadSubmitting.value = true;
  errorText.value = "";
  try {
    await uploadIngestionTask(uploadPipelineId.value, file);
    successText.value = "文件摄取任务已提交。";
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "上传 ingestion 文件失败。";
  } finally {
    uploadSubmitting.value = false;
    uploadPipelineId.value = "";
    event.target.value = "";
  }
}

async function handleUploadSubmit() {
  if (!uploadPipelineId.value) {
    errorText.value = "请选择流水线。";
    return;
  }
  if (!uploadFile.value) {
    errorText.value = "请选择文件。";
    return;
  }

  uploadSubmitting.value = true;
  errorText.value = "";
  try {
    await uploadIngestionTask(uploadPipelineId.value, uploadFile.value);
    successText.value = "文件摄取任务已提交。";
    closeUploadDialog();
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "上传 ingestion 文件失败。";
  } finally {
    uploadSubmitting.value = false;
  }
}

async function openTaskDetail(item) {
  taskDetailTarget.value = item;
  taskDetailOpen.value = true;
  taskDetailLoading.value = true;
  taskDetailNodes.value = [];
  errorText.value = "";

  try {
    const [detail, nodeLogs] = await Promise.all([getIngestionTask(item.id), getIngestionTaskNodes(item.id)]);
    taskDetailTarget.value = detail;
    taskDetailNodes.value = nodeLogs || [];
  } catch (error) {
    errorText.value = error?.message || "加载 task 详情失败。";
  } finally {
    taskDetailLoading.value = false;
  }
}

function closeTaskDetail() {
  taskDetailOpen.value = false;
  taskDetailTarget.value = null;
  taskDetailNodes.value = [];
}

function handlePipelineSearch() {
  pipelinePageNo.value = 1;
  pipelineKeyword.value = pipelineSearchInput.value.trim();
  void loadIngestion();
}

function handleTaskFileChange(event) {
  taskFile.value = event.target?.files?.[0] || null;
}

function handleUploadFileChange(event) {
  uploadFile.value = event.target?.files?.[0] || null;
}

function handlePipelineRefresh() {
  pipelinePageNo.value = 1;
  void loadIngestion();
}

function handleTaskRefresh() {
  taskPageNo.value = 1;
  void loadIngestion();
}

function setTab(tab) {
  activeTab.value = tab;
}

function goPipelinePrev() {
  if (pipelinePageNo.value <= 1) return;
  pipelinePageNo.value -= 1;
  void loadIngestion();
}

function goPipelineNext() {
  if (pipelinePageNo.value >= pipelinePages.value) return;
  pipelinePageNo.value += 1;
  void loadIngestion();
}

function goTaskPrev() {
  if (taskPageNo.value <= 1) return;
  taskPageNo.value -= 1;
  void loadIngestion();
}

function goTaskNext() {
  if (taskPageNo.value >= taskPages.value) return;
  taskPageNo.value += 1;
  void loadIngestion();
}

onMounted(() => {
  void loadIngestion();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Ingestion"
      title="数据通道"
      description="对齐 frontend 的后台摄取管理结构，集中管理 pipeline、任务创建、文件上传和任务节点执行详情。"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="loadIngestion">
          刷新
        </button>
        <button class="admin-button--ghost" type="button" @click="openUploadDialog()">
          上传文件
        </button>
        <button class="admin-button" type="button" @click="openPipelineDialog('create')">
          新建 Pipeline
        </button>
        <input ref="uploadInputRef" class="admin-hidden-file" type="file" @change="handleUploadChange" />
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>
    <p v-if="successText" class="admin-notice is-success">{{ successText }}</p>

    <section class="admin-stat-grid">
      <StatCard
        v-for="stat in pipelineStats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </section>

    <div class="admin-window-tabs">
      <button
        :class="['admin-window-tab', { 'is-active': activeTab === 'pipelines' }]"
        type="button"
        @click="setTab('pipelines')"
      >
        Pipeline 管理
      </button>
      <button
        :class="['admin-window-tab', { 'is-active': activeTab === 'tasks' }]"
        type="button"
        @click="setTab('tasks')"
      >
        Task 管理
      </button>
    </div>

    <template v-if="activeTab === 'pipelines'">
      <article class="admin-table-card">
        <div class="admin-card-header">
          <div>
            <h3>Pipeline 列表</h3>
            <p class="admin-detail-card-desc">支持搜索、编辑、节点预览、URL 任务创建、文件上传和删除。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(pipelines).toLocaleString("zh-CN") }} 条</span>
        </div>

        <div class="admin-toolbar" style="margin-bottom: 16px;">
          <div class="admin-toolbar-left">
            <input
              v-model="pipelineSearchInput"
              class="admin-input"
              type="search"
              placeholder="搜索 pipeline 名称"
              @keyup.enter="handlePipelineSearch"
            />
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handlePipelineSearch">
              搜索
            </button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handlePipelineRefresh">
              刷新
            </button>
            <button class="admin-button" type="button" @click="openPipelineDialog('create')">
              新建 Pipeline
            </button>
          </div>
        </div>

        <div v-if="loading && pipelineRecords.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pipelineRecords.length === 0" class="admin-empty">暂无 pipeline</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>描述</th>
                <th>节点数</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pipelineRecords" :key="item.id">
                <td>
                  <div class="admin-cell-title">{{ item.name || item.id }}</div>
                  <div class="admin-list-meta">{{ item.id }}</div>
                </td>
                <td>{{ item.description || "-" }}</td>
                <td>{{ item.nodes?.length ?? 0 }}</td>
                <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click="openPipelineDetail(item)">查看节点</button>
                    <button class="admin-button--ghost" type="button" @click="openPipelineDialog('edit', item)">编辑</button>
                    <button class="admin-button--ghost" type="button" @click="openTaskDialog(item.id)">新建任务</button>
                    <button class="admin-button--ghost" type="button" @click="openUploadDialog(item.id)">上传文件</button>
                    <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="admin-pagination">
          <span class="admin-page-count">第 {{ pipelines.current || pipelinePageNo }} / {{ pipelinePages }} 页</span>
          <div class="admin-pagination-controls">
            <button class="admin-button--ghost" type="button" :disabled="loading || (pipelines.current || pipelinePageNo) <= 1" @click="goPipelinePrev">
              上一页
            </button>
            <button class="admin-button--ghost" type="button" :disabled="loading || (pipelines.current || pipelinePageNo) >= pipelinePages" @click="goPipelineNext">
              下一页
            </button>
          </div>
        </div>
      </article>
    </template>

    <template v-else>
      <article class="admin-table-card">
        <div class="admin-card-header">
          <div>
            <h3>Task 列表</h3>
            <p class="admin-detail-card-desc">支持按状态过滤、创建 URL/文件任务，并查看任务节点执行详情。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(tasks).toLocaleString("zh-CN") }} 条</span>
        </div>

        <div class="admin-toolbar" style="margin-bottom: 16px;">
          <div class="admin-toolbar-left">
            <select v-model="taskStatus" class="admin-select" @change="handleTaskRefresh">
              <option value="">全部状态</option>
              <option value="PENDING">PENDING</option>
              <option value="RUNNING">RUNNING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleTaskRefresh">
              刷新
            </button>
            <button class="admin-button--ghost" type="button" @click="openUploadDialog()">
              上传文件
            </button>
            <button class="admin-button" type="button" @click="openTaskDialog()">
              新建任务
            </button>
          </div>
        </div>

        <div v-if="loading && taskRecords.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="taskRecords.length === 0" class="admin-empty">暂无 ingestion task</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Pipeline</th>
                <th>状态</th>
                <th>来源</th>
                <th>分块数</th>
                <th>开始时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in taskRecords" :key="item.id">
                <td class="is-code">{{ item.id }}</td>
                <td>{{ item.pipelineId || "--" }}</td>
                <td>
                  <span :class="['admin-badge', taskStatusBadgeClass(item.status)]">
                    {{ normalizeTaskStatus(item.status) || "--" }}
                  </span>
                </td>
                <td>{{ item.sourceLocation || item.sourceFileName || "--" }}</td>
                <td>{{ item.chunkCount ?? "--" }}</td>
                <td>{{ formatDateTime(item.startedAt || item.createTime) }}</td>
                <td>
                  <button class="admin-button--ghost" type="button" @click="openTaskDetail(item)">查看详情</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="admin-pagination">
          <span class="admin-page-count">第 {{ tasks.current || taskPageNo }} / {{ taskPages }} 页</span>
          <div class="admin-pagination-controls">
            <button class="admin-button--ghost" type="button" :disabled="loading || (tasks.current || taskPageNo) <= 1" @click="goTaskPrev">
              上一页
            </button>
            <button class="admin-button--ghost" type="button" :disabled="loading || (tasks.current || taskPageNo) >= taskPages" @click="goTaskNext">
              下一页
            </button>
          </div>
        </div>
      </article>
    </template>

    <div v-if="pipelineDetailDialogOpen" class="admin-dialog-overlay" @click.self="closePipelineDetail">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closePipelineDetail">&times;</button>
        <h3>Pipeline 节点</h3>
        <p>{{ pipelineDetailTarget?.name || pipelineDetailTarget?.id }}</p>
        <div v-if="pipelineDetailLoading" class="admin-empty">加载中...</div>
        <div v-else-if="!pipelineDetailTarget?.nodes?.length" class="admin-empty">暂无节点</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>节点ID</th>
                <th>类型</th>
                <th>下一节点</th>
                <th>配置</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(node, index) in pipelineDetailTarget.nodes" :key="node.id || `${node.nodeId}-${index}`">
                <td>{{ index + 1 }}</td>
                <td class="is-code">{{ node.nodeId }}</td>
                <td>{{ node.nodeType }}</td>
                <td>{{ node.nextNodeId || "-" }}</td>
                <td><pre class="admin-pre">{{ formatNodeSettings(node) }}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="pipelineDialogOpen" class="admin-dialog-overlay" @click.self="closePipelineDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closePipelineDialog">&times;</button>
        <h3>{{ pipelineDialogMode === "edit" ? "编辑 Pipeline" : "新建 Pipeline" }}</h3>
        <p>支持直接编辑 nodes 的 JSON 结构，和 frontend 一样保留完整节点配置能力。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="pipelineForm.name" class="admin-input" placeholder="请输入 pipeline 名称" />
          </div>
          <div class="admin-dialog-field">
            <label>描述</label>
            <input v-model="pipelineForm.description" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>Nodes JSON</label>
            <textarea
              v-model="pipelineForm.nodesJson"
              class="admin-textarea"
              rows="10"
              placeholder='[{"nodeId":"fetch-1","nodeType":"fetcher","settings":{}}]'
            />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closePipelineDialog">取消</button>
          <button class="admin-button" type="button" :disabled="pipelineSubmitting || !pipelineForm.name.trim()" @click="handlePipelineSubmit">
            {{ pipelineSubmitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="taskDialogOpen" class="admin-dialog-overlay" @click.self="closeTaskDialog">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeTaskDialog">&times;</button>
        <h3>新建任务</h3>
        <p>支持 file / url / feishu / s3 四类来源，文件上传任务则走独立上传入口。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>Pipeline</label>
            <select v-model="taskForm.pipelineId" class="admin-select">
              <option value="" disabled>请选择 pipeline</option>
              <option v-for="pipeline in pipelineOptions" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>来源类型</label>
            <select v-model="taskForm.sourceType" class="admin-select">
              <option value="file">file</option>
              <option value="url">url</option>
              <option value="feishu">feishu</option>
              <option value="s3">s3</option>
            </select>
          </div>
          <div v-if="taskForm.sourceType === 'file'" class="admin-dialog-field">
            <label>本地文件</label>
            <input type="file" class="admin-input" @change="handleTaskFileChange" />
          </div>
          <template v-else>
            <div class="admin-dialog-field">
              <label>来源地址</label>
              <input v-model="taskForm.location" class="admin-input" placeholder="URL / path / s3 地址" />
            </div>
            <div class="admin-dialog-field">
              <label>文件名</label>
              <input v-model="taskForm.fileName" class="admin-input" placeholder="可选" />
            </div>
            <div class="admin-dialog-field">
              <label>凭证 JSON</label>
              <textarea v-model="taskForm.credentialsJson" class="admin-textarea" rows="4" placeholder='{"token":"xxx"}' />
            </div>
          </template>
          <div class="admin-dialog-field">
            <label>元数据 JSON</label>
            <textarea v-model="taskForm.metadataJson" class="admin-textarea" rows="4" placeholder='{"source":"manual"}' />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeTaskDialog">取消</button>
          <button class="admin-button" type="button" :disabled="taskSubmitting || !taskForm.pipelineId" @click="handleCreateTask">
            {{ taskSubmitting ? "提交中..." : "提交" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="uploadDialogOpen" class="admin-dialog-overlay" @click.self="closeUploadDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <h3>上传文件</h3>
        <p>上传后会直接触发对应流水线的摄取任务。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>Pipeline</label>
            <select v-model="uploadPipelineId" class="admin-select">
              <option value="" disabled>请选择 pipeline</option>
              <option v-for="pipeline in pipelineOptions" :key="pipeline.id" :value="pipeline.id">
                {{ pipeline.name || pipeline.id }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>文件</label>
            <input type="file" class="admin-input" @change="handleUploadFileChange" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeUploadDialog">取消</button>
          <button class="admin-button" type="button" :disabled="uploadSubmitting || !uploadPipelineId || !uploadFile" @click="handleUploadSubmit">
            {{ uploadSubmitting ? "上传中..." : "上传" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">确认删除 pipeline "{{ deleteTarget?.name || deleteTarget?.id }}" 吗？</p>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDeleteDialog">取消</button>
          <button class="admin-button--danger" type="button" :disabled="deleteSubmitting" @click="handleDeletePipeline">
            {{ deleteSubmitting ? "删除中..." : "删除" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="taskDetailOpen" class="admin-dialog-overlay" @click.self="closeTaskDetail">
      <div class="admin-dialog admin-dialog--wide">
        <button class="admin-dialog-close" type="button" @click="closeTaskDetail">&times;</button>
        <h3>Task 详情</h3>
        <p>{{ taskDetailTarget?.id }} · {{ normalizeTaskStatus(taskDetailTarget?.status) }}</p>

        <div v-if="taskDetailLoading" class="admin-empty">加载中...</div>
        <div v-else>
          <div class="admin-kv" style="margin-bottom: 16px;">
            <div>
              <dt>Pipeline</dt>
              <dd>{{ taskDetailTarget?.pipelineId || "--" }}</dd>
            </div>
            <div>
              <dt>来源</dt>
              <dd>{{ taskDetailTarget?.sourceLocation || taskDetailTarget?.sourceFileName || "--" }}</dd>
            </div>
            <div>
              <dt>分块数</dt>
              <dd>{{ taskDetailTarget?.chunkCount ?? "--" }}</dd>
            </div>
            <div>
              <dt>开始时间</dt>
              <dd>{{ formatDateTime(taskDetailTarget?.startedAt || taskDetailTarget?.createTime) }}</dd>
            </div>
          </div>

          <div v-if="taskDetailTarget?.errorMessage" class="admin-notice is-error" style="margin-bottom: 16px;">
            {{ taskDetailTarget.errorMessage }}
          </div>

          <h3 style="margin-top: 0;">Task Nodes</h3>
          <div v-if="taskDetailNodes.length === 0" class="admin-empty">暂无节点数据</div>
          <div v-else class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>节点</th>
                  <th>类型</th>
                  <th>状态</th>
                  <th>耗时</th>
                  <th>消息</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="node in taskDetailNodes" :key="node.id">
                  <td class="is-code">{{ node.nodeId }}</td>
                  <td>{{ node.nodeType }}</td>
                  <td>
                    <span :class="['admin-badge', taskStatusBadgeClass(node.status)]">{{ normalizeTaskStatus(node.status) || "--" }}</span>
                  </td>
                  <td>{{ node.durationMs ?? "-" }} ms</td>
                  <td>
                    <div class="admin-list-meta">{{ node.message || node.errorMessage || "-" }}</div>
                    <pre class="admin-pre" v-if="node.output">{{ prettyJson(node.output) }}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
