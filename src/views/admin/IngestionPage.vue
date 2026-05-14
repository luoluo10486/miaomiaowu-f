<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createIngestionPipeline,
  createIngestionTask,
  deleteIngestionPipeline,
  getIngestionTaskNodes,
  getIngestionTasks,
  getIngestionPipelines,
  updateIngestionPipeline,
  uploadIngestionTask
} from "../../services/ingestionService";
import { formatDateTime, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const successText = ref("");
const keyword = ref("");
const taskStatus = ref("");
const pipelines = ref({ records: [], total: 0 });
const tasks = ref({ records: [], total: 0 });
const uploadInputRef = ref(null);
const uploadPipelineId = ref("");

const activeTab = ref(route.query.tab === "tasks" ? "tasks" : "pipelines");

const pipelineDialogOpen = ref(false);
const pipelineDialogMode = ref("create");
const pipelineTarget = ref(null);
const pipelineForm = ref({ name: "", description: "" });
const pipelineSubmitting = ref(false);

const taskDialogOpen = ref(false);
const taskForm = ref({ location: "" });
const taskTargetPipelineId = ref("");
const taskSubmitting = ref(false);

const taskDetailOpen = ref(false);
const taskDetailNodes = ref([]);
const taskDetailLoading = ref(false);
const taskDetailTarget = ref(null);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

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

function openPipelineDialog(mode, item) {
  pipelineDialogMode.value = mode;
  if (mode === "edit" && item) {
    pipelineTarget.value = item;
    pipelineForm.value = { name: item.name || "", description: item.description || "" };
  } else {
    pipelineTarget.value = null;
    pipelineForm.value = { name: "", description: "" };
  }
  pipelineDialogOpen.value = true;
}

function closePipelineDialog() {
  pipelineDialogOpen.value = false;
  pipelineTarget.value = null;
}

async function handlePipelineSubmit() {
  if (!pipelineForm.value.name.trim()) return;
  pipelineSubmitting.value = true;
  try {
    if (pipelineDialogMode.value === "edit" && pipelineTarget.value) {
      await updateIngestionPipeline(pipelineTarget.value.id, {
        name: pipelineForm.value.name.trim(),
        description: pipelineForm.value.description.trim() || "",
        nodes: pipelineTarget.value.nodes || []
      });
      successText.value = "Pipeline 已更新。";
    } else {
      await createIngestionPipeline({
        name: pipelineForm.value.name.trim(),
        description: pipelineForm.value.description.trim() || "",
        nodes: []
      });
      successText.value = "Pipeline 已创建。";
    }
    pipelineDialogOpen.value = false;
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || (pipelineDialogMode.value === "edit" ? "更新 pipeline 失败。" : "创建 pipeline 失败。");
  } finally {
    pipelineSubmitting.value = false;
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

async function handleDeletePipeline() {
  if (!deleteTarget.value) return;
  deleteSubmitting.value = true;
  try {
    await deleteIngestionPipeline(deleteTarget.value.id);
    successText.value = "Pipeline 已删除。";
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "删除 pipeline 失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

function openTaskDialog(pipelineId) {
  taskTargetPipelineId.value = pipelineId;
  taskForm.value = { location: "" };
  taskDialogOpen.value = true;
}

function closeTaskDialog() {
  taskDialogOpen.value = false;
  taskTargetPipelineId.value = "";
}

async function handleCreateTask() {
  if (!taskForm.value.location.trim()) return;
  taskSubmitting.value = true;
  try {
    await createIngestionTask({
      pipelineId: taskTargetPipelineId.value,
      source: {
        type: "url",
        location: taskForm.value.location.trim()
      }
    });
    successText.value = "Ingestion task 已创建。";
    taskDialogOpen.value = false;
    await loadIngestion();
  } catch (error) {
    errorText.value = error?.message || "创建 ingestion task 失败。";
  } finally {
    taskSubmitting.value = false;
  }
}

function triggerUpload(pipelineId) {
  uploadPipelineId.value = pipelineId;
  uploadInputRef.value?.click();
}

async function handleUploadChange(event) {
  const file = event.target?.files?.[0];
  if (!file || !uploadPipelineId.value) return;
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

async function openTaskDetail(item) {
  taskDetailTarget.value = item;
  taskDetailOpen.value = true;
  taskDetailLoading.value = true;
  taskDetailNodes.value = [];
  try {
    taskDetailNodes.value = await getIngestionTaskNodes(item.id);
  } catch (error) {
    errorText.value = error?.message || "加载 task nodes 失败。";
  } finally {
    taskDetailLoading.value = false;
  }
}

function closeTaskDetail() {
  taskDetailOpen.value = false;
  taskDetailTarget.value = null;
  taskDetailNodes.value = [];
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
        <p class="admin-page-subtitle">pipeline 和 task 两块管理视图，支持新建 pipeline、发起 URL / 文件摄取和查看节点执行详情。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="loadIngestion">刷新</button>
        <button class="admin-button" type="button" @click="openPipelineDialog('create')">新建 Pipeline</button>
        <input ref="uploadInputRef" class="admin-hidden-file" type="file" @change="handleUploadChange" />
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>
    <p v-if="successText" class="admin-notice is-success">{{ successText }}</p>

    <div class="admin-window-tabs" style="margin-bottom:16px;">
      <button
        :class="['admin-window-tab', { 'is-active': activeTab === 'pipelines' }]"
        type="button"
        @click="activeTab='pipelines'"
      >Pipeline 列表</button>
      <button
        :class="['admin-window-tab', { 'is-active': activeTab === 'tasks' }]"
        type="button"
        @click="activeTab='tasks'"
      >Task 列表</button>
    </div>

    <template v-if="activeTab === 'pipelines'">
      <article class="admin-table-card">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <h3>Pipeline 列表</h3>
          </div>
          <div class="admin-page-count">{{ pageTotal(pipelines) }} pipeline(s)</div>
        </div>

        <div v-if="loading && pageRecords(pipelines).length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="pageRecords(pipelines).length === 0" class="admin-empty">暂无 pipeline</div>
        <div v-else class="admin-card-list">
          <div v-for="item in pageRecords(pipelines)" :key="item.id" class="admin-card-item">
            <div class="admin-toolbar">
              <div class="admin-toolbar-left">
                <h3>{{ item.name || item.id }}</h3>
              </div>
              <div class="admin-inline-actions">
                <button class="admin-button--ghost" type="button" @click="openPipelineDialog('edit', item)">编辑</button>
                <button class="admin-button--ghost" type="button" @click="openTaskDialog(item.id)">Run URL</button>
                <button class="admin-button--ghost" type="button" @click="triggerUpload(item.id)">上传文件</button>
                <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
              </div>
            </div>
            <p>{{ item.description || "No description" }}</p>
            <p>{{ formatDateTime(item.updateTime || item.createTime) }}</p>
          </div>
        </div>
      </article>
    </template>

    <template v-if="activeTab === 'tasks'">
      <article class="admin-table-card">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <h3>Task 列表</h3>
            <select v-model="taskStatus" class="admin-select" @change="loadIngestion">
              <option value="">全部状态</option>
              <option value="PENDING">PENDING</option>
              <option value="RUNNING">RUNNING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div class="admin-toolbar-right">
            <span class="admin-page-count">{{ pageTotal(tasks) }} task(s)</span>
          </div>
        </div>

        <div v-if="pageRecords(tasks).length === 0" class="admin-empty">暂无 ingestion task</div>
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
              <tr v-for="item in pageRecords(tasks)" :key="item.id">
                <td class="is-code">{{ item.id }}</td>
                <td>{{ item.pipelineId || "--" }}</td>
                <td>
                  <span :class="['admin-badge', item.status === 'SUCCESS' ? 'is-success' : item.status === 'FAILED' ? 'is-danger' : item.status === 'RUNNING' ? 'is-warn' : 'is-muted']">
                    {{ item.status || "--" }}
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
      </article>
    </template>

    <div v-if="pipelineDialogOpen" class="admin-dialog-overlay" @click.self="closePipelineDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closePipelineDialog">&times;</button>
        <h3>{{ pipelineDialogMode === 'edit' ? '编辑 Pipeline' : '新建 Pipeline' }}</h3>
        <p>{{ pipelineDialogMode === 'edit' ? '修改 pipeline 基本信息' : '配置 pipeline 基本信息' }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="pipelineForm.name" class="admin-input" placeholder="请输入 pipeline 名称" />
          </div>
          <div class="admin-dialog-field">
            <label>描述</label>
            <input v-model="pipelineForm.description" class="admin-input" placeholder="可选" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closePipelineDialog">取消</button>
          <button class="admin-button" type="button" :disabled="pipelineSubmitting || !pipelineForm.name.trim()" @click="handlePipelineSubmit">
            {{ pipelineSubmitting ? "保存中..." : (pipelineDialogMode === 'edit' ? '保存' : '创建') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="taskDialogOpen" class="admin-dialog-overlay" @click.self="closeTaskDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeTaskDialog">&times;</button>
        <h3>发起 URL 摄取</h3>
        <p>输入 source location</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>Source Location</label>
            <input v-model="taskForm.location" class="admin-input" placeholder="URL / path" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeTaskDialog">取消</button>
          <button class="admin-button" type="button" :disabled="taskSubmitting || !taskForm.location.trim()" @click="handleCreateTask">
            {{ taskSubmitting ? "提交中..." : "提交" }}
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
      <div class="admin-dialog" style="width:min(720px,calc(100% - 32px));">
        <button class="admin-dialog-close" type="button" @click="closeTaskDetail">&times;</button>
        <h3>Task 详情</h3>
        <p>{{ taskDetailTarget?.id }} · {{ taskDetailTarget?.status }}</p>
        <div class="admin-kv" style="margin-bottom:16px;">
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
        <h3>Task Nodes</h3>
        <div v-if="taskDetailLoading" class="admin-empty">加载中...</div>
        <div v-else-if="taskDetailNodes.length === 0" class="admin-empty">暂无节点数据</div>
        <pre v-else class="admin-pre">{{ JSON.stringify(taskDetailNodes, null, 2) }}</pre>
      </div>
    </div>
  </section>
</template>
