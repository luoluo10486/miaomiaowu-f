<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  createQueryTermMapping,
  deleteQueryTermMapping,
  getQueryTermMappingsPage,
  updateQueryTermMapping
} from "../../services/queryTermMappingService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keywordInput = ref("");
const keyword = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: pageSize });
const selectedMappingId = ref(null);

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref(buildEmptyForm());
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const mappings = computed(() => pageRecords(page.value));
const currentPageLabel = computed(() => `${pageNo.value} / ${pageCount(page.value)}`);
const enabledCount = computed(() => mappings.value.filter((item) => item.enabled).length);
const disabledCount = computed(() => mappings.value.filter((item) => !item.enabled).length);
const exactCount = computed(() => mappings.value.filter((item) => String(item.matchType || "").toUpperCase() === "EXACT").length);
const regexCount = computed(() => mappings.value.filter((item) => String(item.matchType || "").toUpperCase() === "REGEX").length);
const selectedMapping = computed(() => {
  if (selectedMappingId.value) {
    return mappings.value.find((item) => item.id === selectedMappingId.value) || mappings.value[0] || null;
  }
  return mappings.value[0] || null;
});
const latestMapping = computed(() => mappings.value[0] || null);
const selectedMappingLabel = computed(() =>
  selectedMapping.value ? `${selectedMapping.value.sourceTerm} → ${selectedMapping.value.targetTerm}` : "--"
);
const latestMappingLabel = computed(() => {
  if (!latestMapping.value) return "--";
  return `${latestMapping.value.sourceTerm} → ${latestMapping.value.targetTerm}`;
});

const stats = computed(() => [
  {
    title: "Total",
    value: pageTotal(page.value),
    hint: "关键词映射总数",
    tone: "indigo"
  },
  {
    title: "Enabled",
    value: mappings.value.filter((item) => item.enabled).length,
    hint: "当前页启用数量",
    tone: "emerald"
  },
  {
    title: "Disabled",
    value: mappings.value.filter((item) => !item.enabled).length,
    hint: "当前页禁用数量",
    tone: "amber"
  },
  {
    title: "Visible",
    value: mappings.value.length,
    hint: "当前页展示数量",
    tone: "cyan"
  }
]);

function buildEmptyForm() {
  return {
    sourceTerm: "",
    targetTerm: "",
    matchType: "EXACT",
    enabled: true,
    priority: 0,
    remark: ""
  };
}

async function loadData() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getQueryTermMappingsPage(pageNo.value, pageSize, keyword.value);
    if (!selectedMappingId.value && mappings.value.length > 0) {
      selectedMappingId.value = mappings.value[0].id;
    }
  } catch (error) {
    errorText.value = error?.message || "加载映射规则失败。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = keywordInput.value.trim();
  void loadData();
}

function handleRefresh() {
  pageNo.value = 1;
  void loadData();
}

function resetSearch() {
  keywordInput.value = "";
  keyword.value = "";
  handleRefresh();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value -= 1;
    void loadData();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value += 1;
    void loadData();
  }
}

function selectMapping(item) {
  selectedMappingId.value = item.id;
}

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = buildEmptyForm();
  dialogOpen.value = true;
}

function openEditDialog(item) {
  dialogMode.value = "edit";
  dialogTarget.value = item;
  form.value = {
    sourceTerm: item.sourceTerm || "",
    targetTerm: item.targetTerm || "",
    matchType: item.matchType || "EXACT",
    enabled: item.enabled ?? true,
    priority: item.priority ?? 0,
    remark: item.remark || ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.sourceTerm.trim() || !form.value.targetTerm.trim()) return;
  submitting.value = true;
  errorText.value = "";
  try {
    const payload = {
      sourceTerm: form.value.sourceTerm.trim(),
      targetTerm: form.value.targetTerm.trim(),
      matchType: form.value.matchType,
      enabled: form.value.enabled,
      priority: Number(form.value.priority) || 0,
      remark: form.value.remark.trim() || null
    };
    if (dialogMode.value === "create") {
      await createQueryTermMapping(payload);
      pageNo.value = 1;
      await loadData();
    } else if (dialogTarget.value) {
      await updateQueryTermMapping(dialogTarget.value.id, payload);
      await loadData();
    }
    dialogOpen.value = false;
  } catch (error) {
    errorText.value = error?.message || "保存映射规则失败。";
  } finally {
    submitting.value = false;
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
  errorText.value = "";
  try {
    await deleteQueryTermMapping(deleteTarget.value.id);
    closeDeleteDialog();
    pageNo.value = 1;
    await loadData();
  } catch (error) {
    errorText.value = error?.message || "删除映射规则失败。";
  } finally {
    deleteSubmitting.value = false;
  }
}

onMounted(() => {
  void loadData();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Query Term Mapping"
      title="关键词映射"
      description="管理查询归一化规则，支持搜索、编辑、启用和删除。"
    >
      <template #meta>
        <div class="admin-header-meta">
          <span class="admin-badge is-muted">筛选：{{ keyword || "全部词条" }}</span>
          <span class="admin-badge is-muted">当前页：{{ mappings.length }}</span>
          <span class="admin-badge is-muted">选中：{{ selectedMappingLabel }}</span>
          <span class="admin-badge is-muted">最新：{{ latestMappingLabel }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增映射</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </section>

    <section class="admin-detail-card mappings-hero">
      <div class="mappings-hero-copy">
        <p class="trace-hero-tag">Query Normalization</p>
        <h2>关键词映射总览</h2>
        <p>维护原始词到目标词的映射规则，快速定位当前筛选、选中词条和最新规则。</p>
      </div>
      <div class="mappings-hero-side">
        <div class="mappings-hero-cardline">
          <span class="mappings-hero-cardlabel">当前筛选</span>
          <strong>{{ keyword || "全部词条" }}</strong>
        </div>
        <div class="mappings-hero-cardline">
          <span class="mappings-hero-cardlabel">当前页</span>
          <strong>{{ currentPageLabel }}</strong>
        </div>
        <div class="mappings-hero-cardline">
          <span class="mappings-hero-cardlabel">选中规则</span>
          <strong>{{ selectedMappingLabel }}</strong>
        </div>
        <div class="mappings-hero-cardline">
          <span class="mappings-hero-cardlabel">最新规则</span>
          <strong>{{ latestMappingLabel }}</strong>
        </div>
        <div class="mappings-hero-cardline">
          <span class="mappings-hero-cardlabel">启用 / 禁用</span>
          <strong>{{ enabledCount }} / {{ disabledCount }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>映射列表</h2>
            <p>一眼查看原始词、目标词、匹配类型和启用状态。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <input
              v-model="keywordInput"
              class="admin-input admin-search-input"
              type="search"
              placeholder="搜索原始词 / 目标词..."
              @keydown.enter.prevent="handleSearch"
            />
            <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
            <button class="admin-button--ghost" type="button" @click="resetSearch">重置</button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
            <button class="admin-button" type="button" @click="openCreateDialog">新增映射</button>
          </div>
        </div>

        <div v-if="loading && mappings.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="mappings.length === 0" class="admin-empty">暂无映射规则</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:220px;">原始词</th>
                <th style="width:220px;">目标词</th>
                <th style="width:120px;">匹配类型</th>
                <th style="width:90px;">优先级</th>
                <th style="width:90px;">状态</th>
                <th>备注</th>
                <th style="width:160px;">更新时间</th>
                <th style="width:160px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in mappings"
                :key="item.id"
                :class="selectedMapping?.id === item.id ? 'is-active-row' : ''"
                @click="selectMapping(item)"
              >
                <td><strong>{{ item.sourceTerm }}</strong></td>
                <td>{{ item.targetTerm }}</td>
                <td><span class="admin-badge is-muted">{{ item.matchType }}</span></td>
                <td>{{ item.priority }}</td>
                <td>
                  <span :class="['admin-badge', item.enabled ? 'is-success' : 'is-muted']">
                    {{ item.enabled ? "启用" : "禁用" }}
                  </span>
                </td>
                <td>{{ item.remark || "--" }}</td>
                <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="admin-button--ghost" type="button" @click.stop="openEditDialog(item)">编辑</button>
                    <button class="admin-button--danger" type="button" @click.stop="openDeleteDialog(item)">删除</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="mappings.length > 0" class="admin-pagination">
          <span>共 {{ pageTotal(page) }} 条</span>
          <div class="admin-pagination-right">
            <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
            <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
            <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>规则分布</h3>
          <p class="admin-detail-card-desc">先看当前页里的匹配类型和启用状态，再进入具体规则详情。</p>
          <div class="admin-kv">
            <div><dt>当前页</dt><dd>{{ mappings.length }}</dd></div>
            <div><dt>启用</dt><dd>{{ enabledCount }}</dd></div>
            <div><dt>禁用</dt><dd>{{ disabledCount }}</dd></div>
            <div><dt>精确 / 正则</dt><dd>{{ exactCount }} / {{ regexCount }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>规则预览</h3>
          <p class="admin-detail-card-desc">点击任意一行查看映射规则的完整细节。</p>
          <div v-if="selectedMapping" class="admin-kv">
            <div class="admin-mapping-preview">
              <p class="admin-cell-title">{{ selectedMapping.sourceTerm }}</p>
              <p class="admin-cell-subtitle is-secondary">→ {{ selectedMapping.targetTerm }}</p>
            </div>
            <div><dt>原始词</dt><dd>{{ selectedMapping.sourceTerm }}</dd></div>
            <div><dt>目标词</dt><dd>{{ selectedMapping.targetTerm }}</dd></div>
            <div><dt>匹配类型</dt><dd>{{ selectedMapping.matchType }}</dd></div>
            <div><dt>优先级</dt><dd>{{ selectedMapping.priority }}</dd></div>
            <div><dt>状态</dt><dd>{{ selectedMapping.enabled ? "启用" : "禁用" }}</dd></div>
            <div><dt>更新时间</dt><dd>{{ formatDateTime(selectedMapping.updateTime || selectedMapping.createTime) }}</dd></div>
          </div>
          <div v-else class="admin-empty-sm">暂无选中规则</div>
        </article>
      </aside>
    </section>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新增映射规则" : "编辑映射规则" }}</h3>
        <p>{{ dialogMode === "create" ? "配置查询归一化的关键词映射规则。" : "修改映射规则内容。" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>原始词</label>
            <input v-model="form.sourceTerm" class="admin-input" placeholder="请输入原始词" />
          </div>
          <div class="admin-dialog-field">
            <label>目标词</label>
            <input v-model="form.targetTerm" class="admin-input" placeholder="请输入目标词" />
          </div>
          <div class="admin-dialog-field">
            <label>匹配类型</label>
            <select v-model="form.matchType" class="admin-select">
              <option value="EXACT">精确匹配</option>
              <option value="REGEX">正则匹配</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>优先级</label>
            <input v-model.number="form.priority" class="admin-input" type="number" min="0" />
          </div>
          <div class="admin-dialog-field">
            <label>状态</label>
            <select v-model="form.enabled" class="admin-select">
              <option :value="true">启用</option>
              <option :value="false">禁用</option>
            </select>
          </div>
          <div class="admin-dialog-field">
            <label>备注</label>
            <input v-model="form.remark" class="admin-input" placeholder="可选" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.sourceTerm.trim() || !form.targetTerm.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">删除后该映射规则将失效，是否继续？</p>
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
.is-active-row {
  background: rgba(79, 70, 229, 0.05);
}

.admin-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-mapping-preview {
  grid-column: 1 / -1;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid var(--admin-line);
  border-radius: 14px;
  background: var(--admin-bg-soft);
}

.mappings-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.mappings-hero-copy {
  display: grid;
  gap: 8px;
}

.mappings-hero-copy h2 {
  margin: 0;
  font-size: 24px;
}

.mappings-hero-copy p,
.mappings-hero-side p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.mappings-hero-side {
  display: grid;
  gap: 12px;
  min-width: 280px;
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.76);
}

.mappings-hero-cardline {
  display: grid;
  gap: 4px;
}

.mappings-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.mappings-hero-cardline strong {
  color: var(--admin-ink);
  font-size: 14px;
  word-break: break-word;
}

@media (max-width: 960px) {
  .mappings-hero {
    flex-direction: column;
  }

  .mappings-hero-side {
    min-width: 0;
  }
}
</style>
