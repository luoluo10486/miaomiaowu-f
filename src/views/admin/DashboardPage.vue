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
    { label: "用户总数", en: "Total Users", value: kpis.totalUsers?.value, delta: kpis.totalUsers?.deltaPct, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" , extra: "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" },
    { label: "活跃用户", en: "Active Users", value: kpis.activeUsers?.value, delta: kpis.activeUsers?.deltaPct, icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", extra: "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87" },
    { label: "今日会话", en: "Sessions 24h", value: kpis.sessions24h?.value, delta: kpis.sessions24h?.deltaPct, icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
    { label: "今日消息", en: "Messages 24h", value: kpis.messages24h?.value, delta: kpis.messages24h?.deltaPct, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" }
  ];
});

const performanceCards = computed(() => {
  const current = performance.value || {};
  return [
    { label: "平均延迟", en: "Avg Latency", value: current.avgLatencyMs ? `${current.avgLatencyMs} ms` : "--" },
    { label: "P95 延迟", en: "P95 Latency", value: current.p95LatencyMs ? `${current.p95LatencyMs} ms` : "--" },
    { label: "成功率", en: "Success Rate", value: current.successRate !== undefined ? `${current.successRate}%` : "--" },
    { label: "错误率", en: "Error Rate", value: current.errorRate !== undefined ? `${current.errorRate}%` : "--" }
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
          <option value="24h">24 小时</option>
          <option value="7d">7 天</option>
          <option value="30d">30 天</option>
        </select>
        <select v-model="metricValue" class="admin-select" @change="loadDashboard">
          <option value="sessions">会话</option>
          <option value="messages">消息</option>
          <option value="users">用户</option>
        </select>
        <button class="admin-button" type="button" :disabled="loading" @click="loadDashboard">
          {{ loading ? "加载中..." : "刷新" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-grid-4">
      <article v-for="card in kpiCards" :key="card.en" class="admin-stat-card">
        <div class="stat-card__head">
          <svg class="stat-card__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="card.icon" />
            <path v-if="card.extra" :d="card.extra" />
          </svg>
          <span>{{ card.label }}</span>
        </div>
        <strong>{{ card.value ?? "--" }}</strong>
        <small v-if="card.delta !== undefined">
          <span :class="card.delta >= 0 ? 'delta-up' : 'delta-down'">
            {{ card.delta >= 0 ? "↑" : "↓" }} {{ Math.abs(card.delta) }}%
          </span>
          较上期
        </small>
        <small v-else>暂无对比数据</small>
      </article>
    </section>

    <section class="admin-grid-4">
      <article v-for="item in performanceCards" :key="item.en" class="admin-stat-card admin-stat-card--perf">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ windowValue === "24h" ? "24 小时窗口" : windowValue === "7d" ? "7 天窗口" : "30 天窗口" }}</small>
      </article>
    </section>

    <section class="admin-grid-2">
      <article class="admin-detail-card">
        <h3 class="detail-card__title">趋势数据</h3>
        <div v-if="trendSeries.length === 0" class="admin-empty">暂无趋势数据</div>
        <div v-else class="admin-card-list">
          <div v-for="series in trendSeries" :key="series.name" class="admin-card-item">
            <h3>{{ series.name }}</h3>
            <p>
              {{ Array.isArray(series.data) ? series.data.length : 0 }} 个数据点 · 最新
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
        <h3 class="detail-card__title">快速入口</h3>
        <div class="admin-card-list">
          <RouterLink to="/admin/knowledge" class="admin-card-item admin-card-item--link">
            <h3>知识库管理</h3>
            <p>查看知识库、进入文档和分块详情、执行上传或重新切分。</p>
          </RouterLink>
          <RouterLink to="/admin/traces" class="admin-card-item admin-card-item--link">
            <h3>链路追踪</h3>
            <p>定位具体 trace、任务或会话，顺着节点链路排查生成过程。</p>
          </RouterLink>
          <RouterLink to="/admin/settings" class="admin-card-item admin-card-item--link">
            <h3>系统设置</h3>
            <p>核对默认 collection、聊天模型、deep thinking 模型和 provider 配置。</p>
          </RouterLink>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.stat-card__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-card__icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--admin-accent);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.7;
}

.delta-up {
  color: var(--admin-success);
}

.delta-down {
  color: var(--admin-danger);
}

.detail-card__title {
  margin: 0 0 16px;
  font-family: var(--admin-serif);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--admin-ink);
}

.admin-card-item--link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-card-item--link:hover {
  border-color: rgba(107, 127, 90, 0.3);
  transform: translateX(4px);
  box-shadow: var(--admin-shadow);
}
</style>
