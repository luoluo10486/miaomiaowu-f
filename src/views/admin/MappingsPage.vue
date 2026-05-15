<script setup>
import { computed, onMounted, ref, watch } from "vue";
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
const selectedMapping = computed(() => {
  if (selectedMappingId.value) {
    return mappings.value.find((item) => item.id === selectedMappingId.value) || mappings.value[0] || null;
  }
  return mappings.value[0] || null;
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

watch(keyword, () => {
  pageNo.value = 1;
  void loadData();
});

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
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增映射</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
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
          <h3>规则预览</h3>
          <p class="admin-detail-card-desc">点击任意一行查看映射规则的完整细节。</p>
          <div v-if="selectedMapping" class="admin-kv">
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
</style>
