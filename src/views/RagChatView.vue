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
const quickActions = [
  {
    key: "summary",
    title: "内容总结",
    description: "快速提炼核心要点，生成结构化总结与摘要。"
  },
  {
    key: "tasks",
    title: "任务拆解",
    description: "将复杂任务拆解为可执行步骤，并给出优先级建议。"
  },
  {
    key: "compare",
    title: "方案对比",
    description: "对比多个方案的优势，提供清晰的对比结论。"
  }
];
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
        返回
      </button>

      <div class="rag-topbar__actions"></div>
    </header>

    <div class="rag-layout">
      <aside class="sidebar-card">
        <div class="sidebar-card__header">
          <h2>历史会话</h2>
          <button class="new-chat-button" type="button" @click="createConversation">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            新建对话
          </button>
        </div>

        <div class="sidebar-search">
          <input v-model="sessionSearch" type="search" placeholder="搜索会话标题..." />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
        </div>

        <div v-if="loadingSessions" class="panel-state">加载会话中...</div>

        <div v-else-if="filteredSessions.length === 0" class="panel-state panel-state--compact">
          暂无会话，直接在右侧开始提问。
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
                  <span class="session-item__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 6.5h14M5 12h10M5 17.5h7" />
                    </svg>
                  </span>
                  <span class="session-item__copy">
                    <strong>{{ session.title }}</strong>
                    <small>{{ activeSession?.id === session.id ? "当前会话" : "继续追问与整理" }}</small>
                  </span>
                  <time>{{ formatSessionTime(session.lastTime) }}</time>
                </button>
                <button class="session-item__delete" type="button" @click="removeSession(session.id)">
                  ×
                </button>
              </li>
            </ul>
          </section>
        </div>

        <button class="history-more-button" type="button">查看全部历史会话 →</button>

        <div class="sidebar-footer">
          <div class="rag-user rag-user--sidebar">
            <img class="rag-user__avatar" src="/rag-icons/user-avatar.svg" alt="" aria-hidden="true" />
            <strong>{{ currentUserName }}</strong>
            <span class="rag-user__chevron" aria-hidden="true">⌄</span>
          </div>
        </div>
      </aside>

      <main class="chat-card">
        <header class="chat-card__header">
          <div class="chat-title">
            <h1>对话手稿</h1>
          </div>
        </header>

        <div v-if="noticeText" :class="['notice-bar', `notice-bar--${noticeType}`]">
          {{ noticeText }}
        </div>

        <section class="chat-card__body">
          <div v-if="loadingMessages" class="panel-state panel-state--body">加载消息中...</div>

          <template v-else>
            <div v-if="!hasMessages" class="welcome-shell">
              <div class="welcome-hero">
                <div class="welcome-box">
                  <h3>今天想问点什么？</h3>
                  <p>基于知识库检索增强，提供可靠、可追溯的回答。</p>
                </div>
                <div class="welcome-figure" aria-hidden="true" />
              </div>

            </div>

            <div v-else ref="messageScrollerRef" class="message-list">
              <article
                v-for="message in messages"
                :key="message.id"
                :class="['message-row', `message-row--${message.role}`]"
              >
                <img
                  class="message-avatar"
                  :src="message.role === 'user' ? '/rag-icons/user-avatar.svg' : '/rag-icons/assistant-avatar.svg'"
                  :alt="message.role === 'user' ? '我' : 'RAG 助手'"
                />

                <div :class="['message-bubble', `message-bubble--${message.role}`]">
                  <div class="message-bubble__meta">
                    <span>{{ message.role === "user" ? "我" : "RAG 助手" }}</span>
                    <time>{{ formatSessionTime(message.createdAt) }}</time>
                  </div>

                  <details
                    v-if="message.role === 'assistant' && message.thinking"
                    class="thinking-panel"
                  >
                    <summary>
                      <span>深度思考</span>
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
          <div v-if="thinkingMessage" class="thinking-tip">深度思考中，正在生成推理内容...</div>

          <div class="composer-box">
            <div class="composer-input-shell">
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
            </div>

            <div class="composer__footer">
              <div class="composer-tools">
                <button
                  type="button"
                  :class="['thinking-toggle', 'composer-thinking-toggle', { 'is-active': deepThinkingEnabled }]"
                  :disabled="isStreaming"
                  @click="deepThinkingEnabled = !deepThinkingEnabled"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 3a4 4 0 0 0-4 4v2.5A3.5 3.5 0 0 0 6.5 16H7v2a3 3 0 0 0 5 2.24A3 3 0 0 0 17 18v-2h.5A3.5 3.5 0 0 0 19 9.5V7a4 4 0 0 0-4-4 3.98 3.98 0 0 0-3 1.36A3.98 3.98 0 0 0 9 3Z" />
                    <path d="M12 4.36v15.88" />
                  </svg>
                  深度思考
                </button>
              </div>

              <div class="composer-actions">
                <button class="send-button" :class="{ 'is-stop': isStreaming }" type="button" @click="sendMessage">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <aside v-if="showRetrievalPanel" class="insight-stack" aria-label="检索信息">
        <button class="insight-close-button" type="button" aria-label="关闭检索信息" @click="closeRetrievalPanel">
          ×
        </button>
        <section class="insight-card insight-card--sources">
          <header>
            <h2>检索来源</h2>
            <span>{{ retrievalSources.length + 1 }}</span>
          </header>
          <ol class="source-list">
            <li v-for="(source, index) in retrievalSources" :key="source.title">
              <span class="source-index">{{ index + 1 }}</span>
              <div>
                <strong>{{ source.title }}</strong>
                <p>
                  <span :class="['source-type', `source-type--${source.tone}`]">{{ source.type }}</span>
                  <small>相似度 {{ source.score }}</small>
                  <small>{{ source.page }}</small>
                </p>
              </div>
              <button type="button" title="打开来源">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 4h6v6M10 14 20 4M20 14v6H4V4h6" />
                </svg>
              </button>
            </li>
          </ol>
          <button class="panel-link-button" type="button">查看更多来源 →</button>
        </section>

        <section class="insight-card">
          <header>
            <h2>引用片段</h2>
          </header>
          <div class="citation-box">
            <strong>检索增强生成（RAG）综述.pdf · P.12</strong>
            <p>{{ citationSnippet }}</p>
          </div>
          <button class="panel-link-button" type="button">查看原文 →</button>
        </section>

        <section class="insight-card">
          <header>
            <h2>本次请求</h2>
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
  height: 100vh;
  padding: 12px 16px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(240, 245, 255, 0.95), rgba(250, 250, 250, 1)),
    #fafafa;
  color: #1f2937;
}

.rag-shell button,
.rag-shell textarea {
  font: inherit;
}

.rag-topbar,
.rag-layout {
  width: min(1440px, 100%);
  margin: 0 auto;
}

.rag-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.rag-brand,
.rag-topbar__actions,
.rag-user {
  display: flex;
  align-items: center;
}

.rag-brand {
  gap: 12px;
}

.rag-brand__logo {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #7c8fd8, #8fd3f4 70%, #f6b7a7);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
}

.rag-brand strong,
.rag-brand span {
  display: block;
}

.rag-brand strong {
  font-size: 20px;
}

.rag-brand span,
.rag-user small,
.chat-card__desc,
.session-item span,
.suggestion-card small,
.suggestion-card span,
.message-bubble__meta,
.composer__hint,
.sidebar-card__search {
  color: #6b7280;
}

.rag-topbar__actions {
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ghost-button,
.new-chat-button,
.thinking-toggle,
.send-button,
.message-actions button {
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.ghost-button {
  height: 36px;
  padding: 0 14px;
  background: #fff;
  color: #1f2937;
  cursor: pointer;
}

.ghost-button:hover {
  border-color: #93c5fd;
  color: #2563eb;
}

.ghost-button--danger:hover {
  border-color: #fecaca;
  color: #dc2626;
}

.rag-user {
  gap: 10px;
  min-height: 36px;
  padding: 3px 10px 3px 3px;
  border: 1px solid #dbe4ee;
  border-radius: 999px;
  background: #fff;
}

.rag-user__avatar,
.message-avatar {
  display: grid;
  place-items: center;
  font-weight: 700;
}

.rag-user__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #111827;
  color: #fff;
}

.rag-user strong {
  display: block;
  font-size: 13px;
}

.rag-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
  height: 100%;
}

.sidebar-card,
.chat-card {
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.sidebar-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 14px;
}

.sidebar-card__header,
.chat-card__header,
.composer__footer,
.message-bubble__meta,
.message-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sidebar-card__header h2,
.chat-card__header h1,
.welcome-box h3 {
  margin: 0;
  color: #111827;
}

.sidebar-card__label,
.chat-card__label {
  margin: 0 0 6px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar-card__header h2 {
  font-size: 22px;
}

.new-chat-button {
  height: 32px;
  padding: 0 12px;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

.new-chat-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.sidebar-card__search {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding: 10px 0 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 12px;
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 84px;
  color: #6b7280;
  text-align: center;
}

.panel-state--compact {
  min-height: 120px;
}

.panel-state--body {
  min-height: 100%;
}

.session-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
  overflow: auto;
}

.session-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.session-item {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 14px;
  background: #fafafa;
  text-align: left;
  cursor: pointer;
}

.session-item:hover {
  background: #f5f7fb;
}

.session-item.is-active {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.session-item strong,
.session-item span {
  display: block;
}

.session-item strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #111827;
  font-size: 14px;
}

.session-item span {
  margin-top: 4px;
  font-size: 12px;
}

.session-item__delete {
  border: 0;
  background: transparent;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
}

.session-item__delete:hover {
  color: #ef4444;
}

.chat-card {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.chat-card__header {
  padding: 18px 18px 14px;
  border-bottom: 1px solid #f3f4f6;
}

.chat-card__header h1 {
  font-size: 24px;
  line-height: 1.2;
}

.chat-card__desc {
  margin: 6px 0 0;
  line-height: 1.45;
  font-size: 13px;
}

.thinking-toggle {
  min-height: 36px;
  padding: 0 12px;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
}

.thinking-toggle.is-active {
  border-color: #bfdbfe;
  background: #dbeafe;
  color: #2563eb;
}

.thinking-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.notice-bar {
  margin: 8px 18px 0;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
}

.notice-bar--info {
  background: #eff6ff;
  color: #1d4ed8;
}

.notice-bar--success {
  background: #ecfdf5;
  color: #047857;
}

.notice-bar--error {
  background: #fef2f2;
  color: #dc2626;
}

.chat-card__body {
  min-height: 0;
  background: #fff;
}

.welcome-shell {
  height: 100%;
  min-height: 0;
  padding: 18px;
  display: grid;
  align-content: center;
  gap: 16px;
}

.welcome-box {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.welcome-box h3 {
  font-size: 30px;
  letter-spacing: -0.04em;
}

.welcome-box p {
  margin: 10px 0 0;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.suggestion-card {
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.suggestion-card:hover {
  transform: translateY(-2px);
  border-color: #bfdbfe;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.08);
}

.suggestion-card strong,
.suggestion-card small,
.suggestion-card span {
  display: block;
}

.suggestion-card strong {
  color: #111827;
  font-size: 16px;
}

.suggestion-card small {
  margin-top: 4px;
  font-size: 12px;
}

.suggestion-card span {
  margin-top: 10px;
  color: #374151;
  font-size: 12px;
  line-height: 1.5;
}

.message-list {
  height: 100%;
  min-height: 0;
  max-height: 100%;
  padding: 16px 18px;
  overflow-y: auto;
  background: #fff;
}

.message-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-row--user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #374151;
  font-size: 11px;
}

.message-row--assistant .message-avatar {
  background: #dbeafe;
  color: #2563eb;
}

.message-bubble {
  max-width: min(820px, 88%);
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.message-bubble--user {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.message-bubble__meta {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
}

.message-bubble__content,
.thinking-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #1f2937;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.65;
}

.thinking-panel {
  margin: 0 0 10px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fbff;
}

.thinking-panel summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  color: #2563eb;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.thinking-panel pre {
  padding: 0 12px 12px;
  color: #1d4ed8;
  font-size: 12px;
}

.message-loading {
  display: inline-flex;
  gap: 6px;
  margin-bottom: 8px;
}

.message-loading span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  animation: dotBounce 0.9s ease-in-out infinite;
}

.message-loading span:nth-child(2) {
  animation-delay: 0.15s;
}

.message-loading span:nth-child(3) {
  animation-delay: 0.3s;
}

.message-bubble__status {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 12px;
}

.message-bubble__status--error {
  color: #dc2626;
}

.message-actions {
  flex-wrap: wrap;
  margin-top: 10px;
}

.message-actions button {
  height: 28px;
  padding: 0 10px;
  background: #fff;
  color: #6b7280;
  font-size: 12px;
  cursor: pointer;
}

.message-actions button:hover:not(:disabled),
.message-actions button.is-active {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #2563eb;
}

.message-actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.composer {
  padding: 12px 16px 14px;
  border-top: 1px solid #f3f4f6;
  background: #fff;
}

.thinking-tip {
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 12px;
}

.composer__input {
  width: 100%;
  min-height: 48px;
  max-height: 120px;
  resize: none;
  border: 1px solid #dbe4ee;
  border-radius: 14px;
  padding: 12px 14px;
  background: #fff;
  color: #111827;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.composer__input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.18);
}

.composer__footer {
  margin-top: 10px;
}

.composer__hint {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
}

.send-button {
  min-width: 108px;
  height: 36px;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

.send-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.send-button.is-stop {
  background: #dc2626;
  border-color: #dc2626;
}

/* 水墨主题覆盖 */
.rag-shell {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(circle at 12% 8%, rgba(36, 64, 52, 0.16), transparent 24%),
    radial-gradient(circle at 88% 12%, rgba(142, 116, 66, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(255, 252, 243, 0.96), rgba(238, 234, 218, 0.9)),
    #f7f1e2;
  color: #243028;
}

.rag-shell::before,
.rag-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.rag-shell::before {
  background:
    linear-gradient(90deg, rgba(36, 48, 40, 0.04) 1px, transparent 1px),
    linear-gradient(180deg, rgba(36, 48, 40, 0.035) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 78%);
}

.rag-shell::after {
  background:
    radial-gradient(ellipse at 4% 92%, rgba(20, 25, 22, 0.18), transparent 32%),
    radial-gradient(ellipse at 96% 76%, rgba(73, 94, 80, 0.13), transparent 26%);
  filter: blur(16px);
  opacity: 0.8;
}

.rag-topbar,
.rag-layout {
  position: relative;
  z-index: 1;
}

.rag-brand__logo,
.rag-user__avatar {
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.55), transparent 24%),
    linear-gradient(135deg, #1f2f29, #5d725f);
  box-shadow: 0 10px 26px rgba(31, 47, 41, 0.24);
}

.rag-brand strong,
.sidebar-card__header h2,
.chat-card__header h1,
.welcome-box h3,
.session-item strong,
.suggestion-card strong {
  color: #1f2f29;
  font-family: "STKaiti", "KaiTi", "Microsoft YaHei", serif;
  letter-spacing: 0.03em;
}

.rag-brand span,
.rag-user small,
.chat-card__desc,
.session-item span,
.suggestion-card small,
.suggestion-card span,
.message-bubble__meta,
.composer__hint,
.sidebar-card__search,
.panel-state,
.welcome-box p {
  color: #6f695d;
}

.sidebar-card,
.chat-card,
.rag-user,
.ghost-button,
.suggestion-card,
.message-bubble,
.composer__input {
  border-color: rgba(70, 76, 61, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 253, 247, 0.88), rgba(246, 240, 225, 0.78)),
    rgba(255, 252, 243, 0.86);
  box-shadow:
    0 18px 48px rgba(50, 42, 28, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(14px);
}

.sidebar-card,
.chat-card {
  border-radius: 28px;
}

.sidebar-card__label,
.chat-card__label {
  color: #8b6f3d;
  letter-spacing: 0.2em;
}

.new-chat-button,
.send-button {
  border-color: #243028;
  background: linear-gradient(135deg, #18231f, #536656);
  color: #fffaf0;
  box-shadow: 0 12px 26px rgba(31, 47, 41, 0.18);
}

.new-chat-button:hover,
.send-button:hover {
  border-color: #6f7f63;
  background: linear-gradient(135deg, #243028, #6f7f63);
}

.ghost-button:hover,
.thinking-toggle:hover,
.message-actions button:hover:not(:disabled) {
  border-color: #8b6f3d;
  color: #4d5d4f;
  background: rgba(255, 249, 235, 0.78);
}

.ghost-button--danger:hover,
.send-button.is-stop {
  border-color: #8f3a32;
  background: #8f3a32;
  color: #fff9eb;
}

.session-item {
  border-color: rgba(70, 76, 61, 0.1);
  background: rgba(255, 250, 238, 0.64);
}

.session-item:hover {
  background: rgba(239, 230, 205, 0.62);
}

.session-item.is-active {
  border-color: rgba(93, 114, 95, 0.42);
  background:
    linear-gradient(90deg, rgba(93, 114, 95, 0.18), rgba(255, 250, 238, 0.78));
}

.chat-card__header,
.composer,
.sidebar-card__search {
  border-color: rgba(70, 76, 61, 0.14);
}

.chat-card__body,
.message-list {
  background:
    radial-gradient(circle at 18% 12%, rgba(93, 114, 95, 0.08), transparent 24%),
    rgba(255, 252, 243, 0.38);
}

.thinking-toggle {
  border-color: rgba(93, 114, 95, 0.22);
  background: rgba(255, 250, 238, 0.72);
  color: #4d5d4f;
}

.thinking-toggle.is-active,
.message-actions button.is-active {
  border-color: rgba(139, 111, 61, 0.44);
  background: rgba(229, 216, 181, 0.52);
  color: #6f4f1f;
}

.notice-bar--info {
  background: rgba(229, 216, 181, 0.48);
  color: #5b513e;
}

.notice-bar--success {
  background: rgba(213, 227, 207, 0.64);
  color: #36543d;
}

.notice-bar--error {
  background: rgba(245, 218, 210, 0.68);
  color: #8f3a32;
}

.suggestion-card:hover {
  border-color: rgba(139, 111, 61, 0.46);
  box-shadow: 0 18px 38px rgba(50, 42, 28, 0.14);
}

.message-avatar {
  background: rgba(229, 216, 181, 0.72);
  color: #4a3f2c;
}

.message-row--assistant .message-avatar {
  background: #243028;
  color: #fff9eb;
}

.message-bubble {
  border-radius: 20px 20px 20px 6px;
}

.message-bubble--user {
  border-color: rgba(93, 114, 95, 0.42);
  border-radius: 20px 20px 6px 20px;
  background:
    linear-gradient(135deg, rgba(219, 232, 209, 0.82), rgba(249, 244, 231, 0.9));
}

.message-bubble__content,
.thinking-panel pre {
  color: #28322b;
}

.thinking-panel {
  border-color: rgba(93, 114, 95, 0.28);
  background: rgba(247, 241, 226, 0.82);
}

.thinking-panel summary,
.thinking-panel pre,
.thinking-tip {
  color: #4d5d4f;
}

.message-loading span {
  background: #6f7f63;
}

.message-actions button {
  border-color: rgba(70, 76, 61, 0.16);
  background: rgba(255, 252, 243, 0.72);
  color: #6f695d;
}

.composer {
  background:
    linear-gradient(180deg, rgba(255, 252, 243, 0.8), rgba(241, 233, 214, 0.84));
}

.composer__input {
  color: #1f2f29;
  caret-color: #6f4f1f;
}

.composer__input:focus {
  border-color: rgba(139, 111, 61, 0.56);
  box-shadow: 0 0 0 4px rgba(139, 111, 61, 0.12);
}

/* 中式美学强化：山水、云纹、朱印、竹影 */
.chinoiserie-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.ink-sun {
  position: absolute;
  top: 86px;
  right: 12%;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 34%, rgba(255, 238, 199, 0.9), rgba(178, 65, 49, 0.52) 58%, transparent 62%);
  opacity: 0.72;
  filter: blur(0.3px);
}

.ink-mountain {
  position: absolute;
  bottom: -36px;
  width: 48vw;
  height: 220px;
  opacity: 0.42;
  filter: blur(1px);
  background:
    radial-gradient(ellipse at 18% 72%, rgba(31, 47, 41, 0.38), transparent 36%),
    radial-gradient(ellipse at 48% 68%, rgba(74, 93, 76, 0.34), transparent 42%),
    radial-gradient(ellipse at 78% 78%, rgba(20, 25, 22, 0.28), transparent 34%);
}

.ink-mountain--left {
  left: -10vw;
}

.ink-mountain--right {
  right: -12vw;
  transform: scaleX(-1) translateY(-8px);
  opacity: 0.34;
}

.cloud-ribbon {
  position: absolute;
  width: 260px;
  height: 82px;
  border: 1px solid rgba(139, 111, 61, 0.28);
  border-left: 0;
  border-right: 0;
  opacity: 0.48;
}

.cloud-ribbon::before,
.cloud-ribbon::after {
  content: "";
  position: absolute;
  border: 1px solid rgba(139, 111, 61, 0.28);
  border-radius: 999px;
}

.cloud-ribbon::before {
  width: 92px;
  height: 34px;
  left: 22px;
  top: 18px;
}

.cloud-ribbon::after {
  width: 134px;
  height: 42px;
  right: 28px;
  bottom: 12px;
}

.cloud-ribbon--top {
  top: 120px;
  left: 8%;
}

.cloud-ribbon--bottom {
  right: 9%;
  bottom: 126px;
  transform: scaleX(-1);
}

.bamboo-shadow {
  position: absolute;
  left: 24px;
  top: 12%;
  width: 132px;
  height: 72%;
  opacity: 0.24;
  background:
    linear-gradient(88deg, transparent 0 42px, rgba(31, 47, 41, 0.5) 43px 46px, transparent 47px),
    linear-gradient(84deg, transparent 0 72px, rgba(31, 47, 41, 0.38) 73px 76px, transparent 77px),
    radial-gradient(ellipse at 64px 90px, rgba(31, 47, 41, 0.36) 0 12px, transparent 13px),
    radial-gradient(ellipse at 88px 170px, rgba(31, 47, 41, 0.32) 0 14px, transparent 15px),
    radial-gradient(ellipse at 54px 258px, rgba(31, 47, 41, 0.28) 0 12px, transparent 13px);
  filter: blur(0.4px);
}

.rag-brand {
  position: relative;
}

.rag-brand__seal {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-left: -6px;
  border: 2px solid rgba(153, 39, 30, 0.82);
  border-radius: 7px;
  color: #9a2f28;
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  transform: rotate(-8deg);
  background: rgba(255, 245, 225, 0.68);
}

.sidebar-card,
.chat-card {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
}

.sidebar-card::before,
.chat-card::before,
.suggestion-card::before,
.overview-scroll-line {
  content: "";
  position: absolute;
  pointer-events: none;
}

.sidebar-card::before,
.chat-card::before {
  inset: 10px;
  border: 1px solid rgba(139, 111, 61, 0.18);
  border-radius: 24px;
}

.chat-card::after {
  content: "问";
  position: absolute;
  right: 26px;
  bottom: 88px;
  color: rgba(154, 47, 40, 0.08);
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 132px;
  line-height: 1;
  pointer-events: none;
}

.suggestion-card {
  position: relative;
  overflow: hidden;
}

.suggestion-card::before {
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(154, 47, 40, 0.28);
  border-radius: 9px;
  transform: rotate(8deg);
}

.welcome-box h3::after {
  content: "｜松风入砚";
  margin-left: 10px;
  color: #9a2f28;
  font-size: 18px;
  letter-spacing: 0.08em;
}

.message-bubble--assistant {
  background:
    linear-gradient(135deg, rgba(255, 253, 247, 0.92), rgba(238, 230, 207, 0.78)),
    repeating-linear-gradient(135deg, rgba(139, 111, 61, 0.035) 0 1px, transparent 1px 8px);
}

.message-row--assistant .message-bubble {
  border-left: 4px solid rgba(139, 111, 61, 0.42);
}

.message-row--user .message-bubble {
  border-right: 4px solid rgba(93, 114, 95, 0.42);
}

/* 诗意网页质感：更接近视频里的留白、宣纸、缓动 */
.rag-shell {
  padding: 0 0 14px;
}

.rag-topbar {
  width: min(1620px, calc(100% - 64px));
  min-height: 82px;
}

.rag-layout {
  width: min(1620px, calc(100% - 64px));
  gap: 20px;
}

.rag-brand__logo {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  font-size: 22px;
}

.rag-brand strong {
  font-size: 22px;
}

.ghost-button {
  min-width: 76px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 250, 238, 0.78);
  color: #25362d;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.rag-user {
  min-height: 44px;
  border-radius: 999px;
  background: rgba(255, 250, 238, 0.74);
}

.sidebar-card,
.chat-card {
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.68), transparent 38%),
    linear-gradient(180deg, rgba(255, 253, 247, 0.94), rgba(246, 240, 225, 0.86));
}

.sidebar-card {
  padding: 18px;
}

.chat-card__header {
  padding: 22px 22px 16px;
}

.welcome-shell {
  min-height: 430px;
}

.welcome-box h3 {
  font-size: 34px;
}

.composer__input {
  min-height: 78px;
  border-radius: 18px;
  font-size: 17px;
  box-shadow:
    inset 0 0 0 1px rgba(139, 111, 61, 0.08),
    0 12px 30px rgba(50, 42, 28, 0.06);
}

.send-button {
  min-width: 126px;
  height: 42px;
  border-radius: 14px;
  font-size: 16px;
}

.ink-sun {
  animation: poeticSun 8s ease-in-out infinite;
}

.cloud-ribbon--top {
  animation: poeticCloud 16s ease-in-out infinite alternate;
}

.cloud-ribbon--bottom {
  animation: poeticCloudReverse 18s ease-in-out infinite alternate;
}

.ink-mountain--left {
  animation: inkFloat 12s ease-in-out infinite alternate;
}

.ink-mountain--right {
  animation: inkFloat 14s ease-in-out infinite alternate-reverse;
}

.session-list,
.message-list {
  scrollbar-color: rgba(139, 111, 61, 0.34) transparent;
  scrollbar-width: thin;
}

.session-list::-webkit-scrollbar,
.message-list::-webkit-scrollbar {
  width: 8px;
}

.session-list::-webkit-scrollbar-thumb,
.message-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(139, 111, 61, 0.34);
}

@keyframes poeticSun {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.62;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.78;
  }
}

@keyframes poeticCloud {
  from {
    transform: translateX(-16px);
  }
  to {
    transform: translateX(26px);
  }
}

@keyframes poeticCloudReverse {
  from {
    transform: scaleX(-1) translateX(-22px);
  }
  to {
    transform: scaleX(-1) translateX(18px);
  }
}

@keyframes inkFloat {
  from {
    filter: blur(1px);
  }
  to {
    filter: blur(2px);
    opacity: 0.46;
  }
}

@keyframes dotBounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (max-width: 1080px) {
  .rag-shell {
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }

  .rag-layout {
    grid-template-columns: 1fr;
    height: auto;
  }

  .sidebar-card {
    max-height: none;
    height: auto;
  }

  .session-list {
    max-height: 280px;
  }

  .chat-card {
    height: auto;
    min-height: calc(100vh - 110px);
  }
}

@media (max-width: 768px) {
  .rag-shell {
    padding: 12px;
  }

  .rag-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .rag-topbar__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .chat-card__header,
  .composer__footer {
    align-items: flex-start;
    flex-direction: column;
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

  .send-button {
    width: 100%;
  }
}

/* Prototype alignment overrides */
.rag-shell {
  height: 100vh;
  padding: 0 24px 24px;
  grid-template-rows: 76px minmax(0, 1fr);
  gap: 0;
  overflow: hidden;
  background:
    linear-gradient(90deg, rgba(116, 92, 54, 0.045) 1px, transparent 1px),
    linear-gradient(180deg, rgba(116, 92, 54, 0.04) 1px, transparent 1px),
    url("/artwork/workbench-person-rag.png"),
    #f5ecdc;
  background-size: 28px 28px, 28px 28px, auto 118%;
  background-position: 0 0, 0 0, right 40% center;
  background-repeat: repeat, repeat, no-repeat;
  color: #26352e;
}

.rag-shell::before {
  background:
    linear-gradient(90deg, rgba(255, 250, 239, 0.88), rgba(255, 250, 239, 0.56) 42%, rgba(255, 250, 239, 0.42)),
    radial-gradient(ellipse at 5% 86%, rgba(57, 75, 64, 0.12), transparent 34%);
  mask-image: none;
}

.rag-shell::after {
  display: none;
}

.rag-topbar,
.rag-layout {
  width: min(1780px, 100%);
}

.rag-topbar {
  min-height: 76px;
  padding: 0;
}

.rag-brand {
  gap: 10px;
}

.rag-brand__logo {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  object-fit: contain;
  box-shadow: 0 12px 24px rgba(32, 50, 42, 0.18);
}

.rag-brand__seal {
  width: 44px;
  height: 44px;
  margin: 0 8px 0 0;
  object-fit: contain;
  transform: none;
  border: 0;
  background: transparent;
}

.rag-brand strong {
  font-size: 25px;
  line-height: 1.15;
}

.rag-brand span {
  margin-top: 4px;
  font-size: 15px;
}

.rag-topbar__actions {
  gap: 14px;
}

.ghost-button {
  min-width: 86px;
  height: 42px;
  padding: 0 22px;
  border: 1px solid rgba(102, 86, 60, 0.2);
  border-radius: 999px;
  background: rgba(255, 251, 243, 0.72);
  color: #26352e;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 10px 20px rgba(70, 55, 31, 0.06);
}

.rag-user {
  min-height: 44px;
  gap: 8px;
  padding: 4px 14px 4px 4px;
  border: 1px solid rgba(102, 86, 60, 0.2);
  background: rgba(255, 251, 243, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 10px 20px rgba(70, 55, 31, 0.06);
}

.rag-user__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: contain;
  box-shadow: none;
}

.rag-user strong {
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #26352e;
  font-size: 15px;
}

.rag-user__chevron {
  color: #6f695d;
  font-size: 18px;
  line-height: 1;
}

.rag-layout {
  height: 100%;
  min-height: 0;
  grid-template-columns: 340px minmax(680px, 1fr) 340px;
  gap: 18px;
}

.sidebar-card,
.chat-card,
.insight-card {
  border: 1px solid rgba(103, 83, 49, 0.22);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.84), rgba(247, 239, 223, 0.76)),
    rgba(255, 250, 239, 0.78);
  box-shadow: 0 16px 34px rgba(62, 47, 24, 0.08), inset 0 1px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.sidebar-card::before,
.chat-card::before,
.chat-card::after,
.suggestion-card::before {
  display: none;
}

.sidebar-card {
  padding: 16px;
  border-radius: 14px;
}

.sidebar-card__header {
  align-items: center;
  margin-bottom: 14px;
}

.sidebar-card__header h2,
.chat-title h1,
.insight-card h2 {
  margin: 0;
  color: #26352e;
  font-family: "STKaiti", "KaiTi", "Microsoft YaHei", serif;
  letter-spacing: 0.04em;
}

.sidebar-card__header h2 {
  font-size: 23px;
}

.new-chat-button {
  height: 36px;
  gap: 8px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: 0 10px 20px rgba(32, 50, 42, 0.16);
}

.new-chat-button svg,
.ghost-button svg,
.thinking-toggle svg,
.suggestion-card svg,
.composer-tools svg,
.composer-actions svg,
.message-actions svg,
.source-list svg,
.sidebar-search svg,
.session-item svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar-search {
  position: relative;
  margin-bottom: 16px;
}

.sidebar-search input {
  width: 100%;
  height: 42px;
  border: 1px solid rgba(103, 83, 49, 0.17);
  border-radius: 8px;
  padding: 0 44px 0 14px;
  background: rgba(255, 251, 243, 0.64);
  color: #26352e;
  outline: 0;
}

.sidebar-search input:focus {
  border-color: rgba(35, 67, 59, 0.45);
  box-shadow: 0 0 0 3px rgba(35, 67, 59, 0.09);
}

.sidebar-search svg {
  position: absolute;
  right: 14px;
  top: 50%;
  color: #687164;
  transform: translateY(-50%);
}

.session-list {
  margin: 0;
  display: block;
  min-height: 0;
  padding-right: 2px;
  overflow: auto;
}

.session-group + .session-group {
  margin-top: 18px;
}

.session-group h3 {
  margin: 0 0 8px;
  color: #6f695d;
  font-size: 14px;
  font-weight: 500;
}

.session-group ul {
  list-style: none;
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.session-group li {
  position: relative;
}

.session-item {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 70px;
  padding: 11px 12px;
  border: 1px solid rgba(103, 83, 49, 0.13);
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.56);
  color: #26352e;
}

.session-item:hover {
  background: rgba(247, 239, 223, 0.72);
}

.session-item.is-active {
  border-color: rgba(35, 67, 59, 0.45);
  background: linear-gradient(90deg, rgba(35, 67, 59, 0.12), rgba(255, 251, 243, 0.72));
  box-shadow: inset 4px 0 #24433b;
}

.session-item__icon {
  color: #344c42;
}

.session-item__copy {
  min-width: 0;
}

.session-item strong,
.session-item small,
.session-item time {
  display: block;
}

.session-item strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #26352e;
  font-size: 15px;
}

.session-item small {
  overflow: hidden;
  margin-top: 6px;
  color: #7d776c;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item time {
  align-self: start;
  color: #7d776c;
  font-size: 13px;
}

.session-item__delete {
  position: absolute;
  right: 8px;
  bottom: 7px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  opacity: 0;
  color: #9a3a31;
}

.session-group li:hover .session-item__delete {
  opacity: 1;
}

.history-more-button,
.panel-link-button {
  width: 100%;
  min-height: 36px;
  border: 1px solid rgba(103, 83, 49, 0.14);
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.58);
  color: #4b4b40;
  cursor: pointer;
}

.history-more-button {
  margin-top: 14px;
}

.chat-card {
  border-radius: 14px;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
}

.chat-card__header {
  position: relative;
  grid-template-columns: 1fr auto 1fr;
  display: grid;
  align-items: center;
  min-height: 76px;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(103, 83, 49, 0.12);
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-title h1 {
  font-size: 30px;
}

.chat-title span {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border: 2px solid rgba(154, 47, 40, 0.72);
  border-radius: 6px;
  color: #9a2f28;
  font-family: "STKaiti", "KaiTi", serif;
  font-weight: 800;
}

.workbench-tabs {
  justify-self: center;
  display: flex;
  padding: 3px;
  border: 1px solid rgba(103, 83, 49, 0.13);
  border-radius: 999px;
  background: rgba(255, 251, 243, 0.52);
}

.workbench-tabs button {
  min-width: 104px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #6f695d;
  cursor: pointer;
}

.workbench-tabs button.is-active {
  background: #24433b;
  color: #fff9eb;
  box-shadow: 0 8px 18px rgba(35, 67, 59, 0.18);
}

.thinking-toggle {
  justify-self: end;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.62);
}

.chat-card__body {
  min-height: 0;
  background: transparent;
}

.welcome-shell {
  height: 100%;
  min-height: 0;
  align-content: start;
  padding: 0 24px 18px;
  gap: 18px;
}

.welcome-hero {
  position: relative;
  min-height: 250px;
  display: grid;
  align-items: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(103, 83, 49, 0.1);
}

.welcome-figure {
  position: absolute;
  right: 18px;
  bottom: -54px;
  width: min(390px, 42%);
  aspect-ratio: 2334 / 4069;
  background: url("/artwork/workbench-person-rag.png") center bottom / contain no-repeat;
  opacity: 0.68;
  filter: sepia(0.12) saturate(0.82);
}

.welcome-box {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0;
  padding-left: 8%;
  text-align: left;
}

.welcome-box h3 {
  color: #21463d;
  font-size: 42px;
  letter-spacing: 0.08em;
}

.welcome-box h3::after {
  content: "";
}

.welcome-box p {
  margin-top: 16px;
  color: #7a756a;
  font-size: 16px;
}

.suggestions-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.suggestion-card {
  position: relative;
  min-height: 150px;
  padding: 20px 18px;
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.66);
}

.suggestion-card__icon {
  display: block;
  margin-bottom: 14px;
  color: #24433b;
}

.suggestion-card__icon svg {
  width: 30px;
  height: 30px;
}

.suggestion-card strong {
  color: #26352e;
  font-size: 18px;
}

.suggestion-card small {
  margin-top: 10px;
  color: #5d5b51;
  line-height: 1.7;
}

.suggestion-card__arrow {
  position: absolute;
  right: 16px;
  bottom: 14px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(103, 83, 49, 0.18);
  border-radius: 50%;
  color: #516255;
  font-size: 18px;
}

.message-list {
  height: 100%;
  padding: 18px 24px;
  background: transparent;
}

.message-row {
  margin-bottom: 14px;
}

.message-row--user {
  flex-direction: row;
}

.message-avatar {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 50%;
  object-fit: contain;
}

.message-bubble {
  max-width: min(760px, 88%);
  padding: 13px 16px;
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.66);
}

.message-bubble--user {
  border-color: rgba(103, 83, 49, 0.15);
  background: rgba(255, 251, 243, 0.7);
}

.message-row--assistant .message-bubble {
  border-left: 0;
}

.message-row--user .message-bubble {
  border-right: 0;
}

.message-bubble__meta {
  font-size: 13px;
}

.message-bubble__content {
  color: #2f302a;
  font-size: 15px;
}

.message-actions {
  justify-content: flex-end;
  gap: 8px;
}

.message-actions button {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 6px;
}

.composer {
  padding: 0 10px 8px;
  border-top: 0;
  background: transparent;
}

.composer-box {
  padding: 14px;
  border: 1px solid rgba(103, 83, 49, 0.16);
  border-radius: 12px;
  background: rgba(255, 251, 243, 0.66);
}

.composer__input {
  min-height: 54px;
  max-height: 104px;
  padding: 6px 8px 8px;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  font-size: 17px;
}

.composer__input:focus {
  box-shadow: none;
}

.composer__footer {
  margin-top: 10px;
  align-items: center;
}

.composer-tools,
.composer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.composer-tools button,
.composer-actions button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(103, 83, 49, 0.16);
  border-radius: 8px;
  background: rgba(255, 251, 243, 0.82);
  color: #34423b;
  cursor: pointer;
}

.composer-tools button {
  padding: 0 12px;
}

.composer-actions button {
  width: 42px;
  justify-content: center;
  padding: 0;
}

.tool-switch {
  width: 32px;
  height: 20px;
  border-radius: 999px;
  background: #e9dfcc;
  box-shadow: inset 12px 0 #fffaf0, inset 0 0 0 1px rgba(103, 83, 49, 0.16);
}

.composer-actions .send-button {
  width: auto;
  min-width: 132px;
  padding: 0 20px;
  justify-content: center;
  border-radius: 8px;
}

.composer__hint {
  margin: 7px 0 0 6px;
  gap: 14px;
  color: #7a756a;
  font-size: 12px;
}

.insight-stack {
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1.35fr) auto auto;
  gap: 14px;
}

.insight-card {
  min-height: 0;
  padding: 14px;
  overflow: hidden;
}

.insight-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.insight-card h2 {
  font-size: 20px;
}

.insight-card header span {
  display: grid;
  place-items: center;
  min-width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(103, 83, 49, 0.12);
  color: #6a5a3e;
}

.source-list {
  display: grid;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto;
}

.source-list li {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 24px;
  gap: 10px;
  align-items: start;
}

.source-index {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #635b4a;
  color: #fffaf0;
  font-size: 13px;
  font-weight: 700;
}

.source-list li:nth-child(1) .source-index,
.source-list li:nth-child(4) .source-index {
  background: #8f3a32;
}

.source-list strong {
  display: block;
  overflow: hidden;
  color: #38372f;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-list p {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 0;
  color: #7a756a;
  font-size: 12px;
}

.source-type {
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px solid rgba(103, 83, 49, 0.2);
  background: rgba(255, 251, 243, 0.62);
}

.source-type--red {
  border-color: rgba(143, 58, 50, 0.28);
  color: #9a3a31;
}

.source-type--blue {
  border-color: rgba(57, 115, 184, 0.28);
  color: #3973b8;
}

.source-list button {
  border: 0;
  background: transparent;
  color: #34423b;
  cursor: pointer;
}

.panel-link-button {
  margin-top: 14px;
}

.citation-box {
  border: 1px solid rgba(103, 83, 49, 0.14);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 251, 243, 0.5);
}

.citation-box strong {
  display: block;
  color: #4d4b42;
  font-size: 14px;
}

.citation-box p {
  margin: 10px 0 0;
  color: #6c675c;
  font-size: 14px;
  line-height: 1.65;
}

.request-stats {
  margin: 0;
}

.request-stats div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(103, 83, 49, 0.12);
}

.request-stats div:last-child {
  border-bottom: 0;
}

.request-stats dt {
  color: #6f695d;
  font-size: 14px;
}

.request-stats dd {
  min-width: 0;
  max-width: 190px;
  margin: 0;
  overflow: hidden;
  color: #4a493f;
  font-size: 14px;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1280px) {
  .rag-shell {
    height: auto;
    min-height: 100vh;
    padding: 0 18px 18px;
    overflow: auto;
  }

  .rag-layout {
    grid-template-columns: 300px minmax(0, 1fr);
    height: auto;
  }

  .insight-stack {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: auto;
  }
}

@media (max-width: 900px) {
  .rag-topbar {
    min-height: auto;
    padding: 14px 0;
    align-items: flex-start;
    flex-direction: column;
  }

  .rag-layout,
  .insight-stack {
    grid-template-columns: 1fr;
  }

  .chat-card__header {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .workbench-tabs,
  .thinking-toggle {
    justify-self: start;
  }

  .welcome-box {
    padding-left: 0;
  }

  .welcome-figure {
    opacity: 0.35;
    width: 54%;
  }
}

@media (max-width: 640px) {
  .rag-shell {
    padding: 0 12px 14px;
    background-size: 28px 28px, 28px 28px, auto 88%;
  }

  .rag-brand__logo {
    width: 46px;
    height: 46px;
  }

  .rag-brand__seal {
    width: 38px;
    height: 38px;
  }

  .rag-brand strong {
    font-size: 21px;
  }

  .workbench-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-box h3 {
    font-size: 32px;
  }

  .composer-tools,
  .composer-actions {
    width: 100%;
  }

  .composer-actions .send-button {
    flex: 1;
  }
}

/* Latest prototype behavior: minimal topbar, exact full-page background, lazy retrieval drawer */
.rag-shell {
  position: relative;
  height: 100vh;
  padding: 0 24px 24px;
  grid-template-rows: 64px minmax(0, 1fr);
  background: #f6eedf;
  overflow: hidden;
}

.rag-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background: url("/artwork/rag-chat-background.png") center center / cover no-repeat;
  transform: translateX(0);
  transform-origin: center;
  transition: transform 0.28s ease;
}

.rag-shell.is-retrieval-open::before {
  transform: translateX(-180px);
}

.rag-shell::after {
  display: none;
}

.rag-topbar {
  width: min(1780px, 100%);
  min-height: 64px;
  padding: 0;
}

.rag-brand {
  display: none;
}

.rag-topbar__actions {
  margin-left: auto;
}

.back-button {
  min-width: 82px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid rgba(102, 86, 60, 0.2);
  border-radius: 999px;
  background: rgba(255, 251, 243, 0.72);
  color: #26352e;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76), 0 10px 20px rgba(70, 55, 31, 0.06);
}

.back-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.back-button:hover,
.rag-user:hover {
  border-color: rgba(35, 67, 59, 0.36);
  background: rgba(255, 251, 243, 0.86);
}

.rag-layout {
  width: min(1780px, 100%);
  grid-template-columns: 340px minmax(0, 1fr);
  transition: grid-template-columns 0.28s ease;
}

.rag-shell.is-retrieval-open .rag-layout {
  grid-template-columns: 340px minmax(0, 1fr) 340px;
}

.insight-stack {
  position: relative;
  animation: retrievalPanelIn 0.24s ease both;
}

.insight-close-button {
  position: absolute;
  top: -54px;
  right: 0;
  z-index: 2;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 251, 243, 0.92);
  color: #1f2f29;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(62, 47, 24, 0.12);
}

.insight-card {
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.9), rgba(247, 239, 223, 0.84)),
    rgba(255, 250, 239, 0.88);
}

.sidebar-card,
.chat-card {
  border-color: rgba(103, 83, 49, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.34), rgba(247, 239, 223, 0.22)),
    rgba(255, 250, 239, 0.18);
  box-shadow: 0 14px 32px rgba(62, 47, 24, 0.06), inset 0 1px rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(5px);
}

.chat-card__header,
.composer,
.chat-card__body,
.message-list {
  background: transparent;
}

.welcome-figure {
  display: none;
}

.welcome-hero {
  background: transparent;
}

.suggestion-card,
.composer-box,
.session-item,
.sidebar-search input,
.history-more-button {
  background: rgba(255, 251, 243, 0.34);
  backdrop-filter: blur(3px);
}

.notice-bar {
  background: rgba(229, 216, 181, 0.48);
}

.insight-card {
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.88), rgba(247, 239, 223, 0.8)),
    rgba(255, 250, 239, 0.86);
  backdrop-filter: blur(10px);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 14px;
}

.rag-user--sidebar {
  width: 100%;
  justify-content: space-between;
  gap: 10px;
  padding-right: 16px;
  border-radius: 10px;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

.rag-user--sidebar strong {
  flex: 1;
  max-width: none;
}

.rag-user--sidebar:hover {
  background: transparent !important;
}

.chat-card {
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

.welcome-shell {
  align-content: center;
  padding-bottom: 28px;
}

.welcome-hero {
  min-height: 320px;
  border-bottom: 0;
}

.composer {
  padding: 0 16px 14px;
}

.composer-box {
  padding: 12px 0 0;
  border: 0;
  border-radius: 0;
  background: transparent !important;
  box-shadow: none !important;
  filter: none !important;
  backdrop-filter: none !important;
}

.composer-input-shell {
  position: relative;
  min-height: 82px;
  padding: 12px 14px 10px;
  background: none !important;
  filter: none !important;
  backdrop-filter: none !important;
}

.composer-input-shell::before,
.composer-input-shell::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.composer-input-shell::before {
  top: 0;
  left: 0;
  width: 84px;
  height: 18px;
  border-top: 1px solid rgba(103, 83, 49, 0.45);
  border-left: 1px solid rgba(103, 83, 49, 0.45);
}

.composer-input-shell::after {
  right: 0;
  bottom: 0;
  width: 104px;
  height: 18px;
  border-right: 1px solid rgba(103, 83, 49, 0.4);
  border-bottom: 1px solid rgba(103, 83, 49, 0.4);
}

.composer__input {
  display: block;
  width: 100%;
  min-height: 64px;
  padding: 0;
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  filter: none !important;
  backdrop-filter: none !important;
}

.composer__input::placeholder {
  color: rgba(79, 72, 61, 0.72);
}

.composer__footer {
  margin-top: 2px;
  padding: 0;
}

.composer-tools button,
.composer-actions button,
.composer-thinking-toggle,
.send-button {
  backdrop-filter: none !important;
  box-shadow: none !important;
}

.composer-tools {
  flex: 1;
}

.composer-actions {
  justify-content: flex-end;
}

.composer-thinking-toggle {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid rgba(103, 83, 49, 0.2);
  border-radius: 8px;
  background: transparent !important;
  color: #34423b;
}

.composer-thinking-toggle:hover {
  border-color: rgba(35, 67, 59, 0.36);
  background: transparent !important;
}

.composer-thinking-toggle.is-active {
  border-color: rgba(35, 67, 59, 0.48);
  background: transparent !important;
  color: #24433b;
}

.composer-thinking-toggle:disabled {
  opacity: 0.56;
}

.send-button {
  width: 54px;
  min-width: 54px;
  height: 42px;
  padding: 0;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 251, 243, 0.92);
}

.send-button svg {
  width: 18px;
  height: 18px;
}

.chat-card__header {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 16px 24px 10px;
}

.chat-title h1 {
  font-size: 28px;
}

@keyframes retrievalPanelIn {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 1280px) {
  .rag-layout,
  .rag-shell.is-retrieval-open .rag-layout {
    grid-template-columns: 300px minmax(0, 1fr);
  }

  .insight-stack {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .rag-shell.is-retrieval-open::before {
    transform: translateX(0);
  }
}

@media (max-width: 900px) {
  .rag-shell {
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }

  .rag-layout,
  .rag-shell.is-retrieval-open .rag-layout,
  .insight-stack {
    grid-template-columns: 1fr;
  }

  .insight-close-button {
    top: -8px;
    right: 8px;
  }

  .sidebar-footer {
    padding-top: 12px;
  }
}
</style>
