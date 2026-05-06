<script setup>
import { onMounted, ref } from "vue";
import {
  createIngestionPipeline,
  createIngestionTask,
  deleteIngestionPipeline,
  getIngestionTaskNodes,
  getIngestionTasks,
  getIngestionPipelines,
  uploadIngestionTask
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const successText = ref("");
const keyword = ref("");
const taskStatus = ref("");
const pipelines = ref({ records: [], total: 0 });
const tasks = ref({ records: [], total: 0 });
const selectedTaskNodes = ref([]);
const selectedTaskId = ref("");
const uploadInputRef = ref(null);
const uploadPipelineId = ref("");

async function loadIngestion() {
  loading.value = true;
  errorText.value = "";

  try {
    const [pipelinePage, taskPage] = await Promise.all([
      getIngestionPipelines(1, 30, keyword.value),
      getIngestionTasks(1, 30, taskStatus.value)
    ]);
    pipelines.value = pipelinePage;
    tasks.value = taskPage;
  } catch (error) {
    errorText.value = error?.message || "加载 ingestion 数据失败。";
  } finally {
    loading.value = false;
  }
}

async function handleCreatePipeline() {
  const name = askText("请输入 pipeline 名称");
  if (!name) {
    return;
  }

  const description = askText("请输入 pipeline 描述", "");
  if (description === null) {
    return;
  }

  try {
    await createIngestionPipeline({ name, description, nodes: [] });
    successText.value = "Pipeline 已创建。";
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "创建 pipeline 失败。";
  }
}

async function handleDeletePipeline(item) {
  if (!confirmAction(`确认删除 pipeline“${item.name || item.id}”吗？`)) {
    return;
  }

  try {
    await deleteIngestionPipeline(item.id);
    successText.value = "Pipeline 已删除。";
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "删除 pipeline 失败。";
  }
}

async function handleCreateTask(pipelineId) {
  const location = askText("请输入 source location（URL / path）");
  if (!location) {
    return;
  }

  try {
    await createIngestionTask({
      pipelineId,
      source: {
        type: "url",
        location
      }
    });
    successText.value = "Ingestion task 已创建。";
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "创建 ingestion task 失败。";
  }
}

function triggerUpload(pipelineId) {
  uploadPipelineId.value = pipelineId;
  uploadInputRef.value?.click();
}

async function handleUploadChange(event) {
  const file = event.target?.files?.[0];
  if (!file || !uploadPipelineId.value) {
    return;
  }

  try {
    await uploadIngestionTask(uploadPipelineId.value, file);
    successText.value = "文件 ingestion task 已提交。";
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "上传 ingestion 文件失败。";
  } finally {
    uploadPipelineId.value = "";
    event.target.value = "";
  }
}

async function handleInspectTask(item) {
  selectedTaskId.value = item.id;

  try {
    selectedTaskNodes.value = await getIngestionTaskNodes(item.id);
  } catch (error) {
    errorText.value = error?.message || "加载 task nodes 失败。";
  }
}

onMounted(() => {
  void loadIngestion();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Ingestion</span>
        <h2 class="admin-page-title">摄取任务</h2>
        <p class="admin-page-subtitle">补齐 pipeline 和 task 两块管理视图，支持新建 pipeline、发起 URL / 文件摄取和查看节点执行详情。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button" type="button" @click="handleCreatePipeline">Create Pipeline</button>
        <input ref="uploadInputRef" class="admin-hidden-file" type="file" @change="handleUploadChange" />
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>
    <p v-if="successText" class="admin-notice is-success">{{ successText }}</p>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <input
              v-model="keyword"
              class="admin-input"
              type="search"
              placeholder="搜索 pipeline"
              @keydown.enter.prevent="loadIngestion"
            />
            <button class="admin-button--ghost" type="button" @click="loadIngestion">Search</button>
          </div>
          <div class="admin-page-count">{{ pageTotal(pipelines) }} pipeline(s)</div>
        </div>

        <div v-if="pageRecords(pipelines).length === 0" class="admin-empty">暂无 pipeline</div>
        <div v-else class="admin-card-list">
          <div v-for="item in pageRecords(pipelines)" :key="item.id" class="admin-card-item">
            <div class="admin-toolbar">
              <div class="admin-toolbar-left">
                <h3>{{ item.name || item.id }}</h3>
              </div>
              <div class="admin-inline-actions">
                <button class="admin-button--ghost" type="button" @click="handleCreateTask(item.id)">Run URL</button>
                <button class="admin-button--ghost" type="button" @click="triggerUpload(item.id)">Upload File</button>
                <button class="admin-button--danger" type="button" @click="handleDeletePipeline(item)">Delete</button>
              </div>
            </div>
            <p>{{ item.description || "No description" }}</p>
            <p>{{ formatDateTime(item.updateTime || item.createTime) }}</p>
          </div>
        </div>
      </article>

      <article class="admin-panel">
        <h3>Task Nodes</h3>
        <p class="admin-form-note">当前查看任务：{{ selectedTaskId || "未选择" }}</p>
        <div v-if="selectedTaskNodes.length === 0" class="admin-empty">选择右侧 task 后可查看节点详情</div>
        <pre v-else class="admin-pre">{{ JSON.stringify(selectedTaskNodes, null, 2) }}</pre>
      </article>
    </section>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <select v-model="taskStatus" class="admin-select" @change="loadIngestion">
            <option value="">All Status</option>
            <option value="PENDING">PENDING</option>
            <option value="RUNNING">RUNNING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(tasks) }} task(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadIngestion">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>

      <div v-if="pageRecords(tasks).length === 0" class="admin-empty">暂无 ingestion task</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Pipeline</th>
              <th>Status</th>
              <th>Source</th>
              <th>Chunks</th>
              <th>Started</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(tasks)" :key="item.id">
              <td class="is-code">{{ item.id }}</td>
              <td>{{ item.pipelineId || "--" }}</td>
              <td>{{ item.status || "--" }}</td>
              <td>{{ item.sourceLocation || item.sourceFileName || "--" }}</td>
              <td>{{ item.chunkCount ?? "--" }}</td>
              <td>{{ formatDateTime(item.startedAt || item.createTime) }}</td>
              <td>
                <button class="admin-button--ghost" type="button" @click="handleInspectTask(item)">Inspect</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
