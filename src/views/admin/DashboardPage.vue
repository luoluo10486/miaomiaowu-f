<script setup>
import { computed, onMounted, ref } from "vue";
import {
  getAdminDashboardOverview,
  getAdminDashboardPerformance,
  getAdminDashboardTrends
} from "../../services/dashboardService";
import { formatDateTime } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const overview = ref(null);
const performance = ref(null);

const trendsSessions = ref(null);
const trendsMessages = ref(null);
const trendsActiveUsers = ref(null);
const trendsLatency = ref(null);
const trendsQuality = ref(null);

const windowValue = ref("24h");
const lastUpdated = ref(null);

const windowOptions = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" }
];

const WINDOW_LABEL_MAP = { "24h": "滚动 24h", "7d": "近 7 天", "30d": "近 30 天" };

const THRESHOLDS = {
  latency: { good: 10000, warning: 15000 },
  successRate: { good: 99, warning: 95 },
  errorRate: { good: 1, warning: 5 },
  noDocRate: { good: 10, warning: 30 }
};

function formatNumber(value) {
  if (value === null || value === undefined) return "--";
  return Number(value).toLocaleString("zh-CN");
}

function formatPercent(value) {
  if (value === null || value === undefined) return "--";
  return `${Number(value).toFixed(1)}%`;
}

function formatDuration(value) {
  if (value === null || value === undefined) return "--";
  const num = Number(value);
  if (num < 1000) return `${Math.round(num)}ms`;
  return `${(num / 1000).toFixed(2)}s`;
}

function formatRatio(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "--";
  return value.toFixed(2);
}

function formatCompactNumber(value) {
  if (value >= 10000) return `${(value / 1000).toFixed(0)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return Math.round(value).toString();
}

function formatDelta(deltaPct) {
  if (deltaPct === null || deltaPct === undefined) return null;
  const num = Number(deltaPct);
  if (num > 0) return { text: `+${num.toFixed(1)}%`, trend: "up", positive: true };
  if (num < 0) return { text: `${num.toFixed(1)}%`, trend: "down", positive: false };
  return { text: "0%", trend: "flat", positive: true };
}

function formatLastUpdated() {
  if (!lastUpdated.value) return "--";
  return new Date(lastUpdated.value).toLocaleString("zh-CN", {
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
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

const TONE_COLOR = { good: "#10B981", warning: "#F59E0B", bad: "#EF4444" };

const healthStatus = computed(() => {
  const perf = performance.value;
  const windowMessages = overview.value?.kpis?.messages24h?.value;
  if (!perf || !windowMessages) return "unknown";
  if ((perf.errorRate ?? 0) > THRESHOLDS.errorRate.warning) return "critical";
  if ((perf.successRate ?? 0) < THRESHOLDS.successRate.warning) return "critical";
  if ((perf.noDocRate ?? 0) > 20) return "attention";
  return "healthy";
});

const HEALTH_CONFIG = {
  healthy: { bg: "is-success", label: "运行正常" },
  attention: { bg: "is-warning", label: "需要关注" },
  critical: { bg: "is-error", label: "风险偏高" },
  unknown: { bg: "is-muted", label: "暂无数据" }
};

const kpiCards = computed(() => {
  const kpis = overview.value?.kpis || {};
  const sessionDepth = (kpis.sessions24h?.value ?? 0) > 0
    ? (kpis.messages24h?.value ?? 0) / (kpis.sessions24h?.value ?? 1)
    : null;
  return [
    { label: "活跃用户", value: formatNumber(kpis.activeUsers?.value), delta: formatDelta(kpis.activeUsers?.deltaPct), color: "is-blue" },
    { label: "会话数", value: formatNumber(kpis.sessions24h?.value), delta: formatDelta(kpis.sessions24h?.deltaPct), color: "is-indigo" },
    { label: "消息数", value: formatNumber(kpis.messages24h?.value), delta: formatDelta(kpis.messages24h?.deltaPct), color: "is-amber" },
    { label: "会话深度", value: sessionDepth === null ? "--" : formatRatio(sessionDepth), delta: null, color: "is-cyan", suffix: "条/会话" }
  ];
});

const successRate = computed(() => performance.value?.successRate ?? 0);
const ringColor = computed(() => {
  const v = successRate.value;
  if (v >= 95) return "#10B981";
  if (v >= 85) return "#F59E0B";
  return "#EF4444";
});
const ringDasharray = computed(() => 2 * Math.PI * 50);
const ringDashoffset = computed(() => {
  const progress = (Math.min(successRate.value, 100) / 100) * ringDasharray.value;
  return ringDasharray.value - progress;
});

const metricRows = computed(() => {
  const p = performance.value || {};
  return [
    { label: "平均响应", value: formatDuration(p.avgLatencyMs), tone: getMetricTone("latency", p.avgLatencyMs) },
    { label: "P95 响应", value: formatDuration(p.p95LatencyMs), tone: getMetricTone("latency", p.p95LatencyMs) }
  ];
});

const qualityItems = computed(() => {
  const p = performance.value || {};
  return [
    { label: "错误率", value: p.errorRate, toneClass: "is-error-bar", valueClass: "is-error-text", target: "阈值 ≤5%" },
    { label: "无知识率", value: p.noDocRate, toneClass: "is-warning-bar", valueClass: "is-warning-text", target: "阈值 ≤20%" },
    { label: "慢响应率", value: p.slowRate, toneClass: "is-info-bar", valueClass: "is-info-text", target: "阈值 ≤20%" }
  ];
});

function clampPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

const efficiencyItems = computed(() => {
  const kpis = overview.value?.kpis || {};
  const activeUsers = kpis.activeUsers?.value ?? 0;
  const sessions = kpis.sessions24h?.value ?? 0;
  const messages = kpis.messages24h?.value ?? 0;
  return [
    { label: "人均会话", value: activeUsers > 0 ? formatRatio(sessions / activeUsers) + " 次/人" : "--" },
    { label: "单会话消息", value: sessions > 0 ? formatRatio(messages / sessions) + " 条/会话" : "--" },
    { label: "人均消息", value: activeUsers > 0 ? formatRatio(messages / activeUsers) + " 条/人" : "--" }
  ];
});

const insights = computed(() => {
  const perf = performance.value;
  const windowMessages = overview.value?.kpis?.messages24h?.value;
  const windowLabel = WINDOW_LABEL_MAP[windowValue.value] || windowValue.value;
  if (!perf || !windowMessages) {
    return [{ type: "trend", title: "暂无会话数据", metric: "Dashboard", change: windowLabel, context: "当前窗口内暂无消息记录，各项指标将在会话产生后自动更新" }];
  }
  const items = [];
  if (perf.errorRate > 5 || perf.successRate < 95) {
    items.push({
      type: "anomaly", title: "链路稳定性触发告警",
      metric: "成功率/错误率", change: `${perf.successRate.toFixed(1)}% / ${perf.errorRate.toFixed(1)}%`,
      context: "成功率低于 95% 或错误率高于 5%", action: "优先查看失败请求分布与超时节点"
    });
  } else if (perf.noDocRate > 20) {
    items.push({
      type: "recommendation", title: "召回质量需优化",
      metric: "无知识率", change: `${perf.noDocRate.toFixed(1)}%`,
      context: "无知识率超过 20%，用户命中体验存在风险", action: "优化索引覆盖率与检索重排策略"
    });
  } else {
    items.push({
      type: "trend", title: "系统可用性稳定",
      metric: "成功率", change: `${perf.successRate.toFixed(1)}%`,
      context: "当前窗口整体可用性处于健康区间"
    });
  }
  if (perf.noDocRate > 20 && items.length < 3) {
    items.push({
      type: "recommendation", title: "召回质量需优化",
      metric: "无知识率", change: `${perf.noDocRate.toFixed(1)}%`,
      context: "无知识率超过 20%", action: "优化索引覆盖率与检索重排策略"
    });
  }
  if (perf.avgLatencyMs > 15000 && items.length < 3) {
    items.push({
      type: "recommendation", title: "响应性能需要关注",
      metric: "平均响应时间", change: `${(perf.avgLatencyMs / 1000).toFixed(2)}s`,
      context: "平均延迟高于阈值", action: "排查慢节点与模型并发配置"
    });
  }
  if (items.length < 3) {
    items.push({
      type: "recommendation", title: "继续保持当前策略",
      metric: "运营状态", change: windowLabel,
      context: "当前窗口内未发现显著异常趋势"
    });
  }
  return items.slice(0, 3);
});

const INSIGHT_STYLE = {
  anomaly: { cls: "is-anomaly", icon: "⚠" },
  trend: { cls: "is-trend", icon: "ℹ" },
  recommendation: { cls: "is-recommendation", icon: "💡" }
};

const INSIGHT_TYPE_LABEL = { anomaly: "异常", trend: "趋势", recommendation: "建议" };

function getSeriesData(trend) {
  if (!trend?.series?.length) return [];
  return trend.series[0]?.data || [];
}

function buildChartData(trend) {
  const data = getSeriesData(trend);
  if (data.length === 0) return { points: [], linePath: "", areaPath: "", yLabels: [], xLabels: [] };
  const vals = data.map((d) => Number(d.value) || 0);
  const maxVal = Math.max(1, ...vals);
  const CHART_W = 600;
  const CHART_H = 180;
  const PAD = { top: 8, right: 8, bottom: 28, left: 40 };
  const drawW = CHART_W - PAD.left - PAD.right;
  const drawH = CHART_H - PAD.top - PAD.bottom;
  const points = data.map((d, i) => {
    const x = i / Math.max(data.length - 1, 1);
    const y = 1 - (Number(d.value) / maxVal);
    return { x, y, ts: d.ts, value: d.value };
  });
  let line = "";
  if (points.length === 1) {
    line = `M ${points[0].x} ${points[0].y}`;
  } else {
    line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      line += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }
  const areaPath = `${line} L ${points[points.length - 1].x} 1 L ${points[0].x} 1 Z`;

  const yTickCount = 4;
  const yStep = maxVal / (yTickCount - 1);
  const yLabels = Array.from({ length: yTickCount }, (_, i) => ({
    y: i / (yTickCount - 1),
    label: formatCompactNumber(yStep * (yTickCount - 1 - i))
  }));

  const xCount = Math.min(5, data.length);
  const xStep = Math.max(1, Math.floor((data.length - 1) / (xCount - 1)));
  const xLabels = Array.from({ length: xCount }, (_, i) => {
    const idx = Math.min(i * xStep, data.length - 1);
    const pt = data[idx];
    if (!pt) return null;
    const date = new Date(pt.ts);
    const label = windowValue.value === "24h"
      ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
      : `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
    return { x: idx / Math.max(data.length - 1, 1), label };
  }).filter(Boolean);

  return { points, linePath: line, areaPath, yLabels, xLabels, CHART_W, CHART_H, PAD };
}

const trafficData = computed(() => buildChartData(trendsMessages.value));
const sessionsData = computed(() => buildChartData(trendsSessions.value));
const activeUsersData = computed(() => buildChartData(trendsActiveUsers.value));
const latencyData = computed(() => buildChartData(trendsLatency.value));
const qualityData = computed(() => buildChartData(trendsQuality.value));

function makeChartTooltip(trendRef) {
  const tooltip = ref({ visible: false, x: 0, y: 0, value: "", label: "" });
  const data = computed(() => buildChartData(trendRef.value));
  function handleMove(event) {
    const pts = data.value.points;
    if (pts.length === 0) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    let closestIdx = 0;
    let minDist = Infinity;
    pts.forEach((pt, i) => {
      const dist = Math.abs(pt.x - relativeX);
      if (dist < minDist) { minDist = dist; closestIdx = i; }
    });
    const pt = pts[closestIdx];
    const date = new Date(pt.ts);
    const label = windowValue.value === "24h"
      ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
      : `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
    tooltip.value = { visible: true, x: pt.x, y: pt.y, value: String(pt.value), label };
  }
  function handleLeave() { tooltip.value.visible = false; }
  return { tooltip, data, handleMove, handleLeave };
}

const trafficChart = makeChartTooltip(trendsMessages);
const sessionsChart = makeChartTooltip(trendsSessions);
const activeUsersChart = makeChartTooltip(trendsActiveUsers);
const latencyChart = makeChartTooltip(trendsLatency);
const qualityChart = makeChartTooltip(trendsQuality);

async function loadDashboard() {
  loading.value = true;
  errorText.value = "";
  const granularity = windowValue.value === "24h" ? "hour" : "day";
  try {
    const [overviewData, performanceData] = await Promise.all([
      getAdminDashboardOverview(windowValue.value),
      getAdminDashboardPerformance(windowValue.value)
    ]);
    overview.value = overviewData;
    performance.value = performanceData;
    lastUpdated.value = Date.now();
    try {
      const [s, m, au, l, q] = await Promise.all([
        getAdminDashboardTrends("sessions", windowValue.value, granularity),
        getAdminDashboardTrends("messages", windowValue.value, granularity),
        getAdminDashboardTrends("activeUsers", windowValue.value, granularity),
        getAdminDashboardTrends("avgLatency", windowValue.value, granularity),
        getAdminDashboardTrends("quality", windowValue.value, granularity)
      ]);
      trendsSessions.value = s;
      trendsMessages.value = m;
      trendsActiveUsers.value = au;
      trendsLatency.value = l;
      trendsQuality.value = q;
    } catch {
      trendsSessions.value = null;
      trendsMessages.value = null;
      trendsActiveUsers.value = null;
      trendsLatency.value = null;
      trendsQuality.value = null;
    }
  } catch (error) {
    errorText.value = error?.message || "加载 dashboard 失败，请稍后重试。";
  } finally {
    loading.value = false;
  }
}

function changeWindow(val) {
  windowValue.value = val;
  loadDashboard();
}

onMounted(() => { void loadDashboard(); });
</script>

<template>
  <section class="admin-page admin-dashboard">
    <header class="admin-dashboard-header">
      <h1 class="admin-page-title">Dashboard</h1>
      <div class="admin-dashboard-header-right">
        <div class="admin-window-tabs">
          <button
            v-for="opt in windowOptions"
            :key="opt.value"
            :class="['admin-window-tab', { 'is-active': windowValue === opt.value }]"
            type="button"
            :disabled="loading"
            @click="changeWindow(opt.value)"
          >{{ opt.label }}</button>
        </div>
        <div class="admin-updated-stamp">
          <span class="admin-dot is-success" />
          <span>{{ formatLastUpdated() }}</span>
        </div>
        <button class="admin-button--icon" type="button" :disabled="loading" @click="loadDashboard">
          <span :class="['admin-icon-refresh', { 'is-spinning': loading }]">⟳</span>
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-dashboard-grid">
      <div class="admin-dashboard-main">
        <article class="admin-dash-card">
          <h3 class="admin-dash-card-title">核心指标</h3>
          <div class="admin-kpi-grid">
            <div v-for="card in kpiCards" :key="card.label" class="admin-kpi-item">
              <div class="admin-kpi-top">
                <div>
                  <span class="admin-kpi-value">{{ card.value }}</span>
                  <span class="admin-kpi-label">{{ card.label }}<template v-if="card.suffix">（{{ card.suffix }}）</template></span>
                </div>
                <div :class="['admin-kpi-icon', card.color]">{{ card.label.charAt(0) }}</div>
              </div>
              <div class="admin-kpi-delta">
                <template v-if="card.delta && card.delta.trend !== 'flat'">
                  <span :class="['admin-kpi-delta-icon', card.delta.positive ? 'is-up' : 'is-down']">
                    {{ card.delta.trend === 'up' ? '↑' : '↓' }}
                  </span>
                  <span :class="['admin-kpi-delta-text', card.delta.positive ? 'is-up' : 'is-down']">{{ card.delta.text }}</span>
                  <span class="admin-kpi-delta-hint">较上周期</span>
                </template>
                <span v-else class="admin-kpi-delta-hint">--</span>
              </div>
            </div>
          </div>
        </article>

        <article class="admin-dash-card admin-dash-card--tall">
          <p class="admin-dash-card-title">流量概览</p>
          <template v-if="loading">
            <div class="admin-chart-placeholder" />
          </template>
          <div v-else-if="trafficData.points.length === 0" class="admin-empty-sm">暂无流量数据</div>
          <svg
            v-else
            class="admin-chart-full"
            :viewBox="`0 0 1 1`"
            preserveAspectRatio="none"
            @mousemove="trafficChart.handleMove"
            @mouseleave="trafficChart.handleLeave"
          >
            <defs>
              <linearGradient id="gradTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <path :d="trafficData.areaPath" fill="url(#gradTraffic)" />
            <path :d="trafficData.linePath" fill="none" stroke="#3B82F6" stroke-width="2" vector-effect="non-scaling-stroke" />
            <template v-if="trafficChart.tooltip.value.visible">
              <line :x1="trafficChart.tooltip.value.x" y1="0" :x2="trafficChart.tooltip.value.x" y2="1" stroke="#94A3B8" stroke-width="1" vector-effect="non-scaling-stroke" opacity="0.4" />
              <circle :cx="trafficChart.tooltip.value.x" :cy="trafficChart.tooltip.value.y" r="0.006" fill="#3B82F6" stroke="#fff" stroke-width="0.003" />
            </template>
          </svg>
          <div v-if="trafficChart.tooltip.value.visible" class="admin-chart-tooltip" :style="{ left: (trafficChart.tooltip.value.x * 100) + '%', top: (trafficChart.tooltip.value.y * 70) + '%' }">
            <div class="admin-chart-tooltip-label">{{ trafficChart.tooltip.value.label }}</div>
            <div class="admin-chart-tooltip-value">
              <span class="admin-chart-tooltip-dot" />消息数: {{ trafficChart.tooltip.value.value }}
            </div>
          </div>
        </article>

        <article class="admin-dash-card">
          <h3 class="admin-dash-card-title">趋势分析</h3>
          <div class="admin-trend-grid">
            <div class="admin-trend-item">
              <div class="admin-trend-title">会话趋势</div>
              <div class="admin-trend-unit">单位：次</div>
              <svg v-if="sessionsData.points.length > 0" class="admin-chart-sm" viewBox="0 0 1 1" preserveAspectRatio="none" @mousemove="sessionsChart.handleMove" @mouseleave="sessionsChart.handleLeave">
                <defs><linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10B981" stop-opacity="0.2" /><stop offset="100%" stop-color="#10B981" stop-opacity="0.02" /></linearGradient></defs>
                <path :d="sessionsData.areaPath" fill="url(#gradSessions)" />
                <path :d="sessionsData.linePath" fill="none" stroke="#10B981" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
              <div v-else class="admin-empty-sm">暂无数据</div>
            </div>
            <div class="admin-trend-item">
              <div class="admin-trend-title">活跃用户趋势</div>
              <div class="admin-trend-unit">单位：人</div>
              <svg v-if="activeUsersData.points.length > 0" class="admin-chart-sm" viewBox="0 0 1 1" preserveAspectRatio="none" @mousemove="activeUsersChart.handleMove" @mouseleave="activeUsersChart.handleLeave">
                <defs><linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366F1" stop-opacity="0.2" /><stop offset="100%" stop-color="#6366F1" stop-opacity="0.02" /></linearGradient></defs>
                <path :d="activeUsersData.areaPath" fill="url(#gradActive)" />
                <path :d="activeUsersData.linePath" fill="none" stroke="#6366F1" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
              <div v-else class="admin-empty-sm">暂无数据</div>
            </div>
            <div class="admin-trend-item">
              <div class="admin-trend-title">响应时间趋势</div>
              <div class="admin-trend-unit">单位：毫秒</div>
              <svg v-if="latencyData.points.length > 0" class="admin-chart-sm" viewBox="0 0 1 1" preserveAspectRatio="none" @mousemove="latencyChart.handleMove" @mouseleave="latencyChart.handleLeave">
                <defs><linearGradient id="gradLatency" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F59E0B" stop-opacity="0.2" /><stop offset="100%" stop-color="#F59E0B" stop-opacity="0.02" /></linearGradient></defs>
                <path :d="latencyData.areaPath" fill="url(#gradLatency)" />
                <path :d="latencyData.linePath" fill="none" stroke="#F59E0B" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
              <div v-else class="admin-empty-sm">暂无数据</div>
            </div>
            <div class="admin-trend-item">
              <div class="admin-trend-title">质量趋势</div>
              <div class="admin-trend-unit">单位：%</div>
              <svg v-if="qualityData.points.length > 0" class="admin-chart-sm" viewBox="0 0 1 1" preserveAspectRatio="none" @mousemove="qualityChart.handleMove" @mouseleave="qualityChart.handleLeave">
                <defs><linearGradient id="gradQuality" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#EF4444" stop-opacity="0.2" /><stop offset="100%" stop-color="#EF4444" stop-opacity="0.02" /></linearGradient></defs>
                <path :d="qualityData.areaPath" fill="url(#gradQuality)" />
                <path :d="qualityData.linePath" fill="none" stroke="#EF4444" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
              <div v-else class="admin-empty-sm">暂无数据</div>
            </div>
          </div>
        </article>
      </div>

      <aside class="admin-dashboard-aside">
        <article class="admin-dash-card">
          <div class="admin-perf-header">
            <h3 class="admin-dash-card-title">AI 性能</h3>
            <span :class="['admin-badge', HEALTH_CONFIG[healthStatus].bg]">{{ HEALTH_CONFIG[healthStatus].label }}</span>
          </div>
          <div class="admin-perf-ring-wrap">
            <svg class="admin-perf-ring" viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" stroke-width="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                :stroke="ringColor" stroke-width="8" stroke-linecap="round"
                :stroke-dasharray="ringDasharray" :stroke-dashoffset="ringDashoffset"
                class="admin-perf-ring-progress"
              />
            </svg>
            <div class="admin-perf-ring-label">
              <span class="admin-perf-ring-value" :style="{ color: ringColor }">{{ formatPercent(successRate) }}</span>
              <span class="admin-perf-ring-hint">成功率</span>
            </div>
          </div>
          <div class="admin-metric-rows">
            <div v-for="row in metricRows" :key="row.label" class="admin-metric-row">
              <span class="admin-metric-row-label">{{ row.label }}</span>
              <span class="admin-metric-row-value" :style="{ color: TONE_COLOR[row.tone] }">{{ row.value }}</span>
            </div>
          </div>

          <div class="admin-quality-snapshot">
            <div class="admin-quality-header">
              <span class="admin-quality-title">质量快照（柱状）</span>
              <span class="admin-quality-window">{{ WINDOW_LABEL_MAP[windowValue] || windowValue }}</span>
            </div>
            <div class="admin-quality-bars">
              <div v-for="item in qualityItems" :key="item.label" class="admin-quality-bar-item">
                <div class="admin-quality-bar-track">
                  <div :class="['admin-quality-bar-fill', item.toneClass]" :style="{ height: Math.max(clampPercent(item.value), item.value != null ? 4 : 0) + '%' }" />
                </div>
                <div :class="['admin-quality-bar-value', item.valueClass]">{{ formatPercent(item.value) }}</div>
                <div class="admin-quality-bar-label">{{ item.label }}</div>
                <div class="admin-quality-bar-target">{{ item.target }}</div>
              </div>
            </div>
          </div>

          <div class="admin-efficiency-snapshot">
            <div class="admin-efficiency-header">
              <span class="admin-efficiency-title">运营效率</span>
              <span class="admin-efficiency-window">{{ WINDOW_LABEL_MAP[windowValue] || windowValue }}</span>
            </div>
            <div v-for="item in efficiencyItems" :key="item.label" class="admin-efficiency-row">
              <span class="admin-efficiency-label">{{ item.label }}</span>
              <span class="admin-efficiency-value">{{ item.value }}</span>
            </div>
          </div>
        </article>

        <article class="admin-dash-card admin-insight-card">
          <h3 class="admin-dash-card-title">运营洞察</h3>
          <div class="admin-insight-list">
            <div v-for="(item, i) in insights" :key="i" class="admin-insight-item">
              <div class="admin-insight-header">
                <span :class="['admin-insight-badge', INSIGHT_STYLE[item.type]?.cls || 'is-trend']">
                  {{ INSIGHT_STYLE[item.type]?.icon || 'ℹ' }} {{ INSIGHT_TYPE_LABEL[item.type] || item.type }}
                </span>
              </div>
              <p class="admin-insight-title">{{ item.title }}</p>
              <p class="admin-insight-metric">{{ item.metric }}: {{ item.change }}</p>
              <p class="admin-insight-context">归因：{{ item.context }}</p>
              <p v-if="item.action" class="admin-insight-action">建议：{{ item.action }}</p>
            </div>
          </div>
        </article>
      </aside>
    </div>
  </section>
</template>
