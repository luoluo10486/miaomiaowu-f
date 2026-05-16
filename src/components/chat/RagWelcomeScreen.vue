<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

const props = defineProps({
  draft: {
    type: String,
    default: ""
  },
  suggestions: {
    type: Array,
    default: () => []
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

const emit = defineEmits([
  "update:draft",
  "toggle-thinking",
  "send",
  "keydown",
  "suggestion"
]);

const localTextareaRef = ref(null);
const isFocused = ref(false);
const isComposingRef = ref(false);
const iconKinds = ["book", "check", "lightbulb"];

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
  if (event.key === "Enter" && !event.shiftKey) {
    const nativeEvent = event.nativeEvent || event;
    if (nativeEvent.isComposing || isComposingRef.value || nativeEvent.keyCode === 229) {
      return;
    }
    event.preventDefault();
  }
}

function submitQuestion() {
  emit("send");
}

function applySuggestion(question) {
  emit("suggestion", question);
}

function resolveIconKind(index) {
  return iconKinds[index % iconKinds.length];
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
  <section class="welcome-screen">
    <div class="welcome-screen__hero">
      <span class="welcome-screen__badge">RAG 智能问答</span>
      <h1>把问题变成清晰答案</h1>
      <p>结构化提问、知识检索和深度思考放在同一个入口，尽量让每次对话都像一条清晰的工作流。</p>
    </div>

    <div class="welcome-screen__composer" :class="{ 'is-focused': isFocused }">
      <div class="welcome-screen__input-wrap">
        <textarea
          :ref="bindTextareaRef"
          :value="draft"
          :placeholder="placeholder"
          class="welcome-screen__input"
          rows="1"
          aria-label="聊天输入框"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @input="updateDraft"
          @keydown="handleKeydown"
        />
        <div class="welcome-screen__fade" aria-hidden="true" />
      </div>

      <div class="welcome-screen__actions">
        <button
          type="button"
          class="welcome-screen__thinking"
          :class="{ 'is-active': deepThinkingEnabled }"
          :disabled="isStreaming"
          @click="$emit('toggle-thinking')"
        >
          <span class="welcome-screen__thinking-dot" />
          深度思考
        </button>
        <button
          type="button"
          class="welcome-screen__send"
          :disabled="!draft.trim() && !isStreaming"
          :aria-label="isStreaming ? '停止生成' : '发送消息'"
          @click="submitQuestion"
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

      <p v-if="deepThinkingEnabled" class="welcome-screen__tip is-active">
        深度思考模式已开启，AI 会先进行更深入的分析再给出回答。
      </p>
      <p class="welcome-screen__hint">
        <kbd>Enter</kbd> 发送
        <span>·</span>
        <kbd>Shift + Enter</kbd> 换行
        <span v-if="isStreaming" class="welcome-screen__hint-stream">生成中...</span>
      </p>
    </div>

    <div class="welcome-screen__prompts">
      <div class="welcome-screen__prompts-head">
        <span class="welcome-screen__line" />
        <span>试试这些开场</span>
        <span class="welcome-screen__line" />
      </div>

      <div class="welcome-screen__grid">
        <button
          v-for="(item, index) in suggestions"
          :key="item.id || item.question || index"
          type="button"
          class="welcome-screen__card"
          :disabled="isStreaming"
          @click="applySuggestion(item.question)"
        >
          <div class="welcome-screen__card-head">
            <span class="welcome-screen__icon" :class="`is-${resolveIconKind(index)}`" aria-hidden="true">
              <svg v-if="resolveIconKind(index) === 'book'" viewBox="0 0 24 24">
                <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5V6.5Z" />
                <path d="M4 6.5V20.5" />
              </svg>
              <svg v-else-if="resolveIconKind(index) === 'check'" viewBox="0 0 24 24">
                <path d="m20 6-11 11-5-5" />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12v2h8v-2a7 7 0 0 0-4-12Z" />
              </svg>
            </span>
            <div>
              <strong>{{ item.title }}</strong>
              <small>{{ item.description }}</small>
            </div>
          </div>
          <div class="welcome-screen__prompt">
            <span>推荐问法：{{ item.question }}</span>
            <svg class="welcome-screen__arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M9 7h8v8" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome-screen {
  display: grid;
  gap: 28px;
  padding: 42px 0 28px;
  align-content: start;
}

.welcome-screen__hero {
  display: grid;
  gap: 12px;
  text-align: center;
}

.welcome-screen__badge {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border: 1px solid rgba(191, 219, 254, 0.8);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
}

.welcome-screen__hero h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.18;
  font-weight: 700;
}

.welcome-screen__hero p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.8;
}

.welcome-screen__composer {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}

.welcome-screen__composer.is-focused {
  border-color: rgba(191, 219, 254, 0.9);
  box-shadow: 0 20px 48px rgba(37, 99, 235, 0.12);
}

.welcome-screen__input-wrap {
  position: relative;
}

.welcome-screen__input {
  display: block;
  width: 100%;
  min-height: 56px;
  max-height: 160px;
  resize: none;
  border: 0;
  padding: 8px 6px 10px;
  background: transparent;
  color: #1f2937;
  font-size: 15px;
  line-height: 1.75;
  outline: none;
}

.welcome-screen__input::placeholder {
  color: #9ca3af;
}

.welcome-screen__fade {
  pointer-events: none;
  position: absolute;
  inset: auto 0 0;
  height: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
}

.welcome-screen__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-screen__thinking {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: rgba(245, 245, 245, 0.96);
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.welcome-screen__thinking:hover:not(:disabled) {
  background: rgba(238, 242, 255, 0.9);
  color: #334155;
}

.welcome-screen__thinking.is-active {
  border-color: rgba(191, 219, 254, 0.8);
  background: rgba(219, 234, 254, 0.92);
  color: #2563eb;
}

.welcome-screen__thinking:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.welcome-screen__thinking-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}

.welcome-screen__thinking.is-active .welcome-screen__thinking-dot {
  background: #2563eb;
}

.welcome-screen__send {
  margin-left: auto;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  transition: all 0.22s ease;
}

.welcome-screen__send:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.18);
}

.welcome-screen__send:disabled {
  cursor: not-allowed;
  background: #f5f5f5;
  color: #cccccc;
}

.welcome-screen__send svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.welcome-screen__tip {
  margin: 0;
  color: #2563eb;
  font-size: 12px;
  line-height: 1.6;
}

.welcome-screen__hint {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}

.welcome-screen__hint kbd {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.82);
  color: #64748b;
  font-size: 11px;
}

.welcome-screen__hint span {
  padding: 0 8px;
}

.welcome-screen__hint-stream {
  margin-left: 6px;
  color: #2563eb;
}

.welcome-screen__prompts {
  display: grid;
  gap: 16px;
}

.welcome-screen__prompts-head {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  color: #94a3b8;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.welcome-screen__line {
  width: 34px;
  height: 1px;
  background: #e2e8f0;
}

.welcome-screen__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.welcome-screen__card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 18px 16px 22px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  text-align: left;
  cursor: pointer;
  transition: all 0.22s ease;
  overflow: hidden;
}

.welcome-screen__card:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(191, 219, 254, 0.9);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.welcome-screen__card:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.welcome-screen__card-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.welcome-screen__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  flex-shrink: 0;
}

.welcome-screen__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.welcome-screen__card strong {
  display: block;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}

.welcome-screen__card small {
  display: block;
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.6;
}

.welcome-screen__prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: #94a3b8;
  font-size: 12px;
}

.welcome-screen__prompt span {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.welcome-screen__arrow-icon {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #cbd5e1;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
  transition: stroke 0.2s ease, transform 0.2s ease;
}

.welcome-screen__card:hover .welcome-screen__arrow-icon {
  stroke: #3b82f6;
  transform: translate(2px, -2px);
}

@media (max-width: 960px) {
  .welcome-screen__grid {
    grid-template-columns: 1fr;
  }
}
</style>
