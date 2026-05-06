<script setup>
import { onMounted, ref } from "vue";
import {
  createSampleQuestion,
  deleteSampleQuestion,
  getSampleQuestionsPage,
  updateSampleQuestion
} from "../../services/adminService";
import { askText, confirmAction, formatDateTime, pageRecords, pageTotal } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const keyword = ref("");
const page = ref({ records: [], total: 0 });

async function loadQuestions() {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getSampleQuestionsPage(1, 50, keyword.value);
  } catch (error) {
    errorText.value = error?.message || "加载示例问题失败。";
  } finally {
    loading.value = false;
  }
}

async function handleCreate() {
  const title = askText("请输入标题");
  if (title === null) {
    return;
  }

  const description = askText("请输入描述");
  if (description === null) {
    return;
  }

  const question = askText("请输入示例问题");
  if (!question) {
    return;
  }

  try {
    await createSampleQuestion({ title, description, question });
    await loadQuestions();
  } catch (error) {
    errorText.value = error?.message || "创建示例问题失败。";
  }
}

async function handleEdit(item) {
  const title = askText("编辑标题", item.title || "");
  if (title === null) {
    return;
  }

  const description = askText("编辑描述", item.description || "");
  if (description === null) {
    return;
  }

  const question = askText("编辑问题", item.question || "");
  if (!question) {
    return;
  }

  try {
    await updateSampleQuestion(item.id, { title, description, question });
    await loadQuestions();
  } catch (error) {
    errorText.value = error?.message || "更新示例问题失败。";
  }
}

async function handleDelete(item) {
  if (!confirmAction("确认删除这个示例问题吗？")) {
    return;
  }

  try {
    await deleteSampleQuestion(item.id);
    await loadQuestions();
  } catch (error) {
    errorText.value = error?.message || "删除示例问题失败。";
  }
}

onMounted(() => {
  void loadQuestions();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Sample Questions</span>
        <h2 class="admin-page-title">示例问题</h2>
        <p class="admin-page-subtitle">补齐问答首页推荐问题的后台维护入口，支持搜索、新增、编辑、删除。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button" type="button" @click="handleCreate">Create Question</button>
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
            placeholder="搜索标题或问题"
            @keydown.enter.prevent="loadQuestions"
          />
          <button class="admin-button--ghost" type="button" @click="loadQuestions">Search</button>
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} question(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadQuestions">
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无示例问题</div>
      <div v-else class="admin-card-list">
        <div v-for="item in pageRecords(page)" :key="item.id" class="admin-card-item">
          <div class="admin-toolbar">
            <div class="admin-toolbar-left">
              <h3>{{ item.title || "Untitled" }}</h3>
            </div>
            <div class="admin-inline-actions">
              <button class="admin-button--ghost" type="button" @click="handleEdit(item)">Edit</button>
              <button class="admin-button--danger" type="button" @click="handleDelete(item)">Delete</button>
            </div>
          </div>
          <p>{{ item.description || "No description" }}</p>
          <p>{{ item.question }}</p>
          <p>{{ formatDateTime(item.updateTime || item.createTime) }}</p>
        </div>
      </div>
    </article>
  </section>
</template>
