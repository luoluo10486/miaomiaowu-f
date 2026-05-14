<script setup>
import { computed, onMounted, ref } from "vue";
import {
  batchDisableIntentNodes,
  batchEnableIntentNodes,
  createIntentNode,
  deleteIntentNode,
  getIntentTree,
  updateIntentNode
} from "../../services/intentTreeService";
import { flattenIntentTree } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const tree = ref([]);

const LEVEL_OPTIONS = [
  { value: 0, label: "DOMAIN" },
  { value: 1, label: "CATEGORY" },
  { value: 2, label: "TOPIC" }
];

const KIND_OPTIONS = [
  { value: 0, label: "KB" },
  { value: 1, label: "SYSTEM" },
  { value: 2, label: "MCP" }
];

function levelLabel(value) {
  const opt = LEVEL_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? `Level ${value}`;
}

function kindLabel(value) {
  const opt = KIND_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? "--";
}

function parseExamples(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return String(value).split("\n").map((item) => item.trim()).filter(Boolean);
}

const rows = computed(() => flattenIntentTree(tree.value));

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const dialogParent = ref(null);
const form = ref({
  intentCode: "",
  name: "",
  description: "",
  level: 1,
  kind: 0,
  parentCode: "",
  collectionName: "",
  mcpToolId: "",
  examplesText: "",
  topK: 3,
  sortOrder: 0,
  enabled: true,
  promptSnippet: "",
  promptTemplate: "",
  paramPromptTemplate: ""
});
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

async function loadTree() {
  loading.value = true;
  errorText.value = "";
  try {
    tree.value = await getIntentTree();
  } catch (error) {
    errorText.value = error?.message || "加载意图树失败。";
  } finally {
    loading.value = false;
  }
}

function openCreateDialog(parent = null) {
  dialogMode.value = "create";
  dialogTarget.value = null;
  dialogParent.value = parent;
  form.value = {
    intentCode: parent ? `${parent.intentCode}.child` : "",
    name: "",
    description: "",
    level: parent ? (parent.level || 0) + 1 : 1,
    kind: 0,
    parentCode: parent?.intentCode || "",
    collectionName: "",
    mcpToolId: "",
    examplesText: "",
    topK: 3,
    sortOrder: 0,
    enabled: true,
    promptSnippet: "",
    promptTemplate: "",
    paramPromptTemplate: ""
  };
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  dialogParent.value = null;
  form.value = {
    intentCode: item.intentCode || "",
    name: item.name || "",
    description: item.description || "",
    level: item.level ?? 1,
    kind: item.kind ?? 0,
    parentCode: item.parentCode || "",
    collectionName: item.collectionName || "",
    mcpToolId: item.mcpToolId || "",
    examplesText: parseExamples(item.examples).join("\n"),
    topK: item.topK ?? 3,
    sortOrder: item.sortOrder ?? 0,
    enabled: item.enabled !== 0,
    promptSnippet: item.promptSnippet || "",
    promptTemplate: item.promptTemplate || "",
    paramPromptTemplate: item.paramPromptTemplate || ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
  dialogParent.value = null;
}

async function handleSubmit() {
  if (!form.value.intentCode.trim() || !form.value.name.trim()) return;
  if (form.value.kind === 2 && !form.value.mcpToolId.trim()) {
    errorText.value = "MCP节点必须填写工具ID";
    return;
  }
  submitting.value = true;
  try {
    const examples = form.value.examplesText
      ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];
    const payload = {
      name: form.value.name.trim(),
      level: Number(form.value.level) || 0,
      parentCode: form.value.parentCode || null,
      description: form.value.description.trim() || "",
      kind: form.value.kind,
      collectionName: form.value.kind === 0 ? form.value.collectionName.trim() : "",
      mcpToolId: form.value.kind === 2 ? form.value.mcpToolId.trim() : "",
      examples,
      topK: Number(form.value.topK) || 0,
      sortOrder: Number(form.value.sortOrder) || 0,
      enabled: form.value.enabled ? 1 : 0,
      promptSnippet: form.value.promptSnippet.trim(),
      promptTemplate: form.value.promptTemplate.trim(),
      paramPromptTemplate: form.value.kind === 2 ? form.value.paramPromptTemplate.trim() : ""
    };
    if (dialogMode.value === "create") {
      payload.intentCode = form.value.intentCode.trim();
      await createIntentNode(payload);
    } else if (dialogTarget.value) {
      await updateIntentNode(dialogTarget.value.id, payload);
    }
    await loadTree();
    dialogOpen.value = false;
  } catch (error) {
    errorText.value = error?.message || "保存意图节点失败。";
  } finally {
    submitting.value = false;
  }
}

async function handleToggle(item) {
  try {
    if (item.enabled === 1 || item.enabled === true) {
      await batchDisableIntentNodes([Number(item.id)]);
    } else {
      await batchEnableIntentNodes([Number(item.id)]);
    }
    await loadTree();
  } catch (error) {
    errorText.value = error?.message || "切换意图节点状态失败。";
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
    await deleteIntentNode(deleteTarget.value.id);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    await loadTree();
  } catch (error) {
    errorText.value = error?.message || "删除意图节点失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

onMounted(() => {
  void loadTree();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Intent Tree</span>
        <h2 class="admin-page-title">意图树</h2>
        <p class="admin-page-subtitle">支持新增根节点、子节点、编辑、启停和删除。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="loadTree">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog()">新增根节点</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div v-if="loading && rows.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="rows.length === 0" class="admin-empty">暂无意图树数据</div>
      <div v-else class="admin-tree-list">
        <article v-for="item in rows" :key="item.id" class="admin-tree-item">
          <div class="admin-tree-item-header">
            <div class="admin-tree-item-title">
              <span v-for="depthIndex in item.depth" :key="depthIndex" class="admin-tree-indent" />
              <div>
                <strong>{{ item.name || item.intentCode }}</strong>
                <small class="is-code">{{ item.intentCode }}</small>
              </div>
            </div>
            <div class="admin-inline-actions">
              <button class="admin-button--ghost" type="button" @click="openCreateDialog(item)">新增子节点</button>
              <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
              <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                {{ item.enabled === 1 || item.enabled === true ? "禁用" : "启用" }}
              </button>
              <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
            </div>
          </div>

          <div class="admin-tree-meta">
            <span class="admin-badge">{{ levelLabel(item.level) }}</span>
            <span :class="['admin-badge', item.kind === 0 ? '' : item.kind === 2 ? 'is-warn' : 'is-muted']">{{ kindLabel(item.kind) }}</span>
            <span class="admin-badge is-muted">TopK {{ item.topK ?? "--" }}</span>
            <span v-if="item.kind === 0 && item.collectionName" class="admin-badge is-success">Collection: {{ item.collectionName }}</span>
            <span v-if="item.kind === 2 && item.mcpToolId" class="admin-badge is-warn">Tool: {{ item.mcpToolId }}</span>
            <span v-if="item.parentName" class="admin-badge is-muted">{{ item.parentName }}</span>
            <span v-if="item.exampleCount > 0" class="admin-badge is-muted">{{ item.exampleCount }} examples</span>
          </div>

          <p class="admin-muted">{{ item.description || "No description" }}</p>
        </article>
      </div>
    </article>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog" style="width:min(600px,calc(100% - 32px));">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? (dialogParent ? "新增子节点" : "新增根节点") : "编辑意图节点" }}</h3>
        <p>{{ dialogMode === "create" ? "填写意图节点信息" : "修改意图节点信息" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>Intent Code</label>
              <input v-model="form.intentCode" class="admin-input" placeholder="请输入 intent code" :disabled="dialogMode === 'edit'" />
            </div>
            <div class="admin-dialog-field">
              <label>名称</label>
              <input v-model="form.name" class="admin-input" placeholder="请输入名称" />
            </div>
          </div>

          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>层级</label>
              <select v-model.number="form.level" class="admin-select">
                <option v-for="opt in LEVEL_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div class="admin-dialog-field">
              <label>类型</label>
              <select v-model.number="form.kind" class="admin-select">
                <option v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <div v-if="form.kind === 0" class="admin-dialog-field">
            <label>Collection 名称</label>
            <input v-model="form.collectionName" class="admin-input" placeholder="向量数据库 Collection 名称" />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>MCP 工具ID（必填）</label>
            <input v-model="form.mcpToolId" class="admin-input" placeholder="例如：sales_query" />
          </div>

          <div class="admin-dialog-field">
            <label>描述</label>
            <textarea v-model="form.description" class="admin-input" rows="2" placeholder="节点描述" style="resize:vertical;" />
          </div>

          <div class="admin-dialog-field">
            <label>示例问题（每行一个）</label>
            <textarea v-model="form.examplesText" class="admin-input" rows="3" placeholder="示例问题1&#10;示例问题2" style="resize:vertical;" />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 片段</label>
            <textarea v-model="form.promptSnippet" class="admin-input" rows="2" placeholder="可选" style="resize:vertical;" />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 模板</label>
            <textarea v-model="form.promptTemplate" class="admin-input" rows="3" placeholder="可选" style="resize:vertical;" />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>参数 Prompt 模板</label>
            <textarea v-model="form.paramPromptTemplate" class="admin-input" rows="2" placeholder="MCP 节点参数模板" style="resize:vertical;" />
          </div>

          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>TopK</label>
              <input v-model.number="form.topK" class="admin-input" type="number" min="0" />
            </div>
            <div class="admin-dialog-field">
              <label>排序权重</label>
              <input v-model.number="form.sortOrder" class="admin-input" type="number" min="0" />
            </div>
          </div>

          <div class="admin-dialog-field">
            <label>状态</label>
            <select v-model="form.enabled" class="admin-select">
              <option :value="true">启用</option>
              <option :value="false">禁用</option>
            </select>
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.intentCode.trim() || !form.name.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">确认删除意图节点 "{{ deleteTarget?.name || deleteTarget?.intentCode }}" 吗？</p>
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
