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

const THRESHOLDS = {
  latency: { good: 10000, warning: 15000 },
  successRate: { good: 99, warning: 95 },
  errorRate: { good: 1, warning: 5 },
  noDocRate: { good: 10, warning: 30 }
};

const windowValue = ref("24h");
const loading = ref(false);
const errorText = ref("");
const overview = ref(null);
const performance = ref(null);
const trends = ref({
  sessions: null,
  messages: null,
  activeUsers: null,
  latency: null,
  quality: null
});
const lastUpdated = ref(null);
const requestId = ref(0);

function formatNumber(value) {
  if (value === null || value === undefined) return "--";
  return Number(value).toLocaleString("zh-CN");
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `${Number(value).toFixed(1)}%`;
}

function formatDuration(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  const num = Number(value);
  if (num < 1000) return `${Math.round(num)}ms`;
  return `${(num / 1000).toFixed(2)}s`;
}

function formatRatio(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "--";
  return Number(value).toFixed(2);
}

function formatLastUpdated(timestamp) {
  if (!timestamp) return "--";
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

function getMetricTone(metric, value) {
  if (value === null || value === undefined) return "warning";

  if (metric === "latency") {
    if (value < THRESHOLDS.latency.good) return "good";
    if (value < THRESHOLDS.latency.warning) return "warning";
    return "bad";
  }

  if (metric === "successRate") {
    if (value >= THRESHOLDS.successRate.good) return "good";
    if (value >= THRESHOLDS.successRate.warning) return "warning";
    return "bad";
  }

  if (metric === "errorRate") {
    if (value <= THRESHOLDS.errorRate.good) return "good";
    if (value <= THRESHOLDS.errorRate.warning) return "warning";
    return "bad";
  }

  if (value <= THRESHOLDS.noDocRate.good) return "good";
  if (value <= THRESHOLDS.noDocRate.warning) return "warning";
  return "bad";
}

function getHealthStatus(perf, windowMessages) {
  if (!perf || !windowMessages) return "unknown";
  if ((perf.errorRate ?? 0) > THRESHOLDS.errorRate.warning) return "critical";
  if ((perf.successRate ?? 0) < THRESHOLDS.successRate.warning) return "critical";
  if ((perf.noDocRate ?? 0) > 20) return "attention";
  return "healthy";
}

function formatDelta(deltaPct) {
  if (deltaPct === null || deltaPct === undefined) return "--";
  const value = Number(deltaPct);
  if (!Number.isFinite(value) || value === 0) return "--";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function buildTrendSeries(trend) {
  const series = trend?.series?.[0]?.data || [];
  if (series.length === 0) {
    return { points: [], linePath: "", areaPath: "", maxValue: 0 };
  }

  const values = series.map((item) => Number(item.value) || 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = Math.max(maxValue - minValue, 1);
  const points = series.map((item, index) => {
    const x = series.length === 1 ? 0 : index / (series.length - 1);
    const normalized = (Number(item.value) - minValue) / valueRange;
    const y = 1 - normalized;
    return {
      x,
      y,
      value: Number(item.value) || 0,
      ts: item.ts
    };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L 1 1 L 0 1 Z`;

  return {
    points,
    linePath,
    areaPath,
    maxValue
  };
}

function createSparklineState(sourceGetter) {
  const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    value: ""
  });

  const chartData = computed(() => buildTrendSeries(sourceGetter()));

  function handleMove(event) {
    const { points } = chartData.value;
    if (points.length === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
    let closest = points[0];
    let minDistance = Number.POSITIVE_INFINITY;

    points.forEach((point) => {
      const distance = Math.abs(point.x - ratio);
      if (distance < minDistance) {
        minDistance = distance;
        closest = point;
      }
    });

    const date = new Date(closest.ts);
    const isDaily = windowValue.value !== "24h";
    const label = isDaily
      ? `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
      : `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    tooltip.value = {
      visible: true,
      x: closest.x,
      y: closest.y,
      label,
      value: String(closest.value)
    };
  }

  function handleLeave() {
    tooltip.value.visible = false;
  }

  return {
    chartData,
    tooltip,
    handleMove,
    handleLeave
  };
}

const sessionsChart = createSparklineState(() => trends.value.sessions);
const messagesChart = createSparklineState(() => trends.value.messages);
const activeUsersChart = createSparklineState(() => trends.value.activeUsers);
const latencyChart = createSparklineState(() => trends.value.latency);
const qualityChart = createSparklineState(() => trends.value.quality);

const healthStatus = computed(() => {
  const perf = performance.value;
  const messages = overview.value?.kpis?.messages24h?.value;
  return getHealthStatus(perf, messages);
});

const healthMeta = computed(() => {
  switch (healthStatus.value) {
    case "healthy":
      return { label: "运行正常", tone: "is-success", detail: "当前窗口内未发现明显异常。" };
    case "attention":
      return { label: "需要关注", tone: "is-warn", detail: "部分指标已经接近阈值。" };
    case "critical":
      return { label: "风险偏高", tone: "is-danger", detail: "请优先检查错误率和无知识命中率。" };
    default:
      return { label: "暂无数据", tone: "is-muted", detail: "选择时间窗口后会加载指标。" };
  }
});

const dashboardHeaderMeta = computed(() => [
  { label: `窗口：${WINDOW_LABEL_MAP[windowValue.value]}`, tone: "is-muted" },
  { label: `健康：${healthMeta.value.label}`, tone: healthMeta.value.tone },
  { label: `更新时间：${formatLastUpdated(lastUpdated.value)}`, tone: "is-muted" }
]);

const dashboardWindowLabel = computed(() => WINDOW_LABEL_MAP[windowValue.value]);
const dashboardHeroSummary = computed(() => [
  { label: "当前窗口", value: dashboardWindowLabel.value },
  { label: "健康状态", value: healthMeta.value.label },
  { label: "最近更新", value: formatLastUpdated(lastUpdated.value) },
  { label: "平均响应", value: formatDuration(performance.value?.avgLatencyMs) }
]);

const kpiCards = computed(() => {
  const kpis = overview.value?.kpis || {};
  const sessionDepth =
    (kpis.sessions24h?.value ?? 0) > 0
      ? (kpis.messages24h?.value ?? 0) / (kpis.sessions24h?.value ?? 1)
      : null;

  return [
    {
      title: "活跃用户",
      value: formatNumber(kpis.activeUsers?.value),
      hint: `较上期 ${formatDelta(kpis.activeUsers?.deltaPct)}`,
      tone: "indigo"
    },
    {
      title: "会话数",
      value: formatNumber(kpis.sessions24h?.value),
      hint: `较上期 ${formatDelta(kpis.sessions24h?.deltaPct)}`,
      tone: "blue"
    },
    {
      title: "消息数",
      value: formatNumber(kpis.messages24h?.value),
      hint: `较上期 ${formatDelta(kpis.messages24h?.deltaPct)}`,
      tone: "amber"
    },
    {
      title: "会话深度",
      value: sessionDepth === null ? "--" : formatRatio(sessionDepth),
      hint: "条 / 会话",
      tone: "cyan"
    }
  ];
});

const performanceRows = computed(() => [
  {
    label: "平均响应",
    value: formatDuration(performance.value?.avgLatencyMs),
    tone: getMetricTone("latency", performance.value?.avgLatencyMs)
  },
  {
    label: "P95 响应",
    value: formatDuration(performance.value?.p95LatencyMs),
    tone: getMetricTone("latency", performance.value?.p95LatencyMs)
  },
  {
    label: "成功率",
    value: formatPercent(performance.value?.successRate),
    tone: getMetricTone("successRate", performance.value?.successRate)
  },
  {
    label: "错误率",
    value: formatPercent(performance.value?.errorRate),
    tone: getMetricTone("errorRate", performance.value?.errorRate)
  },
  {
    label: "无知识命中率",
    value: formatPercent(performance.value?.noDocRate),
    tone: getMetricTone("noDocRate", performance.value?.noDocRate)
  },
  {
    label: "慢响应率",
    value: formatPercent(performance.value?.slowRate),
    tone: getMetricTone("latency", performance.value?.slowRate)
  }
]);

const efficiencyRows = computed(() => {
  const kpis = overview.value?.kpis || {};
  const activeUsers = kpis.activeUsers?.value ?? 0;
  const sessions = kpis.sessions24h?.value ?? 0;
  const messages = kpis.messages24h?.value ?? 0;

  return [
    {
      label: "人均会话",
      value: activeUsers > 0 ? formatRatio(sessions / activeUsers) : "--"
    },
    {
      label: "单会话消息",
      value: sessions > 0 ? formatRatio(messages / sessions) : "--"
    },
    {
      label: "人均消息",
      value: activeUsers > 0 ? formatRatio(messages / activeUsers) : "--"
    }
  ];
});

const insights = computed(() => {
  const perf = performance.value;
  const windowLabel = WINDOW_LABEL_MAP[windowValue.value];

  if (!perf) {
    return [
      {
        type: "trend",
        title: "暂无窗口数据",
        metric: "Dashboard",
        change: windowLabel,
        context: "切换时间窗口后会重新加载指标。"
      }
    ];
  }

  const items = [];

  if ((perf.errorRate ?? 0) > 5 || (perf.successRate ?? 0) < 95) {
    items.push({
      type: "anomaly",
      title: "稳定性需要关注",
      metric: "成功率 / 错误率",
      change: `${formatPercent(perf.successRate)} / ${formatPercent(perf.errorRate)}`,
      context: "成功率偏低或错误率偏高时，优先排查失败请求和超时链路。"
    });
  } else {
    items.push({
      type: "trend",
      title: "系统状态平稳",
      metric: "成功率",
      change: formatPercent(perf.successRate),
      context: "当前窗口内的整体服务质量处于健康区间。"
    });
  }

  if ((perf.noDocRate ?? 0) > 20) {
    items.push({
      type: "recommendation",
      title: "知识召回存在空洞",
      metric: "无知识命中率",
      change: formatPercent(perf.noDocRate),
      context: "建议检查知识库覆盖和检索策略。"
    });
  }

  if ((perf.avgLatencyMs ?? 0) > 15000) {
    items.push({
      type: "recommendation",
      title: "响应速度偏慢",
      metric: "平均响应时间",
      change: formatDuration(perf.avgLatencyMs),
      context: "可以优先排查模型、网络和后端链路中的慢点。"
    });
  }

  while (items.length < 3) {
    items.push({
      type: "recommendation",
      title: "继续保持当前策略",
      metric: "运行状态",
      change: windowLabel,
      context: "当前窗口内暂未发现新的异常模式。"
    });
  }

  return items.slice(0, 3);
});

const insightMeta = {
  anomaly: { label: "异常", tone: "is-danger" },
  trend: { label: "趋势", tone: "is-success" },
  recommendation: { label: "建议", tone: "is-warn" }
};

async function loadDashboard(nextWindow = windowValue.value) {
  const currentRequestId = ++requestId.value;
  loading.value = true;
  errorText.value = "";

  const granularity = nextWindow === "24h" ? "hour" : "day";

  try {
    const [overviewData, performanceData] = await Promise.all([
      getAdminDashboardOverview(nextWindow),
      getAdminDashboardPerformance(nextWindow)
    ]);

    if (requestId.value !== currentRequestId) return;

    overview.value = overviewData;
    performance.value = performanceData;
    lastUpdated.value = Date.now();

    try {
      const [sessions, messages, activeUsers, latency, quality] = await Promise.all([
        getAdminDashboardTrends("sessions", nextWindow, granularity),
        getAdminDashboardTrends("messages", nextWindow, granularity),
        getAdminDashboardTrends("activeUsers", nextWindow, granularity),
        getAdminDashboardTrends("avgLatency", nextWindow, granularity),
        getAdminDashboardTrends("quality", nextWindow, granularity)
      ]);

      if (requestId.value !== currentRequestId) return;

      trends.value = { sessions, messages, activeUsers, latency, quality };
    } catch (trendError) {
      if (requestId.value !== currentRequestId) return;
      console.error(trendError);
      trends.value = {
        sessions: null,
        messages: null,
        activeUsers: null,
        latency: null,
        quality: null
      };
    }
  } catch (error) {
    if (requestId.value !== currentRequestId) return;
    console.error(error);
    errorText.value = "Dashboard 数据加载失败，请稍后重试。";
  } finally {
    if (requestId.value === currentRequestId) {
      loading.value = false;
    }
  }
}

function handleWindowChange(nextWindow) {
  if (windowValue.value === nextWindow) return;
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
      tag="Dashboard"
      title="后台总览"
      description="聚焦会话、消息、性能和知识召回，快速判断当前服务状态。"
    >
      <template #meta>
        <div class="dashboard-header-meta">
          <span v-for="item in dashboardHeaderMeta" :key="item.label" :class="['admin-badge', item.tone]">
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

    <section class="admin-detail-card dashboard-hero">
      <div class="dashboard-hero-copy">
        <p class="trace-hero-tag">Overview</p>
        <h2>{{ dashboardWindowLabel }}</h2>
        <p>最后更新时间：{{ formatLastUpdated(lastUpdated) }}</p>
      </div>
      <div class="dashboard-hero-side">
        <div class="admin-kv admin-kv--compact">
          <div><dt>健康状态</dt><dd>{{ healthMeta.label }}</dd></div>
          <div><dt>当前窗口</dt><dd>{{ dashboardWindowLabel }}</dd></div>
          <div><dt>最近更新</dt><dd>{{ formatLastUpdated(lastUpdated) }}</dd></div>
          <div><dt>平均响应</dt><dd>{{ formatDuration(performance?.avgLatencyMs) }}</dd></div>
        </div>
        <p>{{ healthMeta.detail }}</p>
      </div>
      <div class="dashboard-hero-summary">
        <div v-for="item in dashboardHeroSummary" :key="item.label" class="dashboard-hero-summary-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </section>

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
              <h2>消息趋势</h2>
              <p>当前窗口内消息数量变化。</p>
            </div>
            <span class="admin-page-count">{{ WINDOW_LABEL_MAP[windowValue] }}</span>
          </div>

          <div v-if="messagesChart.chartData.points.length === 0" class="admin-empty">暂无消息趋势数据</div>
          <div v-else class="dashboard-chart-shell">
            <svg
              class="admin-chart-full"
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              @mousemove="messagesChart.handleMove"
              @mouseleave="messagesChart.handleLeave"
            >
              <defs>
                <linearGradient id="dashboardMessagesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.28" />
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02" />
                </linearGradient>
              </defs>
              <path :d="messagesChart.chartData.areaPath" fill="url(#dashboardMessagesGradient)" />
              <path
                :d="messagesChart.chartData.linePath"
                fill="none"
                stroke="#3b82f6"
                stroke-width="0.02"
                vector-effect="non-scaling-stroke"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                v-if="messagesChart.tooltip.visible"
                :cx="messagesChart.tooltip.x"
                :cy="messagesChart.tooltip.y"
                r="0.01"
                fill="#3b82f6"
                stroke="#ffffff"
                stroke-width="0.008"
              />
            </svg>

            <div
              v-if="messagesChart.tooltip.visible"
              class="admin-chart-tooltip"
              :style="{ left: `${messagesChart.tooltip.x * 100}%`, top: `${messagesChart.tooltip.y * 72}%` }"
            >
              <div class="admin-chart-tooltip-label">{{ messagesChart.tooltip.label }}</div>
              <div class="admin-chart-tooltip-value">
                <span class="admin-chart-tooltip-dot" />
                消息数：{{ messagesChart.tooltip.value }}
              </div>
            </div>
          </div>
        </article>

        <article class="admin-table-card">
          <div class="admin-table-card__header">
            <div>
              <h2>趋势分布</h2>
              <p>会话、活跃用户、响应和质量指标。</p>
            </div>
          </div>

          <div class="dashboard-trend-grid">
            <section
              v-for="chart in [
                { key: 'sessions', title: '会话趋势', unit: '次', state: sessionsChart, color: '#10b981' },
                { key: 'activeUsers', title: '活跃用户', unit: '人', state: activeUsersChart, color: '#6366f1' },
                { key: 'latency', title: '响应时延', unit: 'ms', state: latencyChart, color: '#f59e0b' },
                { key: 'quality', title: '质量趋势', unit: '%', state: qualityChart, color: '#ef4444' }
              ]"
              :key="chart.key"
              class="dashboard-trend-item"
            >
              <div class="admin-trend-title">{{ chart.title }}</div>
              <div class="admin-trend-unit">单位：{{ chart.unit }}</div>
              <div v-if="chart.state.chartData.points.length === 0" class="admin-empty-sm">暂无数据</div>
              <svg
                v-else
                class="admin-chart-sm"
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
                @mousemove="chart.state.handleMove"
                @mouseleave="chart.state.handleLeave"
              >
                <defs>
                  <linearGradient :id="`dashboard-${chart.key}-gradient`" x1="0" y1="0" x2="0" y2="1">
                    <stop :stop-color="chart.color" stop-opacity="0.22" />
                    <stop offset="100%" :stop-color="chart.color" stop-opacity="0.03" />
                  </linearGradient>
                </defs>
                <path :d="chart.state.chartData.areaPath" :fill="`url(#dashboard-${chart.key}-gradient)`" />
                <path
                  :d="chart.state.chartData.linePath"
                  fill="none"
                  :stroke="chart.color"
                  stroke-width="0.018"
                  vector-effect="non-scaling-stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </section>
          </div>
        </article>

        <article class="admin-table-card">
          <div class="admin-table-card__header">
            <div>
              <h2>运行建议</h2>
              <p>根据当前窗口指标自动生成的观察点。</p>
            </div>
          </div>

          <div class="admin-card-list">
            <div v-for="item in insights" :key="`${item.title}-${item.change}`" class="admin-card-item">
              <div class="admin-insight-header">
                <span :class="['admin-badge', insightMeta[item.type].tone]">{{ insightMeta[item.type].label }}</span>
                <span class="admin-page-count">{{ item.metric }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.context }}</p>
              <p class="admin-insight-change">{{ item.change }}</p>
            </div>
          </div>
        </article>
      </div>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>健康概览</h3>
          <p class="admin-detail-card-desc">快速判断当前后端状态。</p>
          <div class="admin-health-box">
            <span :class="['admin-badge', healthMeta.tone]">{{ healthMeta.label }}</span>
            <p>{{ healthMeta.detail }}</p>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>性能指标</h3>
          <p class="admin-detail-card-desc">平均响应、P95、成功率和错误率。</p>
          <div class="admin-kv">
            <div v-for="row in performanceRows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>
                <span :class="['admin-badge', row.tone === 'good' ? 'is-success' : row.tone === 'warning' ? 'is-warn' : 'is-danger']">
                  {{ row.value }}
                </span>
              </dd>
            </div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>效率指标</h3>
          <p class="admin-detail-card-desc">观察用户和消息之间的整体效率。</p>
          <div class="admin-kv">
            <div v-for="row in efficiencyRows" :key="row.label">
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
.admin-icon-spin {
  display: inline-block;
  animation: adminSpin 0.8s linear infinite;
}

.dashboard-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  align-items: stretch;
}

.dashboard-hero-copy {
  display: grid;
  gap: 8px;
}

.dashboard-hero-copy h2 {
  margin: 0;
  font-size: 24px;
}

.dashboard-hero-copy p {
  margin: 0;
  color: var(--admin-ink-soft);
}

.dashboard-hero-side {
  display: grid;
  gap: 10px;
  align-content: start;
  min-width: 240px;
}

.dashboard-hero-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  flex: 1 0 100%;
  padding-top: 4px;
}

.dashboard-hero-summary-item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--admin-line);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.98));
}

.dashboard-hero-summary-item span {
  color: var(--admin-muted);
  font-size: 12px;
}

.dashboard-hero-summary-item strong {
  color: var(--admin-ink);
  font-size: 16px;
  font-weight: 700;
}

.dashboard-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dashboard-chart-shell {
  position: relative;
}

.dashboard-trend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-trend-item {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--admin-line);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.94));
}

.admin-trend-title {
  font-weight: 700;
  color: var(--admin-ink);
}

.admin-trend-unit {
  color: var(--admin-muted);
  font-size: 12px;
}

.admin-health-box {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.admin-health-box p {
  margin: 0;
  color: var(--admin-ink-soft);
  font-size: 13px;
  line-height: 1.7;
}

.admin-insight-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.admin-insight-change {
  margin-top: 10px;
  color: var(--admin-accent);
  font-weight: 600;
}

@keyframes adminSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .dashboard-hero,
  .admin-split {
    grid-template-columns: 1fr;
  }

  .dashboard-hero-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-trend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
