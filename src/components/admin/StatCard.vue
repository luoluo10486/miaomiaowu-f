<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  hint: {
    type: String,
    default: ""
  },
  tone: {
    type: String,
    default: "indigo"
  }
});
</script>

<template>
  <article class="admin-stat-card">
    <div class="admin-stat-card-left">
      <div :class="['admin-stat-icon', `is-${tone}`]">
        <slot name="icon">{{ title.charAt(0) }}</slot>
      </div>
      <div>
        <span class="admin-stat-label">{{ title }}</span>
        <span class="admin-stat-value">{{ value }}</span>
      </div>
    </div>
    <p v-if="hint" class="admin-stat-note">{{ hint }}</p>
  </article>
</template>

<style scoped>
.admin-stat-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--admin-shadow);
}

.admin-stat-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-stat-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
}

.admin-stat-icon.is-indigo {
  background: #e0e7ff;
  color: #4338ca;
}

.admin-stat-icon.is-blue {
  background: #dbeafe;
  color: #2563eb;
}

.admin-stat-icon.is-emerald {
  background: #d1fae5;
  color: #059669;
}

.admin-stat-icon.is-amber {
  background: #fef3c7;
  color: #d97706;
}

.admin-stat-icon.is-cyan {
  background: #cffafe;
  color: #0891b2;
}

.admin-stat-label {
  display: block;
  color: var(--admin-muted);
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.admin-stat-value {
  display: block;
  margin-top: 4px;
  color: var(--admin-ink);
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
}

.admin-stat-note {
  margin: 0;
  color: var(--admin-muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>

