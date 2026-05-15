<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  batchDisableIntentNodes,
  batchEnableIntentNodes,
  createIntentNode,
  deleteIntentNode,
  getIntentTree,
  updateIntentNode
} from "../../services/intentTreeService";
import { flattenIntentTree, formatDateTime } from "./adminShared";

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errorText = ref("");
const tree = ref([]);
const keywordInput = ref("");
const keyword = ref("");
const selectedIntentCode = ref("");

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

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const dialogParent = ref(null);
const form = ref(buildEmptyForm());
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);
const expandedMap = ref({});

const rows = computed(() =>
  flattenIntentTree(tree.value).map((row) => ({
    ...row,
    hasChildren: Number(row.childCount ?? 0) > 0
  }))
);

function buildVisibleRows(nodes, depth = 0, parentNames = [], parentCodes = [], result = []) {
  nodes.forEach((node) => {
    const currentNames = [...parentNames, node.name];
    const currentCodes = [...parentCodes, node.intentCode];
    const children = Array.isArray(node.children) ? node.children : [];
    result.push({
      ...node,
      depth,
      hasChildren: children.length > 0,
      childCount: children.length,
      exampleCount: parseExamples(node.examples).length,
      pathText: currentNames.join(" > "),
      pathNames: currentNames,
      pathCodes: currentCodes
    });

    if (children.length > 0 && expandedMap.value[node.intentCode] !== false) {
      buildVisibleRows(children, depth + 1, currentNames, currentCodes, result);
    }
  });

  return result;
}

const visibleRows = computed(() => buildVisibleRows(tree.value));

const filteredRows = computed(() => {
  const normalized = keyword.value.trim().toLowerCase();
  if (!normalized) return visibleRows.value;

  return rows.value.filter((row) => {
    const searchable = [
      row.name,
      row.intentCode,
      row.pathText,
      row.description,
      row.parentName
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchable.includes(normalized);
  });
});

const selectedNode = computed(() => {
  if (selectedIntentCode.value) {
    return rows.value.find((row) => row.intentCode === selectedIntentCode.value) || null;
  }
  return filteredRows.value[0] || rows.value[0] || null;
});

const selectedExamples = computed(() => parseExamples(selectedNode.value?.examples));
const expandedCount = computed(
  () => Object.values(expandedMap.value).filter((value) => value !== false).length
);
const selectedPath = computed(() => selectedNode.value?.pathText || "--");
const selectedResource = computed(() => {
  if (!selectedNode.value) return "--";
  if (selectedNode.value.kind === 0) return selectedNode.value.collectionName || "--";
  if (selectedNode.value.kind === 2) return selectedNode.value.mcpToolId || "--";
  return "系统意图";
});
const searchSummary = computed(() => (keyword.value ? `关键词: ${keyword.value}` : "全部节点"));
const selectedNodeLabel = computed(() => {
  if (!selectedNode.value) return "--";
  return `${selectedNode.value.name || selectedNode.value.intentCode || "--"} · ${levelLabel(selectedNode.value.level)}`;
});
const selectedMetaSummary = computed(() => {
  if (!selectedNode.value) return "--";
  return `${selectedResource.value} · ${selectedExamples.value.length} examples`;
});

const stats = computed(() => {
  const allRows = rows.value;
  return [
    {
      title: "Nodes",
      value: allRows.length,
      hint: "意图树总节点数",
      tone: "indigo"
    },
    {
      title: "Enabled",
      value: allRows.filter((item) => item.enabled === 1 || item.enabled === true).length,
      hint: "当前已启用节点",
      tone: "emerald"
    },
    {
      title: "KB",
      value: allRows.filter((item) => item.kind === 0).length,
      hint: "知识库意图节点",
      tone: "cyan"
    },
    {
      title: "MCP",
      value: allRows.filter((item) => item.kind === 2).length,
      hint: "工具调用意图节点",
      tone: "amber"
    }
  ];
});

function buildEmptyForm() {
  return {
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
  };
}

function levelLabel(value) {
  const opt = LEVEL_OPTIONS.find((item) => item.value === value);
  return opt?.label ?? `Level ${value}`;
}

function kindLabel(value) {
  const opt = KIND_OPTIONS.find((item) => item.value === value);
  return opt?.label ?? "--";
}

function isExpanded(intentCode) {
  return expandedMap.value[intentCode] !== false;
}

function toggleExpanded(intentCode) {
  expandedMap.value = {
    ...expandedMap.value,
    [intentCode]: !isExpanded(intentCode)
  };
}

function parseExamples(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // fall back to line-based examples
  }
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadTree() {
  loading.value = true;
  errorText.value = "";
  try {
    tree.value = await getIntentTree();
    if (!selectedIntentCode.value && rows.value.length > 0) {
      selectedIntentCode.value = rows.value[0].intentCode;
    }
  } catch (error) {
    errorText.value = error?.message || "加载意图树失败。";
  } finally {
    loading.value = false;
  }
}

function syncSelectedCode(code) {
  selectedIntentCode.value = code || "";
  const nextQuery = { ...route.query };
  if (code) {
    nextQuery.intentCode = code;
  } else {
    delete nextQuery.intentCode;
  }
  void router.replace({ query: nextQuery });
}

function handleSearch() {
  keyword.value = keywordInput.value.trim();
}

function handleResetSearch() {
  keywordInput.value = "";
  keyword.value = "";
}

function openCreateDialog(parent = null) {
  dialogMode.value = "create";
  dialogTarget.value = null;
  dialogParent.value = parent;
  form.value = {
    ...buildEmptyForm(),
    intentCode: parent ? `${parent.intentCode}.child` : "",
    level: parent ? (parent.level || 0) + 1 : 1,
    parentCode: parent?.intentCode || ""
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
    errorText.value = "MCP 节点必须填写工具 ID。";
    return;
  }

  submitting.value = true;
  errorText.value = "";
  try {
    const payload = {
      name: form.value.name.trim(),
      level: Number(form.value.level) || 0,
      parentCode: form.value.parentCode || null,
      description: form.value.description.trim() || "",
      kind: form.value.kind,
      collectionName: form.value.kind === 0 ? form.value.collectionName.trim() : "",
      mcpToolId: form.value.kind === 2 ? form.value.mcpToolId.trim() : "",
      examples: form.value.examplesText
        ? form.value.examplesText.split("\n").map((item) => item.trim()).filter(Boolean)
        : [],
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

function selectNode(item) {
  syncSelectedCode(item.intentCode);
}

watch(
  () => route.query.intentCode,
  (value) => {
    if (value) {
      selectedIntentCode.value = String(value);
    }
  },
  { immediate: true }
);

watch(rows, (nextRows) => {
  if (!selectedIntentCode.value && nextRows.length > 0) {
    selectedIntentCode.value = nextRows[0].intentCode;
  }
});

onMounted(() => {
  void loadTree();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Intent Tree"
      title="意图树"
      description="从树形结构查看和维护意图节点，支持新建、编辑、启停和删除。"
    >
      <template #meta>
        <div class="intent-tree-header-meta">
          <span class="admin-badge is-muted">节点：{{ rows.length }}</span>
          <span class="admin-badge is-muted">展开：{{ expandedCount }}</span>
          <span class="admin-badge is-muted">焦点：{{ selectedNodeLabel }}</span>
          <span class="admin-badge is-muted">路径：{{ selectedPath }}</span>
          <span class="admin-badge is-muted">搜索：{{ searchSummary }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="loadTree">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog()">新建根节点</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </div>

    <section class="admin-detail-card intent-hero-card">
      <div class="intent-hero-copy">
        <p class="trace-hero-tag">Intent Overview</p>
        <h2>{{ selectedNode ? "当前树形焦点已定位" : "当前树形焦点未定位" }}</h2>
        <p>先用树形结构定位节点，再在右侧补全路径、资源归属和 prompt 配置，编辑、创建和删除都保留原有工作流。</p>
      </div>
      <div class="intent-hero-grid">
        <div><span>当前节点</span><strong>{{ selectedNodeLabel }}</strong></div>
        <div><span>Intent Code</span><strong>{{ selectedNode?.intentCode || "--" }}</strong></div>
        <div><span>路径</span><strong>{{ selectedPath }}</strong></div>
        <div><span>展开分支</span><strong>{{ expandedCount }}</strong></div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>节点列表</h2>
            <p>使用搜索、定位和行内操作快速管理意图树节点。</p>
          </div>
          <span class="admin-page-count">{{ filteredRows.length }} / {{ rows.length }} 节点</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <input
              v-model="keywordInput"
              class="admin-input admin-search-input"
              type="search"
              placeholder="搜索名称 / intent code / 路径..."
              @keydown.enter.prevent="handleSearch"
            />
            <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
            <button class="admin-button--ghost" type="button" @click="handleResetSearch">重置</button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="loadTree">刷新</button>
            <button class="admin-button" type="button" @click="openCreateDialog()">新建节点</button>
          </div>
        </div>

        <div v-if="loading && filteredRows.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="filteredRows.length === 0" class="admin-empty">暂无匹配的意图节点</div>
        <div v-else class="admin-tree-list">
          <article
            v-for="item in filteredRows"
            :key="item.id"
            :class="['admin-tree-item', selectedNode?.id === item.id ? 'is-active' : '']"
          >
            <div class="admin-tree-item-header">
              <div class="admin-tree-item-title-wrap">
                <button
                  v-if="item.hasChildren"
                  class="admin-tree-expand"
                  type="button"
                  :aria-label="isExpanded(item.intentCode) ? '收起节点' : '展开节点'"
                  :title="isExpanded(item.intentCode) ? '收起节点' : '展开节点'"
                  @click.stop="toggleExpanded(item.intentCode)"
                >
                  {{ isExpanded(item.intentCode) ? "▾" : "▸" }}
                </button>
                <button class="admin-tree-item-title" type="button" @click="selectNode(item)">
                  <span v-for="depthIndex in item.depth" :key="depthIndex" class="admin-tree-indent" />
                  <div>
                    <strong>{{ item.name || item.intentCode }}</strong>
                    <small class="is-code">{{ item.intentCode }}</small>
                  </div>
                </button>
              </div>
              <div class="admin-inline-actions">
                <button class="admin-button--ghost" type="button" @click="openCreateDialog(item)">新建子节点</button>
                <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
                <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                  {{ item.enabled === 1 || item.enabled === true ? "禁用" : "启用" }}
                </button>
                <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
              </div>
            </div>

            <div class="admin-tree-meta">
              <span class="admin-badge">{{ levelLabel(item.level) }}</span>
              <span :class="['admin-badge', item.kind === 0 ? 'is-success' : item.kind === 2 ? 'is-warn' : 'is-muted']">
                {{ kindLabel(item.kind) }}
              </span>
              <span class="admin-badge is-muted">TopK {{ item.topK ?? "--" }}</span>
              <span v-if="item.hasChildren" class="admin-badge is-muted">{{ item.childCount }} children</span>
              <span v-if="item.kind === 0 && item.collectionName" class="admin-badge is-success">
                Collection: {{ item.collectionName }}
              </span>
              <span v-if="item.kind === 2 && item.mcpToolId" class="admin-badge is-warn">Tool: {{ item.mcpToolId }}</span>
              <span v-if="item.parentName" class="admin-badge is-muted">{{ item.parentName }}</span>
              <span v-if="item.exampleCount > 0" class="admin-badge is-muted">{{ item.exampleCount }} examples</span>
            </div>

            <p class="admin-muted">{{ item.description || "No description" }}</p>
          </article>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>节点详情</h3>
          <p class="admin-detail-card-desc">点击左侧节点后，在这里查看层级、来源资源和 prompt 配置。</p>
          <div v-if="selectedNode" class="admin-kv">
            <div><dt>摘要</dt><dd>{{ selectedMetaSummary }}</dd></div>
            <div><dt>名称</dt><dd>{{ selectedNode.name || "--" }}</dd></div>
            <div><dt>Intent Code</dt><dd class="is-code">{{ selectedNode.intentCode }}</dd></div>
            <div><dt>层级</dt><dd>{{ levelLabel(selectedNode.level) }}</dd></div>
            <div><dt>类型</dt><dd>{{ kindLabel(selectedNode.kind) }}</dd></div>
            <div><dt>父节点</dt><dd>{{ selectedNode.parentName || selectedNode.parentCode || "ROOT" }}</dd></div>
            <div>
              <dt>资源</dt>
              <dd>
                {{ selectedNode.kind === 0 ? selectedNode.collectionName || "--" : selectedNode.kind === 2 ? selectedNode.mcpToolId || "--" : "系统意图" }}
              </dd>
            </div>
            <div><dt>子节点</dt><dd>{{ selectedNode.childCount }}</dd></div>
            <div><dt>示例数</dt><dd>{{ selectedNode.exampleCount }}</dd></div>
            <div><dt>状态</dt><dd>{{ selectedNode.enabled === 1 || selectedNode.enabled === true ? "启用" : "禁用" }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDateTime(selectedNode.updateTime || selectedNode.createTime) }}</dd></div>
          </div>
          <div v-else class="admin-empty-sm">暂无选中节点</div>
        </article>

        <article class="admin-detail-card">
          <h3>路径与示例</h3>
          <p class="admin-detail-card-desc">查看路径、描述和常用示例，帮助快速判断节点是否符合预期。</p>
          <div v-if="selectedNode" class="admin-card-list">
            <div class="admin-card-item">
              <h3>路径</h3>
              <p>{{ selectedNode.pathText }}</p>
            </div>
            <div class="admin-card-item">
              <h3>描述</h3>
              <p>{{ selectedNode.description || "No description" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>Prompt</h3>
              <p>{{ selectedNode.promptSnippet || selectedNode.promptTemplate || "--" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>Examples</h3>
              <p v-if="selectedExamples.length > 0">{{ selectedExamples.slice(0, 5).join(" / ") }}</p>
              <p v-else>--</p>
            </div>
          </div>
          <div v-else class="admin-empty-sm">选择一个节点后可查看完整信息</div>
        </article>
      </aside>
    </section>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog" style="width:min(700px,calc(100% - 32px));">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? (dialogParent ? "新建子节点" : "新建根节点") : "编辑意图节点" }}</h3>
        <p>{{ dialogMode === "create" ? "填写意图节点信息" : "修改意图节点信息" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-form-grid-2">
            <div class="admin-dialog-field">
              <label>Intent Code</label>
              <input
                v-model="form.intentCode"
                class="admin-input"
                placeholder="请输入 intent code"
                :disabled="dialogMode === 'edit'"
              />
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
            <input v-model="form.collectionName" class="admin-input" placeholder="知识库 Collection 名称" />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>MCP 工具 ID</label>
            <input v-model="form.mcpToolId" class="admin-input" placeholder="例如：sales_query" />
          </div>

          <div class="admin-dialog-field">
            <label>描述</label>
            <textarea
              v-model="form.description"
              class="admin-input"
              rows="2"
              placeholder="节点描述"
              style="resize:vertical;"
            />
          </div>

          <div class="admin-dialog-field">
            <label>示例问题（每行一个）</label>
            <textarea
              v-model="form.examplesText"
              class="admin-input"
              rows="3"
              placeholder="示例问题1&#10;示例问题2"
              style="resize:vertical;"
            />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 片段</label>
            <textarea
              v-model="form.promptSnippet"
              class="admin-input"
              rows="2"
              placeholder="可选"
              style="resize:vertical;"
            />
          </div>

          <div class="admin-dialog-field">
            <label>Prompt 模板</label>
            <textarea
              v-model="form.promptTemplate"
              class="admin-input"
              rows="3"
              placeholder="可选"
              style="resize:vertical;"
            />
          </div>

          <div v-if="form.kind === 2" class="admin-dialog-field">
            <label>参数 Prompt 模板</label>
            <textarea
              v-model="form.paramPromptTemplate"
              class="admin-input"
              rows="2"
              placeholder="MCP 节点参数模板"
              style="resize:vertical;"
            />
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

<style scoped>
.admin-tree-item {
  border: 1px solid var(--admin-line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--admin-shadow);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.admin-tree-item.is-active {
  border-color: rgba(79, 70, 229, 0.45);
  box-shadow: 0 18px 45px rgba(79, 70, 229, 0.12);
  transform: translateY(-1px);
}

.admin-tree-item-title {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  border: 0;
  background: transparent;
  padding: 0;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.admin-tree-item-title-wrap {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.admin-tree-expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-top: 1px;
  border: 1px solid var(--admin-line);
  border-radius: 999px;
  background: #fff;
  color: var(--admin-ink-soft);
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
}

.admin-tree-expand:hover {
  border-color: var(--admin-line-strong);
  background: var(--admin-bg-soft);
  color: var(--admin-ink);
}

.intent-hero-card {
  display: grid;
  gap: 16px;
}

.intent-hero-copy {
  display: grid;
  gap: 8px;
}

.intent-hero-copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.intent-hero-copy p {
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

.intent-tree-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.intent-hero-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.intent-hero-grid > div {
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.intent-hero-grid span {
  display: block;
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.intent-hero-grid strong {
  display: block;
  margin-top: 6px;
  color: var(--admin-ink);
  font-size: 15px;
  word-break: break-word;
}

.admin-tree-item-title strong {
  display: block;
  color: var(--admin-ink, #1e293b);
  font-size: 15px;
  line-height: 1.35;
}

.admin-tree-item-title small {
  display: block;
  margin-top: 2px;
}

@media (max-width: 960px) {
  .intent-hero-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
