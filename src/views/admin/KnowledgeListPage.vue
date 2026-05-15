<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  renameKnowledgeBase
} from "../../services/knowledgeService";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, size: pageSize });

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

const records = computed(() => pageRecords(page.value));

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
    const recordsList = Array.isArray(firstPage?.records) ? firstPage.records : [];
    let documentTotal = 0;
    let activeTotal = 0;
    const creators = new Set();

    recordsList.forEach((kb) => {
      const dc = kb.documentCount ?? 0;
      documentTotal += dc;
      if (dc > 0) activeTotal++;
      if (kb.createdBy) creators.add(kb.createdBy);
    });

    stats.value = {
      totalCount: firstPage?.total ?? recordsList.length,
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

function formatStatValue(value) {
  if (statsLoading.value) return "--";
  return Number(value || 0).toLocaleString("zh-CN");
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  void loadKnowledgeBases();
  void loadStats();
}

function handleRefresh() {
  pageNo.value = 1;
  void loadKnowledgeBases();
  void loadStats();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value -= 1;
    void loadKnowledgeBases();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value += 1;
    void loadKnowledgeBases();
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
      collectionName:
        createForm.value.collectionName.trim() ||
        createForm.value.name.trim().replace(/\s+/g, "-").toLowerCase(),
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

watch(keyword, () => {
  pageNo.value = 1;
  void loadKnowledgeBases();
});

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
      description="管理所有知识库、集合名称和文档汇总，支持搜索、新建、重命名和删除。"
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
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
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
      <StatCard title="有文档知识库" :value="formatStatValue(stats.activeCount)" tone="emerald">
        <template #icon>活</template>
      </StatCard>
      <StatCard title="创建者数量" :value="formatStatValue(stats.creatorCount)" tone="amber">
        <template #icon>人</template>
      </StatCard>
    </div>

    <section class="admin-table-card">
      <div class="admin-table-card__header">
        <div>
          <h2>知识库列表</h2>
          <p>查看知识库的集合、模型和文档汇总信息，点击名称可进入知识库详情。</p>
        </div>
        <span class="admin-page-count">{{ pageTotal(page) }} 条</span>
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
                <button class="admin-link" type="button" @click="router.push(`/admin/knowledge/${item.id}`)">
                  {{ item.name || "--" }}
                </button>
              </td>
              <td class="is-code">{{ item.embeddingModel || "--" }}</td>
              <td>
                <span class="admin-badge is-outline">{{ item.collectionName || "--" }}</span>
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
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
        </div>
      </div>
    </section>

    <div v-if="createDialogOpen" class="admin-dialog-overlay" @click.self="closeCreateDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeCreateDialog">&times;</button>
        <h3>新建知识库</h3>
        <p>填写知识库基础信息。</p>
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
        <p>修改知识库名称。</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>名称</label>
            <input v-model="renameValue" class="admin-input" placeholder="请输入新的名称" />
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
        <p class="admin-confirm-text">删除后该知识库不可恢复，是否继续？</p>
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
