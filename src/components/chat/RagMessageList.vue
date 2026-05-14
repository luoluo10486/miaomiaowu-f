<script setup>
import { computed } from "vue";
import RagMarkdownRenderer from "./RagMarkdownRenderer.vue";

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  userInitial: {
    type: String,
    default: "U"
  }
});

const emit = defineEmits(["copy", "feedback"]);

function formatTimestamp(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

const visibleMessages = computed(() => props.messages || []);
</script>

<template>
  <div class="message-stream">
    <article
      v-for="message in visibleMessages"
      :key="message.id"
      :class="['message-row', `message-row--${message.role}`]"
    >
      <div
        class="message-avatar"
        :aria-label="message.role === 'user' ? '用户' : '助手'"
      >
        {{ message.role === "user" ? userInitial : "R" }}
      </div>

      <div :class="['message-bubble', `message-bubble--${message.role}`]">
        <header v-if="message.createdAt || message.role === 'assistant'" class="message-bubble__meta">
          <span>{{ message.role === "user" ? "你" : "助手" }}</span>
          <time v-if="formatTimestamp(message.createdAt)">{{ formatTimestamp(message.createdAt) }}</time>
        </header>

        <details v-if="message.role === 'assistant' && message.thinking" class="thinking-panel">
          <summary>
            <span class="thinking-panel__label">
              <span class="thinking-dot"></span>
              深度思考
            </span>
            <strong v-if="message.thinkingDuration">{{ message.thinkingDuration }}s</strong>
          </summary>
          <pre>{{ message.thinking }}</pre>
        </details>

        <div
          v-if="message.role === 'assistant' && message.status === 'streaming' && !message.content && !message.thinking"
          class="message-loading"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <RagMarkdownRenderer
          v-if="message.content"
          :content="message.content"
        />
        <p v-else-if="message.status === 'streaming' && message.isThinking" class="message-bubble__content">
          正在深度思考中...
        </p>
        <p v-else class="message-bubble__content">
          {{ message.role === "assistant" ? "等待回答..." : message.content }}
        </p>

        <p v-if="message.status === 'cancelled'" class="message-bubble__status">
          已停止生成
        </p>
        <p v-else-if="message.status === 'error'" class="message-bubble__status message-bubble__status--error">
          生成失败，请重试
        </p>

        <div
          v-if="
            message.role === 'assistant' &&
            message.status !== 'streaming' &&
            message.content &&
            !String(message.id).startsWith('assistant-')
          "
          class="message-actions"
        >
          <button type="button" title="复制" @click="emit('copy', message.content)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 8h10v12H8z" />
              <path d="M6 16H4V4h12v2" />
            </svg>
          </button>
          <button
            type="button"
            title="有帮助"
            :class="{ 'is-active': message.feedback === 'like' }"
            @click="emit('feedback', message, 'like')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10v10H4V10h3Zm0 0 5-7 1.5 1.5L12 9h6a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H7" />
            </svg>
          </button>
          <button
            type="button"
            title="需改进"
            :class="{ 'is-active': message.feedback === 'dislike' }"
            @click="emit('feedback', message, 'dislike')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 14V4H4v10h3Zm0 0 5 7 1.5-1.5L12 15h6a2 2 0 0 0 2-2l-1-7a2 2 0 0 0-2-2H7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.message-stream {
  display: grid;
  gap: 18px;
  padding: 8px 4px 0;
}

.message-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  animation: messageIn 0.3s ease both;
}

.message-row--user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(107, 127, 90, 0.1);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.message-row--assistant .message-avatar {
  background: linear-gradient(135deg, #6b7f5a, #8b9f72);
  color: #fff;
}

.message-bubble {
  max-width: min(760px, 82%);
  padding: 14px 16px 15px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: rgba(255, 252, 246, 0.36);
}

.message-bubble--user {
  border-color: rgba(107, 127, 90, 0.2);
  background: rgba(107, 127, 90, 0.08);
}

.message-bubble__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  color: var(--text-muted);
  font-size: 12px;
}

.message-bubble__meta span {
  color: var(--text-secondary);
  font-weight: 600;
}

.message-bubble__meta time {
  font-variant-numeric: tabular-nums;
}

.message-bubble__content {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.thinking-panel {
  margin: 0 0 12px;
  border: 1px solid rgba(107, 127, 90, 0.15);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: rgba(107, 127, 90, 0.04);
}

.thinking-panel summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 12px;
  list-style: none;
}

.thinking-panel summary::-webkit-details-marker {
  display: none;
}

.thinking-panel__label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-weight: 600;
}

.thinking-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.thinking-panel strong {
  color: var(--text-muted);
  font-weight: 500;
}

.thinking-panel pre {
  margin: 0;
  padding: 0 14px 14px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-secondary);
  font-family: var(--sans);
  font-size: 12px;
  line-height: 1.65;
}

.message-loading {
  display: flex;
  gap: 5px;
  padding: 4px 0 8px;
}

.message-loading span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: dotPulse 1s ease-in-out infinite;
}

.message-loading span:nth-child(2) {
  animation-delay: 0.12s;
}

.message-loading span:nth-child(3) {
  animation-delay: 0.24s;
}

.message-bubble__status {
  margin: 10px 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.message-bubble__status--error {
  color: #a04030;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  justify-content: flex-end;
}

.message-actions button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.message-actions button svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.message-actions button:hover {
  border-color: rgba(107, 127, 90, 0.15);
  background: rgba(107, 127, 90, 0.06);
  color: var(--accent);
}

.message-actions button.is-active {
  border-color: rgba(107, 127, 90, 0.25);
  background: rgba(107, 127, 90, 0.12);
  color: var(--accent);
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
