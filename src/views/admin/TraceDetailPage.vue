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
        <button class="admin-button--ghost" type="button" @click="router.push('/admin/traces')">返回</button>
        <button class="admin-button" type="button" :disabled="loading" @click="loadTraceDetail">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-emerald"><span>S</span></div>
          <div>
            <span class="admin-stat-label">状态</span>
            <span class="admin-stat-value">{{ formatRelativeStatus(detail?.run?.status) }}</span>
          </div>
        </div>
        <p class="admin-stat-note">{{ detail?.run?.errorMessage || "无错误" }}</p>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-indigo"><span>D</span></div>
          <div>
            <span class="admin-stat-label">耗时</span>
            <span class="admin-stat-value">{{ detail?.run?.durationMs ? `${detail.run.durationMs} ms` : "--" }}</span>
          </div>
        </div>
        <p class="admin-stat-note">{{ detail?.run?.entryMethod || "--" }}</p>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-cyan"><span>U</span></div>
          <div>
            <span class="admin-stat-label">用户</span>
            <span class="admin-stat-value">{{ detail?.run?.userName || detail?.run?.username || "--" }}</span>
          </div>
        </div>
        <p class="admin-stat-note">{{ detail?.run?.userId || "--" }}</p>
      </article>
      <article class="admin-stat-card">
        <div class="admin-stat-card-left">
          <div class="admin-stat-icon is-amber"><span>T</span></div>
          <div>
            <span class="admin-stat-label">开始时间</span>
            <span class="admin-stat-value">{{ formatDateTime(detail?.run?.startTime) }}</span>
          </div>
        </div>
        <p class="admin-stat-note">{{ detail?.run?.taskId || "--" }}</p>
      </article>
    </div>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <h3>节点执行明细</h3>
        </div>
        <div class="admin-page-count">{{ nodes.length }} node(s)</div>
      </div>

      <div v-if="loading && nodes.length === 0" class="admin-empty">加载中...</div>
      <div v-else-if="nodes.length === 0" class="admin-empty">暂无节点数据</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>节点</th>
              <th>类型</th>
              <th>状态</th>
              <th>耗时</th>
              <th>开始时间</th>
              <th>错误信息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in nodes" :key="item.nodeId">
              <td>
                <p>{{ item.nodeName || item.nodeId }}</p>
                <small class="admin-list-meta is-code">{{ item.parentNodeId || "--" }}</small>
              </td>
              <td>{{ item.nodeType || item.className || "--" }}</td>
              <td>
                <span :class="['admin-badge', item.status === 'FAILED' ? 'is-danger' : item.status === 'RUNNING' ? 'is-warn' : 'is-success']">
                  {{ formatRelativeStatus(item.status) }}
                </span>
              </td>
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
