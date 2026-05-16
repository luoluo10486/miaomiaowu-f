<script setup>
import { computed } from "vue";

const props = defineProps({
  feedback: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: ""
  },
  alwaysVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["copy", "feedback"]);

const copyLabel = computed(() => (props.content ? "复制内容" : "复制"));

function handleCopy() {
  emit("copy", props.content);
}

function handleFeedback(value) {
  emit("feedback", value);
}
</script>

<template>
  <div :class="['feedback-buttons', { 'is-visible': alwaysVisible }]">
    <button type="button" class="feedback-buttons__btn" :aria-label="copyLabel" @click="handleCopy">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 8h10v12H8z" />
        <path d="M6 16H4V4h12v2" />
      </svg>
    </button>
    <button
      type="button"
      class="feedback-buttons__btn"
      :class="{ 'is-active is-like': feedback === 'like' }"
      aria-label="有帮助"
      @click="handleFeedback('like')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10v10H4V10h3Zm0 0 5-7 1.5 1.5L12 9h6a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H7" />
      </svg>
    </button>
    <button
      type="button"
      class="feedback-buttons__btn"
      :class="{ 'is-active is-dislike': feedback === 'dislike' }"
      aria-label="需改进"
      @click="handleFeedback('dislike')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 14V4H4v10h3Zm0 0 5 7 1.5-1.5L12 15h6a2 2 0 0 0 2-2l-1-7a2 2 0 0 0-2-2H7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.feedback-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.feedback-buttons.is-visible,
.group:hover .feedback-buttons {
  opacity: 1;
}

.feedback-buttons__btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #999999;
  cursor: pointer;
  transition: all 0.18s ease;
}

.feedback-buttons__btn:hover {
  background: #f5f5f5;
  color: #666666;
}

.feedback-buttons__btn.is-active {
  background: #f5f5f5;
}

.feedback-buttons__btn.is-like.is-active {
  color: #10b981;
}

.feedback-buttons__btn.is-dislike.is-active {
  color: #ef4444;
}

.feedback-buttons__btn svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
