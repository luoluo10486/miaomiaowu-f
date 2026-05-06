<script setup>
import { computed, onMounted, ref } from "vue";
import {
  batchDisableIntentNodes,
  batchEnableIntentNodes,
  createIntentNode,
  deleteIntentNode,
  getIntentTree,
  updateIntentNode
} from "../../services/adminService";
import { askNumber, askText, confirmAction, flattenIntentTree } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const tree = ref([]);

const rows = computed(() => flattenIntentTree(tree.value));

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

async function handleCreate(parent = null) {
  const intentCode = askText("请输入 intent code", parent ? `${parent.intentCode}.child` : "");
  if (!intentCode) {
    return;
  }

  const name = askText("请输入名称");
  if (!name) {
    return;
  }

  const description = askText("请输入描述", "");
  const level = askNumber("请输入 level", parent ? (parent.level || 0) + 1 : 1);

  try {
    await createIntentNode({
      intentCode,
      name,
      level: Number(level || 1),
      parentCode: parent?.intentCode || "",
      description: description || ""
    });
    await loadTree();
  } catch (error) {
    errorText.value = error?.message || "创建意图节点失败。";
  }
}

async function handleEdit(item) {
  const name = askText("编辑名称", item.name || "");
  if (!name) {
    return;
  }

  const description = askText("编辑描述", item.description || "");
  if (description === null) {
    return;
  }

  const topK = askNumber("编辑 topK", item.topK ?? 3);

  try {
    await updateIntentNode(item.id, {
      name,
      description: description || "",
      topK: Number(topK || 0),
      enabled: item.enabled ?? 1
    });
    await loadTree();
  } catch (error) {
    errorText.value = error?.message || "更新意图节点失败。";
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

async function handleDelete(item) {
  if (!confirmAction(`确认删除意图节点“${item.name || item.intentCode}”吗？`)) {
    return;
  }

  try {
    await deleteIntentNode(item.id);
    await loadTree();
  } catch (error) {
    errorText.value = error?.message || "删除意图节点失败。";
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
        <p class="admin-page-subtitle">补齐意图树浏览和节点操作入口，支持新增根节点、子节点、编辑、启停和删除。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="loadTree">Refresh</button>
        <button class="admin-button" type="button" @click="handleCreate()">Create Root</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div v-if="rows.length === 0" class="admin-empty">暂无意图树数据</div>
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
              <button class="admin-button--ghost" type="button" @click="handleCreate(item)">Add Child</button>
              <button class="admin-button--ghost" type="button" @click="handleEdit(item)">Edit</button>
              <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                {{ item.enabled === 1 || item.enabled === true ? "Disable" : "Enable" }}
              </button>
              <button class="admin-button--danger" type="button" @click="handleDelete(item)">Delete</button>
            </div>
          </div>

          <div class="admin-tree-meta">
            <span class="admin-badge">Level {{ item.level ?? "--" }}</span>
            <span class="admin-badge is-muted">TopK {{ item.topK ?? "--" }}</span>
            <span class="admin-badge is-warn">{{ item.parentName || "Root" }}</span>
          </div>

          <p class="admin-muted">{{ item.description || "No description" }}</p>
        </article>
      </div>
    </article>
  </section>
</template>
