<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import { getIntentTree, updateIntentNode } from "../../services/intentTreeService";
import { flattenIntentTree, formatDateTime } from "./adminShared";

const route = useRoute();
const router = useRouter();

const nodeId = computed(() => Number(route.params.id));
const fromRoute = computed(() => {
  const from = String(route.query.from || "");
  return from.startsWith("/admin/") ? from : "/admin/intent-list";
});

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

function buildEmptyForm() {
  return {
    name: "",
    intentCode: "",
    level: 0,
    kind: 0,
    parentCode: "__ROOT__",
    collectionName: "",
    mcpToolId: "",
    description: "",
    examplesText: "",
    topK: undefined,
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
    if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
  } catch {
    // fall back to line-based examples
  }
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

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
  { value: "__ROOT__", label: "ROOT" },
  ...rows.value
    .filter((row) => !excludedCodes.value.has(row.intentCode))
    .map((row) => ({
      value: row.intentCode,
      label: row.pathText
    }))
]);

const nodeSummary = computed(() => {
  if (!currentNode.value) return null;
  const resource =
    currentNode.value.kind === 0
      ? currentNode.value.collectionName || "--"
      : currentNode.value.kind === 2
        ? currentNode.value.mcpToolId || "--"
        : "系统意图";
  return {
    pathText: currentNode.value.pathText || "--",
    childCount: currentNode.value.childCount ?? 0,
    exampleCount: currentNode.value.exampleCount ?? parseExamples(currentNode.value.examples).length,
    resource
  };
});

const stats = computed(() => [
  { title: "Node", value: rows.value.length, hint: "当前意图树节点总数", tone: "indigo" },
  { title: "Children", value: currentNode.value?.childCount ?? 0, hint: "当前节点子节点数", tone: "cyan" },
  { title: "Examples", value: currentNode.value ? parseExamples(currentNode.value.examples).length : 0, hint: "当前节点示例数", tone: "emerald" },
  { title: "Status", value: currentNode.value?.enabled === 0 ? "Disabled" : "Enabled", hint: "当前节点状态", tone: "amber" }
]);

function fillForm(node) {
  if (!node) return;
  form.value = {
    name: node.name || "",
    intentCode: node.intentCode || "",
    level: node.level ?? 0,
    kind: node.kind ?? 0,
    parentCode: node.parentCode || "__ROOT__",
    collectionName: node.collectionName || "",
    mcpToolId: node.mcpToolId || "",
    description: node.description || "",
    examplesText: parseExamples(node.examples).join("\n"),
    topK: node.topK ?? undefined,
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
  if (!form.value.name.trim()) {
    errorText.value = "请输入节点名称。";
    return;
  }
  if (form.value.name.trim().length > 50) {
    errorText.value = "节点名称不能超过 50 个字符。";
    return;
  }
  if (form.value.kind === 2 && !form.value.mcpToolId.trim()) {
    errorText.value = "MCP 节点必须填写工具 ID。";
    return;
  }
  if (form.value.topK !== undefined && Number(form.value.topK) < 0) {
    errorText.value = "TopK 不能小于 0。";
    return;
  }

  saving.value = true;
  errorText.value = "";
  try {
    const payload = {
      name: form.value.name.trim(),
      level: Number(form.value.level) || 0,
      parentCode: form.value.parentCode === "__ROOT__" ? null : form.value.parentCode || null,
      description: form.value.description.trim(),
      examples: form.value.examplesText
        ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
      collectionName: form.value.kind === 0 ? form.value.collectionName.trim() : "",
      mcpToolId: form.value.kind === 2 ? form.value.mcpToolId.trim() : "",
      kind: form.value.kind,
      topK: form.value.topK === undefined || form.value.topK === null || form.value.topK === "" ? undefined : Number(form.value.topK),
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

onMounted(() => {
  void loadTree();
});
</script>

<template>
  <section class="admin-page intent-edit-page">
    <PageHeader
      tag="Intent Edit"
      title="编辑意图节点"
      :description="currentNode ? `${currentNode.name || '--'} · ${currentNode.intentCode || '--'}` : '选择一个节点继续编辑。'"
    >
      <template #meta>
        <div class="intent-edit-header-meta">
          <span class="admin-badge is-muted">路径：{{ nodeSummary?.pathText || "--" }}</span>
          <span class="admin-badge is-muted">资源：{{ nodeSummary?.resource || "--" }}</span>
          <span class="admin-badge is-muted">子节点：{{ nodeSummary?.childCount ?? 0 }}</span>
          <span class="admin-badge is-muted">示例：{{ nodeSummary?.exampleCount ?? 0 }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="loadTree">刷新</button>
        <button class="admin-button--ghost" type="button" @click="handleCancel">返回列表</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </div>

    <section class="admin-detail-card intent-edit-hero">
      <div class="intent-edit-hero__copy">
        <p class="trace-hero-tag">Intent Overview</p>
        <h2>{{ currentNode?.name || "--" }}</h2>
        <p>
          {{ nodeSummary?.pathText || "--" }} · {{ currentNode?.intentCode || "--" }} ·
          {{ currentNode?.enabled === 1 || currentNode?.enabled === true ? "已启用" : "已禁用" }}
        </p>
      </div>
      <div class="intent-edit-hero__grid">
        <div><span>父节点</span><strong>{{ currentNode?.parentName || currentNode?.parentCode || "ROOT" }}</strong></div>
        <div><span>资源</span><strong>{{ nodeSummary?.resource || "--" }}</strong></div>
        <div><span>子节点</span><strong>{{ nodeSummary?.childCount ?? 0 }}</strong></div>
        <div><span>示例</span><strong>{{ nodeSummary?.exampleCount ?? 0 }}</strong></div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>节点配置</h2>
            <p>修改基础信息、Prompt 与高级参数。</p>
          </div>
          <span class="admin-page-count">{{ currentNode ? currentNode.intentCode : "--" }}</span>
        </div>

        <div v-if="loading" class="admin-empty">加载中...</div>
        <div v-else-if="!currentNode" class="admin-empty">
          <p>未找到对应的意图节点。</p>
          <button class="admin-button--ghost" type="button" @click="handleCancel">返回列表</button>
        </div>
        <form v-else class="intent-edit-form" @submit.prevent="handleSubmit">
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
            <textarea v-model="form.description" class="admin-textarea" rows="3" placeholder="节点描述" />
          </div>

          <div class="admin-dialog-field">
            <label>示例问题</label>
            <textarea v-model="form.examplesText" class="admin-textarea" rows="4" placeholder="每行一个示例问题" />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 片段</label>
            <textarea v-model="form.promptSnippet" class="admin-textarea" rows="3" placeholder="可选的 prompt 片段" />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 模板</label>
            <textarea v-model="form.promptTemplate" class="admin-textarea" rows="4" placeholder="可选的 prompt 模板" />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>参数 Prompt 模板</label>
            <textarea v-model="form.paramPromptTemplate" class="admin-textarea" rows="3" placeholder="MCP 节点参数模板" />
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
              {{ saving ? "保存中..." : "保存修改" }}
            </button>
          </div>
        </form>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>节点概览</h3>
          <p class="admin-detail-card-desc">路径、父节点、状态和更新时间。</p>
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
          <p class="admin-detail-card-desc">快速查看片段、模板和参数模板。</p>
          <div v-if="currentNode" class="admin-card-list">
            <div class="admin-card-item">
              <h3>Prompt 片段</h3>
              <p>{{ currentNode.promptSnippet || "--" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>Prompt 模板</h3>
              <p>{{ currentNode.promptTemplate || "--" }}</p>
            </div>
            <div v-if="currentNode.kind === 2" class="admin-card-item">
              <h3>参数模板</h3>
              <p>{{ currentNode.paramPromptTemplate || "--" }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.intent-edit-page {
  display: grid;
  gap: 18px;
}

.intent-edit-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.intent-edit-hero {
  display: grid;
  gap: 16px;
}

.intent-edit-hero__copy {
  display: grid;
  gap: 8px;
}

.intent-edit-hero__copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.intent-edit-hero__copy p {
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

.intent-edit-hero__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.intent-edit-hero__grid > div {
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.intent-edit-hero__grid span {
  display: block;
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.intent-edit-hero__grid strong {
  display: block;
  margin-top: 6px;
  color: var(--admin-ink);
  font-size: 15px;
  word-break: break-word;
}

.intent-edit-form {
  display: grid;
  gap: 16px;
  max-width: 760px;
}

@media (max-width: 960px) {
  .intent-edit-hero__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
