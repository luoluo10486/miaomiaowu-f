<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { getRagTraceRuns } from "../../services/ragTraceService";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import FilterBar from "../../components/admin/FilterBar.vue";
import RunsTable from "../../components/admin/RunsTable.vue";
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
    errorText.value = error?.message || "加载 trace 列表失败，请稍后重试。";
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
    <div class="trace-list-shell">
      <PageHeader
        tag="Trace Runs"
        title="链路追踪"
        description="统一查看运行列表、筛选条件和耗时分布，点击任意一条记录进入详情页查看节点执行轨迹。"
      >
        <template #actions>
          <button class="admin-button--ghost" type="button" :disabled="loading" @click="handleRefresh">
            刷新
          </button>
        </template>
      </PageHeader>

      <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

      <div class="admin-stat-grid">
        <StatCard title="成功 / 失败 / 运行中" :value="`${stats.successCount} / ${stats.failedCount} / ${stats.runningCount}`" tone="emerald">
          <template #icon>R</template>
        </StatCard>
        <StatCard title="成功率" :value="`${stats.successRate}%`" tone="cyan">
          <template #icon>%</template>
        </StatCard>
        <StatCard title="平均耗时" :value="stats.avgDuration ? `${stats.avgDuration} ms` : '--'" tone="indigo">
          <template #icon>μ</template>
        </StatCard>
        <StatCard title="P95 耗时" :value="stats.p95Duration ? `${stats.p95Duration} ms` : '--'" tone="amber">
          <template #icon>P</template>
        </StatCard>
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

      <RunsTable
        :runs="runs"
        :loading="loading"
        :current="pageNo"
        :pages="pages"
        :total="total"
        @open="openRun"
        @prev="goPrevPage"
        @next="goNextPage"
      />
    </div>
  </section>
</template>

<style scoped>
.trace-list-shell {
  display: grid;
  gap: 18px;
}
</style>
