<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  getAdminDashboardOverview,
  getAdminDashboardPerformance,
  getAdminDashboardTrends
} from "../../services/adminService";
import { formatDateTime } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const overview = ref(null);
const performance = ref(null);
const trends = ref(null);
const windowValue = ref("24h");
const metricValue = ref("sessions");

const kpiCards = computed(() => {
  const kpis = overview.value?.kpis || {};
  return [
    ["Total Users", kpis.totalUsers?.value, kpis.totalUsers?.deltaPct],
    ["Active Users", kpis.activeUsers?.value, kpis.activeUsers?.deltaPct],
    ["Sessions 24h", kpis.sessions24h?.value, kpis.sessions24h?.deltaPct],
    ["Messages 24h", kpis.messages24h?.value, kpis.messages24h?.deltaPct]
  ];
});

const performanceCards = computed(() => {
  const current = performance.value || {};
  return [
    { label: "Avg Latency", value: current.avgLatencyMs ? `${current.avgLatencyMs} ms` : "--" },
    { label: "P95 Latency", value: current.p95LatencyMs ? `${current.p95LatencyMs} ms` : "--" },
    { label: "Success Rate", value: current.successRate !== undefined ? `${current.successRate}%` : "--" },
    { label: "Error Rate", value: current.errorRate !== undefined ? `${current.errorRate}%` : "--" }
  ];
});

const trendSeries = computed(() => {
  return Array.isArray(trends.value?.series) ? trends.value.series : [];
});

async function loadDashboard() {
  loading.value = true;
  errorText.value = "";

  try {
    const [overviewData, performanceData, trendData] = await Promise.all([
      getAdminDashboardOverview(windowValue.value),
      getAdminDashboardPerformance(windowValue.value),
      getAdminDashboardTrends(metricValue.value, "7d", "day")
    ]);

    overview.value = overviewData;
    performance.value = performanceData;
    trends.value = trendData;
  } catch (error) {
    errorText.value = error?.message || "加载 dashboard 失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDashboard();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Dashboard</span>
        <h2 class="admin-page-title">管理台总览</h2>
        <p class="admin-page-subtitle">
          汇总用户、会话、消息和链路表现，先把总体运行状态看到位，再进入各子模块做精细管理。
        </p>
      </div>

      <div class="admin-page-actions">
        <select v-model="windowValue" class="admin-select" @change="loadDashboard">
          <option value="24h">24h</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
        </select>
        <select v-model="metricValue" class="admin-select" @change="loadDashboard">
          <option value="sessions">sessions</option>
          <option value="messages">messages</option>
          <option value="users">users</option>
        </select>
        <button class="admin-button" type="button" :disabled="loading" @click="loadDashboard">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-grid-4">
      <article v-for="[label, value, delta] in kpiCards" :key="label" class="admin-stat-card">
        <span>{{ label }}</span>
        <strong>{{ value ?? "--" }}</strong>
        <small>{{ delta !== undefined ? `Δ ${delta}%` : "No compare data" }}</small>
      </article>
    </section>

    <section class="admin-grid-4">
      <article v-for="item in performanceCards" :key="item.label" class="admin-stat-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>Window {{ windowValue }}</small>
      </article>
    </section>

    <section class="admin-grid-2">
      <article class="admin-detail-card">
        <h3>Trend Series</h3>
        <div v-if="trendSeries.length === 0" class="admin-empty">暂无趋势数据</div>
        <div v-else class="admin-card-list">
          <div v-for="series in trendSeries" :key="series.name" class="admin-card-item">
            <h3>{{ series.name }}</h3>
            <p>
              {{ Array.isArray(series.data) ? series.data.length : 0 }} points · latest
              {{
                Array.isArray(series.data) && series.data.length
                  ? `${series.data[series.data.length - 1].value} @ ${formatDateTime(series.data[series.data.length - 1].ts)}`
                  : "--"
              }}
            </p>
          </div>
        </div>
      </article>

      <article class="admin-detail-card">
        <h3>Quick Access</h3>
        <div class="admin-card-list">
          <div class="admin-card-item">
            <h3><RouterLink class="admin-link-button" to="/admin/knowledge">Knowledge Bases</RouterLink></h3>
            <p>查看知识库、进入文档和分块详情、执行上传或重新切分。</p>
          </div>
          <div class="admin-card-item">
            <h3><RouterLink class="admin-link-button" to="/admin/traces">Trace Runs</RouterLink></h3>
            <p>定位具体 trace、任务或会话，顺着节点链路排查生成过程。</p>
          </div>
          <div class="admin-card-item">
            <h3><RouterLink class="admin-link-button" to="/admin/settings">Settings</RouterLink></h3>
            <p>核对默认 collection、聊天模型、deep thinking 模型和 provider 配置。</p>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>
