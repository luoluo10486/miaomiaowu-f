<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getIntentTree, updateIntentNode } from "../../services/adminService";
import { askText, findIntentNodeById, flattenIntentTree, parseIntentExamples } from "./adminShared";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const saving = ref(false);
const errorText = ref("");
const tree = ref([]);

const rows = computed(() => flattenIntentTree(tree.value));
const currentNode = computed(() => findIntentNodeById(tree.value, route.params.id));
const fromPath = computed(() => {
  const value = route.query.from;
  return typeof value === "string" && value.startsWith("/admin/") ? value : "/admin/intent-list";
});

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
  topK: "",
  sortOrder: 0,
  enabled: true,
  promptSnippet: "",
  promptTemplate: "",
  paramPromptTemplate: ""
});

function syncForm(node) {
  if (!node) {
    return;
  }

  form.value = {
    name: node.name || "",
    intentCode: node.intentCode || "",
    level: Number(node.level ?? 0),
    kind: Number(node.kind ?? 0),
    parentCode: node.parentCode || "",
    collectionName: node.collectionName || "",
    mcpToolId: node.mcpToolId || "",
    description: node.description || "",
    examplesText: parseIntentExamples(node.examples).join("\n"),
    topK: node.topK ?? "",
    sortOrder: Number(node.sortOrder ?? 0),
    enabled: Number(node.enabled ?? 1) !== 0,
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
    syncForm(findIntentNodeById(tree.value, route.params.id));
  } catch (error) {
    errorText.value = error?.message || "加载意图节点失败。";
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  const node = currentNode.value;
  if (!node) {
    return;
  }

  const name = form.value.name.trim();
  if (!name) {
    errorText.value = "名称不能为空。";
    return;
  }

  const payload = {
    name,
    level: Number(form.value.level || 0),
    parentCode: form.value.parentCode || null,
    description: form.value.description.trim(),
    examples: form.value.examplesText
      ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
      : [],
    collectionName: Number(form.value.kind) === 0 ? form.value.collectionName.trim() : "",
    mcpToolId: Number(form.value.kind) === 2 ? form.value.mcpToolId.trim() : "",
    kind: Number(form.value.kind),
    topK: form.value.topK === "" ? undefined : Number(form.value.topK),
    sortOrder: Number(form.value.sortOrder || 0),
    enabled: form.value.enabled ? 1 : 0,
    promptSnippet: form.value.promptSnippet.trim(),
    promptTemplate: form.value.promptTemplate.trim(),
    paramPromptTemplate: Number(form.value.kind) === 2 ? form.value.paramPromptTemplate.trim() : ""
  };

  if (Number(form.value.kind) === 2 && !payload.mcpToolId) {
    errorText.value = "MCP 节点必须填写工具 ID。";
    return;
  }

  saving.value = true;
  try {
    await updateIntentNode(node.id, payload);
    router.push(fromPath.value);
  } catch (error) {
    errorText.value = error?.message || "更新失败。";
  } finally {
    saving.value = false;
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
        <span class="admin-page-eyebrow">Intent Edit</span>
        <h2 class="admin-page-title">编辑意图节点</h2>
        <p class="admin-page-subtitle">{{ currentNode?.name || "--" }} / {{ currentNode?.intentCode || "--" }}</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push(fromPath)">Back</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-detail-card" v-if="!loading && currentNode">
      <div class="admin-grid-3">
        <label class="admin-field">
          <span>名称</span>
          <input v-model="form.name" class="admin-input" />
        </label>
        <label class="admin-field">
          <span>意图标识</span>
          <input v-model="form.intentCode" class="admin-input" disabled />
        </label>
        <label class="admin-field">
          <span>层级</span>
          <select v-model="form.level" class="admin-select">
            <option :value="0">DOMAIN</option>
            <option :value="1">CATEGORY</option>
            <option :value="2">TOPIC</option>
          </select>
        </label>
        <label class="admin-field">
          <span>类型</span>
          <select v-model="form.kind" class="admin-select">
            <option :value="0">KB</option>
            <option :value="1">SYSTEM</option>
            <option :value="2">MCP</option>
          </select>
        </label>
        <label class="admin-field">
          <span>父节点</span>
          <select v-model="form.parentCode" class="admin-select">
            <option value="">ROOT</option>
            <option v-for="row in rows.filter((item) => String(item.id) !== String(currentNode.id))" :key="row.id" :value="row.intentCode">
              {{ row.pathText || row.name }}
            </option>
          </select>
        </label>
        <label class="admin-field" v-if="Number(form.kind) === 0">
          <span>Collection</span>
          <input v-model="form.collectionName" class="admin-input" />
        </label>
        <label class="admin-field" v-if="Number(form.kind) === 2">
          <span>MCP 工具 ID</span>
          <input v-model="form.mcpToolId" class="admin-input" />
        </label>
        <label class="admin-field">
          <span>TopK</span>
          <input v-model="form.topK" class="admin-input" type="number" />
        </label>
        <label class="admin-field">
          <span>排序</span>
          <input v-model="form.sortOrder" class="admin-input" type="number" />
        </label>
      </div>

      <label class="admin-field">
        <span>描述</span>
        <textarea v-model="form.description" class="admin-textarea" rows="3" />
      </label>

      <label class="admin-field">
        <span>示例问题</span>
        <textarea v-model="form.examplesText" class="admin-textarea" rows="4" />
      </label>

      <label class="admin-field">
        <span>Prompt Snippet</span>
        <textarea v-model="form.promptSnippet" class="admin-textarea" rows="3" />
      </label>

      <label class="admin-field">
        <span>Prompt Template</span>
        <textarea v-model="form.promptTemplate" class="admin-textarea" rows="4" />
      </label>

      <label class="admin-field" v-if="Number(form.kind) === 2">
        <span>Param Prompt Template</span>
        <textarea v-model="form.paramPromptTemplate" class="admin-textarea" rows="4" />
      </label>

      <label class="admin-field admin-field--row">
        <input v-model="form.enabled" type="checkbox" />
        <span>启用节点</span>
      </label>

      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" :disabled="saving" @click="router.push(fromPath)">Cancel</button>
        <button class="admin-button" type="button" :disabled="saving" @click="handleSubmit">
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
    </article>
  </section>
</template>
