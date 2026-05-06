<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  renameKnowledgeBase
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const page = ref({ records: [], total: 0 });

async function loadKnowledgeBases() {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getKnowledgeBases(1, 50, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载知识库失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const name = askText("请输入知识库名称");
  if (!name) {
    return;
  }

  const collectionName = askText("请输入 collection 名称", name.replace(/\s+/g, "-").toLowerCase());
  if (!collectionName) {
    return;
  }

  const embeddingModel = askText("请输入 embedding model", "text-embedding-3-large");
  if (embeddingModel === null) {
    return;
  }

  try {
    await createKnowledgeBase({
      name,
      collectionName,
      embeddingModel
    });
    await loadKnowledgeBases();
  } catch (error) {
    errorText.value = error?.message || "创建知识库失败。";
  }
}

async function handleRename(item) {
  const nextName = askText("请输入新的知识库名称", item.name || "");
  if (!nextName) {
    return;
  }

  try {
    await renameKnowledgeBase(item.id, nextName);
    await loadKnowledgeBases();
  } catch (error) {
    errorText.value = error?.message || "重命名知识库失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction(`确认删除知识库“${item.name || item.id}”吗？`)) {
    return;
  }

  try {
    await deleteKnowledgeBase(item.id);
    await loadKnowledgeBases();
  } catch (error) {
    errorText.value = error?.message || "删除知识库失败。";
  }
}

onMounted(() => {
  void loadKnowledgeBases();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge</span>
        <h2 class="admin-page-title">知识库管理</h2>
        <p class="admin-page-subtitle">补齐知识库列表、搜索、创建、重命名、删除和进入文档详情的入口。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button" type="button" @click="handleCreate">Create KB</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-toolbar-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <input
            v-model="keyword"
            class="admin-input"
            type="search"
            placeholder="搜索知识库名称"
            @keydown.enter.prevent="loadKnowledgeBases"
          />
          <button class="admin-button--ghost" type="button" @click="loadKnowledgeBases">Search</button>
        </div>

        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} result(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadKnowledgeBases">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无知识库数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Collection</th>
              <th>Embedding Model</th>
              <th>Documents</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>
                <p>{{ item.name || "--" }}</p>
                <small class="admin-list-meta is-code">{{ item.id }}</small>
              </td>
              <td>{{ item.collectionName || "--" }}</td>
              <td>{{ item.embeddingModel || "--" }}</td>
              <td>{{ item.documentCount ?? 0 }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="router.push(`/admin/knowledge/${item.id}`)">
                    Documents
                  </button>
                  <button class="admin-button--ghost" type="button" @click="handleRename(item)">Rename</button>
                  <button class="admin-button--danger" type="button" @click="handleDelete(item)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
