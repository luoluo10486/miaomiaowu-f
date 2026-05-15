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
  router.push(`/admin/traces/${traceId}`);
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
      <template #actions>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">刷新</button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

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
