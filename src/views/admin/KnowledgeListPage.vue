<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  renameKnowledgeBase
} from "../../services/knowledgeService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();

const PAGE_SIZE = 10;
const STATS_PAGE_SIZE = 200;

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const page = ref({ records: [], total: 0, size: PAGE_SIZE });
const stats = ref({
  totalCount: 0,
  documentCount: 0,
  activeCount: 0,
  creatorCount: 0
});
const statsLoading = ref(false);
const statsRequestId = ref(0);

const createDialogOpen = ref(false);
const createSubmitting = ref(false);
const createForm = ref({
  name: "",
  collectionName: "",
  embeddingModel: "text-embedding-3-large"
});

const renameDialogOpen = ref(false);
const renameSubmitting = ref(false);
const renameTarget = ref(null);
const renameValue = ref("");

const deleteDialogOpen = ref(false);
const deleteSubmitting = ref(false);
const deleteTarget = ref(null);

const records = computed(() => pageRecords(page.value));

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function normalizeCollectionName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function resetCreateForm() {
  createForm.value = {
    name: "",
    collectionName: "",
    embeddingModel: "text-embedding-3-large"
  };
}

async function loadKnowledgeBases(current = pageNo.value, currentKeyword = keyword.value) {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getKnowledgeBases(current, PAGE_SIZE, currentKeyword.trim());
  } catch (error) {
    errorText.value = getErrorMessage(error, "加载知识库列表失败，请稍后重试。");
  } finally {
    loading.value = false;
  }
}

async function loadStats(currentKeyword = keyword.value) {
  const requestId = ++statsRequestId.value;
  statsLoading.value = true;

  try {
    const filter = currentKeyword.trim();
    const firstPage = await getKnowledgeBases(1, STATS_PAGE_SIZE, filter || undefined);
    if (statsRequestId.value !== requestId) return;

    let documentCount = 0;
    let activeCount = 0;
    const creators = new Set();

    const collect = (items = []) => {
      items.forEach((kb) => {
        const docCount = Number(kb.documentCount ?? 0);
        documentCount += docCount;
        if (docCount > 0) {
          activeCount += 1;
        }
        if (kb.createdBy) {
          creators.add(kb.createdBy);
        }
      });
    };

    collect(firstPage.records || []);

    const totalCount = Number(firstPage.total ?? firstPage.records?.length ?? 0);
    const totalPages = firstPage.pages || Math.max(1, Math.ceil(totalCount / STATS_PAGE_SIZE));

    for (let pageIndex = 2; pageIndex <= totalPages; pageIndex += 1) {
      const nextPage = await getKnowledgeBases(pageIndex, STATS_PAGE_SIZE, filter || undefined);
      if (statsRequestId.value !== requestId) return;
      collect(nextPage.records || []);
    }

    if (statsRequestId.value !== requestId) return;

    stats.value = {
      totalCount,
      documentCount,
      activeCount,
      creatorCount: creators.size
    };
  } catch (error) {
    if (statsRequestId.value !== requestId) return;
    console.error(error);
    stats.value = {
      totalCount: 0,
      documentCount: 0,
      activeCount: 0,
      creatorCount: 0
    };
  } finally {
    if (statsRequestId.value === requestId) {
      statsLoading.value = false;
    }
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  void loadKnowledgeBases(1, keyword.value);
}

function handleRefresh() {
  pageNo.value = 1;
  void loadKnowledgeBases(1, keyword.value);
  void loadStats(keyword.value);
}

function goPrev() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadKnowledgeBases(pageNo.value, keyword.value);
}

function goNext() {
  const totalPages = pageCount(page.value);
  if (pageNo.value >= totalPages) return;
  pageNo.value += 1;
  void loadKnowledgeBases(pageNo.value, keyword.value);
}

function openCreateDialog() {
  resetCreateForm();
  createDialogOpen.value = true;
}

function closeCreateDialog() {
  createDialogOpen.value = false;
}

async function handleCreate() {
  const name = createForm.value.name.trim();
  if (!name) return;

  createSubmitting.value = true;
  try {
    await createKnowledgeBase({
      name,
      collectionName: createForm.value.collectionName.trim() || normalizeCollectionName(name),
      embeddingModel: createForm.value.embeddingModel.trim() || "text-embedding-3-large"
    });
    closeCreateDialog();
    pageNo.value = 1;
    await loadKnowledgeBases(1, keyword.value);
    await loadStats(keyword.value);
  } catch (error) {
    errorText.value = getErrorMessage(error, "创建知识库失败，请稍后重试。");
  } finally {
    createSubmitting.value = false;
  }
}

function openRenameDialog(item) {
  renameTarget.value = item;
  renameValue.value = item?.name || "";
  renameDialogOpen.value = true;
}

function closeRenameDialog() {
  renameDialogOpen.value = false;
  renameTarget.value = null;
}

async function handleRename() {
  const target = renameTarget.value;
  const nextName = renameValue.value.trim();
  if (!target || !nextName) return;

  renameSubmitting.value = true;
  try {
    await renameKnowledgeBase(target.id, nextName);
    closeRenameDialog();
    await loadKnowledgeBases(pageNo.value, keyword.value);
    await loadStats(keyword.value);
  } catch (error) {
    errorText.value = getErrorMessage(error, "重命名知识库失败，请稍后重试。");
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
  const target = deleteTarget.value;
  if (!target) return;

  deleteSubmitting.value = true;
  try {
    await deleteKnowledgeBase(target.id);
    closeDeleteDialog();
    pageNo.value = 1;
    await loadKnowledgeBases(1, keyword.value);
    await loadStats(keyword.value);
  } catch (error) {
    errorText.value = getErrorMessage(error, "删除知识库失败，请稍后重试。");
  } finally {
    deleteSubmitting.value = false;
  }
}

function formatStatValue(value) {
  if (statsLoading.value) return "--";
  return Number(value || 0).toLocaleString("zh-CN");
}

function goToDocuments(item) {
  router.push(`/admin/knowledge/${item.id}`);
}

onMounted(() => {
  void loadKnowledgeBases();
  void loadStats();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Knowledge"
      title="知识库管理"
      description="管理知识库集合、embedding 模型和文档总量，支持搜索、新建、重命名和删除。"
    >
      <template #actions>
        <input
          v-model="searchInput"
          class="admin-input admin-page-header-search"
          type="search"
          placeholder="搜索知识库名称"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新建知识库</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard title="知识库总数" :value="formatStatValue(stats.totalCount)" tone="indigo">
        <template #icon>库</template>
      </StatCard>
      <StatCard title="文档总数" :value="formatStatValue(stats.documentCount)" tone="blue">
        <template #icon>文</template>
      </StatCard>
      <StatCard title="活跃知识库" :value="formatStatValue(stats.activeCount)" tone="emerald">
        <template #icon>活</template>
      </StatCard>
      <StatCard title="创建者数" :value="formatStatValue(stats.creatorCount)" tone="amber">
        <template #icon>人</template>
      </StatCard>
    </div>

    <section class="admin-table-card">
      <div class="admin-table-card__header">
        <div>
          <h2>知识库列表</h2>
          <p>查看知识库集合、embedding 模型和文档总量，点击名称进入文档管理。</p>
        </div>
        <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
      </div>

      <div v-if="loading && records.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="records.length === 0" class="admin-empty">暂无知识库，点击右上角按钮创建。</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>Embedding 模型</th>
              <th>Collection</th>
              <th>文档数</th>
              <th>创建者</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.id">
              <td>
                <button class="admin-link" type="button" @click="goToDocuments(item)">
                  {{ item.name || "--" }}
                </button>
              </td>
              <td class="is-code">{{ item.embeddingModel || "--" }}</td>
              <td>
                <span class="admin-badge is-muted">{{ item.collectionName || "--" }}</span>
              </td>
              <td>{{ item.documentCount ?? "--" }}</td>
              <td>{{ item.createdBy || "--" }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.updateTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="openRenameDialog(item)">重命名</button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="records.length > 0" class="admin-pagination">
        <span>共 {{ pageTotal(page) }} 条</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">
            下一页
          </button>
        </div>
      </div>
    </section>

    <div v-if="createDialogOpen" class="admin-dialog-overlay" @click.self="closeCreateDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeCreateDialog">&times;</button>
        <h3>新建知识库</h3>
        <p>填写知识库基础信息，Collection 名称可留空自动生成。</p>
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
        <p>修改当前知识库的显示名称，不影响 Collection。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="renameValue" class="admin-input" placeholder="请输入新名称" />
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
        <p class="admin-confirm-text">删除后该知识库及其文档将无法恢复，是否继续？</p>
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
