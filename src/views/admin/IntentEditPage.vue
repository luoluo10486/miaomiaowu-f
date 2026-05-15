<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import {
  getIntentTree,
  updateIntentNode
} from "../../services/intentTreeService";
import { flattenIntentTree, formatDateTime } from "./adminShared";

const router = useRouter();
const route = useRoute();

const nodeId = computed(() => Number(route.params.id));
const fromRoute = computed(() => String(route.query.from || "/admin/intent-list"));
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

const form = ref(buildEmptyForm());

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

const parentOptions = computed(() => [
  { value: "", label: "ROOT" },
  ...rows.value
    .filter((row) => !excludedCodes.value.has(row.intentCode))
    .map((row) => ({
      value: row.intentCode,
      label: row.pathText
    }))
]);

function buildEmptyForm() {
  return {
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
  };
}

function parseExamples(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // ignore parse errors and fall back to line split
  }
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function fillForm(node) {
  if (!node) return;
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

async function handleSubmit() {
  if (!currentNode.value) return;
  if (form.value.kind === 2 && !form.value.mcpToolId.trim()) {
    errorText.value = "MCP 节点必须填写工具 ID。";
    return;
  }

  saving.value = true;
  errorText.value = "";
  try {
    const payload = {
      name: form.value.name.trim(),
      level: Number(form.value.level) || 0,
      parentCode: form.value.parentCode || null,
      description: form.value.description.trim(),
      examples: form.value.examplesText
        ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      collectionName: form.value.kind === 0 ? form.value.collectionName.trim() : "",
      mcpToolId: form.value.kind === 2 ? form.value.mcpToolId.trim() : "",
      kind: form.value.kind,
      topK: Number(form.value.topK) || 0,
      sortOrder: Number(form.value.sortOrder) || 0,
      enabled: form.value.enabled ? 1 : 0,
      promptSnippet: form.value.promptSnippet.trim(),
      promptTemplate: form.value.promptTemplate.trim(),
      paramPromptTemplate: form.value.kind === 2 ? form.value.paramPromptTemplate.trim() : ""
    };
    await updateIntentNode(currentNode.value.id, payload);
    router.push(fromRoute.value);
  } catch (error) {
    errorText.value = error?.message || "更新意图节点失败。";
  } finally {
    saving.value = false;
  }
}

function handleCancel() {
  router.push(fromRoute.value);
}

watch(currentNode, (node) => {
  if (node) fillForm(node);
}, { immediate: true });

onMounted(async () => {
  await loadTree();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Intent Tree"
      title="编辑意图节点"
      :description="currentNode ? `${currentNode.name || '--'} · ${currentNode.intentCode || '--'}` : '选择一个节点继续编辑。'"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="loadTree">刷新</button>
        <button class="admin-button--ghost" type="button" @click="handleCancel">返回列表</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>节点配置</h2>
            <p>修改基础信息、父节点、prompt 和资源字段。</p>
          </div>
          <span class="admin-page-count">{{ currentNode ? currentNode.intentCode : "--" }}</span>
        </div>

        <div v-if="loading" class="admin-empty">加载中...</div>
        <div v-else-if="!currentNode" class="admin-empty">
          <p>未找到对应的意图节点。</p>
          <button class="admin-button--ghost" type="button" @click="handleCancel">返回列表</button>
        </div>
        <form v-else class="admin-dialog-body" @submit.prevent="handleSubmit" style="max-width:720px;">
          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>节点名称</label>
              <input v-model="form.name" class="admin-input" placeholder="例如：OA 系统" />
            </div>
            <div class="admin-dialog-field">
              <label>Intent Code</label>
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
            <input v-model="form.collectionName" class="admin-input" placeholder="知识库 Collection 名称" />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>MCP 工具 ID</label>
            <input v-model="form.mcpToolId" class="admin-input" placeholder="例如：sales_query" />
          </div>

          <div class="admin-dialog-field">
            <label>描述</label>
            <textarea v-model="form.description" class="admin-input" rows="3" placeholder="节点描述" style="resize:vertical;" />
          </div>

          <div class="admin-dialog-field">
            <label>示例问题</label>
            <textarea v-model="form.examplesText" class="admin-input" rows="4" placeholder="示例问题1&#10;示例问题2" style="resize:vertical;" />
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

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>节点概览</h3>
          <p class="admin-detail-card-desc">快速查看当前节点的路径、状态和资源归属。</p>
          <div v-if="currentNode" class="admin-kv">
            <div><dt>路径</dt><dd>{{ currentNode.pathText }}</dd></div>
            <div><dt>父节点</dt><dd>{{ currentNode.parentName || currentNode.parentCode || "ROOT" }}</dd></div>
            <div><dt>层级</dt><dd>{{ currentNode.level }}</dd></div>
            <div><dt>类型</dt><dd>{{ currentNode.kind }}</dd></div>
            <div><dt>状态</dt><dd>{{ currentNode.enabled === 1 || currentNode.enabled === true ? "启用" : "禁用" }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDateTime(currentNode.updateTime || currentNode.createTime) }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>Prompt 预览</h3>
          <p class="admin-detail-card-desc">展示片段、模板和参数模板，便于快速校验。</p>
          <div v-if="currentNode" class="admin-card-list">
            <div class="admin-card-item">
              <h3>Prompt 片段</h3>
              <p>{{ currentNode.promptSnippet || "--" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>Prompt 模板</h3>
              <p>{{ currentNode.promptTemplate || "--" }}</p>
            </div>
            <div class="admin-card-item" v-if="currentNode.kind === 2">
              <h3>参数模板</h3>
              <p>{{ currentNode.paramPromptTemplate || "--" }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </section>
</template>
