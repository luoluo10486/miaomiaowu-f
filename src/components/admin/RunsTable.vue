<script setup>
import { computed } from "vue";
import { formatDateTime, formatDuration, statusBadgeClass, statusLabel } from "../../views/admin/traceUtils";

const props = defineProps({
  runs: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  current: {
    type: Number,
    default: 1
  },
  pages: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["open", "prev", "next"]);

const hasRows = computed(() => Array.isArray(props.runs) && props.runs.length > 0);
</script>

<template>
  <section class="admin-table-card">
    <div class="admin-table-card__header">
      <div>
        <h2>运行列表</h2>
        <p>按时间倒序查看运行记录，点击任一条目进入详情页分析节点执行细节。</p>
      </div>
      <span class="admin-page-count">共 {{ total.toLocaleString("zh-CN") }} 条</span>
    </div>

    <div v-if="loading && !hasRows" class="admin-empty">加载中...</div>
    <div v-else-if="!hasRows" class="admin-empty">暂无链路数据</div>
    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Trace Name</th>
            <th>Trace ID</th>
            <th>会话 / 任务</th>
            <th>用户</th>
            <th>耗时</th>
            <th>状态</th>
            <th>开始时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="run in runs" :key="run.traceId">
            <td>
              <p class="admin-cell-title">{{ run.traceName || "-" }}</p>
            </td>
            <td>
              <span class="admin-code">{{ run.traceId }}</span>
            </td>
            <td>
              <p class="admin-cell-subtitle">{{ run.conversationId || "-" }}</p>
              <p class="admin-cell-subtitle is-secondary">{{ run.taskId || "-" }}</p>
            </td>
            <td>{{ run.userName || run.username || run.userId || "-" }}</td>
            <td>{{ formatDuration(run.durationMs ?? undefined) }}</td>
            <td>
              <span :class="['admin-badge', statusBadgeClass(run.status)]">
                {{ statusLabel(run.status) }}
              </span>
            </td>
            <td>{{ formatDateTime(run.startTime ?? undefined) }}</td>
            <td>
              <button class="admin-button--ghost" type="button" @click="$emit('open', run.traceId)">
                查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="admin-table-card__footer">
      <span class="admin-page-count">第 {{ current }} / {{ pages }} 页</span>
      <div class="admin-pagination">
        <button class="admin-button--ghost" type="button" :disabled="loading || current <= 1" @click="$emit('prev')">
          上一页
        </button>
        <button class="admin-button--ghost" type="button" :disabled="loading || current >= pages" @click="$emit('next')">
          下一页
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-table-card {
  padding: 18px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--admin-shadow);
}

.admin-table-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.admin-table-card__header h2 {
  margin: 0;
  color: var(--admin-ink);
  font-size: 18px;
  font-weight: 700;
}

.admin-table-card__header p {
  margin: 6px 0 0;
  color: var(--admin-muted);
  font-size: 13px;
  line-height: 1.65;
}

.admin-table-wrap {
  overflow: auto;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-md);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.admin-table th,
.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--admin-line);
  text-align: left;
  vertical-align: top;
}

.admin-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8fafc;
  color: var(--admin-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.admin-table tbody tr:hover {
  background: #f8fafc;
}

.admin-cell-title {
  margin: 0;
  color: var(--admin-ink);
  font-weight: 700;
}

.admin-cell-subtitle {
  margin: 2px 0 0;
  color: var(--admin-ink-soft);
  font-size: 12px;
}

.admin-cell-subtitle.is-secondary {
  color: var(--admin-muted);
}

.admin-code {
  font-family: var(--admin-mono);
  color: var(--admin-ink-soft);
  word-break: break-all;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
}

.admin-badge.is-success {
  background: var(--admin-success-light);
  color: #047857;
}

.admin-badge.is-warn {
  background: var(--admin-warning-light);
  color: #b45309;
}

.admin-badge.is-danger {
  background: var(--admin-danger-light);
  color: #b91c1c;
}

.admin-badge.is-outline {
  background: #fff;
  border-color: var(--admin-line-strong);
  color: var(--admin-ink-soft);
}

.admin-table-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.admin-pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 960px) {
  .admin-table-card__header,
  .admin-table-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

