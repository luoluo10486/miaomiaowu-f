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
  placeholder: {
    type: String,
    default: "输入你的问题，Enter 发送，Shift+Enter 换行"
  },
  inputRef: {
    type: [Object, Function, null],
    default: null
  }
});

const emit = defineEmits(["update:draft", "toggle-thinking", "send", "keydown"]);
const localTextareaRef = ref(null);
const isFocused = ref(false);
const isComposingRef = ref(false);

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
  resizeTextarea();
}

function handleCompositionStart() {
  isComposingRef.value = true;
}

function handleCompositionEnd() {
  isComposingRef.value = false;
}

function handleKeydown(event) {
  emit("keydown", event);
}

function submit() {
  emit("send");
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
    <div class="composer__card" :class="{ 'is-focused': isFocused }">
      <div class="composer__input-wrap">
        <textarea
          :ref="bindTextareaRef"
          :value="draft"
          :placeholder="placeholder"
          class="composer__input"
          rows="1"
          aria-label="聊天输入框"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @input="updateDraft"
          @keydown="
            (event) => {
              handleKeydown(event);
              if (event.key === 'Enter' && !event.shiftKey) {
                const nativeEvent = event.nativeEvent || event;
                if (nativeEvent.isComposing || isComposingRef.value || nativeEvent.keyCode === 229) {
                  return;
                }
                event.preventDefault();
                submit();
              }
            }
          "
        />
        <div class="composer__fade" aria-hidden="true" />
      </div>

      <div class="composer__actions">
        <button
          type="button"
          class="composer__thinking"
          :class="{ 'is-active': deepThinkingEnabled }"
          :disabled="isStreaming"
          @click="$emit('toggle-thinking')"
        >
          <span class="composer__thinking-dot" />
          深度思考
        </button>

        <button
          type="button"
          class="composer__send"
          :class="{ 'is-stop': isStreaming }"
          :disabled="!draft.trim() && !isStreaming"
          :aria-label="isStreaming ? '停止生成' : '发送消息'"
          @click="submit"
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

    <p class="composer__hint">
      <kbd>Enter</kbd> 发送
      <span>·</span>
      <kbd>Shift + Enter</kbd> 换行
      <span v-if="isStreaming" class="composer__streaming">生成中...</span>
    </p>
  </footer>
</template>

<style scoped>
.composer {
  padding: 12px 16px 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}

.composer__card {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.composer__card.is-focused {
  border-color: #d4d4d4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.composer__input-wrap {
  position: relative;
}

.composer__input {
  display: block;
  width: 100%;
  min-height: 44px;
  max-height: 160px;
  resize: none;
  border: 0;
  padding: 12px 16px 8px;
  background: transparent;
  color: #333333;
  font-size: 15px;
  line-height: 1.7;
  outline: none;
}

.composer__input::placeholder {
  color: #999999;
}

.composer__fade {
  pointer-events: none;
  position: absolute;
  inset: auto 0 0;
  height: 12px;
  border-radius: 0 0 18px 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
}

.composer__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0 0;
  min-height: 42px;
}

.composer__thinking {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #f5f5f5;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.composer__thinking:hover:not(:disabled) {
  background: #eeeeee;
  color: #334155;
}

.composer__thinking.is-active {
  border-color: #bfdbfe;
  background: #dbeafe;
  color: #2563eb;
}

.composer__thinking:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.composer__thinking-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}

.composer__thinking.is-active .composer__thinking-dot {
  background: #2563eb;
}

.composer__send {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-left: auto;
  border: 1px solid transparent;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.composer__send:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.18);
}

.composer__send:disabled {
  cursor: not-allowed;
  background: #f5f5f5;
  color: #cccccc;
}

.composer__send.is-stop {
  background: #ef4444;
  color: #fff;
}

.composer__send.is-stop:hover:not(:disabled) {
  background: #dc2626;
  box-shadow: 0 12px 28px rgba(239, 68, 68, 0.18);
}

.composer__send svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.composer__hint {
  margin: 10px 0 0;
  color: #999999;
  font-size: 12px;
  text-align: center;
}

.composer__hint kbd {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f5f5f5;
  color: #666666;
  font-size: 11px;
}

.composer__hint span {
  padding: 0 8px;
}

.composer__streaming {
  margin-left: 6px;
  color: #2563eb;
}
</style>
