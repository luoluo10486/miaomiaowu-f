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
  sortSessions,
  formatSessionTime,
  createConversation,
  goBack,
  closeRetrievalPanel,
  openSession,
  removeSession,
  handleSessionRename,
  handleSuggestionClick,
  handleComposerKeydown,
  copyMessageContent,
  submitFeedback,
  sendMessage
} = useRagChat();

const sessionGroups = computed(() => {
  const keyword = sessionSearch.value.trim().toLowerCase();
  const filtered = sortSessions(sessions.value).filter((session) => {
    if (!keyword) {
      return true;
    }
    return String(session.title || "").toLowerCase().includes(keyword);
  });

  const buckets = [
    { key: "today", label: "今天", items: [] },
    { key: "week", label: "7天内", items: [] },
    { key: "month", label: "30天内", items: [] },
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
  return compact.length > 180 ? `${compact.slice(0, 180)}...` : compact;
});

const sessionIdLabel = computed(() => currentSessionId.value || "新会话");
const sessionUpdatedAt = computed(() => {
  if (!activeSession.value?.lastTime) {
    return "--";
  }
  return formatSessionTime(activeSession.value.lastTime);
});

const panelStats = computed(() => [
  { label: "消息总数", value: String(messages.value.length) },
  { label: "完整回复", value: String(completedAnswerCount.value) },
  { label: "会话状态", value: isStreaming.value ? "生成中" : "待机" },
  { label: "深度思考", value: deepThinkingEnabled.value ? "开启" : "关闭" }
]);
</script>

<template>
  <section class="chat-page" :class="{ 'is-panel-open': showRetrievalPanel }">
    <header class="chat-page__topbar">
      <button class="chat-back-button" type="button" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18 9 12l6-6" />
        </svg>
        <span>返回</span>
      </button>

      <div class="chat-page__meta">
        <span class="chat-page__eyebrow">RAG Chat</span>
        <strong>{{ currentUserName }}</strong>
      </div>
    </header>

    <div v-if="noticeText" :class="['chat-notice', `is-${noticeType}`]">
      {{ noticeText }}
    </div>

    <div class="chat-page__layout">
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
          <div class="chat-card__actions">
            <button class="chat-card__action" type="button" @click="handleSessionRename(activeSession || { id: currentSessionId })">
              重命名
            </button>
            <button class="chat-card__action is-secondary" type="button" @click="createConversation">
              新会话
            </button>
            <span v-if="isStreaming" class="chat-card__badge">生成中</span>
          </div>
        </header>

        <section class="chat-card__body">
          <div ref="messageScrollerRef" class="message-stream-shell">
            <div v-if="loadingMessages" class="panel-state panel-state--body">
              <div class="state-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <template v-else>
              <div v-if="!hasMessages" class="welcome-shell">
                <div class="welcome-hero">
                  <h3>今天想问点什么？</h3>
                  <p>基于知识库检索增强的问答工作区，支持可追溯、可复核的回答。</p>
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
                    <span class="suggestion-card__arrow">→</span>
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
          :placeholder="deepThinkingEnabled ? '输入需要深度分析的问题...' : '输入你的问题，Enter 发送，Shift+Enter 换行'"
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

        <section class="insight-card">
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
.chat-page {
  --text: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --bg: #f8fafc;
  --accent: #2563eb;
  --accent-warm: #0f172a;
  --border: rgba(148, 163, 184, 0.24);
  --border-light: rgba(148, 163, 184, 0.16);
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
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.16), transparent 28%),
    radial-gradient(circle at bottom left, rgba(15, 23, 42, 0.12), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  font-family: var(--sans);
}

.chat-page::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.14), transparent 58%);
  opacity: 0.5;
}

.chat-page__topbar,
.chat-page__layout {
  position: relative;
  z-index: 1;
}

.chat-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.chat-back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.84);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-back-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chat-back-button:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.22);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.chat-page__meta {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.chat-page__eyebrow {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chat-page__meta strong {
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}

.chat-notice {
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.84);
  font-size: 14px;
}

.chat-notice.is-success {
  border-color: rgba(16, 185, 129, 0.18);
  background: rgba(236, 253, 245, 0.85);
  color: #047857;
}

.chat-notice.is-error {
  border-color: rgba(239, 68, 68, 0.18);
  background: rgba(254, 242, 242, 0.85);
  color: #b91c1c;
}

.chat-notice.is-info {
  border-color: rgba(37, 99, 235, 0.18);
  background: rgba(239, 246, 255, 0.85);
  color: #1d4ed8;
}

.chat-page__layout {
  display: grid;
  grid-template-columns: minmax(270px, 0.95fr) minmax(0, 1.6fr) minmax(300px, 0.88fr);
  gap: 16px;
  min-height: calc(100vh - 86px);
}

.chat-card,
.insight-stack {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}

.chat-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
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

.chat-card__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.chat-card__action {
  padding: 9px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.84);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-card__action:hover {
  border-color: rgba(37, 99, 235, 0.2);
  background: rgba(37, 99, 235, 0.06);
  color: var(--accent);
}

.chat-card__action.is-secondary {
  color: var(--text-muted);
}

.chat-card__badge {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  background: rgba(37, 99, 235, 0.1);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
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
  scrollbar-color: rgba(37, 99, 235, 0.22) transparent;
}

.message-stream-shell::-webkit-scrollbar {
  width: 4px;
}

.message-stream-shell::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.22);
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
  background: rgba(255, 255, 255, 0.64);
  text-align: left;
  cursor: pointer;
  transition: all 0.24s ease;
  overflow: hidden;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.28);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
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
  border-color: rgba(37, 99, 235, 0.22);
  background: rgba(37, 99, 235, 0.06);
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
  background: rgba(255, 255, 255, 0.7);
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
  background: rgba(37, 99, 235, 0.1);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}

.citation-box {
  padding: 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: rgba(248, 250, 252, 0.82);
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
  background: rgba(248, 250, 252, 0.82);
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
  .chat-page__layout {
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
  .chat-page {
    padding: 16px;
  }

  .chat-page__layout {
    grid-template-columns: 1fr;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .chat-page__topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .chat-page__meta {
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
}
</style>
