<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

const props = defineProps({
  draft: {
    type: String,
    default: ""
  },
  deepThinkingEnabled: {
    type: Boolean,
    default: false
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  thinkingMessage: {
    type: Object,
    default: null
  },
  placeholder: {
    type: String,
    default: "输入你的问题，Enter 发送，Shift+Enter 换行"
  },
  inputRef: {
    type: [Object, Function, null],
    default: null
  }
});

const emit = defineEmits(["update:draft", "toggle-thinking", "send", "keydown", "input"]);

const localTextareaRef = ref(null);

function bindTextareaRef(el) {
  localTextareaRef.value = el;

  if (typeof props.inputRef === "function") {
    props.inputRef(el);
  } else if (props.inputRef && typeof props.inputRef === "object") {
    props.inputRef.value = el;
  }
}

function resizeTextarea() {
  nextTick(() => {
    const textarea = localTextareaRef.value;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  });
}

function updateDraft(event) {
  emit("update:draft", event.target.value);
  emit("input", event);
  resizeTextarea();
}

function handleKeydown(event) {
  emit("keydown", event);
}

watch(
  () => props.draft,
  () => resizeTextarea()
);

onMounted(() => {
  resizeTextarea();
});
</script>

<template>
  <footer class="composer">
    <div v-if="thinkingMessage" class="thinking-tip">
      <span class="thinking-dot thinking-dot--pulse"></span>
      深度思考中
    </div>

    <div class="composer-box">
      <textarea
        :ref="bindTextareaRef"
        :value="draft"
        class="composer__input"
        rows="2"
        :placeholder="placeholder"
        @input="updateDraft"
        @keydown="handleKeydown"
      />

      <div class="composer__footer">
        <button
          type="button"
          :class="['thinking-toggle', { 'is-active': deepThinkingEnabled }]"
          :disabled="isStreaming"
          @click="$emit('toggle-thinking')"
        >
          <span class="thinking-toggle__dot"></span>
          <span>深度思考</span>
        </button>

        <button
          class="send-button"
          :class="{ 'is-stop': isStreaming }"
          type="button"
          @click="$emit('send')"
          :title="isStreaming ? '停止生成' : '发送'"
        >
          <svg v-if="!isStreaming" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
            <path d="M22 2 11 13" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.composer {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border-light);
}

.thinking-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 500;
}

.thinking-dot--pulse {
  animation: pulseDot 1.5s ease-in-out infinite;
}

.composer-box {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: rgba(255, 252, 246, 0.45);
  transition: border-color 0.2s ease;
}

.composer-box:focus-within {
  border-color: rgba(107, 127, 90, 0.35);
}

.composer__input {
  display: block;
  width: 100%;
  min-height: 52px;
  max-height: 160px;
  resize: none;
  border: 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: 14px 16px 8px;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  line-height: 1.65;
  outline: none;
}

.composer__input::placeholder {
  color: var(--text-muted);
}

.composer__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px 10px;
}

.thinking-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thinking-toggle:hover:not(:disabled) {
  border-color: rgba(107, 127, 90, 0.3);
  color: var(--text-secondary);
}

.thinking-toggle.is-active {
  border-color: rgba(107, 127, 90, 0.4);
  background: rgba(107, 127, 90, 0.08);
  color: var(--accent);
}

.thinking-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.thinking-toggle__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}

.thinking-toggle.is-active .thinking-toggle__dot {
  background: var(--accent);
  box-shadow: 0 0 6px rgba(107, 127, 90, 0.4);
}

.send-button {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--text);
  color: var(--bg);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.send-button:hover {
  transform: scale(1.06);
  box-shadow: 0 4px 16px rgba(44, 36, 24, 0.2);
}

.send-button:active {
  transform: scale(0.96);
}

.send-button.is-stop {
  background: #a04030;
  border-color: #a04030;
}

.send-button.is-stop:hover {
  background: #8b3528;
  box-shadow: 0 4px 16px rgba(160, 64, 48, 0.25);
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
