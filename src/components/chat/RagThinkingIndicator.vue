<script setup>
defineProps({
  content: {
    type: String,
    default: ""
  },
  duration: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div class="thinking-indicator">
    <div class="thinking-indicator__header">
      <svg class="thinking-indicator__spinner" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
      </svg>
      <span>正在深度思考...</span>
      <span v-if="duration" class="thinking-indicator__badge">{{ duration }}秒</span>
    </div>
    <div class="thinking-indicator__body">
      <span class="thinking-indicator__brain" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M9 7a3 3 0 0 1 6 0v10a3 3 0 0 1-6 0V7Z" />
          <path d="M9 11H7a2 2 0 0 0 0 4h2" />
          <path d="M15 11h2a2 2 0 0 1 0 4h-2" />
        </svg>
      </span>
      <p>
        {{ content || "" }}
        <span class="thinking-indicator__pulse" aria-hidden="true" />
      </p>
    </div>
  </div>
</template>

<style scoped>
.thinking-indicator {
  padding: 13px 15px 14px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #dbeafe;
}

.thinking-indicator__header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 500;
}

.thinking-indicator__spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.9s linear infinite;
}

.thinking-indicator__spinner circle {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 32;
  stroke-dashoffset: 20;
}

.thinking-indicator__badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #bfdbfe;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
}

.thinking-indicator__body {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 9px;
  color: #1e40af;
}

.thinking-indicator__brain {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: #2563eb;
  flex-shrink: 0;
}

.thinking-indicator__brain svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.thinking-indicator__body p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.65;
  font-size: 13px;
}

.thinking-indicator__pulse {
  display: inline-block;
  width: 6px;
  height: 14px;
  margin-left: 4px;
  border-radius: 999px;
  background: #3b82f6;
  vertical-align: middle;
  animation: pulse 1.1s ease-in-out infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scaleY(0.85);
  }

  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
