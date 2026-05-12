<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getRagTraceRuns } from "../../services/adminService";
import { formatDateTime, formatRelativeStatus, pageCount, pageRecords, pageTotal } from "./adminShared";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const traceIdFilter = ref("");
const queryTraceId = ref("");
const pageNo = ref(1);
const pageSize = 10;
const filters = ref({
  conversationId: "",
  taskId: "",
  status: ""
});
const page = ref({ records: [], total: 0 });

function normalizeStatus(status) {
  return String(status || "").toLowerCase();
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(p * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function formatDurationMetric(ms) {
  const val = Number.isFinite(ms) && ms > 0 ? ms : 0;
  if (val < 1000) return { value: `${Math.round(val)}`, unit: "ms" };
  return { value: (val / 1000).toFixed(2), unit: "s" };
}

const runs = computed(() => pageRecords(page.value));

const traceStats = computed(() => {
  const items = runs.value;
  const durations = items
    .map((item) => Number(item.durationMs ?? 0))
    .filter((v) => Number.isFinite(v) && v > 0);
  const successCount = items.filter((i) => normalizeStatus(i.status) === "success").length;
  const failedCount = items.filter((i) => normalizeStatus(i.status) === "failed").length;
  const runningCount = items.filter((i) => normalizeStatus(i.status) === "running").length;
  const avgDuration = durations.length
    ? Math.round(durations.reduce((s, v) => s + v, 0) / durations.length)
    : 0;
  const p95Duration = Math.round(percentile(durations, 0.95));
  const successRate = items.length ? Math.round((successCount / items.length) * 1000) / 10 : 0;
  return { successCount, failedCount, runningCount, avgDuration, p95Duration, successRate };
});

const statCards = computed(() => {
  const s = traceStats.value;
  const avg = formatDurationMetric(s.avgDuration);
  const p95 = formatDurationMetric(s.p95Duration);
  return [
    { label: "成功 / 失败 / 运行中", value: `${s.successCount} / ${s.failedCount} / ${s.runningCount}`, color: "is-emerald" },
    { label: "成功率", value: `${s.successRate}%`, color: "is-cyan" },
    { label: "平均耗时", value: `${avg.value} ${avg.unit}`, color: "is-indigo" },
    { label: "P95 耗时", value: `${p95.value} ${p95.unit}`, color: "is-amber" }
  ];
});

async function loadRuns() {
  loading.value = true;
  errorText.value = "";
  try {
    page.value = await getRagTraceRuns(pageNo.value, pageSize, {
      traceId: queryTraceId.value,
      ...filters.value
    });
  } catch (error) {
    errorText.value = error?.message || "加载 trace 列表失败。";
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNo.value = 1;
  queryTraceId.value = traceIdFilter.value.trim();
  loadRuns();
}

function handleRefresh() {
  loadRuns();
}

function goPrev() {
  if (pageNo.value > 1) {
    pageNo.value--;
    loadRuns();
  }
}

function goNext() {
  if (pageNo.value < pageCount(page.value)) {
    pageNo.value++;
    loadRuns();
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
        <p class="admin-page-subtitle">独立列表页聚焦运行检索，点击任意运行记录进入详情页分析慢节点与失败节点</p>
      </div>
      <div class="admin-page-actions">
        <input
          v-model="traceIdFilter"
          class="admin-input"
          type="search"
          placeholder="搜索 Trace ID"
          @keydown.enter.prevent="handleSearch"
        />
        <button class="admin-button" type="button" @click="handleSearch">查询</button>
        <button class="admin-button--ghost" type="button" @click="handleRefresh">刷新</button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <article v-for="card in statCards" :key="card.label" class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div :class="['admin-stat-icon', card.color]">
            <span>{{ card.label.charAt(0) }}</span>
          </div>
          <div>
            <span class="admin-stat-label">{{ card.label }}</span>
            <span class="admin-stat-value">{{ card.value }}</span>
          </div>
        </div>
      </article>
    </div>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <select v-model="filters.status" class="admin-select" @change="loadRuns">
            <option value="">All Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="RUNNING">RUNNING</option>
            <option value="FAILED">FAILED</option>
          </select>
          <input v-model="filters.conversationId" class="admin-input" type="search" placeholder="Conversation ID" @keydown.enter.prevent="loadRuns" />
          <input v-model="filters.taskId" class="admin-input" type="search" placeholder="Task ID" @keydown.enter.prevent="loadRuns" />
        </div>
        <div class="admin-toolbar-right">
          <span class="admin-page-count">{{ pageTotal(page) }} run(s)</span>
          <button class="admin-button" type="button" :disabled="loading" @click="loadRuns">
            {{ loading ? "刷新中..." : "刷新" }}
          </button>
        </div>
      </div>

      <div v-if="loading && runs.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="runs.length === 0" class="admin-empty">暂无 trace 数据</div>
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
            <tr v-for="item in runs" :key="item.traceId">
              <td>
                <p>{{ item.traceName || item.traceId }}</p>
                <small class="admin-list-meta is-code">{{ item.conversationId || "--" }}</small>
              </td>
              <td>{{ item.userName || item.username || "--" }}</td>
              <td>
                <span :class="['admin-badge', item.status === 'FAILED' ? 'is-danger' : item.status === 'RUNNING' ? 'is-warn' : 'is-success']">
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

      <div v-if="runs.length > 0" class="admin-pagination">
        <span>共 {{ pageTotal(page) }} 条</span>
        <div class="admin-pagination-controls">
          <button class="admin-button--ghost" type="button" :disabled="pageNo <= 1" @click="goPrev">上一页</button>
          <span class="admin-page-count">{{ pageNo }} / {{ pageCount(page) }}</span>
          <button class="admin-button--ghost" type="button" :disabled="pageNo >= pageCount(page)" @click="goNext">下一页</button>
        </div>
      </div>
    </article>
  </section>
</template>
