<script setup>
defineProps({
  tag: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <header class="admin-page-header-card">
    <div class="admin-page-header-copy">
      <p v-if="tag" class="admin-page-header-tag">{{ tag }}</p>
      <h1 class="admin-page-header-title">{{ title }}</h1>
      <p v-if="description" class="admin-page-header-description">{{ description }}</p>
      <div v-if="$slots.meta" class="admin-page-header-meta">
        <slot name="meta" />
      </div>
    </div>

    <div v-if="$slots.actions" class="admin-page-header-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.admin-page-header-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background:
    radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9));
  box-shadow: var(--admin-shadow-lg);
}

.admin-page-header-copy {
  min-width: 0;
}

.admin-page-header-tag {
  margin: 0 0 8px;
  color: var(--admin-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.admin-page-header-title {
  margin: 0;
  color: var(--admin-ink);
  font-size: 30px;
  line-height: 1.25;
  font-weight: 700;
}

.admin-page-header-description {
  max-width: 780px;
  margin: 10px 0 0;
  color: var(--admin-ink-soft);
  font-size: 14px;
  line-height: 1.75;
}

.admin-page-header-meta {
  margin-top: 14px;
}

.admin-page-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .admin-page-header-card {
    flex-direction: column;
  }

  .admin-page-header-actions {
    justify-content: flex-start;
  }
}
</style>
