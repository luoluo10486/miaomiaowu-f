<script setup>
import { computed } from "vue";

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  statusOptions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:filters", "search", "refresh", "reset"]);

const traceId = computed({
  get: () => props.filters.traceId,
  set: (value) => emit("update:filters", { ...props.filters, traceId: value })
});

const conversationId = computed({
  get: () => props.filters.conversationId,
  set: (value) => emit("update:filters", { ...props.filters, conversationId: value })
});

const taskId = computed({
  get: () => props.filters.taskId,
  set: (value) => emit("update:filters", { ...props.filters, taskId: value })
});

const status = computed({
  get: () => props.filters.status,
  set: (value) => emit("update:filters", { ...props.filters, status: value })
});
</script>

<template>
  <section class="admin-filter-card">
    <div class="admin-filter-grid">
      <input v-model="traceId" class="admin-input" type="search" placeholder="筛选 Trace ID" />
      <input v-model="conversationId" class="admin-input" type="search" placeholder="筛选 Conversation ID" />
      <input v-model="taskId" class="admin-input" type="search" placeholder="筛选 Task ID" />

      <select v-model="status" class="admin-select">
        <option v-for="option in statusOptions" :key="option.value || '__all__'" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div class="admin-filter-actions">
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="$emit('reset')">
          重置
        </button>
        <button class="admin-button--ghost" type="button" :disabled="loading" @click="$emit('refresh')">
          刷新
        </button>
        <button class="admin-button" type="button" :disabled="loading" @click="$emit('search')">
          搜索
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-filter-card {
  padding: 18px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--admin-shadow);
}

.admin-filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: center;
}

.admin-select {
  width: 100%;
}

.admin-filter-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 1100px) {
  .admin-filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-filter-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .admin-filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
