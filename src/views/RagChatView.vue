<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import RagComposer from "../components/chat/RagComposer.vue";
import RagMessageList from "../components/chat/RagMessageList.vue";
import RagSessionSidebar from "../components/chat/RagSessionSidebar.vue";
import { useRagChat } from "../composables/useRagChat";

const router = useRouter();
const sidebarOpen = ref(false);
const starCount = ref(null);

const {
  messages,
  suggestions,
  currentSessionId,
  draft,
  loadingSessions,
  loadingMessages,
  isStreaming,
  deepThinkingEnabled,
  noticeText,
  noticeType,
  messageScrollerRef,
  textareaRef,
  hasMessages,
  currentSessionTitle,
  currentUserName,
  userInitial,
  currentUser,
  sessionSearch,
  groupedSessions,
  formatSessionTime,
  createConversation,
  removeSession,
  handleSessionRename,
  handleSuggestionClick,
  handleComposerKeydown,
  copyMessageContent,
  submitFeedback,
  sendMessage,
  openSession,
  handleLogout
} = useRagChat();

const isAdminUser = computed(() => currentUser.value?.role === "admin");

const starLabel = computed(() => {
  if (starCount.value === null) {
    return "--";
  }

  if (starCount.value < 1000) {
    return String(starCount.value);
  }

  const rounded = Math.round((starCount.value / 1000) * 10) / 10;
  return `${String(rounded).replace(/\.0$/, "")}k`;
});

function handleCreateConversation() {
  createConversation();
  sidebarOpen.value = false;
}

function handleSidebarSelect(session) {
  openSession(session);
  sidebarOpen.value = false;
}

function openAdminPanel() {
  router.push("/admin");
  sidebarOpen.value = false;
}

onMounted(() => {
  fetch("https://api.github.com/repos/nageoffer/ragent")
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      starCount.value = typeof data?.stargazers_count === "number" ? data.stargazers_count : null;
    })
    .catch(() => {
      starCount.value = null;
    });
});
</script>

<template>
  <section class="chat-page">
    <header class="chat-topbar">
      <button
        class="chat-topbar__menu"
        type="button"
        aria-label="切换侧边栏"
        @click="sidebarOpen = !sidebarOpen"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div class="chat-topbar__title">
        <span class="chat-topbar__eyebrow">RAG Chat</span>
        <strong>{{ currentSessionTitle }}</strong>
      </div>

      <a
        class="chat-topbar__github"
        href="https://github.com/nageoffer/ragent"
        target="_blank"
        rel="noreferrer"
        aria-label="打开 GitHub 仓库"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a10 10 0 0 0-3.16 19.48c.5.1.68-.22.68-.48v-1.66c-2.78.6-3.37-1.2-3.37-1.2-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.61.07-.61 1 .07 1.53 1.04 1.53 1.04.88 1.52 2.3 1.08 2.86.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.69.93.69 1.87v2.77c0 .26.18.59.69.49A10 10 0 0 0 12 2Z"
          />
        </svg>
        <span class="chat-topbar__github-label">Star</span>
        <span class="chat-topbar__github-count">{{ starLabel }}</span>
      </a>
    </header>

    <div v-if="noticeText" :class="['chat-notice', `is-${noticeType}`]">
      {{ noticeText }}
    </div>

    <div class="chat-layout">
      <RagSessionSidebar
        :groups="groupedSessions"
        :loading="loadingSessions"
        :search="sessionSearch"
        :current-session-id="currentSessionId"
        :current-user-name="currentUserName"
        :user-initial="userInitial"
        :is-admin="isAdminUser"
        :is-open="sidebarOpen"
        :format-time="formatSessionTime"
        @close="sidebarOpen = false"
        @update:search="sessionSearch = $event"
        @create="handleCreateConversation"
        @select="handleSidebarSelect"
        @delete="removeSession"
        @rename="handleSessionRename"
        @logout="handleLogout"
        @open-admin="openAdminPanel"
      />

      <main class="chat-main">
        <header class="chat-main__header">
          <div>
            <p class="chat-main__eyebrow">当前会话</p>
            <h1>{{ currentSessionTitle }}</h1>
          </div>
          <div class="chat-main__actions">
            <button class="chat-main__action" type="button" @click="handleCreateConversation">
              新会话
            </button>
            <span v-if="isStreaming" class="chat-main__badge">生成中</span>
          </div>
        </header>

        <section class="chat-main__body">
          <div ref="messageScrollerRef" class="chat-scroll-shell">
            <div v-if="loadingMessages && messages.length === 0" class="chat-loading">
              <div class="chat-loading__dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <RagMessageList
              v-else
              :messages="messages"
              :is-loading="loadingMessages"
              :is-streaming="isStreaming"
              :suggestions="suggestions"
              :draft="draft"
              :deep-thinking-enabled="deepThinkingEnabled"
              :placeholder="
                deepThinkingEnabled
                  ? '输入需要深度分析的问题...'
                  : '输入你的问题，Enter 发送，Shift+Enter 换行'
              "
              :user-initial="userInitial"
              :input-ref="textareaRef"
              @copy="copyMessageContent"
              @feedback="submitFeedback"
              @update:draft="draft = $event"
              @send="sendMessage"
              @toggle-thinking="deepThinkingEnabled = !deepThinkingEnabled"
              @keydown="handleComposerKeydown"
              @suggestion="handleSuggestionClick"
            />
          </div>
        </section>

        <RagComposer
          v-if="hasMessages"
          :draft="draft"
          :deep-thinking-enabled="deepThinkingEnabled"
          :is-streaming="isStreaming"
          :placeholder="
            deepThinkingEnabled
              ? '输入需要深度分析的问题...'
              : '输入你的问题，Enter 发送，Shift+Enter 换行'
          "
          :input-ref="textareaRef"
          @update:draft="draft = $event"
          @toggle-thinking="deepThinkingEnabled = !deepThinkingEnabled"
          @send="sendMessage"
          @keydown="handleComposerKeydown"
        />
      </main>
    </div>
  </section>
</template>

<style scoped>
.chat-page {
  --chat-text: #0f172a;
  --chat-text-soft: #334155;
  --chat-text-muted: #64748b;
  --chat-bg: #fafafa;
  --chat-card: #ffffff;
  --chat-accent: #2563eb;
  --chat-border: rgba(148, 163, 184, 0.22);
  --chat-border-soft: rgba(148, 163, 184, 0.14);
  --chat-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
  --chat-radius-lg: 24px;
  --chat-radius-md: 18px;
  --chat-radius-full: 999px;
  --chat-sans:
    "PingFang SC",
    "Microsoft YaHei",
    "Helvetica Neue",
    Arial,
    sans-serif;

  position: relative;
  min-height: 100vh;
  padding: 18px;
  overflow: hidden;
  color: var(--chat-text);
  background: var(--chat-bg);
  font-family: var(--chat-sans);
}

.chat-page::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.chat-topbar,
.chat-layout,
.chat-notice {
  position: relative;
  z-index: 1;
}

.chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.chat-topbar__menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--chat-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--chat-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-topbar__menu:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.2);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.chat-topbar__menu svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chat-topbar__title {
  flex: 1;
  display: grid;
  justify-items: center;
  gap: 2px;
  text-align: center;
}

.chat-topbar__eyebrow {
  color: var(--chat-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chat-topbar__title strong {
  color: var(--chat-text);
  font-size: 15px;
  font-weight: 600;
}

.chat-topbar__github {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--chat-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--chat-text-soft);
  text-decoration: none;
  transition: all 0.2s ease;
}

.chat-topbar__github:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.2);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.chat-topbar__github svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.chat-topbar__github-label {
  font-size: 13px;
  font-weight: 600;
}

.chat-topbar__github-count {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--chat-radius-full);
  background: rgba(37, 99, 235, 0.1);
  color: var(--chat-accent);
  font-size: 12px;
  font-weight: 700;
}

.chat-notice {
  margin-bottom: 16px;
  padding: 12px 14px;
  border: 1px solid var(--chat-border);
  border-radius: var(--chat-radius-md);
  background: rgba(255, 255, 255, 0.84);
  font-size: 14px;
}

.chat-notice.is-success {
  border-color: rgba(16, 185, 129, 0.18);
  background: rgba(236, 253, 245, 0.88);
  color: #047857;
}

.chat-notice.is-error {
  border-color: rgba(239, 68, 68, 0.18);
  background: rgba(254, 242, 242, 0.88);
  color: #b91c1c;
}

.chat-notice.is-info {
  border-color: rgba(37, 99, 235, 0.18);
  background: rgba(239, 246, 255, 0.88);
  color: #1d4ed8;
}

.chat-layout {
  display: grid;
  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  gap: 0;
  min-height: calc(100vh - 96px);
}

.chat-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid #f0f0f0;
  border-left: 0;
  border-radius: 0;
  background: var(--chat-card);
  box-shadow: none;
  backdrop-filter: none;
  overflow: hidden;
}

.chat-main__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.chat-main__eyebrow {
  margin: 0 0 6px;
  color: var(--chat-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.chat-main__header h1 {
  margin: 0;
  color: var(--chat-text);
  font-size: 28px;
  line-height: 1.25;
  font-weight: 700;
}

.chat-main__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chat-main__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--chat-border);
  border-radius: var(--chat-radius-full);
  background: rgba(255, 255, 255, 0.82);
  color: var(--chat-text-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-main__action:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.2);
  background: rgba(37, 99, 235, 0.06);
  color: var(--chat-accent);
}

.chat-main__badge {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: var(--chat-radius-full);
  background: rgba(37, 99, 235, 0.1);
  color: var(--chat-accent);
  font-size: 12px;
  font-weight: 700;
}

.chat-main__body {
  flex: 1;
  min-height: 0;
  padding: 0 24px 10px;
  overflow: hidden;
}

.chat-scroll-shell {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding-top: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(37, 99, 235, 0.22) transparent;
}

.chat-scroll-shell::-webkit-scrollbar {
  width: 4px;
}

.chat-scroll-shell::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.22);
}

.chat-loading {
  display: grid;
  place-items: center;
  min-height: 180px;
}

.chat-loading__dots {
  display: flex;
  gap: 6px;
}

.chat-loading__dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--chat-accent);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.chat-loading__dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.chat-loading__dots span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dotPulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@media (max-width: 1180px) {
  .chat-layout {
    grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
  }
}

@media (max-width: 1024px) {
  .chat-page {
    padding: 14px;
  }

  .chat-layout {
    grid-template-columns: 1fr;
  }

  .chat-topbar__title {
    justify-items: start;
    text-align: left;
  }
}

@media (max-width: 720px) {
  .chat-topbar {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .chat-topbar__github {
    width: 100%;
    justify-content: center;
  }

  .chat-main__header {
    padding: 20px 18px 16px;
    flex-direction: column;
  }

  .chat-main__body {
    padding: 0 18px 10px;
  }
}
</style>
