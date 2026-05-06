<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRagTraceDetail, getRagTraceNodes } from "../../services/adminService";
import { formatDateTime, formatRelativeStatus, safeArray } from "./adminShared";

const route = useRoute();
const router = useRouter();
const traceId = computed(() => route.params.traceId);
const loading = ref(false);
const errorText = ref("");
const detail = ref(null);
const nodes = ref([]);

async function loadTraceDetail() {
  loading.value = true;
  errorText.value = "";

  try {
    const [detailData, nodesData] = await Promise.all([
      getRagTraceDetail(traceId.value),
      getRagTraceNodes(traceId.value)
    ]);

    detail.value = detailData;
    nodes.value = Array.isArray(nodesData) ? nodesData : safeArray(detailData?.nodes);
  } catch (error) {
    errorText.value = error?.message || "加载 trace 详情失败。";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadTraceDetail();
});
</script>

<template>
  <section class="admin-page">
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Trace Detail</span>
        <h2 class="admin-page-title">Trace {{ traceId }}</h2>
        <p class="admin-page-subtitle">查看 trace run 摘要和节点级执行明细，方便排查超时、报错和节点链路问题。</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/traces')">Back</button>
        <button class="admin-button" type="button" :disabled="loading" @click="loadTraceDetail">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-grid-4">
      <article class="admin-stat-card">
        <span>Status</span>
        <strong>{{ formatRelativeStatus(detail?.run?.status) }}</strong>
        <small>{{ detail?.run?.errorMessage || "No error" }}</small>
      </article>
      <article class="admin-stat-card">
        <span>Duration</span>
        <strong>{{ detail?.run?.durationMs ? `${detail.run.durationMs} ms` : "--" }}</strong>
        <small>{{ detail?.run?.entryMethod || "--" }}</small>
      </article>
      <article class="admin-stat-card">
        <span>User</span>
        <strong>{{ detail?.run?.userName || detail?.run?.username || "--" }}</strong>
        <small>{{ detail?.run?.userId || "--" }}</small>
      </article>
      <article class="admin-stat-card">
        <span>Started</span>
        <strong>{{ formatDateTime(detail?.run?.startTime) }}</strong>
        <small>{{ detail?.run?.taskId || "--" }}</small>
      </article>
    </section>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <h3>Nodes</h3>
        </div>
        <div class="admin-page-count">{{ nodes.length }} node(s)</div>
      </div>

      <div v-if="nodes.length === 0" class="admin-empty">暂无节点数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Node</th>
              <th>Type</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Started</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in nodes" :key="item.nodeId">
              <td>
                <p>{{ item.nodeName || item.nodeId }}</p>
                <small class="admin-list-meta is-code">{{ item.parentNodeId || "--" }}</small>
              </td>
              <td>{{ item.nodeType || item.className || "--" }}</td>
              <td>{{ formatRelativeStatus(item.status) }}</td>
              <td>{{ item.durationMs ? `${item.durationMs} ms` : "--" }}</td>
              <td>{{ formatDateTime(item.startTime) }}</td>
              <td>{{ item.errorMessage || "--" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
