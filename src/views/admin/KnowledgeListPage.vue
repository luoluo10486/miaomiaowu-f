<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  renameKnowledgeBase
} from "../../services/knowledgeService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0 });

const createDialogOpen = ref(false);
const createForm = ref({ name: "", collectionName: "", embeddingModel: "text-embedding-3-large" });
const createSubmitting = ref(false);

const renameDialogOpen = ref(false);
const renameTarget = ref(null);
const renameValue = ref("");
const renameSubmitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const stats = ref({ totalCount: 0, documentCount: 0, activeCount: 0, creatorCount: 0 });
const statsLoading = ref(false);

async function loadKnowledgeBases() {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getKnowledgeBases(pageNo.value, pageSize, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载知识库失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

async function loadStats() {
  statsLoading.value = true;
  try {
    const firstPage = await getKnowledgeBases(1, 200, keyword.value);
    const records = Array.isArray(firstPage?.records) ? firstPage.records : [];
    let documentTotal = 0;
    let activeTotal = 0;
    const creators = new Set();

    records.forEach((kb) => {
      const dc = kb.documentCount ?? 0;
      documentTotal += dc;
      if (dc > 0) activeTotal++;
      if (kb.createdBy) creators.add(kb.createdBy);
    });

    stats.value = {
      totalCount: firstPage?.total ?? records.length,
      documentCount: documentTotal,
      activeCount: activeTotal,
      creatorCount: creators.size
    };
  } catch {
    stats.value = { totalCount: 0, documentCount: 0, activeCount: 0, creatorCount: 0 };
  } finally {
    statsLoading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  loadKnowledgeBases();
  loadStats();
}

function handleRefresh() {
  pageNo.value = 1;
  loadKnowledgeBases();
  loadStats();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value--;
    loadKnowledgeBases();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value++;
    loadKnowledgeBases();
  }
}

function openCreateDialog() {
  createForm.value = { name: "", collectionName: "", embeddingModel: "text-embedding-3-large" };
  createDialogOpen.value = true;
}

function closeCreateDialog() {
  createDialogOpen.value = false;
}

async function handleCreate() {
  if (!createForm.value.name.trim()) return;
  createSubmitting.value = true;
  try {
    await createKnowledgeBase({
      name: createForm.value.name.trim(),
      collectionName: createForm.value.collectionName.trim() || createForm.value.name.trim().replace(/\s+/g, "-").toLowerCase(),
      embeddingModel: createForm.value.embeddingModel.trim() || "text-embedding-3-large"
    });
    createDialogOpen.value = false;
    pageNo.value = 1;
    await loadKnowledgeBases();
    await loadStats();
  } catch (error) {
    errorText.value = error?.message || "创建知识库失败。";
  } finally {
    createSubmitting.value = false;
  }
}

function openRenameDialog(item) {
  renameTarget.value = item;
  renameValue.value = item.name || "";
  renameDialogOpen.value = true;
}

function closeRenameDialog() {
  renameDialogOpen.value = false;
  renameTarget.value = null;
}

async function handleRename() {
  if (!renameValue.value.trim() || !renameTarget.value) return;
  renameSubmitting.value = true;
  try {
    await renameKnowledgeBase(renameTarget.value.id, renameValue.value.trim());
    renameDialogOpen.value = false;
    renameTarget.value = null;
    await loadKnowledgeBases();
  } catch (error) {
    errorText.value = error?.message || "重命名知识库失败。";
  } finally {
    renameSubmitting.value = false;
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
    await deleteKnowledgeBase(deleteTarget.value.id);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
    pageNo.value = 1;
    await loadKnowledgeBases();
    await loadStats();
  } catch (error) {
    errorText.value = error?.message || "删除知识库失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

function formatStatValue(value) {
  if (statsLoading.value) return "--";
  return Number(value || 0).toLocaleString("zh-CN");
}

watch(keyword, () => {
  pageNo.value = 1;
  loadKnowledgeBases();
});

onMounted(() => {
  void loadKnowledgeBases();
  void loadStats();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Knowledge</span>
        <h2 class="admin-page-title">知识库管理</h2>
        <p class="admin-page-subtitle">管理所有知识库及其文档</p>
      </div>

      <div class="admin-page-actions">
        <input
          v-model="searchInput"
          class="admin-input"
          type="search"
          placeholder="搜索知识库名称"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建知识库</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-indigo"><span>库</span></div>
          <div>
            <span class="admin-stat-label">知识库</span>
            <span class="admin-stat-value">{{ formatStatValue(stats.totalCount) }}</span>
          </div>
        </div>
        <span class="admin-stat-scope admin-stat-scope--stamp">全部</span>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-blue"><span>文</span></div>
          <div>
            <span class="admin-stat-label">文档数</span>
            <span class="admin-stat-value">{{ formatStatValue(stats.documentCount) }}</span>
          </div>
        </div>
        <span class="admin-stat-scope admin-stat-scope--stamp">全部</span>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-emerald"><span>活</span></div>
          <div>
            <span class="admin-stat-label">含文档知识库</span>
            <span class="admin-stat-value">{{ formatStatValue(stats.activeCount) }}</span>
          </div>
        </div>
        <span class="admin-stat-scope admin-stat-scope--stamp">全部</span>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-amber"><span>人</span></div>
          <div>
            <span class="admin-stat-label">创建用户数</span>
            <span class="admin-stat-value">{{ formatStatValue(stats.creatorCount) }}</span>
          </div>
        </div>
        <span class="admin-stat-scope admin-stat-scope--stamp">全部</span>
      </article>
    </div>

    <article class="admin-table-card">
      <div v-if="loading" class="admin-empty">加载中...</div>
      <div v-else-if="pageRecords(page).length === 0" class="admin-empty">暂无知识库，点击上方按钮创建</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>Embedding 模型</th>
              <th>Collection</th>
              <th>文档数</th>
              <th>负责人</th>
              <th>创建时间</th>
              <th>修改时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
              <td>
                <button class="admin-link" type="button" @click="router.push(`/admin/knowledge/${item.id}`)">
                  {{ item.name || "--" }}
                </button>
              </td>
              <td class="is-code">{{ item.embeddingModel || "--" }}</td>
              <td>
                <span class="admin-badge">{{ item.collectionName || "--" }}</span>
              </td>
              <td>{{ item.documentCount ?? "--" }}</td>
              <td>{{ item.createdBy || "--" }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.updateTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="openRenameDialog(item)">编辑</button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pageRecords(page).length > 0" class="admin-pagination">
        <span>共 {{ pageTotal(page) }} 条</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
        </div>
      </div>
    </article>

    <div v-if="createDialogOpen" class="admin-dialog-overlay" @click.self="closeCreateDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeCreateDialog">&times;</button>
        <h3>新建知识库</h3>
        <p>填写知识库信息</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="createForm.name" class="admin-input" placeholder="请输入知识库名称" />
          </div>
          <div class="admin-dialog-field">
            <label>Collection 名称</label>
            <input v-model="createForm.collectionName" class="admin-input" placeholder="留空将自动生成" />
          </div>
          <div class="admin-dialog-field">
            <label>Embedding 模型</label>
            <input v-model="createForm.embeddingModel" class="admin-input" placeholder="text-embedding-3-large" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeCreateDialog">取消</button>
          <button class="admin-button" type="button" :disabled="createSubmitting || !createForm.name.trim()" @click="handleCreate">
            {{ createSubmitting ? "创建中..." : "创建" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="renameDialogOpen" class="admin-dialog-overlay" @click.self="closeRenameDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeRenameDialog">&times;</button>
        <h3>重命名知识库</h3>
        <p>修改知识库名称</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="renameValue" class="admin-input" placeholder="请输入知识库名称" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeRenameDialog">取消</button>
          <button class="admin-button" type="button" :disabled="renameSubmitting || !renameValue.trim()" @click="handleRename">
            {{ renameSubmitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">知识库删除后当前不提供恢复入口。确定要继续吗？</p>
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
