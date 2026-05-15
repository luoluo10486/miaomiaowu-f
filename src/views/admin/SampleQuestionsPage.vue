<script setup>
import { computed, onMounted, ref, watch } from "vue";
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
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0, pages: 1, current: 1, size: pageSize });

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({ title: "", description: "", question: "" });
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

const questions = computed(() => pageRecords(page.value));
const questionStats = computed(() => [
  {
    title: "Questions",
    value: pageTotal(page.value),
    hint: "示例问题总数",
    tone: "indigo"
  },
  {
    title: "Filled",
    value: questions.value.filter((item) => Boolean(item.title)).length,
    hint: "带标题的示例问题",
    tone: "emerald"
  },
  {
    title: "Empty Desc",
    value: questions.value.filter((item) => !item.description).length,
    hint: "未填写描述的记录",
    tone: "amber"
  }
]);

async function loadData() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getSampleQuestionsPage(pageNo.value, pageSize, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载示例问题失败。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  keyword.value = searchInput.value.trim();
  void loadData();
}

function handleRefresh() {
  pageNo.value = 1;
  void loadData();
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

function openCreateDialog() {
  dialogMode.value = "create";
  dialogTarget.value = null;
  form.value = { title: "", description: "", question: "" };
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
    errorText.value = error?.message || "保存失败。";
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
    errorText.value = error?.message || "删除失败。";
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
      tag="Sample Questions"
      title="示例问题管理"
      description="用于维护首页或推荐区域展示的示例问题内容。"
    >
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增示例</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-stat-grid">
      <StatCard
        v-for="stat in questionStats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </section>

    <article class="admin-table-card">
      <div class="admin-toolbar" style="margin-bottom: 16px;">
        <div class="admin-toolbar-left">
          <input
            v-model="searchInput"
            class="admin-input"
            type="search"
            placeholder="搜索标题 / 描述 / 问题"
            @keydown.enter.prevent="handleSearch"
          />
          <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">共 {{ pageTotal(page).toLocaleString("zh-CN") }} 条</span>
          <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
          <button class="admin-button" type="button" @click="openCreateDialog">新增示例</button>
        </div>
      </div>

      <div v-if="loading && questions.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="questions.length === 0" class="admin-empty">暂无示例问题</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>描述</th>
              <th>问题</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in questions" :key="item.id">
              <td>{{ item.title || "--" }}</td>
              <td>{{ item.description || "--" }}</td>
              <td>{{ item.question }}</td>
              <td>{{ formatDateTime(item.updateTime || item.createTime) }}</td>
              <td>
                <div class="admin-inline-actions">
                  <button class="admin-button--ghost" type="button" @click="openEditDialog(item)">编辑</button>
                  <button class="admin-button--danger" type="button" @click="openDeleteDialog(item)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="questions.length > 0" class="admin-pagination">
        <span class="admin-page-count">共 {{ pageTotal(page) }} 条</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
        </div>
      </div>
    </article>

    <div v-if="dialogOpen" class="admin-dialog-overlay" @click.self="closeDialog">
      <div class="admin-dialog">
        <button class="admin-dialog-close" type="button" @click="closeDialog">&times;</button>
        <h3>{{ dialogMode === "create" ? "新增示例问题" : "编辑示例问题" }}</h3>
        <p>{{ dialogMode === "create" ? "填写首页展示或推荐问题内容。" : "修改示例问题信息。" }}</p>
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
            <textarea v-model="form.question" class="admin-textarea" rows="4" placeholder="请输入示例问题内容" />
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
        <p class="admin-confirm-text">删除后该示例问题将不再展示，是否继续？</p>
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
