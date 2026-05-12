<script setup>
import { onMounted, ref, watch } from "vue";
import {
  createSampleQuestion,
  deleteSampleQuestion,
  getSampleQuestionsPage,
  updateSampleQuestion
} from "../../services/adminService";
import { formatDateTime, pageCount, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const searchInput = ref("");
const pageNo = ref(1);
const pageSize = 10;
const page = ref({ records: [], total: 0 });

const dialogOpen = ref(false);
const dialogMode = ref("create");
const dialogTarget = ref(null);
const form = ref({ title: "", description: "", question: "" });
const submitting = ref(false);

const deleteDialogOpen = ref(false);
const deleteTarget = ref(null);
const deleteSubmitting = ref(false);

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
  loadData();
}

function handleRefresh() {
  pageNo.value = 1;
  loadData();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value--;
    loadData();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value++;
    loadData();
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
  try {
    await deleteSampleQuestion(deleteTarget.value.id);
    deleteDialogOpen.value = false;
    deleteTarget.value = null;
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
  loadData();
});

onMounted(() => {
  void loadData();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Sample Questions</span>
        <h2 class="admin-page-title">示例问题管理</h2>
        <p class="admin-page-subtitle">配置欢迎页的示例问题与推荐问法</p>
      </div>
      <div class="admin-page-actions">
        <input
          v-model="searchInput"
          class="admin-input"
          type="search"
          placeholder="搜索标题/描述/问题"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button--ghost" type="button" @click="handleSearch">搜索</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
        <button class="admin-button" type="button" @click="openCreateDialog">新增示例</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-table-card">
      <div v-if="loading && pageRecords(page).length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="pageRecords(page).length === 0" class="admin-empty">暂无示例问题，点击上方按钮新增</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>描述</th>
              <th>示例问题</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.id">
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

      <div v-if="pageRecords(page).length > 0" class="admin-pagination">
        <span>共 {{ pageTotal(page) }} 条</span>
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
        <p>{{ dialogMode === "create" ? "填写示例问题信息" : "修改示例问题信息" }}</p>
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
            <label>示例问题</label>
            <textarea v-model="form.question" class="admin-textarea" placeholder="请输入示例问题内容" rows="3" />
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
        <p class="admin-confirm-text">删除后该示例问题将不会出现在欢迎页，是否继续？</p>
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
