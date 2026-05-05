<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  createRagChatStream,
  deleteRagSession,
  listRagMessages,
  listRagSessions,
  listSampleQuestions,
  stopRagTask,
  submitRagMessageFeedback
} from "../services/ragService";
import { clearStoredAuth, getStoredAuthUser } from "../utils/auth";

const DEFAULT_SUGGESTIONS = [
  {
    title: "内容总结",
    description: "提炼 3 到 5 个要点",
    question: "请帮我总结这段内容，并提炼 3 到 5 个关键要点。"
  },
  {
    title: "任务拆解",
    description: "拆成步骤和优先级",
    question: "请把这个需求拆成可执行步骤，并给出优先级和里程碑。"
  },
  {
    title: "方案对比",
    description: "给出多个方案并比较",
    question: "围绕这个主题给出 3 个可行方案，并比较优缺点和适用场景。"
  }
];

const router = useRouter();
const sessions = ref([]);
const messages = ref([]);
const suggestions = ref(DEFAULT_SUGGESTIONS);
const currentSessionId = ref("");
const draft = ref("");
const loadingSessions = ref(false);
const loadingMessages = ref(false);
const isStreaming = ref(false);
const deepThinkingEnabled = ref(false);
const noticeText = ref("");
const noticeType = ref("info");
const streamTaskId = ref("");
const streamingMessageId = ref("");
const cancelRequested = ref(false);
const thinkingStartAt = ref(0);
const messageScrollerRef = ref(null);
const textareaRef = ref(null);
let cancelStreamRequest = null;
const currentUser = ref(getStoredAuthUser());

const activeSession = computed(() => {
  return sessions.value.find((item) => item.id === currentSessionId.value) || null;
});
const hasMessages = computed(() => messages.value.length > 0);
const thinkingMessage = computed(() => {
  return messages.value.find((message) => message.role === "assistant" && message.isThinking);
});
const currentSessionTitle = computed(() => activeSession.value?.title || "新对话");
const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "当前用户";
});
const userInitial = computed(() => {
  return currentUserName.value.slice(0, 1).toUpperCase() || "U";
});
const sessionSearch = ref("");
const showRetrievalPanel = ref(false);
const retrievalSources = [
  { type: "PDF", title: "检索增强生成（RAG）综述.pdf", score: "0.92", page: "P.12", tone: "red" },
  { type: "MD", title: "企业知识库建设指南.md", score: "0.88", page: "段落 4", tone: "ink" },
  { type: "DOCX", title: "问答系统设计与优化.docx", score: "0.82", page: "P.8", tone: "blue" },
  { type: "PDF", title: "大模型应用开发实战.pdf", score: "0.76", page: "P.45", tone: "red" },
  { type: "MD", title: "向量数据库选型建议.md", score: "0.68", page: "P.15", tone: "ink" }
];
const citationSnippet =
  "检索增强生成（RAG）通过将大模型与外部知识库相结合，在生成答案前先检索相关信息，从而提升回答的准确性与可追溯性...";
const filteredSessions = computed(() => {
  const keyword = sessionSearch.value.trim().toLowerCase();
  if (!keyword) {
    return sessions.value;
  }

  return sessions.value.filter((item) => item.title.toLowerCase().includes(keyword));
});
const hasCompletedRagAnswer = computed(() => {
  return messages.value.some(
    (message) => message.role === "assistant" && message.status === "done" && message.content
  );
});
const groupedSessions = computed(() => {
  const now = new Date();
  const groups = [
    { key: "today", label: "今天", items: [] },
    { key: "yesterday", label: "昨天", items: [] },
    { key: "earlier", label: "更早", items: [] }
  ];

  filteredSessions.value.forEach((session) => {
    const date = session.lastTime ? new Date(session.lastTime) : null;
    if (!date || Number.isNaN(date.getTime())) {
      groups[2].items.push(session);
      return;
    }

    const diffDays = Math.floor(
      (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
        86400000
    );

    if (diffDays === 0) {
      groups[0].items.push(session);
    } else if (diffDays === 1) {
      groups[1].items.push(session);
    } else {
      groups[2].items.push(session);
    }
  });

  return groups.filter((group) => group.items.length > 0);
});
const requestStats = computed(() => [
  { label: "检索耗时", value: isStreaming.value ? "生成中" : "768 ms" },
  { label: "返回片段", value: `${retrievalSources.length + 1} 条` },
  { label: "Trace ID", value: currentSessionId.value || "f8c7a2e1-9d3e-4b91-8c01" },
  { label: "请求时间", value: new Date().toLocaleString("zh-CN", { hour12: false }) }
]);
function setNotice(message, type = "info") {
  noticeText.value = message;
  noticeType.value = type;
}

function formatSessionTime(value) {
  if (!value) {
    return "刚刚";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const sameYear = now.getFullYear() === date.getFullYear();
  const sameDay =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (sameDay) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    ...(sameYear ? {} : { year: "numeric" })
  });
}

function mapVoteToFeedback(vote) {
  if (vote === 1) {
    return "like";
  }

  if (vote === -1) {
    return "dislike";
  }

  return null;
}

function mapSession(item) {
  return {
    id: item?.conversationId || "",
    title: item?.title || "新对话",
    lastTime: item?.lastTime || ""
  };
}

function mapMessage(item) {
  return {
    id: String(item?.id ?? `${Date.now()}`),
    role: item?.role === "assistant" ? "assistant" : "user",
    content: item?.content || "",
    thinking: item?.thinkingContent || "",
    thinkingDuration: item?.thinkingDuration || 0,
    createdAt: item?.createTime || "",
    feedback: mapVoteToFeedback(item?.vote),
    status: "done",
    isThinking: false
  };
}

function sortSessions(items) {
  return [...items].sort((a, b) => {
    const timeA = a.lastTime ? new Date(a.lastTime).getTime() : 0;
    const timeB = b.lastTime ? new Date(b.lastTime).getTime() : 0;
    return timeB - timeA;
  });
}

function upsertSession(nextSession) {
  const index = sessions.value.findIndex((item) => item.id === nextSession.id);
  const merged = [...sessions.value];

  if (index >= 0) {
    merged[index] = {
      ...merged[index],
      ...nextSession
    };
  } else {
    merged.unshift(nextSession);
  }

  sessions.value = sortSessions(merged);
}

function updateSessionTitle(sessionId, title) {
  if (!sessionId || !title) {
    return;
  }

  sessions.value = sessions.value.map((item) =>
    item.id === sessionId
      ? {
          ...item,
          title
        }
      : item
  );
}

function computeThinkingDuration() {
  if (!thinkingStartAt.value) {
    return 0;
  }

  const seconds = Math.round((Date.now() - thinkingStartAt.value) / 1000);
  return Math.max(1, seconds);
}

function scrollToBottom() {
  nextTick(() => {
    const container = messageScrollerRef.value;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  });
}

function focusComposer() {
  nextTick(() => {
    textareaRef.value?.focus();
  });
}

function resizeComposer() {
  nextTick(() => {
    const textarea = textareaRef.value;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  });
}

function createConversation() {
  if (isStreaming.value) {
    void interruptStreaming();
  }

  currentSessionId.value = "";
  messages.value = [];
  showRetrievalPanel.value = false;
  setNotice("", "info");
  focusComposer();
  resizeComposer();
}

function goBack() {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }

  router.push("/workspace");
}

function closeRetrievalPanel() {
  showRetrievalPanel.value = false;
}

async function loadSuggestions() {
  try {
    const data = await listSampleQuestions();
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }

    suggestions.value = data
      .filter((item) => item?.question && item.question.trim())
      .slice(0, 3)
      .map((item, index) => ({
        title: item.title?.trim() || `推荐问题 ${index + 1}`,
        description: item.description?.trim() || "点击即可快速开始提问",
        question: item.question.trim()
      }));
  } catch {
    return;
  }
}

async function loadSessions({ autoSelect = true } = {}) {
  loadingSessions.value = true;

  try {
    const data = await listRagSessions();
    const nextSessions = Array.isArray(data) ? sortSessions(data.map(mapSession)) : [];
    sessions.value = nextSessions;

    if (!autoSelect) {
      return;
    }

    if (currentSessionId.value && nextSessions.some((item) => item.id === currentSessionId.value)) {
      return;
    }

    if (nextSessions.length > 0) {
      await selectSession(nextSessions[0].id);
      return;
    }

    createConversation();
  } catch (error) {
    setNotice(error?.message || "加载会话失败，请稍后重试", "error");
  } finally {
    loadingSessions.value = false;
  }
}

async function selectSession(sessionId) {
  if (!sessionId) {
    createConversation();
    return;
  }

  if (isStreaming.value) {
    await interruptStreaming();
  }

  currentSessionId.value = sessionId;
  loadingMessages.value = true;
  showRetrievalPanel.value = false;
  setNotice("", "info");

  try {
    const data = await listRagMessages(sessionId);
    if (currentSessionId.value !== sessionId) {
      return;
    }

    messages.value = Array.isArray(data) ? data.map(mapMessage) : [];
    showRetrievalPanel.value = hasCompletedRagAnswer.value;
    scrollToBottom();
  } catch (error) {
    setNotice(error?.message || "加载消息失败，请稍后重试", "error");
  } finally {
    if (currentSessionId.value === sessionId) {
      loadingMessages.value = false;
    }
  }
}

async function removeSession(sessionId) {
  if (!sessionId) {
    return;
  }

  const confirmed = typeof window === "undefined" ? true : window.confirm("确认删除这个会话吗？");
  if (!confirmed) {
    return;
  }

  try {
    await deleteRagSession(sessionId);
    const remaining = sessions.value.filter((item) => item.id !== sessionId);
    sessions.value = remaining;

    if (currentSessionId.value === sessionId) {
      if (remaining.length > 0) {
        await selectSession(remaining[0].id);
      } else {
        createConversation();
      }
    }

    setNotice("会话已删除", "success");
  } catch (error) {
    setNotice(error?.message || "删除会话失败，请稍后重试", "error");
  }
}

function updateStreamingMessage(patch) {
  messages.value = messages.value.map((item) =>
    item.id === streamingMessageId.value ? patch(item) : item
  );
  scrollToBottom();
}

function appendThinking(delta) {
  if (!delta) {
    return;
  }

  if (!thinkingStartAt.value) {
    thinkingStartAt.value = Date.now();
  }

  updateStreamingMessage((message) => ({
    ...message,
    thinking: `${message.thinking || ""}${delta}`,
    isThinking: true
  }));
}

function appendContent(delta) {
  if (!delta) {
    return;
  }

  const duration = thinkingStartAt.value ? computeThinkingDuration() : 0;
  const shouldCloseThinking = thinkingStartAt.value > 0;

  if (shouldCloseThinking) {
    thinkingStartAt.value = 0;
  }

  updateStreamingMessage((message) => ({
    ...message,
    content: `${message.content || ""}${delta}`,
    isThinking: false,
    thinkingDuration: message.thinkingDuration || duration
  }));
}

function finishStreamingMessage(status, payload = null) {
  const duration = thinkingStartAt.value ? computeThinkingDuration() : 0;
  thinkingStartAt.value = 0;

  updateStreamingMessage((message) => ({
    ...message,
    ...(payload?.messageId
      ? {
          id: String(payload.messageId)
        }
      : {}),
    status,
    isThinking: false,
    thinkingDuration: message.thinkingDuration || duration
  }));
}

function clearStreamingState() {
  isStreaming.value = false;
  streamTaskId.value = "";
  streamingMessageId.value = "";
  cancelRequested.value = false;
  thinkingStartAt.value = 0;
  cancelStreamRequest = null;
}

async function interruptStreaming() {
  if (!isStreaming.value) {
    return;
  }

  if (streamTaskId.value) {
    try {
      await stopRagTask(streamTaskId.value);
    } catch {}
  }

  cancelStreamRequest?.();
  clearStreamingState();
}

async function stopGeneration() {
  if (!isStreaming.value) {
    return;
  }

  cancelRequested.value = true;

  if (streamTaskId.value) {
    try {
      await stopRagTask(streamTaskId.value);
    } catch (error) {
      setNotice(error?.message || "停止生成失败，请稍后重试", "error");
    }
  }
}

async function sendMessage() {
  if (isStreaming.value) {
    await stopGeneration();
    return;
  }

  const question = draft.value.trim();
  if (!question) {
    return;
  }

  setNotice("", "info");
  showRetrievalPanel.value = false;

  const userMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    content: question,
    createdAt: new Date().toISOString(),
    status: "done"
  };
  const assistantId = `assistant-${Date.now()}`;
  const assistantMessage = {
    id: assistantId,
    role: "assistant",
    content: "",
    thinking: "",
    thinkingDuration: 0,
    createdAt: new Date().toISOString(),
    feedback: null,
    status: "streaming",
    isThinking: deepThinkingEnabled.value
  };

  draft.value = "";
  resizeComposer();
  messages.value = [...messages.value, userMessage, assistantMessage];
  isStreaming.value = true;
  streamTaskId.value = "";
  streamingMessageId.value = assistantId;
  cancelRequested.value = false;
  thinkingStartAt.value = 0;
  scrollToBottom();

  const stream = createRagChatStream(
    {
      question,
      conversationId: currentSessionId.value || undefined,
      deepThinking: deepThinkingEnabled.value || undefined
    },
    {
      onMeta(payload) {
        if (streamingMessageId.value !== assistantId) {
          return;
        }

        const nextSessionId = payload?.conversationId || currentSessionId.value;
        if (nextSessionId) {
          currentSessionId.value = nextSessionId;
          upsertSession({
            id: nextSessionId,
            title:
              sessions.value.find((item) => item.id === nextSessionId)?.title || "新对话",
            lastTime: new Date().toISOString()
          });
        }

        if (payload?.taskId) {
          streamTaskId.value = payload.taskId;
          if (cancelRequested.value) {
            stopRagTask(payload.taskId).catch(() => null);
          }
        }
      },
      onMessage(payload) {
        if (!payload || typeof payload !== "object") {
          return;
        }

        if (payload.type === "think") {
          appendThinking(payload.delta || "");
          return;
        }

        appendContent(payload.delta || "");
      },
      onReject(payload) {
        appendContent(payload?.delta || "");
      },
      onTitle(payload) {
        if (payload?.title && currentSessionId.value) {
          updateSessionTitle(currentSessionId.value, payload.title);
        }
      },
      onFinish(payload) {
        if (payload?.title && currentSessionId.value) {
          updateSessionTitle(currentSessionId.value, payload.title);
        }

        if (currentSessionId.value) {
          upsertSession({
            id: currentSessionId.value,
            title:
              payload?.title ||
              sessions.value.find((item) => item.id === currentSessionId.value)?.title ||
              "新对话",
            lastTime: new Date().toISOString()
          });
        }

        finishStreamingMessage("done", payload);
        showRetrievalPanel.value = true;
      },
      onCancel(payload) {
        finishStreamingMessage("cancelled", payload);
        clearStreamingState();
      },
      onDone() {
        clearStreamingState();
      },
      onError(error) {
        finishStreamingMessage("error");
        setNotice(error?.message || "生成失败，请稍后重试", "error");
        clearStreamingState();
      }
    }
  );

  cancelStreamRequest = stream.cancel;

  try {
    await stream.start();
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    finishStreamingMessage("error");
    setNotice(error?.message || "生成失败，请稍后重试", "error");
    clearStreamingState();
  } finally {
    focusComposer();
  }
}

function handleSuggestionClick(question) {
  draft.value = question;
  focusComposer();
  resizeComposer();
}

function handleComposerKeydown(event) {
  if (event.key !== "Enter" || event.shiftKey) {
    return;
  }

  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  event.preventDefault();
  void sendMessage();
}

async function copyMessageContent(content) {
  if (!content) {
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    setNotice("回答内容已复制", "success");
  } catch {
    setNotice("复制失败，请手动选择文本", "error");
  }
}

async function submitFeedback(message, feedback) {
  if (!message?.id || message.id.startsWith("assistant-")) {
    return;
  }

  const previousFeedback = message.feedback || null;
  const nextFeedback = previousFeedback === feedback ? null : feedback;
  messages.value = messages.value.map((item) =>
    item.id === message.id
      ? {
          ...item,
          feedback: nextFeedback
        }
      : item
  );

  if (!nextFeedback) {
    setNotice("已取消反馈", "info");
    return;
  }

  try {
    await submitRagMessageFeedback(message.id, nextFeedback === "like" ? 1 : -1);
    setNotice(nextFeedback === "like" ? "已标记为有帮助" : "已标记为需改进", "success");
  } catch (error) {
    messages.value = messages.value.map((item) =>
      item.id === message.id
        ? {
            ...item,
            feedback: previousFeedback
          }
        : item
    );
    setNotice(error?.message || "反馈保存失败，请稍后重试", "error");
  }
}

function handleLogout() {
  clearStoredAuth();
  router.push("/login");
}

onMounted(async () => {
  await Promise.all([loadSuggestions(), loadSessions()]);
  focusComposer();
  resizeComposer();
});

onBeforeUnmount(() => {
  if (streamTaskId.value) {
    stopRagTask(streamTaskId.value).catch(() => null);
  }
  cancelStreamRequest?.();
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
    </header>

    <div class="rag-layout">
      <aside class="sidebar-card">
        <div class="sidebar-card__header">
          <h2>会话</h2>
          <button class="new-chat-button" type="button" @click="createConversation" title="新建对话">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        <div class="sidebar-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input v-model="sessionSearch" type="search" placeholder="搜索会话..." />
        </div>

        <div v-if="loadingSessions" class="panel-state">
          <div class="state-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div v-else-if="filteredSessions.length === 0" class="panel-state panel-state--compact">
          暂无会话记录
        </div>

        <div v-else class="session-list">
          <section v-for="group in groupedSessions" :key="group.key" class="session-group">
            <h3>{{ group.label }}</h3>
            <ul>
              <li v-for="session in group.items" :key="session.id">
                <button
                  type="button"
                  :class="['session-item', { 'is-active': currentSessionId === session.id }]"
                  @click="selectSession(session.id)"
                >
                  <span class="session-item__title">{{ session.title }}</span>
                  <span class="session-item__time">{{ formatSessionTime(session.lastTime) }}</span>
                </button>
                <button class="session-item__delete" type="button" title="删除会话" @click="removeSession(session.id)">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            </ul>
          </section>
        </div>

        <div class="sidebar-footer">
          <div class="user-pill">
            <span class="user-pill__avatar">{{ userInitial }}</span>
            <span class="user-pill__name">{{ currentUserName }}</span>
          </div>
        </div>
      </aside>

      <main class="chat-card">
        <header class="chat-card__header">
          <h1>{{ currentSessionTitle }}</h1>
          <span class="chat-card__badge" v-if="isStreaming">生成中</span>
        </header>

        <div v-if="noticeText" :class="['notice-bar', `notice-bar--${noticeType}`]">
          {{ noticeText }}
        </div>

        <section class="chat-card__body">
          <div v-if="loadingMessages" class="panel-state panel-state--body">
            <div class="state-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          <template v-else>
            <div v-if="!hasMessages" class="welcome-shell">
              <div class="welcome-hero">
                <h3>今天想问点什么</h3>
                <p>基于知识库检索增强，提供可靠、可追溯的回答</p>
              </div>

              <div class="suggestions-grid">
                <button
                  v-for="(item, index) in suggestions"
                  :key="index"
                  class="suggestion-card"
                  type="button"
                  @click="handleSuggestionClick(item.question)"
                >
                  <span class="suggestion-card__index">{{ String(index + 1).padStart(2, '0') }}</span>
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.description }}</small>
                  <span class="suggestion-card__arrow">&rarr;</span>
                </button>
              </div>
            </div>

            <div v-else ref="messageScrollerRef" class="message-list">
              <article
                v-for="message in messages"
                :key="message.id"
                :class="['message-row', `message-row--${message.role}`]"
              >
                <div class="message-avatar" :aria-hidden="message.role === 'user' ? '我' : 'RAG'">
                  {{ message.role === 'user' ? userInitial : 'R' }}
                </div>

                <div :class="['message-bubble', `message-bubble--${message.role}`]">
                  <details
                    v-if="message.role === 'assistant' && message.thinking"
                    class="thinking-panel"
                  >
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

                  <pre class="message-bubble__content">{{
                    message.content || (message.isThinking ? "正在深度思考..." : "")
                  }}</pre>

                  <p v-if="message.status === 'cancelled'" class="message-bubble__status">
                    已停止生成
                  </p>
                  <p
                    v-else-if="message.status === 'error'"
                    class="message-bubble__status message-bubble__status--error"
                  >
                    生成失败，请重试
                  </p>

                  <div
                    v-if="message.role === 'assistant' && message.status !== 'streaming' && message.content"
                    class="message-actions"
                  >
                    <button type="button" title="复制" @click="copyMessageContent(message.content)">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 8h10v12H8z" />
                        <path d="M6 16H4V4h12v2" />
                      </svg>
                    </button>
                    <button
                      title="有帮助"
                      type="button"
                      :class="{ 'is-active': message.feedback === 'like' }"
                      :disabled="message.id.startsWith('assistant-')"
                      @click="submitFeedback(message, 'like')"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 10v10H4V10h3Zm0 0 5-7 1.5 1.5L12 9h6a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2H7" />
                      </svg>
                    </button>
                    <button
                      title="需改进"
                      type="button"
                      :class="{ 'is-active': message.feedback === 'dislike' }"
                      :disabled="message.id.startsWith('assistant-')"
                      @click="submitFeedback(message, 'dislike')"
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
        </section>

        <footer class="composer">
          <div v-if="thinkingMessage" class="thinking-tip">
            <span class="thinking-dot thinking-dot--pulse"></span>
            深度思考中
          </div>

          <div class="composer-box">
            <textarea
              ref="textareaRef"
              v-model="draft"
              class="composer__input"
              rows="2"
              :placeholder="
                deepThinkingEnabled
                  ? '输入需要深度分析的问题...'
                  : '输入你的问题，Enter 发送'
              "
              @input="resizeComposer"
              @keydown="handleComposerKeydown"
            />

            <div class="composer__footer">
              <button
                type="button"
                :class="['thinking-toggle', { 'is-active': deepThinkingEnabled }]"
                :disabled="isStreaming"
                @click="deepThinkingEnabled = !deepThinkingEnabled"
              >
                <span class="thinking-toggle__dot"></span>
                <span>深度思考</span>
              </button>

              <button
                class="send-button"
                :class="{ 'is-stop': isStreaming }"
                type="button"
                @click="sendMessage"
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
      </main>

      <aside v-if="showRetrievalPanel" class="insight-stack" aria-label="检索信息">
        <div class="insight-header">
          <h2>检索信息</h2>
          <button class="insight-close-button" type="button" aria-label="关闭" @click="closeRetrievalPanel">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <section class="insight-card insight-card--sources">
          <header>
            <h3>检索来源</h3>
            <span class="insight-badge">{{ retrievalSources.length + 1 }}</span>
          </header>
          <ol class="source-list">
            <li v-for="(source, index) in retrievalSources" :key="source.title">
              <span class="source-index">{{ index + 1 }}</span>
              <div class="source-info">
                <strong>{{ source.title }}</strong>
                <p>
                  <span :class="['source-type', `source-type--${source.tone}`]">{{ source.type }}</span>
                  <small>相似度 {{ source.score }}</small>
                  <small>{{ source.page }}</small>
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section class="insight-card">
          <header>
            <h3>引用片段</h3>
          </header>
          <div class="citation-box">
            <strong>检索增强生成（RAG）综述.pdf · P.12</strong>
            <p>{{ citationSnippet }}</p>
          </div>
        </section>

        <section class="insight-card">
          <header>
            <h3>本次请求</h3>
          </header>
          <dl class="request-stats">
            <div v-for="item in requestStats" :key="item.label">
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
  --bg: #f6eedf;
  --bg-warm: #f3ead8;
  --card: rgba(255, 252, 246, 0.82);
  --card-solid: #fffcf6;
  --text: #2c2418;
  --text-secondary: #7a7264;
  --text-muted: #a09888;
  --accent: #6b7f5a;
  --accent-warm: #8b6f3d;
  --border: rgba(103, 83, 49, 0.14);
  --border-light: rgba(103, 83, 49, 0.08);
  --shadow-sm: 0 1px 3px rgba(50, 42, 28, 0.05);
  --shadow-md: 0 8px 24px rgba(50, 42, 28, 0.07);
  --shadow-lg: 0 20px 48px rgba(50, 42, 28, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 999px;
  --serif: "STKaiti", "KaiTi", "Noto Serif SC", "Source Han Serif SC", serif;
  --sans: -apple-system, "Noto Sans SC", "Segoe UI", sans-serif;

  position: relative;
  height: 100vh;
  padding: 0 24px 24px;
  display: grid;
  grid-template-rows: 56px minmax(0, 1fr);
  gap: 0;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

.rag-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: url("/artwork/rag-chat-background.png") center center / cover no-repeat;
  opacity: 0.18;
}

.rag-shell button,
.rag-shell textarea {
  font-family: inherit;
}

.rag-topbar,
.rag-layout {
  width: min(1600px, 100%);
  margin: 0 auto;
}

.rag-topbar {
  display: flex;
  align-items: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 14px 0 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: var(--card);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
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
  color: var(--text);
  border-color: rgba(103, 83, 49, 0.28);
  background: rgba(255, 252, 246, 0.95);
}

.rag-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
  height: 100%;
  transition: grid-template-columns 0.3s ease;
}

.rag-shell.is-retrieval-open .rag-layout {
  grid-template-columns: 280px minmax(0, 1fr) 320px;
}

.sidebar-card,
.chat-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--card);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
}

.sidebar-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 16px;
}

.sidebar-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sidebar-card__header h2 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 20px;
  letter-spacing: 0.04em;
}

.new-chat-button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-chat-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.new-chat-button:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(107, 127, 90, 0.08);
}

.sidebar-search {
  position: relative;
  margin-bottom: 14px;
}

.sidebar-search svg {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--text-muted);
  stroke-width: 2;
  stroke-linecap: round;
  transform: translateY(-50%);
  pointer-events: none;
}

.sidebar-search input {
  width: 100%;
  height: 38px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 0 12px 0 34px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;
}

.sidebar-search input:focus {
  border-color: rgba(103, 83, 49, 0.3);
}

.sidebar-search input::placeholder {
  color: var(--text-muted);
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 80px;
  color: var(--text-muted);
  font-size: 13px;
}

.panel-state--compact {
  min-height: 100px;
}

.panel-state--body {
  min-height: 100%;
}

.state-dots {
  display: flex;
  gap: 6px;
}

.state-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.state-dots span:nth-child(2) { animation-delay: 0.15s; }
.state-dots span:nth-child(3) { animation-delay: 0.3s; }

.session-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 111, 61, 0.2) transparent;
}

.session-list::-webkit-scrollbar {
  width: 4px;
}

.session-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(139, 111, 61, 0.2);
}

.session-group + .session-group {
  margin-top: 16px;
}

.session-group h3 {
  margin: 0 0 8px;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.session-group ul {
  list-style: none;
  display: grid;
  gap: 4px;
  padding: 0;
  margin: 0;
}

.session-group li {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24px;
  align-items: center;
}

.session-item {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s ease;
}

.session-item:hover {
  background: rgba(103, 83, 49, 0.06);
}

.session-item.is-active {
  border-color: rgba(107, 127, 90, 0.3);
  background: rgba(107, 127, 90, 0.08);
}

.session-item__title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  font-size: 13px;
  line-height: 1.4;
}

.session-item__time {
  display: block;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 11px;
}

.session-item__delete {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: transparent;
  cursor: pointer;
  transition: all 0.18s ease;
}

.session-item__delete svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.session-group li:hover .session-item__delete {
  color: var(--text-muted);
}

.session-item__delete:hover {
  color: #c44 !important;
  background: rgba(204, 68, 68, 0.08);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.user-pill__avatar {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7f5a, #8b9f72);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-pill__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-secondary);
  font-size: 13px;
}

.chat-card {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.chat-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-light);
}

.chat-card__header h1 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 22px;
  letter-spacing: 0.04em;
}

.chat-card__badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: var(--radius-full);
  background: rgba(107, 127, 90, 0.12);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  animation: badgePulse 2s ease-in-out infinite;
}

.notice-bar {
  margin: 0 24px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
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
  min-height: 0;
  overflow: hidden;
}

.welcome-shell {
  height: 100%;
  min-height: 0;
  padding: 40px 32px 32px;
  display: grid;
  grid-template-rows: auto 1fr;
  align-content: start;
  gap: 32px;
}

.welcome-hero {
  text-align: center;
  padding: 24px 0;
}

.welcome-hero h3 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 36px;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.welcome-hero p {
  margin: 12px 0 0;
  color: var(--text-muted);
  font-size: 15px;
  letter-spacing: 0.02em;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  max-width: 780px;
  margin: 0 auto;
  width: 100%;
}

.suggestion-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 18px 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card);
  text-align: left;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.suggestion-card:hover {
  border-color: rgba(107, 127, 90, 0.4);
  background: rgba(255, 252, 246, 0.95);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.suggestion-card__index {
  display: block;
  margin-bottom: 12px;
  color: var(--text-muted);
  font-family: var(--serif);
  font-size: 12px;
  letter-spacing: 0.06em;
}

.suggestion-card strong {
  display: block;
  color: var(--text);
  font-family: var(--serif);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.04em;
}

.suggestion-card small {
  display: block;
  margin-top: 6px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.5;
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

.message-list {
  height: 100%;
  min-height: 0;
  max-height: 100%;
  padding: 20px 24px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 111, 61, 0.15) transparent;
}

.message-list::-webkit-scrollbar {
  width: 4px;
}

.message-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(139, 111, 61, 0.15);
}

.message-row {
  display: flex;
  gap: 14px;
  margin-bottom: 20px;
  animation: messageIn 0.3s ease both;
}

.message-row--user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(103, 83, 49, 0.1);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.message-row--assistant .message-avatar {
  background: linear-gradient(135deg, #6b7f5a, #8b9f72);
  color: #fff;
}

.message-bubble {
  max-width: min(720px, 82%);
  padding: 14px 16px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--card);
  backdrop-filter: blur(6px);
}

.message-bubble--user {
  border-color: rgba(107, 127, 90, 0.2);
  background: rgba(107, 127, 90, 0.06);
}

.message-bubble__content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text);
  font-family: var(--sans);
  font-size: 14px;
  line-height: 1.7;
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

.thinking-dot--pulse {
  animation: dotPulse 1.2s ease-in-out infinite;
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
  line-height: 1.6;
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

.message-loading span:nth-child(2) { animation-delay: 0.12s; }
.message-loading span:nth-child(3) { animation-delay: 0.24s; }

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
  gap: 4px;
  margin-top: 10px;
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

.message-actions button:hover:not(:disabled) {
  color: var(--accent);
  background: rgba(107, 127, 90, 0.08);
  border-color: rgba(107, 127, 90, 0.2);
}

.message-actions button.is-active {
  color: var(--accent);
  background: rgba(107, 127, 90, 0.12);
  border-color: rgba(107, 127, 90, 0.25);
}

.message-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

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

.composer-box {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card);
  backdrop-filter: blur(8px);
  transition: border-color 0.2s ease;
}

.composer-box:focus-within {
  border-color: rgba(107, 127, 90, 0.35);
}

.composer__input {
  display: block;
  width: 100%;
  min-height: 52px;
  max-height: 120px;
  resize: none;
  border: 0;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  padding: 14px 16px 8px;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
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
  transition: all 0.2s ease;
}

.thinking-toggle.is-active .thinking-toggle__dot {
  background: var(--accent);
  box-shadow: 0 0 6px rgba(107, 127, 90, 0.4);
  animation: dotPulse 1.5s ease-in-out infinite;
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

.insight-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  animation: slideInRight 0.3s ease both;
}

.insight-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.insight-header h2 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 18px;
}

.insight-close-button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.18s ease;
}

.insight-close-button svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.insight-close-button:hover {
  color: var(--text);
  border-color: rgba(103, 83, 49, 0.3);
}

.insight-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: var(--card);
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.insight-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.insight-card h3 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 400;
}

.insight-badge {
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: rgba(103, 83, 49, 0.1);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}

.source-list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.source-list li {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.source-index {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--text);
  color: var(--bg);
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.source-info strong {
  display: block;
  overflow: hidden;
  color: var(--text);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0 0;
  color: var(--text-muted);
  font-size: 11px;
}

.source-type {
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--border);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.source-type--red { color: #a04030; border-color: rgba(160, 64, 48, 0.25); }
.source-type--blue { color: #3973b8; border-color: rgba(57, 115, 184, 0.25); }
.source-type--ink { color: var(--text-secondary); }

.citation-box {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 12px;
  background: rgba(103, 83, 49, 0.03);
}

.citation-box strong {
  display: block;
  color: var(--text);
  font-size: 13px;
  margin-bottom: 8px;
}

.citation-box p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.request-stats {
  margin: 0;
}

.request-stats div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border-light);
}

.request-stats div:last-child {
  border-bottom: 0;
}

.request-stats dt {
  color: var(--text-muted);
  font-size: 13px;
}

.request-stats dd {
  min-width: 0;
  max-width: 160px;
  margin: 0;
  overflow: hidden;
  color: var(--text);
  font-size: 13px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes messageIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 1280px) {
  .rag-layout,
  .rag-shell.is-retrieval-open .rag-layout {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .insight-stack {
    display: none;
  }

  .rag-shell.is-retrieval-open .insight-stack {
    display: flex;
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .rag-shell {
    height: auto;
    min-height: 100vh;
    overflow: auto;
    padding: 0 14px 14px;
  }

  .rag-layout,
  .rag-shell.is-retrieval-open .rag-layout,
  .insight-stack,
  .rag-shell.is-retrieval-open .insight-stack {
    grid-template-columns: 1fr;
  }

  .sidebar-card {
    max-height: 300px;
  }

  .chat-card {
    height: auto;
    min-height: calc(100vh - 100px);
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .message-avatar {
    display: none;
  }

  .message-bubble {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .rag-shell {
    padding: 0 10px 12px;
  }

  .welcome-hero h3 {
    font-size: 28px;
  }

  .chat-card__header h1 {
    font-size: 18px;
  }
}
</style>
