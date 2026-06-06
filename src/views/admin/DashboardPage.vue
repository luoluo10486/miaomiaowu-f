<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  getAdminDashboardOverview,
  getAdminDashboardPerformance,
  getAdminDashboardTrends
} from "../../services/dashboardService";

const WINDOW_OPTIONS = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" }
];

const WINDOW_LABEL_MAP = {
  "24h": "最近 24 小时",
  "7d": "最近 7 天",
  "30d": "最近 30 天"
};

const windowValue = ref("24h");
const loading = ref(false);
const errorText = ref("");
const overview = ref(null);
const performance = ref(null);
const trendCards = ref([]);
const lastUpdated = ref(null);

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }
  return Number(value).toLocaleString("zh-CN");
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }
  return `${Number(value).toFixed(1)}%`;
}

function formatDuration(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  const numeric = Number(value);
  if (numeric < 1000) {
    return `${Math.round(numeric)} ms`;
  }

  return `${(numeric / 1000).toFixed(2)} s`;
}

function formatLastUpdated(timestamp) {
  if (!timestamp) {
    return "--";
  }

  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

function formatDelta(deltaPct) {
  if (deltaPct === null || deltaPct === undefined || Number.isNaN(Number(deltaPct))) {
    return "--";
  }

  const numeric = Number(deltaPct);
  if (numeric === 0) {
    return "0.0%";
  }

  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}%`;
}

function buildTrendSummary(trend) {
  const points = trend?.series?.[0]?.data || [];
  if (points.length === 0) {
    return {
      latest: "--",
      change: "--",
      count: "0"
    };
  }

  const first = Number(points[0]?.value || 0);
  const last = Number(points[points.length - 1]?.value || 0);
  const change = first === 0 ? null : ((last - first) / first) * 100;

  return {
    latest: formatNumber(last),
    change: change === null ? "--" : formatDelta(change),
    count: String(points.length)
  };
}

const dashboardHeaderMeta = computed(() => [
  { label: WINDOW_LABEL_MAP[windowValue.value] || windowValue.value, tone: "is-muted" },
  { label: `更新时间 ${formatLastUpdated(lastUpdated.value)}`, tone: "is-muted" }
]);

const kpiCards = computed(() => {
  const kpis = overview.value?.kpis || {};
  return [
    {
      title: "活跃用户",
      value: formatNumber(kpis.activeUsers?.value),
      hint: `较上期 ${formatDelta(kpis.activeUsers?.deltaPct)}`,
      tone: "indigo"
    },
    {
      title: "总用户",
      value: formatNumber(kpis.totalUsers?.value),
      hint: `较上期 ${formatDelta(kpis.totalUsers?.deltaPct)}`,
      tone: "blue"
    },
    {
      title: "近窗会话",
      value: formatNumber(kpis.sessions24h?.value),
      hint: `较上期 ${formatDelta(kpis.sessions24h?.deltaPct)}`,
      tone: "amber"
    },
    {
      title: "近窗消息",
      value: formatNumber(kpis.messages24h?.value),
      hint: `较上期 ${formatDelta(kpis.messages24h?.deltaPct)}`,
      tone: "cyan"
    }
  ];
});

const performanceRows = computed(() => [
  { label: "平均响应", value: formatDuration(performance.value?.avgLatencyMs) },
  { label: "P95 响应", value: formatDuration(performance.value?.p95LatencyMs) },
  { label: "成功率", value: formatPercent(performance.value?.successRate) },
  { label: "错误率", value: formatPercent(performance.value?.errorRate) },
  { label: "无知识命中率", value: formatPercent(performance.value?.noDocRate) },
  { label: "慢响应率", value: formatPercent(performance.value?.slowRate) }
]);

async function loadDashboard(nextWindow = windowValue.value) {
  loading.value = true;
  errorText.value = "";

  const granularity = nextWindow === "24h" ? "hour" : "day";

  try {
    const [overviewData, performanceData, sessionsTrend, messagesTrend, usersTrend] =
      await Promise.all([
        getAdminDashboardOverview(nextWindow),
        getAdminDashboardPerformance(nextWindow),
        getAdminDashboardTrends("sessions", nextWindow, granularity),
        getAdminDashboardTrends("messages", nextWindow, granularity),
        getAdminDashboardTrends("activeUsers", nextWindow, granularity)
      ]);

    overview.value = overviewData;
    performance.value = performanceData;
    lastUpdated.value = overviewData?.updatedAt || Date.now();
    trendCards.value = [
      { title: "会话趋势", metric: "sessions", summary: buildTrendSummary(sessionsTrend) },
      { title: "消息趋势", metric: "messages", summary: buildTrendSummary(messagesTrend) },
      { title: "活跃用户趋势", metric: "activeUsers", summary: buildTrendSummary(usersTrend) }
    ];
  } catch (error) {
    console.error(error);
    errorText.value = "后台总览数据加载失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

function handleWindowChange(nextWindow) {
  if (windowValue.value === nextWindow || loading.value) {
    return;
  }

  windowValue.value = nextWindow;
  void loadDashboard(nextWindow);
}

onMounted(() => {
  void loadDashboard();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="后台总览"
      title="后台总览"
      description="查看用户、会话、消息和核心性能指标，快速确认后台运行状态。"
    >
      <template #meta>
        <div class="dashboard-header-meta">
          <span
            v-for="item in dashboardHeaderMeta"
            :key="item.label"
            :class="['admin-badge', item.tone]"
          >
            {{ item.label }}
          </span>
        </div>
      </template>

      <template #actions>
        <div class="admin-window-tabs">
          <button
            v-for="option in WINDOW_OPTIONS"
            :key="option.value"
            class="admin-window-tab"
            :class="{ 'is-active': windowValue === option.value }"
            type="button"
            :disabled="loading"
            @click="handleWindowChange(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="loadDashboard()">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard
        v-for="card in kpiCards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :hint="card.hint"
        :tone="card.tone"
      >
        <template #icon>{{ card.title.slice(0, 1) }}</template>
      </StatCard>
    </div>

    <section class="admin-split">
      <div class="admin-dashboard-main">
        <article class="admin-table-card">
          <div class="admin-table-card__header">
            <div>
              <h2>趋势摘要</h2>
              <p>展示当前时间窗口下的关键趋势概览。</p>
            </div>
          </div>

          <div class="dashboard-trend-grid">
            <section
              v-for="item in trendCards"
              :key="item.metric"
              class="dashboard-trend-item"
            >
              <div class="admin-trend-title">{{ item.title }}</div>
              <div class="admin-kv admin-kv--compact">
                <div><dt>最新值</dt><dd>{{ item.summary.latest }}</dd></div>
                <div><dt>变化</dt><dd>{{ item.summary.change }}</dd></div>
                <div><dt>采样点</dt><dd>{{ item.summary.count }}</dd></div>
              </div>
            </section>
          </div>
        </article>
      </div>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>性能指标</h3>
          <p class="admin-detail-card-desc">后台接口和问答链路的核心观测值。</p>
          <div class="admin-kv">
            <div v-for="row in performanceRows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.dashboard-header-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dashboard-trend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-trend-item {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--admin-line);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96));
}

.admin-trend-title {
  color: var(--admin-ink);
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 960px) {
  .dashboard-trend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
