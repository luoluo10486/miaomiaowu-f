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
import { getSystemSettings } from "../../services/settingsService";

const route = useRoute();
const router = useRouter();

const PIPELINE_PAGE_SIZE = 10;
const TASK_PAGE_SIZE = 10;

const NODE_TYPE_OPTIONS = [
  { value: "fetcher", label: "fetcher" },
  { value: "parser", label: "parser" },
  { value: "enhancer", label: "enhancer" },
  { value: "chunker", label: "chunker" },
  { value: "enricher", label: "enricher" },
  { value: "indexer", label: "indexer" }
];

const CHUNK_STRATEGY_OPTIONS = [
  { value: "fixed_size", label: "fixed_size" },
  { value: "structure_aware", label: "structure_aware" }
];

const ENHANCER_TASK_OPTIONS = [
  { value: "context_enhance", label: "context_enhance" },
  { value: "keywords", label: "keywords" },
  { value: "questions", label: "questions" },
  { value: "metadata", label: "metadata" }
];

const ENRICHER_TASK_OPTIONS = [
  { value: "keywords", label: "keywords" },
  { value: "summary", label: "summary" },
  { value: "metadata", label: "metadata" }
];

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
const pipelineNodeMode = ref("form");
const pipelineNodeTypeDraft = ref("fetcher");
const pipelineNodes = ref([]);

const taskDialogOpen = ref(false);
const taskDialogPipelineId = ref("");
const taskForm = ref({
  pipelineId: "",
  sourceType: "file",
  location: "",
  fileName: "",
  credentialsJson: "",
  metadataJson: ""
});
const taskFile = ref(null);
const taskSubmitting = ref(false);
const maxFileSize = ref(50 * 1024 * 1024);

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

const pipelineRecords = computed(() => pageRecords(pipelines.value));
const taskRecords = computed(() => pageRecords(tasks.value));
const latestPipeline = computed(() => pipelineRecords.value[0] || null);
const latestTask = computed(() => taskRecords.value[0] || null);
const latestPipelineNodeCount = computed(() => Number(latestPipeline.value?.nodes?.length || 0));
const latestPipelineLabel = computed(() => {
  if (!latestPipeline.value) return "--";
  return `${latestPipeline.value.name || latestPipeline.value.id || "--"} · ${latestPipelineNodeCount.value} 节点`;
});
const latestTaskLabel = computed(() => {
  if (!latestTask.value) return "--";
  return `${latestTask.value.id || "--"} · ${normalizeTaskStatus(latestTask.value.status) || "--"}`;
});

const pipelinePages = computed(() => Number(pipelines.value?.pages || 1));
const taskPages = computed(() => Number(tasks.value?.pages || 1));
const currentTabLabel = computed(() => (activeTab.value === "pipelines" ? "流水线管理" : "任务管理"));
const viewSummaryLabel = computed(() => `视图：${currentTabLabel.value} · 运行中 ${activeTaskCount.value} · 失败 ${failedTaskCount.value}`);
const pipelineModeLabel = computed(() => (pipelineNodeMode.value === "json" ? "JSON 视图" : "表单视图"));
const taskSourceTypeLabel = computed(() => String(taskForm.value.sourceType || "file").toUpperCase());
const taskDialogSourceHint = computed(() => {
  const sourceType = String(taskForm.value.sourceType || "").toLowerCase();
  if (sourceType === "file") return "本地文件会直接上传并触发任务。";
  if (sourceType === "url") return "URL 适合远程抓取和定时同步。";
  if (sourceType === "feishu") return "Feishu 需要地址和凭证 JSON。";
  if (sourceType === "s3") return "S3 适合对象存储来源。";
  return "";
});

const activeTaskCount = computed(
  () => taskRecords.value.filter((item) => normalizeTaskStatus(item.status) === "RUNNING").length
);
const failedTaskCount = computed(
  () => taskRecords.value.filter((item) => normalizeTaskStatus(item.status) === "FAILED").length
);
const taskFileSizeLabel = computed(() => formatBytes(maxFileSize.value));
const showTaskCredentials = computed(() => {
  const sourceType = String(taskForm.value.sourceType || "").toLowerCase();
  return sourceType === "url" || sourceType === "feishu";
});
const taskSourceMeta = computed(() => {
  switch (String(taskForm.value.sourceType || "").toLowerCase()) {
    case "feishu":
      return {
        locationPlaceholder: "https://open.feishu.cn/...",
        locationHint: "填写飞书文档链接",
        credentialsHint: '{"tenantAccessToken":"..."} 或 {"app_id":"...","app_secret":"..."}'
      };
    case "s3":
      return {
        locationPlaceholder: "s3://bucket/key",
        locationHint: "填写 S3 路径，例如 s3://biz/file.md",
        credentialsHint: ""
      };
    case "url":
      return {
        locationPlaceholder: "https://example.com/file.pdf",
        locationHint: "支持 http/https 链接",
        credentialsHint: '{"token":"xxx"} 或 {"Authorization":"Bearer xxx"}'
      };
    case "file":
    default:
      return {
        locationPlaceholder: "/path/to/file 或 file://path/to/file",
        locationHint: "支持本地文件路径或 file:// 协议",
        credentialsHint: ""
      };
  }
});

const pipelineStats = computed(() => [
  {
    title: "Pipelines",
    value: pageTotal(pipelines.value),
    hint: "当前页与筛选结果对应的流水线总数",
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
const ingestionHeroSummary = computed(() => [
  { label: "当前视图", value: currentTabLabel.value },
  { label: "流水线", value: String(pageTotal(pipelines.value)) },
  { label: "任务", value: String(pageTotal(tasks.value)) },
  { label: "运行中", value: String(activeTaskCount.value) },
  { label: "失败", value: String(failedTaskCount.value) }
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
    void loadUploadLimit();
  }
});

watch(uploadDialogOpen, (open) => {
  if (open) {
    uploadFile.value = null;
    void loadUploadLimit();
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
  const normalized = String(status || "").trim().toUpperCase();
  if (normalized === "SUCCESS") return "COMPLETED";
  return normalized;
}

function taskStatusBadgeClass(status) {
  const normalized = normalizeTaskStatus(status);
  if (normalized === "COMPLETED") return "is-success";
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

function formatBytes(value) {
  const size = Number(value || 0);
  if (!Number.isFinite(size) || size <= 0) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createPipelineTask(type = "context_enhance") {
  return {
    id: createLocalId(),
    type,
    systemPrompt: "",
    userPromptTemplate: ""
  };
}

function createPipelineNode(nodeType = "fetcher") {
  return {
    id: createLocalId(),
    nodeId: "",
    nodeType,
    nextNodeId: "",
    condition: "",
    chunker: {
      strategy: "structure_aware",
      chunkSize: "",
      overlapSize: "",
      separator: ""
    },
    enhancer: {
      modelId: "",
      tasks: []
    },
    enricher: {
      modelId: "",
      attachDocumentMetadata: true,
      tasks: []
    },
    parser: {
      rulesJson: ""
    },
    indexer: {
      embeddingModel: "",
      metadataFields: ""
    }
  };
}

function mapPipelineTask(task) {
  return {
    id: createLocalId(),
    type: String(task?.type || ""),
    systemPrompt: String(task?.systemPrompt || ""),
    userPromptTemplate: String(task?.userPromptTemplate || "")
  };
}

function mapPipelineNode(node) {
  const settings = node?.settings && typeof node.settings === "object" ? node.settings : {};
  const nodeType = String(node?.nodeType || "fetcher");
  const rawCondition = node?.condition;
  const tasks = Array.isArray(settings.tasks) ? settings.tasks.map(mapPipelineTask) : [];

  return {
    id: createLocalId(),
    nodeId: String(node?.nodeId || ""),
    nodeType,
    nextNodeId: String(node?.nextNodeId || ""),
    condition:
      rawCondition && typeof rawCondition === "object" ? JSON.stringify(rawCondition, null, 2) : String(rawCondition || ""),
    chunker: {
      strategy: String(settings.strategy || "structure_aware"),
      chunkSize: settings.chunkSize != null ? String(settings.chunkSize) : "",
      overlapSize: settings.overlapSize != null ? String(settings.overlapSize) : "",
      separator: String(settings.separator || "")
    },
    enhancer: {
      modelId: String(settings.modelId || ""),
      tasks: nodeType === "enhancer" ? tasks : []
    },
    enricher: {
      modelId: String(settings.modelId || ""),
      attachDocumentMetadata: settings.attachDocumentMetadata ?? true,
      tasks: nodeType === "enricher" ? tasks : []
    },
    parser: {
      rulesJson: Array.isArray(settings.rules) ? JSON.stringify(settings.rules, null, 2) : ""
    },
    indexer: {
      embeddingModel: String(settings.embeddingModel || ""),
      metadataFields: Array.isArray(settings.metadataFields) ? settings.metadataFields.join(", ") : ""
    }
  };
}

function parsePipelineCondition(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  return trimmed;
}

function parsePipelineRules(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed);
  if (Array.isArray(parsed)) {
    return { rules: parsed };
  }
  if (parsed && typeof parsed === "object" && Array.isArray(parsed.rules)) {
    return { rules: parsed.rules };
  }
  throw new Error("解析规则必须是数组或包含 rules 字段的对象。");
}

function buildNodeSettings(node) {
  switch (node.nodeType) {
    case "chunker": {
      if (!node.chunker.strategy) {
        throw new Error("分块节点需要选择 strategy。");
      }
      const chunkSize = node.chunker.chunkSize.trim();
      const overlapSize = node.chunker.overlapSize.trim();
      const chunkSizeValue = chunkSize ? Number(chunkSize) : undefined;
      const overlapSizeValue = overlapSize ? Number(overlapSize) : undefined;
      if (chunkSizeValue !== undefined && Number.isNaN(chunkSizeValue)) {
        throw new Error("chunkSize 必须是数字。");
      }
      if (overlapSizeValue !== undefined && Number.isNaN(overlapSizeValue)) {
        throw new Error("overlapSize 必须是数字。");
      }
      return {
        strategy: node.chunker.strategy,
        chunkSize: chunkSizeValue,
        overlapSize: overlapSizeValue,
        separator: node.chunker.separator.trim() || undefined
      };
    }
    case "enhancer": {
      const tasks = node.enhancer.tasks
        .filter((task) => task.type)
        .map((task) => ({
          type: task.type,
          systemPrompt: task.systemPrompt.trim() || undefined,
          userPromptTemplate: task.userPromptTemplate.trim() || undefined
        }));
      const payload = {};
      if (node.enhancer.modelId.trim()) {
        payload.modelId = node.enhancer.modelId.trim();
      }
      if (tasks.length > 0) {
        payload.tasks = tasks;
      }
      return Object.keys(payload).length ? payload : undefined;
    }
    case "enricher": {
      const tasks = node.enricher.tasks
        .filter((task) => task.type)
        .map((task) => ({
          type: task.type,
          systemPrompt: task.systemPrompt.trim() || undefined,
          userPromptTemplate: task.userPromptTemplate.trim() || undefined
        }));
      const payload = {
        attachDocumentMetadata: node.enricher.attachDocumentMetadata
      };
      if (node.enricher.modelId.trim()) {
        payload.modelId = node.enricher.modelId.trim();
      }
      if (tasks.length > 0) {
        payload.tasks = tasks;
      }
      return payload;
    }
    case "parser":
      if (!node.parser.rulesJson.trim()) {
        return undefined;
      }
      return parsePipelineRules(node.parser.rulesJson);
    case "indexer": {
      const fields = node.indexer.metadataFields
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const payload = {};
      if (node.indexer.embeddingModel.trim()) {
        payload.embeddingModel = node.indexer.embeddingModel.trim();
      }
      if (fields.length > 0) {
        payload.metadataFields = fields;
      }
      return Object.keys(payload).length ? payload : undefined;
    }
    case "fetcher":
    default:
      return undefined;
  }
}

function buildPipelineNodesPayload(sourceNodes) {
  const result = [];
  for (const node of sourceNodes) {
    const nodeId = String(node.nodeId || "").trim();
    const nodeType = String(node.nodeType || "").trim();
    if (!nodeId) {
      return { ok: false, message: "节点 ID 不能为空。" };
    }
    if (!nodeType) {
      return { ok: false, message: "节点类型不能为空。" };
    }

    let settings;
    let condition;
    try {
      settings = buildNodeSettings(node);
      condition = parsePipelineCondition(node.condition);
    } catch (error) {
      return { ok: false, message: error?.message || "节点配置错误。" };
    }

    result.push({
      nodeId,
      nodeType,
      settings: settings ?? null,
      condition: condition ?? null,
      nextNodeId: String(node.nextNodeId || "").trim() || null
    });
  }

  return { ok: true, nodes: result };
}

function parsePipelineNodesJson(raw) {
  const text = String(raw || "").trim();
  if (!text) return { ok: true, nodes: [] };
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      return { ok: false, message: "节点配置必须是 JSON 数组。" };
    }
    return { ok: true, nodes: parsed.map((item) => mapPipelineNode(item)) };
  } catch {
    return { ok: false, message: "节点配置 JSON 格式错误。" };
  }
}

function syncPipelineMode(nextMode) {
  if (nextMode === pipelineNodeMode.value) return;
  if (nextMode === "json") {
    const result = buildPipelineNodesPayload(pipelineNodes.value);
    if (!result.ok) {
      errorText.value = result.message;
      return;
    }
    pipelineForm.value.nodesJson = JSON.stringify(result.nodes, null, 2);
    pipelineNodeMode.value = "json";
    return;
  }

  const parsed = parsePipelineNodesJson(pipelineForm.value.nodesJson);
  if (!parsed.ok) {
    errorText.value = parsed.message;
    return;
  }
  pipelineNodes.value = parsed.nodes;
  pipelineNodeMode.value = "form";
}

function addPipelineNode(nodeType = pipelineNodeTypeDraft.value) {
  pipelineNodes.value.push(createPipelineNode(nodeType));
}

function removePipelineNode(nodeId) {
  pipelineNodes.value = pipelineNodes.value.filter((node) => node.id !== nodeId);
}

function addPipelineTask(node, scope = "enhancer") {
  const nextTask = createPipelineTask(scope === "enricher" ? "keywords" : "context_enhance");
  if (scope === "enricher") {
    node.enricher.tasks.push(nextTask);
    return;
  }
  node.enhancer.tasks.push(nextTask);
}

async function loadUploadLimit() {
  try {
    const settings = await getSystemSettings();
    const maxSize = Number(settings?.upload?.maxFileSize || 0);
    if (Number.isFinite(maxSize) && maxSize > 0) {
      maxFileSize.value = maxSize;
    }
  } catch {
    // Keep the local fallback when system settings are unavailable.
  }
}

function resetPipelineForm(item = null) {
  pipelineTarget.value = item;
  pipelineForm.value = {
    name: item?.name || "",
    description: item?.description || "",
    nodesJson: item?.nodes?.length ? JSON.stringify(item.nodes, null, 2) : ""
  };
  pipelineNodes.value = item?.nodes?.length ? item.nodes.map((node) => mapPipelineNode(node)) : [];
  pipelineNodeMode.value = "form";
  pipelineNodeTypeDraft.value = "fetcher";
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

async function handlePipelineSubmit() {
  const name = pipelineForm.value.name.trim();
  if (!name) return;

  pipelineSubmitting.value = true;
  errorText.value = "";

  try {
    let nodes = [];
    if (pipelineNodeMode.value === "json") {
      const parsed = parsePipelineNodesJson(pipelineForm.value.nodesJson);
      if (!parsed.ok) {
        throw new Error(parsed.message);
      }
      const result = buildPipelineNodesPayload(parsed.nodes);
      if (!result.ok) {
        throw new Error(result.message);
      }
      nodes = result.nodes;
    } else {
      const result = buildPipelineNodesPayload(pipelineNodes.value);
      if (!result.ok) {
        throw new Error(result.message);
      }
      nodes = result.nodes;
      pipelineForm.value.nodesJson = JSON.stringify(nodes, null, 2);
    }
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
    sourceType: "file",
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
      if (Number(taskFile.value.size || 0) > maxFileSize.value) {
        throw new Error(`上传文件大小超过限制，最大允许 ${taskFileSizeLabel.value}。`);
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

async function handleUploadSubmit() {
  if (!uploadPipelineId.value) {
    errorText.value = "请选择流水线。";
    return;
  }
  if (!uploadFile.value) {
    errorText.value = "请选择文件。";
    return;
  }
  if (Number(uploadFile.value.size || 0) > maxFileSize.value) {
    errorText.value = `上传文件大小超过限制，最大允许 ${taskFileSizeLabel.value}。`;
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
  <section class="admin-page admin-ingestion">
    <PageHeader
      tag="Ingestion"
      title="数据通道"
      description="对齐 frontend 的后台摄取管理结构，集中管理 pipeline、任务创建、文件上传和任务节点执行详情。"
    >
      <template #meta>
        <div class="admin-page-header-meta">
          <span class="admin-badge is-muted">视图：{{ currentTabLabel }}</span>
          <span class="admin-badge is-muted">流水线：{{ pageTotal(pipelines).toLocaleString("zh-CN") }}</span>
          <span class="admin-badge is-muted">任务：{{ pageTotal(tasks).toLocaleString("zh-CN") }}</span>
          <span class="admin-badge is-muted">运行中：{{ activeTaskCount }}</span>
          <span class="admin-badge is-muted">失败：{{ failedTaskCount }}</span>
          <span class="admin-badge is-muted">{{ viewSummaryLabel }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="loadIngestion">刷新</button>
        <button class="admin-button--ghost" type="button" @click="openUploadDialog()">上传文件</button>
        <button class="admin-button" type="button" @click="openPipelineDialog('create')">新建流水线</button>
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

    <section class="admin-detail-card ingestion-hero">
      <div class="ingestion-hero-copy">
        <p class="trace-hero-tag">Data Flow</p>
        <h2>Pipeline / Task / Upload 一体化管理</h2>
        <p>围绕知识库摄取链路，统一查看流水线、任务、文件上传和节点执行详情。</p>
      </div>
      <div class="ingestion-hero-actions" role="tablist" aria-label="Ingestion views">
        <button
          class="ingestion-tab"
          :class="{ 'is-active': activeTab === 'pipelines' }"
          type="button"
          @click="setTab('pipelines')"
        >
          流水线管理
        </button>
        <button
          class="ingestion-tab"
          :class="{ 'is-active': activeTab === 'tasks' }"
          type="button"
          @click="setTab('tasks')"
        >
          任务管理
        </button>
      </div>
      <div class="ingestion-hero-side">
        <div class="ingestion-hero-cardline">
          <span class="ingestion-hero-cardlabel">当前视图</span>
          <strong>{{ currentTabLabel }}</strong>
        </div>
        <div class="ingestion-hero-cardline">
          <span class="ingestion-hero-cardlabel">最新流水线</span>
          <strong>{{ latestPipelineLabel }}</strong>
        </div>
        <div class="ingestion-hero-cardline">
          <span class="ingestion-hero-cardlabel">最新任务</span>
          <strong>{{ latestTaskLabel }}</strong>
        </div>
        <div class="ingestion-hero-cardline">
          <span class="ingestion-hero-cardlabel">上传限制</span>
          <strong>{{ taskFileSizeLabel }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-detail-card ingestion-summary">
      <div class="ingestion-summary__copy">
        <p class="trace-hero-tag">Ingestion Summary</p>
        <h2>数据通道概览</h2>
        <p>对齐 frontend 的 ingestion 页，先显示当前视图与任务态，再进入流水线、任务和详情弹窗。</p>
      </div>
      <div class="ingestion-summary__grid">
        <div v-for="item in ingestionHeroSummary" :key="item.label" class="ingestion-summary__item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-split ingestion-layout">
      <div class="ingestion-main">
        <article v-if="activeTab === 'pipelines'" class="admin-table-card">
          <div class="admin-table-card__header">
            <div>
              <h2>Pipeline 列表</h2>
              <p>支持搜索、编辑、节点预览、任务创建、文件上传和删除。</p>
            </div>
            <span class="admin-page-count">共 {{ pageTotal(pipelines).toLocaleString("zh-CN") }} 条</span>
          </div>

          <div class="admin-toolbar">
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
              <button class="admin-button" type="button" @click="openPipelineDialog('create')">新建 Pipeline</button>
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

        <article v-else class="admin-table-card">
          <div class="admin-table-card__header">
            <div>
              <h2>Task 列表</h2>
              <p>支持按状态过滤、创建 URL / 文件任务，并查看任务节点执行详情。</p>
            </div>
            <span class="admin-page-count">共 {{ pageTotal(tasks).toLocaleString("zh-CN") }} 条</span>
          </div>

          <div class="admin-toolbar">
            <div class="admin-toolbar-left">
              <select v-model="taskStatus" class="admin-select" @change="handleTaskRefresh">
                <option value="">全部状态</option>
                <option value="PENDING">PENDING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="FAILED">FAILED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div class="admin-toolbar-right">
              <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleTaskRefresh">刷新</button>
              <button class="admin-button--ghost" type="button" @click="openUploadDialog()">上传文件</button>
              <button class="admin-button" type="button" @click="openTaskDialog()">新建任务</button>
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
      </div>

      <aside class="ingestion-aside">
        <article class="admin-detail-card">
          <h3>运行概览</h3>
          <p class="admin-detail-card-desc">关注流水线总量、任务状态和最近入口。</p>
          <div class="admin-kv">
            <div><dt>Pipeline 总数</dt><dd>{{ pageTotal(pipelines).toLocaleString("zh-CN") }}</dd></div>
            <div><dt>Task 总数</dt><dd>{{ pageTotal(tasks).toLocaleString("zh-CN") }}</dd></div>
            <div><dt>Running</dt><dd>{{ activeTaskCount }}</dd></div>
            <div><dt>Failed</dt><dd>{{ failedTaskCount }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>来源类型</h3>
          <p class="admin-detail-card-desc">任务创建支持 file、url、feishu 与 s3。</p>
          <div class="admin-card-list">
            <div class="admin-card-item">
              <h3>file</h3>
              <p>本地文件直传，适合快速导入。</p>
            </div>
            <div class="admin-card-item">
              <h3>url</h3>
              <p>远程链接抓取，支持 http / https。</p>
            </div>
            <div class="admin-card-item">
              <h3>feishu / s3</h3>
              <p>适合文档平台和对象存储来源。</p>
            </div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>节点类型</h3>
          <p class="admin-detail-card-desc">Pipeline 编辑器覆盖常见摄取节点。</p>
          <div class="admin-card-list">
            <div v-for="option in NODE_TYPE_OPTIONS" :key="option.value" class="admin-card-item">
              <h3>{{ option.label }}</h3>
              <p>
                {{
                  option.value === "fetcher"
                    ? "源数据抓取入口"
                    : option.value === "parser"
                      ? "内容解析与规则处理"
                      : option.value === "chunker"
                        ? "分块策略与窗口控制"
                        : option.value === "enhancer"
                          ? "内容增强与任务编排"
                          : option.value === "enricher"
                            ? "元数据补充与富集"
                            : "向量索引前处理"
                }}
              </p>
            </div>
          </div>
        </article>
      </aside>
    </section>

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
      <div class="admin-dialog admin-dialog--wide ingestion-dialog">
        <button class="admin-dialog-close" type="button" @click="closePipelineDialog">&times;</button>
        <div class="admin-dialog-header-stack">
          <h3>{{ pipelineDialogMode === "edit" ? "编辑 Pipeline" : "新建 Pipeline" }}</h3>
          <p>对齐 frontend 的双模式节点编辑器，可在表单视图和 JSON 视图之间切换。</p>
          <div class="ingestion-dialog-chips">
            <span class="admin-badge is-muted">模式：{{ pipelineModeLabel }}</span>
            <span class="admin-badge is-muted">节点：{{ pipelineNodes.length }}</span>
            <span class="admin-badge is-muted">JSON：{{ pipelineForm.nodesJson ? '已填写' : '空' }}</span>
          </div>
        </div>

        <div class="ingestion-dialog-layout">
          <div class="admin-dialog-body ingestion-dialog-main">
            <div class="admin-dialog-field">
              <label>名称</label>
              <input v-model="pipelineForm.name" class="admin-input" placeholder="请输入 pipeline 名称" />
            </div>
            <div class="admin-dialog-field">
              <label>描述</label>
              <input v-model="pipelineForm.description" class="admin-input" placeholder="可选" />
            </div>

            <div class="ingestion-dialog-section">
              <div class="admin-toolbar">
                <div class="admin-toolbar-left">
                  <span class="admin-page-count">节点配置</span>
                </div>
                <div class="admin-toolbar-right">
                  <button class="admin-button--ghost" type="button" @click="syncPipelineMode('form')">表单配置</button>
                  <button class="admin-button--ghost" type="button" @click="syncPipelineMode('json')">JSON 配置</button>
                </div>
              </div>

              <div v-if="pipelineNodeMode === 'json'" class="admin-dialog-field">
                <label>Nodes JSON</label>
                <textarea
                  v-model="pipelineForm.nodesJson"
                  class="admin-textarea"
                  rows="12"
                  placeholder='[{"nodeId":"fetch-1","nodeType":"fetcher","settings":{}}]'
                />
                <p class="admin-page-count">可以直接编辑 nodes JSON 数组，保存时会自动校验。</p>
              </div>

              <template v-else>
                <div v-if="pipelineNodes.length === 0" class="admin-empty">暂无节点，请先添加节点配置</div>

                <article v-for="(node, index) in pipelineNodes" :key="node.id" class="admin-detail-card ingestion-node-card">
                  <div class="admin-toolbar">
                    <div class="admin-toolbar-left">
                      <span class="admin-page-count">节点 {{ index + 1 }}</span>
                      <span class="admin-badge is-muted">{{ node.nodeType }}</span>
                    </div>
                    <div class="admin-toolbar-right">
                      <button class="admin-button--ghost" type="button" @click="removePipelineNode(node.id)">删除节点</button>
                    </div>
                  </div>

                  <div class="admin-info-grid is-2">
                    <div class="admin-dialog-field">
                      <label>节点 ID</label>
                      <input v-model="node.nodeId" class="admin-input" placeholder="例如：fetch-1" />
                    </div>
                    <div class="admin-dialog-field">
                      <label>节点类型</label>
                      <select v-model="node.nodeType" class="admin-select">
                        <option v-for="option in NODE_TYPE_OPTIONS" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                    <div class="admin-dialog-field">
                      <label>下一节点 ID</label>
                      <input v-model="node.nextNodeId" class="admin-input" placeholder="例如：parse-1" />
                    </div>
                    <div class="admin-dialog-field">
                      <label>条件（可选）</label>
                      <textarea v-model="node.condition" class="admin-textarea" rows="3" placeholder='{"if":"..."}' />
                    </div>
                  </div>

                  <div v-if="node.nodeType === 'parser'" class="admin-dialog-field ingestion-subsection">
                    <label>解析规则（JSON）</label>
                    <textarea v-model="node.parser.rulesJson" class="admin-textarea" rows="4" placeholder='[{"mimeType":"PDF","options":{}}]' />
                  </div>

                  <div v-if="node.nodeType === 'chunker'" class="admin-info-grid is-2 ingestion-subsection">
                    <div class="admin-dialog-field">
                      <label>分块策略</label>
                      <select v-model="node.chunker.strategy" class="admin-select">
                        <option v-for="option in CHUNK_STRATEGY_OPTIONS" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                    <div class="admin-dialog-field">
                      <label>Chunk Size</label>
                      <input v-model="node.chunker.chunkSize" class="admin-input" type="number" placeholder="例如：512" />
                    </div>
                    <div class="admin-dialog-field">
                      <label>Overlap Size</label>
                      <input v-model="node.chunker.overlapSize" class="admin-input" type="number" placeholder="例如：128" />
                    </div>
                    <div class="admin-dialog-field">
                      <label>自定义分隔符</label>
                      <input v-model="node.chunker.separator" class="admin-input" placeholder="可选" />
                    </div>
                  </div>

                  <div v-if="node.nodeType === 'enhancer'" class="ingestion-subsection">
                    <div class="admin-info-grid is-2">
                      <div class="admin-dialog-field">
                        <label>模型 ID</label>
                        <input v-model="node.enhancer.modelId" class="admin-input" placeholder="可选" />
                      </div>
                    </div>
                    <div class="admin-toolbar">
                      <div class="admin-toolbar-left">
                        <span class="admin-page-count">增强任务</span>
                      </div>
                      <div class="admin-toolbar-right">
                        <button class="admin-button--ghost" type="button" @click="addPipelineTask(node, 'enhancer')">添加任务</button>
                      </div>
                    </div>
                    <div v-if="node.enhancer.tasks.length === 0" class="admin-empty">暂无任务</div>
                    <template v-else>
                      <div v-for="(nodeTask, taskIndex) in node.enhancer.tasks" :key="nodeTask.id" class="admin-detail-card ingestion-task-card">
                        <div class="admin-toolbar">
                          <div class="admin-toolbar-left">
                            <span class="admin-page-count">任务 {{ taskIndex + 1 }}</span>
                          </div>
                          <div class="admin-toolbar-right">
                            <button
                              class="admin-button--ghost"
                              type="button"
                              @click="node.enhancer.tasks = node.enhancer.tasks.filter((item) => item.id !== nodeTask.id)"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                        <div class="admin-info-grid is-2">
                          <div class="admin-dialog-field">
                            <label>任务类型</label>
                            <select v-model="nodeTask.type" class="admin-select">
                              <option v-for="option in ENHANCER_TASK_OPTIONS" :key="option.value" :value="option.value">
                                {{ option.label }}
                              </option>
                            </select>
                          </div>
                          <div class="admin-dialog-field">
                            <label>System Prompt</label>
                            <textarea v-model="nodeTask.systemPrompt" class="admin-textarea" rows="3" placeholder="可选" />
                          </div>
                          <div class="admin-dialog-field" style="grid-column: 1 / -1;">
                            <label>User Prompt 模板</label>
                            <textarea v-model="nodeTask.userPromptTemplate" class="admin-textarea" rows="3" placeholder="可选" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>

                  <div v-if="node.nodeType === 'enricher'" class="ingestion-subsection">
                    <div class="admin-info-grid is-2">
                      <div class="admin-dialog-field">
                        <label>模型 ID</label>
                        <input v-model="node.enricher.modelId" class="admin-input" placeholder="可选" />
                      </div>
                      <div class="admin-dialog-field">
                        <label>附加文档元数据</label>
                        <select
                          class="admin-select"
                          :value="node.enricher.attachDocumentMetadata ? 'true' : 'false'"
                          @change="node.enricher.attachDocumentMetadata = $event.target.value === 'true'"
                        >
                          <option value="true">是</option>
                          <option value="false">否</option>
                        </select>
                      </div>
                    </div>
                    <div class="admin-toolbar">
                      <div class="admin-toolbar-left">
                        <span class="admin-page-count">富集任务</span>
                      </div>
                      <div class="admin-toolbar-right">
                        <button class="admin-button--ghost" type="button" @click="addPipelineTask(node, 'enricher')">添加任务</button>
                      </div>
                    </div>
                    <div v-if="node.enricher.tasks.length === 0" class="admin-empty">暂无任务</div>
                    <template v-else>
                      <div v-for="(nodeTask, taskIndex) in node.enricher.tasks" :key="nodeTask.id" class="admin-detail-card ingestion-task-card">
                        <div class="admin-toolbar">
                          <div class="admin-toolbar-left">
                            <span class="admin-page-count">任务 {{ taskIndex + 1 }}</span>
                          </div>
                          <div class="admin-toolbar-right">
                            <button
                              class="admin-button--ghost"
                              type="button"
                              @click="node.enricher.tasks = node.enricher.tasks.filter((item) => item.id !== nodeTask.id)"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                        <div class="admin-info-grid is-2">
                          <div class="admin-dialog-field">
                            <label>任务类型</label>
                            <select v-model="nodeTask.type" class="admin-select">
                              <option v-for="option in ENRICHER_TASK_OPTIONS" :key="option.value" :value="option.value">
                                {{ option.label }}
                              </option>
                            </select>
                          </div>
                          <div class="admin-dialog-field">
                            <label>System Prompt</label>
                            <textarea v-model="nodeTask.systemPrompt" class="admin-textarea" rows="3" placeholder="可选" />
                          </div>
                          <div class="admin-dialog-field" style="grid-column: 1 / -1;">
                            <label>User Prompt 模板</label>
                            <textarea v-model="nodeTask.userPromptTemplate" class="admin-textarea" rows="3" placeholder="可选" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>

                  <div v-if="node.nodeType === 'indexer'" class="admin-info-grid is-2 ingestion-subsection">
                    <div class="admin-dialog-field">
                      <label>Embedding Model</label>
                      <input v-model="node.indexer.embeddingModel" class="admin-input" placeholder="可选" />
                    </div>
                    <div class="admin-dialog-field">
                      <label>Metadata Fields</label>
                      <input v-model="node.indexer.metadataFields" class="admin-input" placeholder="逗号分隔，例如 title, author" />
                    </div>
                  </div>
                </article>

                <div class="admin-toolbar ingestion-node-footer">
                  <div class="admin-toolbar-left">
                    <select v-model="pipelineNodeTypeDraft" class="admin-select">
                      <option v-for="option in NODE_TYPE_OPTIONS" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="admin-toolbar-right">
                    <button class="admin-button--ghost" type="button" @click="addPipelineNode(pipelineNodeTypeDraft)">添加节点</button>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <aside class="ingestion-dialog-aside">
            <article class="admin-detail-card">
              <h3>编辑概览</h3>
              <p class="admin-detail-card-desc">参考页会把当前对象信息放在右侧，方便在编辑时随时核对。</p>
              <div class="admin-kv admin-kv--compact">
                <div><dt>名称</dt><dd>{{ pipelineForm.name || "--" }}</dd></div>
                <div><dt>节点数</dt><dd>{{ pipelineNodes.length }}</dd></div>
                <div><dt>当前模式</dt><dd>{{ pipelineModeLabel }}</dd></div>
                <div><dt>JSON 状态</dt><dd>{{ pipelineForm.nodesJson ? "已填写" : "未填写" }}</dd></div>
              </div>
            </article>
            <article class="admin-detail-card">
              <h3>节点提示</h3>
              <p class="admin-detail-card-desc">节点类型切换后，面板会自动显示对应配置块。</p>
              <div class="admin-card-list">
                <div v-for="option in NODE_TYPE_OPTIONS" :key="option.value" class="admin-card-item">
                  <h3>{{ option.label }}</h3>
                  <p>
                    {{
                      option.value === "fetcher"
                        ? "源数据抓取入口"
                        : option.value === "parser"
                          ? "内容解析与规则处理"
                          : option.value === "chunker"
                            ? "分块策略与窗口控制"
                            : option.value === "enhancer"
                              ? "内容增强与任务编排"
                              : option.value === "enricher"
                                ? "元数据补充与富集"
                                : "向量索引前处理"
                    }}
                  </p>
                </div>
              </div>
            </article>
          </aside>
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
      <div class="admin-dialog admin-dialog--wide ingestion-dialog">
        <button class="admin-dialog-close" type="button" @click="closeTaskDialog">&times;</button>
        <div class="admin-dialog-header-stack">
          <h3>新建任务</h3>
          <p>支持 file / url / feishu / s3 四类来源，本地文件会直接上传，限制为 {{ taskFileSizeLabel }}。</p>
          <div class="ingestion-dialog-chips">
            <span class="admin-badge is-muted">Pipeline：{{ taskForm.pipelineId || "--" }}</span>
            <span class="admin-badge is-muted">来源：{{ taskSourceTypeLabel }}</span>
            <span class="admin-badge is-muted">文件上限：{{ taskFileSizeLabel }}</span>
          </div>
        </div>

        <div class="ingestion-dialog-layout">
          <div class="admin-dialog-body ingestion-dialog-main">
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
            <div v-if="taskForm.sourceType === 'file'" class="ingestion-subsection">
              <div class="admin-dialog-field">
                <label>本地文件</label>
                <input type="file" class="admin-input" @change="handleTaskFileChange" />
                <p class="admin-page-count">上传大小上限 {{ taskFileSizeLabel }}</p>
              </div>
            </div>
            <template v-else>
              <div class="ingestion-subsection">
                <div class="admin-dialog-field">
                  <label>来源地址</label>
                  <input v-model="taskForm.location" class="admin-input" :placeholder="taskSourceMeta.locationPlaceholder" />
                  <p class="admin-page-count">{{ taskSourceMeta.locationHint }}</p>
                </div>
                <div class="admin-dialog-field">
                  <label>文件名</label>
                  <input v-model="taskForm.fileName" class="admin-input" placeholder="可选" />
                </div>
                <div v-if="showTaskCredentials" class="admin-dialog-field">
                  <label>凭证 JSON</label>
                  <textarea
                    v-model="taskForm.credentialsJson"
                    class="admin-textarea"
                    rows="4"
                    :placeholder="taskSourceMeta.credentialsHint || '{&quot;token&quot;:&quot;xxx&quot;}'"
                  />
                </div>
              </div>
            </template>
            <div class="admin-dialog-field">
              <label>元数据 JSON</label>
              <textarea v-model="taskForm.metadataJson" class="admin-textarea" rows="4" placeholder='{"source":"manual"}' />
            </div>
          </div>

          <aside class="ingestion-dialog-aside">
            <article class="admin-detail-card">
              <h3>创建说明</h3>
              <p class="admin-detail-card-desc">{{ taskDialogSourceHint }}</p>
              <div class="admin-kv admin-kv--compact">
                <div><dt>当前来源</dt><dd>{{ taskSourceTypeLabel }}</dd></div>
                <div><dt>是否文件</dt><dd>{{ taskForm.sourceType === 'file' ? '是' : '否' }}</dd></div>
                <div><dt>凭证区</dt><dd>{{ showTaskCredentials ? '显示' : '隐藏' }}</dd></div>
              </div>
            </article>
            <article class="admin-detail-card">
              <h3>来源参考</h3>
              <div class="admin-card-list">
                <div class="admin-card-item">
                  <h3>file</h3>
                  <p>本地文件直传，适合快速导入。</p>
                </div>
                <div class="admin-card-item">
                  <h3>url</h3>
                  <p>远程链接抓取，支持 http / https。</p>
                </div>
                <div class="admin-card-item">
                  <h3>feishu / s3</h3>
                  <p>适合文档平台和对象存储来源。</p>
                </div>
              </div>
            </article>
          </aside>
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
      <div class="admin-dialog ingestion-dialog">
        <button class="admin-dialog-close" type="button" @click="closeUploadDialog">&times;</button>
        <div class="admin-dialog-header-stack">
          <h3>上传文件</h3>
          <p>上传后会直接触发对应流水线的摄取任务，文件限制为 {{ taskFileSizeLabel }}。</p>
          <div class="ingestion-dialog-chips">
            <span class="admin-badge is-muted">Pipeline：{{ uploadPipelineId || "--" }}</span>
            <span class="admin-badge is-muted">限制：{{ taskFileSizeLabel }}</span>
          </div>
        </div>
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
      <div class="admin-dialog admin-dialog--wide ingestion-dialog">
        <button class="admin-dialog-close" type="button" @click="closeTaskDetail">&times;</button>
        <div class="admin-dialog-header-stack">
          <h3>Task 详情</h3>
          <p>{{ taskDetailTarget?.id }} · {{ normalizeTaskStatus(taskDetailTarget?.status) }}</p>
          <div class="ingestion-dialog-chips">
            <span class="admin-badge is-muted">Pipeline：{{ taskDetailTarget?.pipelineId || "--" }}</span>
            <span class="admin-badge is-muted">来源：{{ taskDetailTarget?.sourceType || "--" }}</span>
            <span class="admin-badge is-muted">分块数：{{ taskDetailTarget?.chunkCount ?? "--" }}</span>
          </div>
        </div>

        <div v-if="taskDetailLoading" class="admin-empty">加载中...</div>
        <div v-else class="ingestion-task-detail">
          <section class="ingestion-task-detail__summary">
            <div class="admin-kv admin-kv--compact">
              <div><dt>Pipeline</dt><dd>{{ taskDetailTarget?.pipelineId || "--" }}</dd></div>
              <div><dt>来源</dt><dd>{{ taskDetailTarget?.sourceLocation || taskDetailTarget?.sourceFileName || "--" }}</dd></div>
              <div><dt>来源类型</dt><dd>{{ taskDetailTarget?.sourceType || "--" }}</dd></div>
              <div><dt>分块数</dt><dd>{{ taskDetailTarget?.chunkCount ?? "--" }}</dd></div>
              <div><dt>开始时间</dt><dd>{{ formatDateTime(taskDetailTarget?.startedAt || taskDetailTarget?.createTime) }}</dd></div>
              <div><dt>结束时间</dt><dd>{{ formatDateTime(taskDetailTarget?.completedAt) }}</dd></div>
            </div>

            <div v-if="taskDetailTarget?.errorMessage" class="admin-notice is-error">
              {{ taskDetailTarget.errorMessage }}
            </div>

            <div v-if="taskDetailTarget?.metadata" class="admin-dialog-field">
              <label>Metadata</label>
              <pre class="admin-pre">{{ prettyJson(taskDetailTarget.metadata) }}</pre>
            </div>
          </section>

          <section class="ingestion-task-detail__nodes">
            <div class="admin-toolbar" style="margin-bottom: 12px;">
              <div class="admin-toolbar-left">
                <span class="admin-page-count">Task Nodes</span>
              </div>
            </div>
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
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ingestion-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background:
    radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.88));
  box-shadow: var(--admin-shadow);
}

.ingestion-hero-copy {
  display: grid;
  gap: 8px;
}

.ingestion-hero-copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.ingestion-hero-copy p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.ingestion-hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.ingestion-hero-side {
  display: grid;
  gap: 12px;
  min-width: 220px;
  padding: 14px 16px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.76);
}

.ingestion-hero-cardline {
  display: grid;
  gap: 4px;
}

.ingestion-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ingestion-hero-cardline strong {
  color: var(--admin-ink);
  font-size: 14px;
  word-break: break-word;
}

.ingestion-summary {
  display: grid;
  gap: 16px;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.06), transparent 22%),
    rgba(255, 255, 255, 0.92);
  box-shadow: var(--admin-shadow);
}

.ingestion-summary__copy {
  display: grid;
  gap: 8px;
}

.ingestion-summary__copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.ingestion-summary__copy p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.ingestion-summary__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.ingestion-summary__item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.ingestion-summary__item span {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ingestion-summary__item strong {
  color: var(--admin-ink);
  font-size: 15px;
  word-break: break-word;
}

.trace-hero-tag {
  margin: 0;
  color: var(--admin-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.ingestion-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--admin-line);
  border-radius: 999px;
  background: var(--admin-bg-soft);
  color: var(--admin-ink-soft);
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s ease;
}

.ingestion-tab.is-active {
  border-color: var(--admin-accent);
  background: var(--admin-accent);
  color: #fff;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.18);
}

.ingestion-layout {
  align-items: start;
  margin-top: 2px;
}

.ingestion-main {
  display: grid;
  gap: 16px;
}

.ingestion-aside {
  display: grid;
  gap: 16px;
  position: sticky;
  top: 16px;
  align-self: start;
}

.admin-page-header-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ingestion-dialog {
  display: grid;
  gap: 16px;
}

.admin-dialog-header-stack {
  display: grid;
  gap: 8px;
  padding-right: 24px;
}

.admin-dialog-header-stack h3 {
  margin: 0;
}

.admin-dialog-header-stack p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.ingestion-dialog-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingestion-dialog-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  align-items: start;
}

.ingestion-dialog-main {
  display: grid;
  gap: 14px;
}

.ingestion-dialog-aside {
  display: grid;
  gap: 16px;
  position: sticky;
  top: 16px;
  align-self: start;
}

.ingestion-dialog-section {
  display: grid;
  gap: 12px;
}

.ingestion-node-card {
  display: grid;
  gap: 14px;
}

.ingestion-task-card {
  display: grid;
  gap: 12px;
}

.ingestion-subsection {
  display: grid;
  gap: 12px;
  padding-top: 4px;
}

.ingestion-node-footer {
  margin-top: 8px;
}

.ingestion-task-detail {
  display: grid;
  gap: 16px;
}

.ingestion-task-detail__summary,
.ingestion-task-detail__nodes {
  display: grid;
  gap: 14px;
}

@media (max-width: 960px) {
  .ingestion-hero {
    grid-template-columns: 1fr;
  }

  .ingestion-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ingestion-layout {
    grid-template-columns: 1fr;
  }

  .ingestion-aside {
    position: static;
  }

  .ingestion-hero-side {
    min-width: 0;
  }

  .ingestion-dialog-layout {
    grid-template-columns: 1fr;
  }

  .ingestion-dialog-aside {
    position: static;
  }
}

@media (max-width: 1100px) {
  .ingestion-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
