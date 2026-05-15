<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import FilterBar from "../../components/admin/FilterBar.vue";
import RunsTable from "../../components/admin/RunsTable.vue";
import { getRagTraceRuns } from "../../services/ragTraceService";
import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
  STATUS_OPTIONS,
  normalizeStatus,
  percentile
} from "./traceUtils";

const router = useRouter();
const loading = ref(false);
const errorText = ref("");
const pageNo = ref(1);
const page = ref({ records: [], total: 0, size: PAGE_SIZE });
const filters = ref({ ...DEFAULT_FILTERS });
const runsRequestId = ref(0);

const runs = computed(() => (Array.isArray(page.value?.records) ? page.value.records : []));
const total = computed(() => Number(page.value?.total ?? runs.value.length ?? 0));
const pages = computed(() => {
  const size = Number(page.value?.size ?? PAGE_SIZE);
  return size > 0 ? Math.max(1, Math.ceil(total.value / size)) : 1;
});

const stats = computed(() => {
  const durations = runs.value
    .map((item) => Number(item.durationMs ?? 0))
    .filter((value) => Number.isFinite(value) && value > 0);
  const successCount = runs.value.filter((item) => normalizeStatus(item.status) === "success").length;
  const failedCount = runs.value.filter((item) => normalizeStatus(item.status) === "failed").length;
  const runningCount = runs.value.filter((item) => normalizeStatus(item.status) === "running").length;
  const avgDuration = durations.length
    ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
    : 0;
  const p95Duration = Math.round(percentile(durations, 0.95));
  const successRate = runs.value.length ? Math.round((successCount / runs.value.length) * 1000) / 10 : 0;

  return {
    successCount,
    failedCount,
    runningCount,
    avgDuration,
    p95Duration,
    successRate
  };
});

const summaryCards = computed(() => [
  {
    title: "Success / Failed / Running",
    value: `${stats.value.successCount} / ${stats.value.failedCount} / ${stats.value.runningCount}`,
    hint: "当前页状态分布",
    tone: "indigo"
  },
  {
    title: "Success Rate",
    value: `${stats.value.successRate}%`,
    hint: "当前页成功率",
    tone: "emerald"
  },
  {
    title: "Avg Latency",
    value: stats.value.avgDuration ? `${stats.value.avgDuration} ms` : "--",
    hint: "当前页平均耗时",
    tone: "cyan"
  },
  {
    title: "P95 Latency",
    value: stats.value.p95Duration ? `${stats.value.p95Duration} ms` : "--",
    hint: "当前页 P95 耗时",
    tone: "amber"
  }
]);

const latestRun = computed(() => runs.value[0] || null);
const activeFilterCount = computed(() =>
  [filters.value.traceId, filters.value.conversationId, filters.value.taskId, filters.value.status].filter(Boolean).length
);
const activeFilterLabel = computed(() =>
  filters.value.traceId || filters.value.conversationId || filters.value.taskId || filters.value.status
    ? `${activeFilterCount.value} 项筛选`
    : "全部链路"
);

function formatDurationLabel(value) {
  const duration = Number(value ?? 0);
  if (!Number.isFinite(duration) || duration <= 0) return "--";
  if (duration < 1000) return `${Math.round(duration)}ms`;
  if (duration < 60_000) return `${(duration / 1000).toFixed(2)}s`;
  return `${(duration / 60_000).toFixed(1)}m`;
}

async function loadRuns() {
  const requestId = ++runsRequestId.value;
  loading.value = true;
  errorText.value = "";
  try {
    const result = await getRagTraceRuns(pageNo.value, PAGE_SIZE, {
      traceId: filters.value.traceId,
      conversationId: filters.value.conversationId,
      taskId: filters.value.taskId,
      status: filters.value.status
    });
    if (runsRequestId.value !== requestId) return;
    page.value = result;
  } catch (error) {
    if (runsRequestId.value !== requestId) return;
    errorText.value = error?.message || "加载 trace 列表失败。";
  } finally {
    if (runsRequestId.value !== requestId) return;
    loading.value = false;
  }
}

function handleFiltersChange(nextFilters) {
  filters.value = { ...nextFilters };
}

function handleSearch() {
  pageNo.value = 1;
  void loadRuns();
}

function handleRefresh() {
  void loadRuns();
}

function handleReset() {
  pageNo.value = 1;
  filters.value = { ...DEFAULT_FILTERS };
  void loadRuns();
}

function goPrevPage() {
  if (pageNo.value <= 1) return;
  pageNo.value -= 1;
  void loadRuns();
}

function goNextPage() {
  if (pageNo.value >= pages.value) return;
  pageNo.value += 1;
  void loadRuns();
}

function openRun(traceId) {
  router.push(`/admin/traces/${encodeURIComponent(traceId)}`);
}

watch(
  () => [filters.value.traceId, filters.value.conversationId, filters.value.taskId, filters.value.status],
  () => {
    pageNo.value = 1;
  }
);

onMounted(() => {
  void loadRuns();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Trace Runs"
      title="链路追踪"
      description="统一查看运行列表、筛选条件和耗时分布，点击任意一条记录可进入详情页查看节点执行轨迹。"
    >
      <template #meta>
        <div class="trace-header-meta">
          <span class="admin-badge is-muted">筛选：{{ activeFilterLabel }}</span>
          <span class="admin-badge is-muted">当前页：{{ runs.length }}</span>
          <span class="admin-badge is-muted">总数：{{ total }}</span>
          <span class="admin-badge is-muted">
            最新：{{ latestRun?.traceName || latestRun?.traceId || "--" }}
            <template v-if="latestRun">· {{ formatDurationLabel(latestRun.durationMs) }}</template>
          </span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-detail-card trace-hero-card">
      <div class="trace-hero-copy">
        <p class="trace-hero-tag">Trace Overview</p>
        <div class="trace-hero-title-row">
          <h2>链路追踪</h2>
          <span class="admin-badge is-muted">Page {{ pageNo }} / {{ pages }}</span>
        </div>
        <p class="trace-hero-subtitle">查看当前筛选条件下的运行记录，并快速跳转到单次 Trace 详情。</p>
        <div class="trace-hero-meta">
          <span>Trace {{ filters.traceId || "--" }}</span>
          <span>Conversation {{ filters.conversationId || "--" }}</span>
          <span>Task {{ filters.taskId || "--" }}</span>
          <span>Status {{ filters.status || "ALL" }}</span>
        </div>
      </div>

      <div class="trace-hero-side">
        <div class="trace-hero-cardline">
          <span class="trace-hero-cardlabel">Current</span>
          <strong>{{ runs.length }}</strong>
        </div>
        <div class="trace-hero-cardline">
          <span class="trace-hero-cardlabel">Total</span>
          <strong>{{ total }}</strong>
        </div>
        <div class="trace-hero-cardline">
          <span class="trace-hero-cardlabel">Pages</span>
          <strong>{{ pages }}</strong>
        </div>
        <div v-if="latestRun" class="trace-hero-cardline">
          <span class="trace-hero-cardlabel">Latest</span>
          <strong>{{ latestRun.traceName || latestRun.traceId }}</strong>
          <span class="trace-hero-cardmeta">{{ formatDurationLabel(latestRun.durationMs) }}</span>
        </div>
      </div>
    </section>

    <div class="admin-stat-grid">
      <StatCard
        v-for="card in summaryCards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :hint="card.hint"
        :tone="card.tone"
      />
    </div>

    <section class="admin-detail-card trace-filter-summary">
      <div class="trace-filter-summary__copy">
        <p class="trace-hero-tag">Trace Overview</p>
        <h2>当前筛选 {{ activeFilterCount }} 项</h2>
        <p>沿着筛选条件快速定位目标运行记录，再进入单条详情查看节点时间线、请求响应和错误信息。</p>
      </div>
      <div class="trace-filter-summary__grid">
        <div>
          <span class="trace-hero-cardlabel">Trace ID</span>
          <strong>{{ filters.traceId || "--" }}</strong>
        </div>
        <div>
          <span class="trace-hero-cardlabel">Conversation</span>
          <strong>{{ filters.conversationId || "--" }}</strong>
        </div>
        <div>
          <span class="trace-hero-cardlabel">Task</span>
          <strong>{{ filters.taskId || "--" }}</strong>
        </div>
        <div>
          <span class="trace-hero-cardlabel">Status</span>
          <strong>{{ filters.status || "ALL" }}</strong>
        </div>
      </div>
      <div v-if="latestRun" class="trace-filter-summary__latest">
        <span class="trace-hero-cardlabel">Latest</span>
        <strong>{{ latestRun.traceName || latestRun.traceId }}</strong>
        <p>
          {{ latestRun.conversationId || "--" }} ·
          {{ latestRun.taskId || "--" }} ·
          {{ latestRun.status || "--" }} ·
          {{ formatDurationLabel(latestRun.durationMs) }}
        </p>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>Trace 列表</h2>
            <p>支持多条件筛选、分页浏览和运行状态快速定位。</p>
          </div>
          <span class="admin-page-count">共 {{ total }} 条</span>
        </div>

        <FilterBar
          :filters="filters"
          :status-options="STATUS_OPTIONS"
          :loading="loading"
          @update:filters="handleFiltersChange"
          @search="handleSearch"
          @refresh="handleRefresh"
          @reset="handleReset"
        />

        <div v-if="loading && runs.length === 0" class="admin-empty">加载中...</div>
        <RunsTable
          v-else
          :runs="runs"
          :loading="loading"
          :current="pageNo"
          :pages="pages"
          :total="total"
          @open="openRun"
          @prev="goPrevPage"
          @next="goNextPage"
        />
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>筛选概览</h3>
          <p class="admin-detail-card-desc">当前 Trace 列表筛选条件。</p>
          <div class="admin-kv">
            <div><dt>Trace ID</dt><dd>{{ filters.traceId || "--" }}</dd></div>
            <div><dt>Conversation ID</dt><dd>{{ filters.conversationId || "--" }}</dd></div>
            <div><dt>Task ID</dt><dd>{{ filters.taskId || "--" }}</dd></div>
            <div><dt>Status</dt><dd>{{ filters.status || "全部" }}</dd></div>
            <div><dt>当前页</dt><dd>{{ pageNo }} / {{ pages }}</dd></div>
            <div><dt>当前数量</dt><dd>{{ runs.length }}</dd></div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>最近记录</h3>
          <p class="admin-detail-card-desc">打开列表中的任意运行记录查看详情。</p>
          <div v-if="runs.length === 0" class="admin-empty-sm">暂无运行记录</div>
          <div v-else class="admin-card-list">
            <div v-for="item in runs.slice(0, 4)" :key="item.traceId" class="admin-card-item">
              <h3>{{ item.traceName || item.traceId }}</h3>
              <p>{{ item.conversationId || "--" }}</p>
              <p>{{ item.status || "--" }} · {{ item.durationMs ? `${item.durationMs} ms` : "--" }}</p>
            </div>
          </div>
        </article>
      </aside>
    </section>
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
  color: var(--admin-ink);
  font-size: 24px;
  line-height: 1.2;
}

.trace-hero-subtitle {
  margin: 12px 0 0;
  color: var(--admin-ink-soft);
  font-size: 14px;
  line-height: 1.7;
}

.trace-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin-top: 14px;
  color: var(--admin-muted);
  font-size: 13px;
}

.trace-hero-side {
  flex: 0 0 230px;
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

.trace-hero-cardmeta {
  color: var(--admin-ink-soft);
  font-size: 13px;
  line-height: 1.5;
}

.trace-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.trace-filter-summary {
  display: grid;
  gap: 14px;
}

.trace-filter-summary__copy {
  display: grid;
  gap: 8px;
}

.trace-filter-summary__copy h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.25;
}

.trace-filter-summary__copy p,
.trace-filter-summary__latest p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.trace-filter-summary__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.trace-filter-summary__grid > div,
.trace-filter-summary__latest {
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
  background: rgba(255, 255, 255, 0.84);
}

.trace-filter-summary__grid strong,
.trace-filter-summary__latest strong {
  display: block;
  margin-top: 6px;
  color: var(--admin-ink);
  font-size: 15px;
}

.trace-filter-summary__latest {
  display: grid;
  gap: 4px;
}

.trace-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .trace-hero-card {
    flex-direction: column;
  }

  .trace-hero-side {
    flex-basis: auto;
    width: 100%;
  }

  .trace-filter-summary__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
