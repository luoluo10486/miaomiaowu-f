<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  createSampleQuestion,
  deleteSampleQuestion,
  getSampleQuestionsPage,
  updateSampleQuestion
} from "../../services/sampleQuestionService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keywordInput = ref("");
const keyword = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: pageSize });
const selectedQuestionId = ref(null);

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref(buildEmptyForm());
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const questions = computed(() => pageRecords(page.value));
const selectedQuestion = computed(() => {
  if (selectedQuestionId.value) {
    return questions.value.find((item) => item.id === selectedQuestionId.value) || questions.value[0] || null;
  }
  return questions.value[0] || null;
});

const latestQuestion = computed(() => questions.value[0] || null);
const selectedQuestionLength = computed(() => selectedQuestion.value?.question?.length || 0);
const activeFilterLabel = computed(() => (keyword.value ? keyword.value : "全部样例"));
const visibleQuestionCount = computed(() => pageTotal(page.value));
const currentPageLabel = computed(() => `${pageNo.value} / ${pageCount(page.value)}`);
const latestQuestionLabel = computed(() => {
  if (!latestQuestion.value) return "--";
  return `${latestQuestion.value.title || "--"} · ${latestQuestion.value.question?.length || 0} 字`;
});
const selectedQuestionLabel = computed(() => {
  if (!selectedQuestion.value) return "--";
  return `${selectedQuestion.value.title || "--"} · ${selectedQuestion.value.question?.length || 0} 字`;
});
const questionSummaryLabel = computed(() => `筛选: ${activeFilterLabel.value} · 当前页: ${visibleQuestionCount.value}`);

const stats = computed(() => [
  {
    title: "Total",
    value: pageTotal(page.value),
    hint: "样例问题总数",
    tone: "indigo"
  },
  {
    title: "Titled",
    value: questions.value.filter((item) => Boolean(item.title)).length,
    hint: "带标题的样例问题",
    tone: "emerald"
  },
  {
    title: "No Desc",
    value: questions.value.filter((item) => !item.description).length,
    hint: "缺少描述的记录",
    tone: "amber"
  },
  {
    title: "Visible",
    value: questions.value.length,
    hint: "当前页展示数量",
    tone: "cyan"
  }
]);

function buildEmptyForm() {
  return {
    title: "",
    description: "",
    question: ""
  };
}

async function loadData() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getSampleQuestionsPage(pageNo.value, pageSize, keyword.value);
    const nextSelected = questions.value.find((item) => item.id === selectedQuestionId.value);
    if (!nextSelected && questions.value.length > 0) {
      selectedQuestionId.value = questions.value[0].id;
    }
  } catch (error) {
    errorText.value = error?.message || "加载样例问题失败。";
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

function selectQuestion(item) {
  selectedQuestionId.value = item.id;
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
    title: item.title || "",
    description: item.description || "",
    question: item.question || ""
  };
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  dialogTarget.value = null;
}

async function handleSubmit() {
  if (!form.value.question.trim()) return;
  submitting.value = true;
  errorText.value = "";
  try {
    const payload = {
      title: form.value.title.trim() || null,
      description: form.value.description.trim() || null,
      question: form.value.question.trim()
    };
    if (dialogMode.value === "create") {
      await createSampleQuestion(payload);
      pageNo.value = 1;
      await loadData();
    } else if (dialogTarget.value) {
      await updateSampleQuestion(dialogTarget.value.id, payload);
      await loadData();
    }
    dialogOpen.value = false;
  } catch (error) {
    errorText.value = error?.message || "保存样例问题失败。";
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
    await deleteSampleQuestion(deleteTarget.value.id);
    closeDeleteDialog();
    pageNo.value = 1;
    await loadData();
  } catch (error) {
    errorText.value = error?.message || "删除样例问题失败。";
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
      tag="Sample Questions"
      title="样例问题管理"
      description="维护首页或推荐区域展示的样例问题内容，支持搜索、编辑和删除。"
    >
      <template #meta>
        <div class="sample-header-meta">
          <span class="admin-badge is-muted">筛选：{{ activeFilterLabel }}</span>
          <span class="admin-badge is-muted">当前页：{{ questions.length }}</span>
          <span class="admin-badge is-muted">选中：{{ selectedQuestionLabel }}</span>
          <span class="admin-badge is-muted">最新：{{ latestQuestionLabel }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增样例</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-detail-card sample-questions-hero">
      <div class="sample-questions-hero__copy">
        <p class="trace-hero-tag">Sample Question Overview</p>
        <h2>{{ selectedQuestion?.title || "样例问题总览" }}</h2>
        <p>
          {{ selectedQuestion?.description || "在同一页面维护欢迎页和推荐位使用的示例问题内容，搜索、编辑和删除都保持在清晰的管理流程里。" }}
        </p>
      </div>
      <div class="sample-questions-hero__grid">
        <div><span>当前选中</span><strong>{{ selectedQuestion?.title || "--" }}</strong></div>
        <div><span>问题长度</span><strong>{{ selectedQuestionLength }}</strong></div>
        <div><span>当前页</span><strong>{{ currentPageLabel }}</strong></div>
        <div><span>最新条目</span><strong>{{ latestQuestionLabel }}</strong></div>
      </div>
    </section>

    <section class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>样例问题列表</h2>
            <p>搜索、分页、编辑和删除都在同一张表里完成。</p>
          </div>
          <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
        </div>

        <div class="admin-toolbar">
          <div class="admin-toolbar-left">
            <input
              v-model="keywordInput"
              class="admin-input admin-search-input"
              type="search"
              placeholder="搜索标题 / 描述 / 问题..."
              @keydown.enter.prevent="handleSearch"
            />
            <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
            <button class="admin-button--ghost" type="button" @click="resetSearch">重置</button>
          </div>
          <div class="admin-toolbar-right">
            <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
            <button class="admin-button" type="button" @click="openCreateDialog">新增样例</button>
          </div>
        </div>

        <div v-if="loading && questions.length === 0" class="admin-empty">加载中...</div>
        <div v-else-if="questions.length === 0" class="admin-empty">暂无样例问题</div>
        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:220px;">标题</th>
                <th>描述</th>
                <th>问题</th>
                <th style="width:160px;">更新时间</th>
                <th style="width:160px;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in questions"
                :key="item.id"
                :class="selectedQuestion?.id === item.id ? 'is-active-row' : ''"
                @click="selectQuestion(item)"
              >
                <td>
                  <strong>{{ item.title || "--" }}</strong>
                </td>
                <td>{{ item.description || "--" }}</td>
                <td class="admin-truncate">{{ item.question }}</td>
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

        <div v-if="questions.length > 0" class="admin-pagination">
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
          <h3>问题预览</h3>
          <p class="admin-detail-card-desc">点击表格中的任意一行即可查看完整内容。</p>
          <div class="admin-kv admin-kv--compact" style="margin-bottom: 16px;">
            <div><dt>当前筛选</dt><dd>{{ activeFilterLabel }}</dd></div>
            <div><dt>当前页结果</dt><dd>{{ visibleQuestionCount }}</dd></div>
            <div><dt>最新条目</dt><dd>{{ latestQuestionLabel }}</dd></div>
          </div>
          <div v-if="selectedQuestion" class="admin-card-list">
            <div class="admin-card-item">
              <h3>标题</h3>
              <p>{{ selectedQuestion.title || "--" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>描述</h3>
              <p>{{ selectedQuestion.description || "--" }}</p>
            </div>
            <div class="admin-card-item">
              <h3>问题</h3>
              <p>{{ selectedQuestion.question }}</p>
            </div>
            <div class="admin-card-item">
              <h3>更新时间</h3>
              <p>{{ formatDateTime(selectedQuestion.updateTime || selectedQuestion.createTime) }}</p>
            </div>
          </div>
          <div v-else class="admin-empty-sm">暂无选中问题</div>
        </article>
      </aside>
    </section>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新增样例问题" : "编辑样例问题" }}</h3>
        <p>{{ dialogMode === "create" ? "填写首页或推荐区域展示的样例问题。 " : "修改样例问题内容。" }}</p>
        <div class="admin-dialog-body">
          <div class="admin-dialog-field">
            <label>标题</label>
            <input v-model="form.title" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>描述</label>
            <input v-model="form.description" class="admin-input" placeholder="可选" />
          </div>
          <div class="admin-dialog-field">
            <label>问题</label>
            <textarea v-model="form.question" class="admin-textarea" rows="4" placeholder="请输入样例问题内容" />
          </div>
        </div>
        <div class="admin-dialog-footer">
          <button class="admin-button--ghost" type="button" @click="closeDialog">取消</button>
          <button class="admin-button" type="button" :disabled="submitting || !form.question.trim()" @click="handleSubmit">
            {{ submitting ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="deleteDialogOpen" class="admin-dialog-overlay" @click.self="closeDeleteDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDeleteDialog">&times;</button>
        <h3>确认删除</h3>
        <p class="admin-confirm-text">删除后该样例问题将不再展示，是否继续？</p>
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
.sample-questions-hero {
  display: grid;
  gap: 16px;
  margin-bottom: 18px;
}

.sample-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sample-questions-hero__copy {
  display: grid;
  gap: 8px;
}

.sample-questions-hero__copy h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.25;
}

.sample-questions-hero__copy p {
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

.sample-questions-hero__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.sample-questions-hero__grid > div {
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.sample-questions-hero__grid span {
  display: block;
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sample-questions-hero__grid strong {
  display: block;
  margin-top: 6px;
  color: var(--admin-ink);
  font-size: 15px;
  word-break: break-word;
}

.is-active-row {
  background: rgba(79, 70, 229, 0.05);
}

.admin-truncate {
  max-width: 520px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 960px) {
  .sample-questions-hero__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
