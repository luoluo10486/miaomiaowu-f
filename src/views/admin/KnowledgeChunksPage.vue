<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  createKnowledgeChunk,
  deleteKnowledgeChunk,
  getKnowledgeChunkLogsPage,
  getKnowledgeChunksPage,
  getKnowledgeDocument,
  toggleKnowledgeChunk,
  updateKnowledgeChunk
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords } from "./adminShared";

const route = useRoute();
const router = useRouter();
const kbId = computed(() => route.params.kbId);
const docId = computed(() => route.params.docId);
const loading = ref(false);
const errorText = ref("");
const doc = ref(null);
const chunksPage = ref({ records: [] });
const logsPage = ref({ records: [] });

async function loadChunks() {
  loading.value = true;
  errorText.value = "";

  try {
    const [docData, chunkData, logData] = await Promise.all([
      getKnowledgeDocument(docId.value),
      getKnowledgeChunksPage(docId.value, { current: 1, size: 100 }),
      getKnowledgeChunkLogsPage(docId.value, 1, 10)
    ]);

    doc.value = docData;
    chunksPage.value = chunkData;
    logsPage.value = logData;
  } catch (error) {
    errorText.value = error?.message || "加载分块数据失败。";
  } finally {
    loading.value = false;
  }
}

async function handleCreateChunk() {
  const content = askText("请输入新的 chunk 内容");
  if (!content) {
    return;
  }

  try {
    await createKnowledgeChunk(docId.value, { content });
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "创建分块失败。";
  }
}

async function handleEdit(item) {
  const content = askText("编辑 chunk 内容", item.content || "");
  if (!content) {
    return;
  }

  try {
    await updateKnowledgeChunk(docId.value, item.id, { content });
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "更新分块失败。";
  }
}

async function handleToggle(item) {
  try {
    await toggleKnowledgeChunk(docId.value, item.id, !(item.enabled === 1 || item.enabled === true));
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "切换分块状态失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction("确认删除这个 chunk 吗？")) {
    return;
  }

  try {
    await deleteKnowledgeChunk(docId.value, item.id);
    await loadChunks();
  } catch (error) {
    errorText.value = error?.message || "删除分块失败。";
  }
}

onMounted(() => {
  void loadChunks();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge Chunks</span>
        <h2 class="admin-page-title">{{ doc?.docName || "文档分块" }}</h2>
        <p class="admin-page-subtitle">对齐文档分块页，支持查看 chunk、手工新增、编辑、启停和最近切分日志。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push(`/admin/knowledge/${kbId}`)">Back</button>
        <button class="admin-button" type="button" @click="handleCreateChunk">Add Chunk</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <h3>Chunks</h3>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button" type="button" :disabled="loading" @click="loadChunks">
              {{ loading ? "Refreshing..." : "Refresh" }}
            </button>
          </div>
        </div>

        <div v-if="pageRecords(chunksPage).length === 0" class="admin-empty">暂无 chunk 数据</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Content</th>
                <th>Chars</th>
                <th>Tokens</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pageRecords(chunksPage)" :key="item.id">
                <td>{{ item.chunkIndex ?? "--" }}</td>
                <td>{{ item.content || "--" }}</td>
                <td>{{ item.charCount ?? "--" }}</td>
                <td>{{ item.tokenCount ?? "--" }}</td>
                <td>
                  <span :class="['admin-badge', item.enabled === 1 || item.enabled === true ? '' : 'is-muted']">
                    {{ item.enabled === 1 || item.enabled === true ? "Enabled" : "Disabled" }}
                  </span>
                </td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click="handleEdit(item)">Edit</button>
                    <button class="admin-button--ghost" type="button" @click="handleToggle(item)">
                      {{ item.enabled === 1 || item.enabled === true ? "Disable" : "Enable" }}
                    </button>
                    <button class="admin-button--danger" type="button" @click="handleDelete(item)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="admin-detail-card">
        <h3>Recent Chunk Logs</h3>
        <div v-if="pageRecords(logsPage).length === 0" class="admin-empty">暂无日志</div>
        <div v-else class="admin-card-list">
          <div v-for="item in pageRecords(logsPage)" :key="item.id" class="admin-card-item">
            <h3>{{ item.status || "unknown" }}</h3>
            <p>{{ item.chunkStrategy || item.processMode || "--" }}</p>
            <p>{{ formatDateTime(item.createTime || item.startTime) }}</p>
            <p>{{ item.errorMessage || "No error message" }}</p>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
