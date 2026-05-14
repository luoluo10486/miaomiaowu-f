<script setup>
import { computed } from "vue";
import { useRagChat } from "../composables/useRagChat";
import RagComposer from "../components/chat/RagComposer.vue";
import RagMessageList from "../components/chat/RagMessageList.vue";
import RagSessionSidebar from "../components/chat/RagSessionSidebar.vue";

const {
  sessions,
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
  streamTaskId,
  streamingMessageId,
  cancelRequested,
  thinkingStartAt,
  messageScrollerRef,
  textareaRef,
  activeSession,
  hasMessages,
  thinkingMessage,
  currentSessionTitle,
  currentUserName,
  userInitial,
  sessionSearch,
  showRetrievalPanel,
  setNotice,
  syncRouteWithSession,
  formatSessionTime,
  sortSessions,
  upsertSession,
  updateSessionTitle,
  promptRenameSession,
  computeThinkingDuration,
  scrollToBottom,
  focusComposer,
  resizeComposer,
  createConversation,
  goBack,
  closeRetrievalPanel,
  loadSuggestions,
  loadSessions,
  selectSession,
  removeSession,
  updateStreamingMessage,
  appendThinking,
  appendContent,
  finishStreamingMessage,
  clearStreamingState,
  interruptStreaming,
  stopGeneration,
  sendMessage,
  openSession,
  handleSessionRename,
  handleSuggestionClick,
  handleComposerKeydown,
  copyMessageContent,
  submitFeedback,
  handleLogout
} = useRagChat();

const sessionGroups = computed(() => {
  const keyword = sessionSearch.value.trim().toLowerCase();
  const filtered = sortSessions(sessions.value).filter((session) => {
    if (!keyword) return true;
    return String(session.title || "").toLowerCase().includes(keyword);
  });

  const buckets = [
    { key: "today", label: "今天", items: [] },
    { key: "week", label: "7 天内", items: [] },
    { key: "month", label: "30 天内", items: [] },
    { key: "earlier", label: "更早", items: [] }
  ];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  filtered.forEach((session) => {
    const date = session.lastTime ? new Date(session.lastTime) : null;
    if (!date || Number.isNaN(date.getTime())) {
      buckets[3].items.push(session);
      return;
    }

    const sessionStart = new Date(date);
    sessionStart.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((todayStart.getTime() - sessionStart.getTime()) / 86400000);

    if (diffDays <= 0) {
      buckets[0].items.push(session);
    } else if (diffDays <= 7) {
      buckets[1].items.push(session);
    } else if (diffDays <= 30) {
      buckets[2].items.push(session);
    } else {
      buckets[3].items.push(session);
    }
  });

  return buckets
    .filter((group) => group.items.length > 0)
    .map((group) => ({
      ...group,
      count: group.items.length
    }));
});

const completedAnswerCount = computed(() =>
  messages.value.filter((message) => message.role === "assistant" && message.status === "done" && message.content).length
);

const latestAssistantMessage = computed(() =>
  [...messages.value].reverse().find((message) => message.role === "assistant" && message.content)
);

const summarySnippet = computed(() => {
  const content = latestAssistantMessage.value?.content || "";
  if (!content) {
    return "当前会话还没有形成可引用的回答摘要。";
  }

  const compact = content.replace(/\s+/g, " ").trim();
  return compact.length > 180 ? `${compact.slice(0, 180)}…` : compact;
});

const panelStats = computed(() => [
  { label: "消息总数", value: String(messages.value.length) },
  { label: "完成回复", value: String(completedAnswerCount.value) },
  { label: "会话状态", value: isStreaming.value ? "生成中" : "待机" },
  { label: "深度思考", value: deepThinkingEnabled.value ? "开启" : "关闭" }
]);

const sessionIdLabel = computed(() => currentSessionId.value || "新会话");
const sessionUpdatedAt = computed(() => {
  if (!activeSession.value?.lastTime) {
    return "--";
  }
  return formatSessionTime(activeSession.value.lastTime);
});
</script>

<template>
  <section :class="['rag-shell', { 'is-retrieval-open': showRetrievalPanel }]">
    <header class="rag-topbar">
      <button class="back-button" type="button" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18 9 12l6-6" />
        </svg>
        <span>返回</span>
      </button>

      <div class="rag-topbar__meta">
        <span class="rag-topbar__eyebrow">RAG Chat</span>
        <strong>{{ currentUserName }}</strong>
      </div>
    </header>

    <div class="rag-layout">
      <RagSessionSidebar
        :groups="sessionGroups"
        :loading="loadingSessions"
        :search="sessionSearch"
        :current-session-id="currentSessionId"
        :current-user-name="currentUserName"
        :user-initial="userInitial"
        :format-time="formatSessionTime"
        @update:search="sessionSearch = $event"
        @create="createConversation"
        @select="openSession"
        @delete="removeSession"
        @rename="handleSessionRename"
      />

      <main class="chat-card">
        <header class="chat-card__header">
          <div>
            <p class="chat-card__eyebrow">当前会话</p>
            <h1>{{ currentSessionTitle }}</h1>
          </div>
          <div class="chat-card__header-actions">
            <button
              class="chat-card__rename"
              type="button"
              @click="handleSessionRename(activeSession || { id: currentSessionId })"
            >
              重命名
            </button>
            <button class="chat-card__rename is-secondary" type="button" @click="createConversation">
              新会话
            </button>
            <span class="chat-card__badge" v-if="isStreaming">生成中</span>
          </div>
        </header>

        <div v-if="noticeText" :class="['notice-bar', `notice-bar--${noticeType}`]">
          {{ noticeText }}
        </div>

        <section class="chat-card__body">
          <div ref="messageScrollerRef" class="message-stream-shell">
            <div v-if="loadingMessages" class="panel-state panel-state--body">
              <div class="state-dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <template v-else>
              <div v-if="!hasMessages" class="welcome-shell">
                <div class="welcome-hero">
                  <h3>今天想问点什么？</h3>
                  <p>基于知识库检索增强，提供可追溯、可复核的回答。</p>
                </div>

                <div class="suggestions-grid">
                  <button
                    v-for="(item, index) in suggestions"
                    :key="index"
                    class="suggestion-card"
                    type="button"
                    @click="handleSuggestionClick(item.question)"
                  >
                    <span class="suggestion-card__index">{{ String(index + 1).padStart(2, "0") }}</span>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.description }}</small>
                    <span class="suggestion-card__arrow">&rarr;</span>
                  </button>
                </div>
              </div>

              <RagMessageList
                v-else
                :messages="messages"
                :user-initial="userInitial"
                @copy="copyMessageContent"
                @feedback="submitFeedback"
              />
            </template>
          </div>
        </section>

        <RagComposer
          :draft="draft"
          :deep-thinking-enabled="deepThinkingEnabled"
          :is-streaming="isStreaming"
          :thinking-message="thinkingMessage"
          :input-ref="textareaRef"
          :placeholder="
            deepThinkingEnabled
              ? '输入需要深度分析的问题...'
              : '输入你的问题，Enter 发送，Shift+Enter 换行'
          "
          @update:draft="draft = $event"
          @toggle-thinking="deepThinkingEnabled = !deepThinkingEnabled"
          @send="sendMessage"
          @keydown="handleComposerKeydown"
        />
      </main>

      <aside v-if="showRetrievalPanel" class="insight-stack" aria-label="会话信息">
        <div class="insight-header">
          <h2>会话信息</h2>
          <button class="insight-close-button" type="button" aria-label="关闭" @click="closeRetrievalPanel">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <section class="insight-card insight-card--sources">
          <header>
            <h3>本次摘要</h3>
            <span class="insight-badge">{{ sessionIdLabel }}</span>
          </header>
          <div class="citation-box">
            <strong>{{ sessionUpdatedAt }}</strong>
            <p>{{ summarySnippet }}</p>
          </div>
        </section>

        <section class="insight-card">
          <header>
            <h3>状态概览</h3>
          </header>
          <dl class="request-stats">
            <div v-for="item in panelStats" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.rag-shell {
  --text: #1f1b16;
  --text-secondary: #4f463d;
  --text-muted: #7e7264;
  --bg: #f5efe7;
  --accent: #6b7f5a;
  --accent-warm: #8b6f3d;
  --border: rgba(93, 78, 58, 0.16);
  --border-light: rgba(93, 78, 58, 0.1);
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 24px;
  --radius-full: 999px;
  --serif: "Georgia", "Times New Roman", serif;
  --sans:
    "PingFang SC",
    "Microsoft YaHei",
    "Helvetica Neue",
    Arial,
    sans-serif;
  --mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 20px;
  color: var(--text);
  background:
    radial-gradient(circle at top right, rgba(139, 111, 61, 0.16), transparent 26%),
    radial-gradient(circle at bottom left, rgba(107, 127, 90, 0.14), transparent 28%),
    linear-gradient(180deg, #fbf8f3 0%, #f5efe7 100%);
  font-family: var(--sans);
}

.rag-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.24) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.16), transparent 60%);
  opacity: 0.55;
}

.rag-topbar,
.rag-layout {
  position: relative;
  z-index: 1;
}

.rag-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.72);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.back-button:hover {
  transform: translateY(-1px);
  border-color: rgba(107, 127, 90, 0.28);
  box-shadow: 0 10px 24px rgba(37, 31, 23, 0.08);
}

.rag-topbar__meta {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.rag-topbar__eyebrow {
  color: var(--accent-warm);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.rag-topbar__meta strong {
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}

.rag-layout {
  display: grid;
  grid-template-columns: minmax(270px, 0.95fr) minmax(0, 1.6fr) minmax(300px, 0.88fr);
  gap: 16px;
  min-height: calc(100vh - 76px);
}

.sidebar-card,
.chat-card,
.insight-stack {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 20px 48px rgba(31, 27, 22, 0.08);
  backdrop-filter: blur(18px);
}

.chat-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
}

.chat-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 18px;
  border-bottom: 1px solid var(--border-light);
}

.chat-card__eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.chat-card__header h1 {
  margin: 0;
  color: var(--text);
  font-size: 28px;
  line-height: 1.25;
  font-weight: 700;
}

.chat-card__header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chat-card__rename {
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-card__rename:hover {
  border-color: rgba(107, 127, 90, 0.26);
  background: rgba(107, 127, 90, 0.07);
  color: var(--accent);
}

.chat-card__rename.is-secondary {
  color: var(--text-muted);
}

.chat-card__badge {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  background: rgba(107, 127, 90, 0.12);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}

.notice-bar {
  margin: 0 24px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
}

.notice-bar--info {
  background: rgba(139, 111, 61, 0.1);
  color: var(--accent-warm);
}

.notice-bar--success {
  background: rgba(107, 127, 90, 0.12);
  color: #4a6b3a;
}

.notice-bar--error {
  background: rgba(180, 60, 50, 0.1);
  color: #a04030;
}

.chat-card__body {
  flex: 1;
  min-height: 0;
  padding: 0 24px 10px;
  overflow: hidden;
}

.message-stream-shell {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 0 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(107, 127, 90, 0.22) transparent;
}

.message-stream-shell::-webkit-scrollbar {
  width: 4px;
}

.message-stream-shell::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(107, 127, 90, 0.22);
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 80px;
  color: var(--text-muted);
  font-size: 13px;
}

.panel-state--body {
  min-height: 180px;
}

.state-dots {
  display: flex;
  gap: 6px;
}

.state-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.state-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.state-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.welcome-shell {
  display: grid;
  gap: 28px;
  padding: 42px 0 28px;
  align-content: start;
}

.welcome-hero {
  display: grid;
  gap: 12px;
  text-align: center;
}

.welcome-hero h3 {
  margin: 0;
  color: var(--text);
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.2;
  font-weight: 700;
}

.welcome-hero p {
  margin: 0;
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.8;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.suggestion-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 18px 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.56);
  text-align: left;
  cursor: pointer;
  transition: all 0.24s ease;
  overflow: hidden;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  border-color: rgba(107, 127, 90, 0.34);
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 14px 30px rgba(37, 31, 23, 0.08);
}

.suggestion-card__index {
  display: block;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.suggestion-card strong {
  display: block;
  color: var(--text);
  font-size: 17px;
  line-height: 1.4;
  font-weight: 700;
}

.suggestion-card small {
  display: block;
  margin-top: 8px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.suggestion-card__arrow {
  position: absolute;
  right: 16px;
  bottom: 14px;
  color: var(--text-muted);
  font-size: 16px;
  transition: transform 0.2s ease;
}

.suggestion-card:hover .suggestion-card__arrow {
  transform: translateX(3px);
  color: var(--accent);
}

.insight-stack {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  gap: 14px;
}

.insight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.insight-header h2 {
  margin: 0;
  color: var(--text);
  font-size: 18px;
  line-height: 1.35;
  font-weight: 700;
}

.insight-close-button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.insight-close-button:hover {
  color: var(--accent);
  border-color: rgba(107, 127, 90, 0.24);
  background: rgba(107, 127, 90, 0.07);
}

.insight-close-button svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.insight-card {
  padding: 16px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.66);
}

.insight-card > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.insight-card h3 {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.35;
  font-weight: 700;
}

.insight-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: var(--radius-full);
  background: rgba(107, 127, 90, 0.12);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}

.citation-box {
  padding: 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: rgba(255, 252, 246, 0.72);
}

.citation-box strong {
  display: block;
  color: var(--text);
  font-size: 13px;
  line-height: 1.4;
  font-weight: 700;
}

.citation-box p {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.request-stats {
  display: grid;
  gap: 12px;
  margin: 0;
}

.request-stats div {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: rgba(255, 252, 246, 0.66);
}

.request-stats dt {
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.request-stats dd {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  font-weight: 700;
  word-break: break-word;
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

@media (max-width: 1280px) {
  .rag-layout {
    grid-template-columns: minmax(250px, 0.9fr) minmax(0, 1.1fr);
  }

  .insight-stack {
    grid-column: 1 / -1;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .insight-header,
  .insight-card {
    flex: 1 1 320px;
  }
}

@media (max-width: 1024px) {
  .rag-shell {
    padding: 16px;
  }

  .rag-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-card,
  .chat-card,
  .insight-stack {
    min-height: auto;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .rag-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .rag-topbar__meta {
    justify-items: start;
    text-align: left;
  }

  .chat-card__header {
    padding: 20px 18px 16px;
    flex-direction: column;
  }

  .chat-card__body {
    padding: 0 18px 10px;
  }

  .notice-bar {
    margin: 0 18px;
  }
}
</style>
