<script setup>
import RagMessageItem from "./RagMessageItem.vue";
import RagWelcomeScreen from "./RagWelcomeScreen.vue";

defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  draft: {
    type: String,
    default: ""
  },
  deepThinkingEnabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ""
  },
  userInitial: {
    type: String,
    default: "U"
  },
  inputRef: {
    type: [Object, Function, null],
    default: null
  }
});

const emit = defineEmits([
  "copy",
  "feedback",
  "update:draft",
  "send",
  "toggle-thinking",
  "keydown",
  "suggestion"
]);
</script>

<template>
  <div class="message-list">
    <div v-if="isLoading && messages.length === 0" class="message-list__loading">
      <div class="message-list__dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <RagWelcomeScreen
      v-else-if="messages.length === 0"
      :draft="draft"
      :suggestions="suggestions"
      :deep-thinking-enabled="deepThinkingEnabled"
      :is-streaming="isStreaming"
      :placeholder="placeholder"
      :input-ref="inputRef"
      @update:draft="$emit('update:draft', $event)"
      @toggle-thinking="$emit('toggle-thinking')"
      @send="$emit('send')"
      @keydown="$emit('keydown', $event)"
      @suggestion="$emit('suggestion', $event)"
    />

    <div v-else class="message-list__stack">
      <div
        v-for="(message, index) in messages"
        :key="message.id"
        class="message-list__item"
      >
        <RagMessageItem
          :message="message"
          :is-last="index === messages.length - 1"
          :user-initial="userInitial"
          @copy="$emit('copy', $event)"
          @feedback="(msg, value) => $emit('feedback', msg, value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  min-height: 100%;
}

.message-list__loading {
  display: grid;
  place-items: center;
  min-height: 180px;
}

.message-list__dots {
  display: flex;
  gap: 6px;
}

.message-list__dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  animation: pulse 1.2s ease-in-out infinite;
}

.message-list__dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.message-list__dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.message-list__stack {
  display: grid;
  gap: 18px;
  padding: 8px 4px 0;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.92);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}
</style>
