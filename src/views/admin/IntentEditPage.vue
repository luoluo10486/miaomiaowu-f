<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getIntentTree,
  updateIntentNode
} from "../../services/intentTreeService";
import { flattenIntentTree } from "./adminShared";

const router = useRouter();
const route = useRoute();
const nodeId = computed(() => Number(route.params.id));
const loading = ref(true);
const saving = ref(false);
const errorText = ref("");
const tree = ref([]);

const LEVEL_OPTIONS = [
  { value: 0, label: "DOMAIN", description: "顶层领域" },
  { value: 1, label: "CATEGORY", description: "业务分类" },
  { value: 2, label: "TOPIC", description: "具体主题" }
];

const KIND_OPTIONS = [
  { value: 0, label: "KB", description: "知识库检索" },
  { value: 1, label: "SYSTEM", description: "系统交互" },
  { value: 2, label: "MCP", description: "工具调用" }
];

const form = ref({
  name: "",
  intentCode: "",
  level: 0,
  kind: 0,
  parentCode: "",
  collectionName: "",
  mcpToolId: "",
  description: "",
  examplesText: "",
  topK: 0,
  sortOrder: 0,
  enabled: true,
  promptSnippet: "",
  promptTemplate: "",
  paramPromptTemplate: ""
});

const rows = computed(() => flattenIntentTree(tree.value));

const currentNode = computed(() => rows.value.find((row) => row.id === nodeId.value) || null);

const excludedCodes = computed(() => {
  if (!currentNode.value) return new Set();
  const childrenMap = new Map();
  rows.value.forEach((row) => {
    if (!row.parentCode) return;
    const next = childrenMap.get(row.parentCode) || [];
    next.push(row.intentCode);
    childrenMap.set(row.parentCode, next);
  });
  const excluded = new Set([currentNode.value.intentCode]);
  const stack = [currentNode.value.intentCode];
  while (stack.length > 0) {
    const code = stack.pop();
    if (!code) continue;
    const children = childrenMap.get(code) || [];
    children.forEach((childCode) => {
      if (!excluded.has(childCode)) {
        excluded.add(childCode);
        stack.push(childCode);
      }
    });
  }
  return excluded;
});

const parentOptions = computed(() => {
  return [
    { value: "", label: "ROOT" },
    ...rows.value
      .filter((row) => !excludedCodes.value.has(row.intentCode))
      .map((row) => ({
        value: row.intentCode,
        label: row.pathText
      }))
  ];
});

function parseExamples(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return String(value).split("\n").map((item) => item.trim()).filter(Boolean);
}

async function loadTree() {
  loading.value = true;
  errorText.value = "";
  try {
    tree.value = await getIntentTree();
  } catch (error) {
    errorText.value = error?.message || "加载意图节点失败。";
  } finally {
    loading.value = false;
  }
}

function fillForm() {
  if (!currentNode.value) return;
  const node = currentNode.value;
  form.value = {
    name: node.name || "",
    intentCode: node.intentCode || "",
    level: node.level ?? 0,
    kind: node.kind ?? 0,
    parentCode: node.parentCode || "",
    collectionName: node.collectionName || "",
    mcpToolId: node.mcpToolId || "",
    description: node.description || "",
    examplesText: parseExamples(node.examples).join("\n"),
    topK: node.topK ?? 0,
    sortOrder: node.sortOrder ?? 0,
    enabled: node.enabled !== 0,
    promptSnippet: node.promptSnippet || "",
    promptTemplate: node.promptTemplate || "",
    paramPromptTemplate: node.paramPromptTemplate || ""
  };
}

async function handleSubmit() {
  if (!currentNode.value) return;
  if (form.value.kind === 2 && !form.value.mcpToolId.trim()) {
    errorText.value = "MCP节点必须填写工具ID";
    return;
  }
  saving.value = true;
  errorText.value = "";
  try {
    const examples = form.value.examplesText
      ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
      : [];
    const payload = {
      name: form.value.name.trim(),
      level: form.value.level,
      parentCode: form.value.parentCode || null,
      description: form.value.description.trim(),
      examples,
      collectionName: form.value.kind === 0 ? form.value.collectionName.trim() : "",
      mcpToolId: form.value.kind === 2 ? form.value.mcpToolId.trim() : "",
      kind: form.value.kind,
      topK: form.value.topK || undefined,
      sortOrder: form.value.sortOrder || 0,
      enabled: form.value.enabled ? 1 : 0,
      promptSnippet: form.value.promptSnippet.trim(),
      promptTemplate: form.value.promptTemplate.trim(),
      paramPromptTemplate: form.value.kind === 2 ? form.value.paramPromptTemplate.trim() : ""
    };
    await updateIntentNode(currentNode.value.id, payload);
    router.push("/admin/intent-list");
  } catch (error) {
    errorText.value = error?.message || "更新失败。";
  } finally {
    saving.value = false;
  }
}

function handleCancel() {
  router.push("/admin/intent-list");
}

onMounted(async () => {
  await loadTree();
  fillForm();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <h2 class="admin-page-title">编辑意图节点</h2>
        <p class="admin-page-subtitle">
          {{ currentNode?.name || '--' }}（{{ currentNode?.intentCode || '--' }}）
        </p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="handleCancel">返回意图列表</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div v-if="loading" class="admin-empty">加载中...</div>
    <div v-else-if="!currentNode" class="admin-empty">
      <p>未找到对应意图节点</p>
      <button class="admin-button--ghost" type="button" @click="handleCancel">返回意图列表</button>
    </div>

    <article v-else class="admin-panel">
      <h3>节点配置</h3>
      <p class="admin-form-note">修改节点基础信息、Prompt与高级参数</p>

      <form class="admin-dialog-body" @submit.prevent="handleSubmit" style="max-width:720px;">
        <div class="admin-form-grid-2">
          <div class="admin-dialog-field">
            <label>节点名称</label>
            <input v-model="form.name" class="admin-input" placeholder="例如：OA系统" />
          </div>
          <div class="admin-dialog-field">
            <label>意图标识</label>
            <input v-model="form.intentCode" class="admin-input" disabled />
          </div>
        </div>

        <div class="admin-form-grid-2">
          <div class="admin-dialog-field">
            <label>层级</label>
            <select v-model.number="form.level" class="admin-select">
              <option v-for="opt in LEVEL_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }} - {{ opt.description }}
              </option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>类型</label>
            <select v-model.number="form.kind" class="admin-select">
              <option v-for="opt in KIND_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }} - {{ opt.description }}
              </option>
            </select>
          </div>
        </div>

        <div class="admin-dialog-field">
          <label>父节点</label>
          <select v-model="form.parentCode" class="admin-select">
            <option v-for="opt in parentOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
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
          <textarea v-model="form.description" class="admin-input" rows="3" placeholder="节点描述" style="resize:vertical;" />
        </div>

        <div class="admin-dialog-field">
          <label>示例问题（每行一个）</label>
          <textarea v-model="form.examplesText" class="admin-input" rows="4" placeholder="示例问题1&#10;示例问题2&#10;示例问题3" style="resize:vertical;" />
        </div>

        <div class="admin-dialog-field">
          <label>Prompt 片段</label>
          <textarea v-model="form.promptSnippet" class="admin-input" rows="3" placeholder="可选的 prompt 片段" style="resize:vertical;" />
        </div>

        <div class="admin-dialog-field">
          <label>Prompt 模板</label>
          <textarea v-model="form.promptTemplate" class="admin-input" rows="4" placeholder="可选的 prompt 模板" style="resize:vertical;" />
        </div>

        <div v-if="form.kind === 2" class="admin-dialog-field">
          <label>参数 Prompt 模板</label>
          <textarea v-model="form.paramPromptTemplate" class="admin-input" rows="3" placeholder="MCP 节点参数模板" style="resize:vertical;" />
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

        <div class="admin-dialog-footer" style="padding-top:16px;">
          <button class="admin-button--ghost" type="button" @click="handleCancel">取消</button>
          <button class="admin-button" type="submit" :disabled="saving || !form.name.trim()">
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </form>
    </article>
  </section>
</template>
