<script setup>
import { computed, ref } from "vue";

import RagFeedbackButtons from "./RagFeedbackButtons.vue";
import RagMarkdownRenderer from "./RagMarkdownRenderer.vue";
import RagThinkingIndicator from "./RagThinkingIndicator.vue";

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isLast: {
    type: Boolean,
    default: false
  },
  userInitial: {
    type: String,
    default: "U"
  }
});

const emit = defineEmits(["copy", "feedback"]);
const thinkingExpanded = ref(false);

const isUser = computed(() => props.message.role === "user");
const isThinking = computed(() => Boolean(props.message.isThinking));
const hasThinking = computed(() => Boolean(props.message.thinking && props.message.thinking.trim()));
const hasContent = computed(() => Boolean(props.message.content && props.message.content.trim()));
const isWaiting = computed(() => props.message.status === "streaming" && !isThinking.value && !hasContent.value);
const showFeedback = computed(
  () =>
    props.message.role === "assistant" &&
    props.message.status !== "streaming" &&
    Boolean(props.message.id) &&
    !String(props.message.id).startsWith("assistant-")
);

function handleCopy(content) {
  emit("copy", content);
}

function handleFeedback(value) {
  emit("feedback", props.message, value);
}
</script>

<template>
  <article :class="['message-item', { 'is-user': isUser, 'is-last': isLast }]">
    <div v-if="isUser" class="message-item__user">
      <div class="user-message">
        <p>{{ message.content }}</p>
      </div>
    </div>

    <div v-else class="message-item__assistant group">
      <div class="message-item__content">
        <div v-if="isThinking" class="message-item__thinking">
          <RagThinkingIndicator :content="message.thinking" :duration="message.thinkingDuration" />
        </div>

        <div v-else-if="hasThinking" class="message-item__thinking-panel">
          <button
            type="button"
            class="message-item__thinking-trigger"
            @click="thinkingExpanded = !thinkingExpanded"
          >
            <div class="message-item__thinking-head">
              <span class="message-item__thinking-icon">◌</span>
              <span class="message-item__thinking-label">深度思考</span>
              <span v-if="message.thinkingDuration" class="message-item__thinking-badge">
                {{ message.thinkingDuration }}秒
              </span>
            </div>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              :class="['message-item__chevron', { 'is-open': thinkingExpanded }]"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div v-if="thinkingExpanded" class="message-item__thinking-body">
            {{ message.thinking }}
          </div>
        </div>

        <div class="message-item__body">
          <div v-if="isWaiting" class="ai-wait" aria-label="思考中">
            <span class="ai-wait-dots" aria-hidden="true">
              <span class="ai-wait-dot" />
              <span class="ai-wait-dot" />
              <span class="ai-wait-dot" />
            </span>
          </div>

          <RagMarkdownRenderer v-if="hasContent" :content="message.content" />

          <p v-else-if="message.status === 'error'" class="message-item__status is-error">
            生成失败，请稍后重试
          </p>
          <p v-else-if="message.status === 'cancelled'" class="message-item__status">
            已停止生成
          </p>
          <p v-else-if="message.status === 'streaming'" class="message-item__status">
            等待回答...
          </p>

          <div v-if="showFeedback" class="message-item__actions">
            <RagFeedbackButtons
              :feedback="message.feedback || null"
              :content="message.content"
              :always-visible="Boolean(isLast)"
              @copy="handleCopy"
              @feedback="handleFeedback"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.message-item {
  display: flex;
}

.message-item.is-user {
  justify-content: flex-end;
}

.message-item__user,
.message-item__assistant {
  width: 100%;
}

.message-item__assistant {
  display: flex;
}

.message-item__content {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 12px;
}

.message-item__thinking-panel {
  overflow: hidden;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #dbeafe;
}

.message-item__thinking-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.message-item__thinking-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.message-item__thinking-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #bfdbfe;
  color: #2563eb;
  font-size: 18px;
}

.message-item__thinking-label {
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
}

.message-item__thinking-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #bfdbfe;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.message-item__chevron {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.18s ease;
}

.message-item__chevron.is-open {
  transform: rotate(180deg);
}

.message-item__thinking-body {
  border-top: 1px solid #bfdbfe;
  padding: 12px 14px 14px;
  color: #1e40af;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.message-item__body {
  display: grid;
  gap: 8px;
}

.message-item__status {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.message-item__status.is-error {
  color: #b91c1c;
}

.message-item__actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}
</style>
