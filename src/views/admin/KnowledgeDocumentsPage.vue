<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getKnowledgeBase,
  getKnowledgeDocumentsPage,
  startKnowledgeDocumentChunk,
  setKnowledgeDocumentEnabled,
  updateKnowledgeDocument,
  deleteKnowledgeDocument,
  uploadKnowledgeDocument
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const base = ref(null);
const page = ref({ records: [], total: 0 });
const fileRef = ref(null);

async function loadDocuments() {
  loading.value = true;
  errorText.value = "";

  try {
    const [baseData, pageData] = await Promise.all([
      getKnowledgeBase(kbId.value),
      getKnowledgeDocumentsPage(kbId.value, { current: 1, size: 50, keyword: keyword.value })
    ]);

    base.value = baseData;
    page.value = pageData;
  } catch (error) {
    errorText.value = error?.message || "加载知识库文档失败。";
  } finally {
    loading.value = false;
  }
}

function openFilePicker() {
  fileRef.value?.click();
}

async function handleFileChange(event) {
  const file = event.target?.files?.[0];
  if (!file) {
    return;
  }

  try {
    await uploadKnowledgeDocument(kbId.value, {
      sourceType: "file",
      file,
      processMode: "chunk",
      chunkStrategy: "paragraph"
    });
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "上传文件失败。";
  } finally {
    event.target.value = "";
  }
}

async function handleAddUrl() {
  const sourceLocation = askText("请输入文档 URL");
  if (!sourceLocation) {
    return;
  }

  try {
    await uploadKnowledgeDocument(kbId.value, {
      sourceType: "url",
      sourceLocation,
      processMode: "chunk",
      chunkStrategy: "paragraph"
    });
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "添加 URL 文档失败。";
  }
}

async function handleEdit(item) {
  const docName = askText("请输入新的文档名称", item.docName || "");
  if (!docName) {
    return;
  }

  try {
    await updateKnowledgeDocument(item.id, {
      docName,
      processMode: item.processMode || "chunk",
      chunkStrategy: item.chunkStrategy || "paragraph",
      sourceLocation: item.sourceLocation || undefined
    });
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "更新文档失败。";
  }
}

async function handleChunk(item) {
  try {
    await startKnowledgeDocumentChunk(item.id);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "执行文档切分失败。";
  }
}

async function handleToggle(item) {
  try {
    await setKnowledgeDocumentEnabled(item.id, !item.enabled);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "切换文档状态失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction(`确认删除文档“${item.docName || item.id}”吗？`)) {
    return;
  }

  try {
    await deleteKnowledgeDocument(item.id);
    await loadDocuments();
  } catch (error) {
    errorText.value = error?.message || "删除文档失败。";
  }
}

onMounted(() => {
  void loadDocuments();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge Docs</span>
        <h2 class="admin-page-title">{{ base?.name || "知识库文档" }}</h2>
        <p class="admin-page-subtitle">支持文件上传、URL 文档接入、切分、启停和跳转到文档分块详情。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/knowledge')">Back</button>
        <button class="admin-button--ghost" type="button" @click="handleAddUrl">Add URL</button>
        <button class="admin-button" type="button" @click="openFilePicker">Upload File</button>
        <input ref="fileRef" class="admin-hidden-file" type="file" @change="handleFileChange" />
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
            placeholder="搜索文档名称"
            @keydown.enter.prevent="loadDocuments"
          />
          <button class="admin-button--ghost" type="button" @click="loadDocuments">Search</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} document(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadDocuments">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无文档数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Source</th>
              <th>Status</th>
              <th>Chunks</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>
                <p>{{ item.docName || "--" }}</p>
                <small class="admin-list-meta">{{ item.processMode || "chunk" }}</small>
              </td>
              <td>{{ item.sourceType || item.fileType || "--" }}</td>
              <td>
                <span :class="['admin-badge', item.enabled ? '' : 'is-muted']">
                  {{ item.status || (item.enabled ? "enabled" : "disabled") }}
                </span>
              </td>
              <td>{{ item.chunkCount ?? 0 }}</td>
              <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button
                    class="admin-button--ghost"
                    type="button"
                    @click="router.push(`/admin/knowledge/${kbId}/docs/${item.id}`)"
                  >
                    Chunks
                  </button>
                  <button class="admin-button--ghost" type="button" @click="handleChunk(item)">Chunk</button>
                  <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                    {{ item.enabled ? "Disable" : "Enable" }}
                  </button>
                  <button class="admin-button--ghost" type="button" @click="handleEdit(item)">Edit</button>
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
