<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import {
  clamp,
  formatDateTime,
  formatDuration,
  normalizeStatus,
  resolveNodeDuration,
  statusBadgeClass,
  statusLabel,
  toTimestamp
} from "./traceUtils";
import { getRagTraceDetail, getRagTraceNodes } from "../../services/ragTraceService";

function decodeTraceId(value) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getErrorMessage(error, fallback) {
  return error?.message || fallback;
}

function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function stringifyJson(value) {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function statusTone(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "failed" || normalized === "timeout") return "amber";
  if (normalized === "running") return "cyan";
  return "emerald";
}

const route = useRoute();
const router = useRouter();
const traceId = computed(() => decodeTraceId(String(route.params.traceId || "")));
const traceIdDisplay = computed(() => {
  const value = traceId.value || "--";
  if (value.length <= 28) return value;
  return `${value.slice(0, 12)}...${value.slice(-8)}`;
});

const loading = ref(false);
const errorText = ref("");
const detail = ref(null);
const nodes = ref([]);
const detailRequestId = ref(0);

const run = computed(() => detail.value?.run || {});
const traceName = computed(() => run.value.traceName || "未命名链路");
const traceStatus = computed(() => statusLabel(run.value.status));
const isInitialLoading = computed(() => loading.value && !detail.value);

const traceRequest = computed(() =>
  pickFirstDefined(
    detail.value?.request,
    detail.value?.requestPayload,
    detail.value?.requestBody,
    run.value.request,
    run.value.requestPayload,
    run.value.requestBody
  )
);

const traceResponse = computed(() =>
  pickFirstDefined(
    detail.value?.response,
    detail.value?.responsePayload,
    detail.value?.responseBody,
    run.value.response,
    run.value.responsePayload,
    run.value.responseBody
  )
);

const traceMetadata = computed(() =>
  pickFirstDefined(detail.value?.metadata, detail.value?.requestMetadata, run.value.metadata)
);

const traceError = computed(() =>
  pickFirstDefined(run.value.errorMessage, detail.value?.errorMessage, detail.value?.error)
);

const nodeStats = computed(() => {
  const total = nodes.value.length;
  const success = nodes.value.filter((node) => normalizeStatus(node.status) === "success").length;
  const failed = nodes.value.filter((node) => normalizeStatus(node.status) === "failed").length;
  const running = nodes.value.filter((node) => normalizeStatus(node.status) === "running").length;
  const avgDuration =
    total > 0 ? Math.round(nodes.value.reduce((sum, node) => sum + resolveNodeDuration(node), 0) / total) : 0;
  const sorted = [...nodes.value].sort((a, b) => resolveNodeDuration(b) - resolveNodeDuration(a));
  return { total, success, failed, running, avgDuration, topSlowestId: sorted[0]?.nodeId || "" };
});

const slowestNodeLabel = computed(() => {
  if (!nodeStats.value.topSlowestId) return "--";
  const target = nodes.value.find((node) => node.nodeId === nodeStats.value.topSlowestId);
  return target?.nodeName || target?.nodeId || "--";
});

const overviewCards = computed(() => [
  {
    title: "状态",
    value: traceStatus.value,
    tone: statusTone(run.value.status),
    icon: "S"
  },
  {
    title: "总耗时",
    value: formatDuration(run.value.durationMs ?? undefined),
    tone: "indigo",
    icon: "D"
  },
  {
    title: "用户",
    value: run.value.userName || run.value.username || run.value.userId || "--",
    tone: "cyan",
    icon: "U"
  },
  {
    title: "开始时间",
    value: formatDateTime(run.value.startTime),
    tone: "amber",
    icon: "T"
  }
]);

const traceDetailSummary = computed(() => [
  { label: "Trace ID", value: traceIdDisplay.value },
  { label: "状态", value: traceStatus.value },
  { label: "节点数", value: String(nodeStats.value.total) },
  { label: "总耗时", value: formatDuration(run.value.durationMs ?? undefined) }
]);

const timeline = computed(() => {
  const source = Array.isArray(nodes.value) ? nodes.value : [];
  if (source.length === 0) {
    return { totalWindowMs: 0, rows: [] };
  }

  const normalized = source.map((node) => {
    const startTs = toTimestamp(node.startTime);
    const endTs = toTimestamp(node.endTime);
    const resolvedDurationMs = resolveNodeDuration(node);
    const depthValue = Math.max(0, Number(node.depth ?? node.level ?? 0));
    const resolvedStartTs = startTs ?? 0;
    const resolvedEndTs = endTs ?? (resolvedStartTs > 0 ? resolvedStartTs + resolvedDurationMs : 0);
    return {
      ...node,
      depthValue,
      resolvedDurationMs,
      startTs: resolvedStartTs,
      endTs: resolvedEndTs
    };
  });

  const withTime = normalized.filter((item) => item.startTs > 0);
  const baseStart = withTime.length
    ? withTime.reduce((min, item) => Math.min(min, item.startTs), withTime[0].startTs)
    : Date.now();
  const maxEnd = withTime.length
    ? withTime.reduce((max, item) => Math.max(max, item.endTs || item.startTs), withTime[0].endTs || withTime[0].startTs)
    : baseStart;
  const runDuration = Number(run.value.durationMs ?? 0);
  const windowDuration = Math.max(runDuration > 0 ? runDuration : maxEnd - baseStart, 1);

  const rows = normalized
    .sort((a, b) => a.startTs - b.startTs || a.depthValue - b.depthValue)
    .map((node) => {
      const offsetMs = node.startTs > 0 ? Math.max(0, node.startTs - baseStart) : 0;
      const leftPercent = clamp((offsetMs / windowDuration) * 100, 0, 99.2);
      const widthPercent = clamp((Math.max(node.resolvedDurationMs, 1) / windowDuration) * 100, 0.8, 100 - leftPercent);
      return { ...node, offsetMs, leftPercent, widthPercent };
    });

  return { totalWindowMs: windowDuration, rows };
});

async function loadTraceDetail() {
  if (!traceId.value) {
    detail.value = null;
    nodes.value = [];
    errorText.value = "";
    return;
  }

  const requestId = ++detailRequestId.value;
  loading.value = true;
  errorText.value = "";

  try {
    const [detailData, nodesData] = await Promise.all([getRagTraceDetail(traceId.value), getRagTraceNodes(traceId.value)]);
    if (detailRequestId.value !== requestId) return;
    detail.value = detailData;
    nodes.value = Array.isArray(nodesData) ? nodesData : Array.isArray(detailData?.nodes) ? detailData.nodes : [];
  } catch (error) {
    if (detailRequestId.value !== requestId) return;
    errorText.value = getErrorMessage(error, "加载 trace 详情失败。");
    detail.value = null;
    nodes.value = [];
  } finally {
    if (detailRequestId.value !== requestId) return;
    loading.value = false;
  }
}

function copyTraceId() {
  if (!traceId.value || !navigator?.clipboard?.writeText) return;
  navigator.clipboard.writeText(traceId.value).catch(() => {
    // ignore clipboard failure
  });
}

watch(traceId, () => {
  void loadTraceDetail();
});

onMounted(() => {
  void loadTraceDetail();
});
</script>

<template>
  <section class="admin-page admin-trace-detail">
    <PageHeader
      tag="Trace Detail"
      :title="traceId ? `Trace ${traceId}` : 'Trace 详情'"
      description="查看链路运行摘要、请求响应、错误信息和节点时间线，快速定位异常与耗时瓶颈。"
    >
      <template #meta>
        <div class="trace-header-meta">
          <span class="admin-badge is-muted">Trace：{{ traceIdDisplay }}</span>
          <span class="admin-badge is-muted">状态：{{ traceStatus }}</span>
          <span class="admin-badge is-muted">节点：{{ nodeStats.total }}</span>
          <span class="admin-badge is-muted">耗时：{{ formatDuration(run.durationMs ?? undefined) }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/traces')">返回列表</button>
        <button class="admin-button--ghost" type="button" @click="copyTraceId" :disabled="!traceId">复制 Trace ID</button>
        <button class="admin-button" type="button" :disabled="loading" @click="loadTraceDetail">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div v-if="isInitialLoading" class="trace-loading-banner">
      <span class="trace-loading-dot" />
      <span>加载 Trace 详情中...</span>
    </div>

    <template v-else>
      <section class="admin-detail-card trace-hero-card">
        <div class="trace-hero-copy">
          <p class="trace-hero-tag">链路概览</p>
          <div class="trace-hero-title-row">
            <h2>{{ traceName }}</h2>
            <span :class="['admin-badge', statusBadgeClass(run.status)]">{{ traceStatus }}</span>
          </div>
          <p class="trace-hero-subtitle">
            <button class="trace-id-chip" type="button" :disabled="!traceId" @click="copyTraceId">
              {{ traceIdDisplay }}
            </button>
          </p>
          <div class="trace-hero-meta">
            <span>用户 {{ run.userName || run.username || run.userId || "--" }}</span>
            <span>开始 {{ formatDateTime(run.startTime) }}</span>
            <span>结束 {{ formatDateTime(run.endTime) }}</span>
          </div>
        </div>
        <div class="trace-hero-side">
          <div class="trace-hero-cardline">
            <span class="trace-hero-cardlabel">会话 ID</span>
            <strong>{{ run.conversationId || "--" }}</strong>
          </div>
          <div class="trace-hero-cardline">
            <span class="trace-hero-cardlabel">任务 ID</span>
            <strong>{{ run.taskId || "--" }}</strong>
          </div>
          <div class="trace-hero-cardline">
            <span class="trace-hero-cardlabel">总耗时</span>
            <strong>{{ formatDuration(run.durationMs ?? undefined) }}</strong>
          </div>
          <div class="trace-hero-cardline">
            <span class="trace-hero-cardlabel">最慢节点</span>
            <strong>{{ slowestNodeLabel }}</strong>
          </div>
        </div>
      </section>

      <section class="admin-detail-card trace-detail-summary">
        <div class="trace-detail-summary__copy">
          <p class="trace-hero-tag">链路摘要</p>
          <h2>运行摘要</h2>
          <p>先看链路主信息，再往下看请求、响应、错误与节点时间线，保持和 frontend 参考一致的阅读顺序。</p>
        </div>
        <div class="trace-detail-summary__grid">
          <div v-for="item in traceDetailSummary" :key="item.label" class="trace-detail-summary__item">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <div class="admin-stat-grid">
        <StatCard v-for="card in overviewCards" :key="card.title" :title="card.title" :value="card.value" :tone="card.tone">
          <template #icon>{{ card.icon }}</template>
        </StatCard>
      </div>

      <section class="admin-split">
        <article class="admin-detail-card">
          <h3>基础信息</h3>
          <p class="admin-detail-card-desc">Trace 标识、会话、任务和状态概览。</p>
          <div class="admin-kv">
            <div><dt>Trace ID</dt><dd class="is-code">{{ traceId || "--" }}</dd></div>
            <div><dt>链路名称</dt><dd>{{ run.traceName || "--" }}</dd></div>
            <div><dt>会话 ID</dt><dd class="is-code">{{ run.conversationId || "--" }}</dd></div>
            <div><dt>任务 ID</dt><dd class="is-code">{{ run.taskId || "--" }}</dd></div>
            <div><dt>用户</dt><dd>{{ run.userName || run.username || run.userId || "--" }}</dd></div>
            <div><dt>状态</dt><dd><span :class="['admin-badge', statusBadgeClass(run.status)]">{{ traceStatus }}</span></dd></div>
            <div><dt>开始时间</dt><dd>{{ formatDateTime(run.startTime) }}</dd></div>
            <div><dt>结束时间</dt><dd>{{ formatDateTime(run.endTime) }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>运行摘要</h3>
          <p class="admin-detail-card-desc">节点统计和整体耗时情况。</p>
          <div class="admin-kv">
            <div><dt>总耗时</dt><dd>{{ formatDuration(run.durationMs ?? undefined) }}</dd></div>
            <div><dt>节点数</dt><dd>{{ nodeStats.total }}</dd></div>
            <div><dt>成功 / 失败 / 运行中</dt><dd>{{ nodeStats.success }} / {{ nodeStats.failed }} / {{ nodeStats.running }}</dd></div>
            <div><dt>节点平均耗时</dt><dd>{{ formatDuration(nodeStats.avgDuration) }}</dd></div>
            <div><dt>最慢节点</dt><dd>{{ slowestNodeLabel }}</dd></div>
          </div>
        </article>
      </section>

      <section class="admin-detail-card">
        <h3>请求 / 响应 / 元数据</h3>
        <p class="admin-detail-card-desc">展示原始输入输出，便于排查上下文和后端返回值。</p>
        <div class="trace-meta-grid">
          <div>
            <h4 class="trace-section-title">请求</h4>
            <pre v-if="traceRequest" class="admin-pre">{{ stringifyJson(traceRequest) }}</pre>
            <div v-else class="admin-empty">暂无请求内容</div>
          </div>
          <div>
            <h4 class="trace-section-title">响应</h4>
            <pre v-if="traceResponse" class="admin-pre">{{ stringifyJson(traceResponse) }}</pre>
            <div v-else class="admin-empty">暂无响应内容</div>
          </div>
          <div>
            <h4 class="trace-section-title">错误</h4>
            <pre v-if="traceError" class="admin-pre is-error">{{ stringifyJson(traceError) }}</pre>
            <div v-else class="admin-empty">暂无错误信息</div>
          </div>
          <div>
            <h4 class="trace-section-title">元数据</h4>
            <pre v-if="traceMetadata" class="admin-pre">{{ stringifyJson(traceMetadata) }}</pre>
            <div v-else class="admin-empty">暂无元数据</div>
          </div>
        </div>
      </section>

      <section class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>节点时间线</h2>
            <p>共 {{ nodeStats.total }} 个节点，成功 {{ nodeStats.success }}，失败 {{ nodeStats.failed }}，运行中 {{ nodeStats.running }}。</p>
          </div>
          <span class="admin-page-count">{{ formatDuration(timeline.totalWindowMs) }}</span>
        </div>

        <div v-if="nodes.length === 0" class="admin-empty">暂无节点数据</div>
        <div v-else class="trace-timeline-table">
          <div class="trace-timeline-scale">
            <span v-for="tick in [0, 25, 50, 75, 100]" :key="tick" :style="{ left: `${tick}%` }">
              {{ formatDuration((timeline.totalWindowMs * tick) / 100) }}
            </span>
          </div>

          <div class="trace-timeline-head">
            <span>节点</span>
            <span>类型</span>
            <span>时间线</span>
            <span>耗时</span>
            <span>开始</span>
            <span>结束</span>
            <span>错误信息</span>
          </div>

          <div class="trace-timeline-body">
            <div v-for="item in timeline.rows" :key="item.nodeId" class="trace-timeline-row">
              <div>
                <p class="admin-cell-title">{{ item.nodeName || item.nodeId }}</p>
                <p class="admin-cell-subtitle is-secondary">{{ item.parentNodeId || "--" }}</p>
              </div>
              <div>{{ item.nodeType || item.className || "--" }}</div>
              <div class="trace-timeline">
                <div class="trace-timeline-track">
                  <div
                    class="trace-timeline-bar"
                    :class="{ 'is-slowest': nodeStats.avgDuration > 0 && resolveNodeDuration(item) >= nodeStats.avgDuration * 1.2 }"
                    :style="{ left: `${item.leftPercent}%`, width: `${Math.max(item.widthPercent, 0.8)}%` }"
                  />
                </div>
              </div>
              <div>{{ formatDuration(item.resolvedDurationMs) }}</div>
              <div>{{ formatDateTime(item.startTime) }}</div>
              <div>{{ formatDateTime(item.endTime) }}</div>
              <div>{{ item.errorMessage || "--" }}</div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.trace-hero-card {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 20px;
}

.trace-hero-copy {
  min-width: 0;
  flex: 1 1 auto;
}

.trace-hero-tag {
  margin: 0 0 8px;
  color: var(--admin-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.trace-hero-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trace-hero-title-row h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: var(--admin-ink);
}

.trace-hero-subtitle {
  margin: 12px 0 0;
}

.trace-loading-banner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--admin-line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--admin-muted);
  font-size: 13px;
}

.trace-loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--admin-accent);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
  animation: tracePulse 1.4s ease-in-out infinite;
}

.trace-id-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--admin-line);
  border-radius: 999px;
  background: #fff;
  color: var(--admin-ink-soft);
  font-family: var(--admin-mono);
  font-size: 12px;
  word-break: break-all;
  cursor: pointer;
}

.trace-id-chip:hover:not(:disabled) {
  border-color: var(--admin-line-strong);
  color: var(--admin-ink);
}

.trace-id-chip:disabled {
  cursor: default;
  opacity: 0.7;
}

.trace-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-top: 14px;
  color: var(--admin-muted);
  font-size: 13px;
}

.trace-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.trace-detail-summary {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.trace-detail-summary__copy {
  display: grid;
  gap: 8px;
}

.trace-detail-summary__copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.trace-detail-summary__copy p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.trace-detail-summary__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.trace-detail-summary__item {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.trace-detail-summary__item span {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.trace-detail-summary__item strong {
  color: var(--admin-ink);
  font-size: 16px;
  font-weight: 700;
  word-break: break-word;
}

.trace-hero-side {
  flex: 0 0 240px;
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.95));
}

.trace-hero-cardline {
  display: grid;
  gap: 4px;
}

.trace-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.trace-section-title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--admin-ink-soft);
}

.trace-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.trace-timeline-table {
  display: grid;
  gap: 0;
}

.trace-timeline-scale {
  position: relative;
  height: 28px;
  border-bottom: 1px solid var(--admin-line);
  margin-bottom: 6px;
}

.trace-timeline-scale span {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  color: var(--admin-muted);
  font-size: 11px;
}

.trace-timeline-head {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 120px 2fr 100px 160px 160px minmax(160px, 1fr);
  gap: 12px;
  padding: 10px 14px;
  color: var(--admin-muted);
  font-size: 12px;
  font-weight: 600;
  border-bottom: 1px solid var(--admin-line);
}

.trace-timeline-body {
  display: grid;
}

.trace-timeline-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 120px 2fr 100px 160px 160px minmax(160px, 1fr);
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
}

.trace-timeline-row:last-child {
  border-bottom: 0;
}

.trace-timeline {
  min-width: 260px;
}

.trace-timeline-track {
  position: relative;
  height: 20px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(226, 232, 240, 0.5), rgba(241, 245, 249, 1));
  overflow: hidden;
}

.trace-timeline-bar {
  position: absolute;
  top: 3px;
  bottom: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4f46e5, #60a5fa);
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.18);
}

.trace-timeline-bar.is-slowest {
  background: linear-gradient(90deg, #f59e0b, #fb7185);
  box-shadow: 0 6px 14px rgba(245, 158, 11, 0.18);
}

.admin-pre.is-error {
  color: #b91c1c;
  background: #fef2f2;
}

@keyframes tracePulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

@media (max-width: 1180px) {
  .trace-timeline-head,
  .trace-timeline-row {
    grid-template-columns: minmax(160px, 1fr) 100px 2fr 90px 140px 140px minmax(140px, 1fr);
  }
}

@media (max-width: 960px) {
  .trace-detail-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .trace-hero-card {
    flex-direction: column;
  }

  .trace-hero-side {
    flex-basis: auto;
    width: 100%;
  }

  .trace-meta-grid {
    grid-template-columns: 1fr;
  }

  .trace-timeline-head,
  .trace-timeline-row {
    grid-template-columns: 1fr;
  }

  .trace-timeline {
    min-width: 0;
    width: 100%;
  }
}
</style>
