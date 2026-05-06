<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getRagTraceRuns } from "../../services/adminService";
import { formatDateTime, formatRelativeStatus, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const filters = ref({
  traceId: "",
  conversationId: "",
  taskId: "",
  status: ""
});
const page = ref({ records: [], total: 0 });

async function loadRuns() {
  loading.value = true;
  errorText.value = "";

  try {
    page.value = await getRagTraceRuns(1, 50, filters.value);
  } catch (error) {
    errorText.value = error?.message || "加载 trace 列表失败。";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadRuns();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Trace Runs</span>
        <h2 class="admin-page-title">链路追踪</h2>
        <p class="admin-page-subtitle">补齐 trace 列表、条件筛选和进入详情页的能力，用于排查会话链路与任务执行状态。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button" type="button" :disabled="loading" @click="loadRuns">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-toolbar-card">
      <div class="admin-toolbar-left">
        <input v-model="filters.traceId" class="admin-input" type="search" placeholder="Trace ID" />
        <input v-model="filters.conversationId" class="admin-input" type="search" placeholder="Conversation ID" />
        <input v-model="filters.taskId" class="admin-input" type="search" placeholder="Task ID" />
        <select v-model="filters.status" class="admin-select">
          <option value="">All Status</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="RUNNING">RUNNING</option>
          <option value="FAILED">FAILED</option>
        </select>
        <button class="admin-button--ghost" type="button" @click="loadRuns">Apply</button>
      </div>
    </article>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <h3>Trace List</h3>
        </div>
        <div class="admin-page-count">{{ pageTotal(page) }} run(s)</div>
      </div>

      <div v-if="pageRecords(page).length === 0" class="admin-empty">暂无 trace 数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Trace</th>
              <th>User</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Started</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pageRecords(page)" :key="item.traceId">
              <td>
                <p>{{ item.traceName || item.traceId }}</p>
                <small class="admin-list-meta is-code">{{ item.conversationId || "--" }}</small>
              </td>
              <td>{{ item.userName || item.username || "--" }}</td>
              <td>
                <span :class="['admin-badge', item.status === 'FAILED' ? 'is-danger' : item.status === 'RUNNING' ? 'is-warn' : '']">
                  {{ formatRelativeStatus(item.status) }}
                </span>
              </td>
              <td>{{ item.durationMs ? `${item.durationMs} ms` : "--" }}</td>
              <td>{{ formatDateTime(item.startTime) }}</td>
              <td>
                <button class="admin-button--ghost" type="button" @click="router.push(`/admin/traces/${item.traceId}`)">
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
