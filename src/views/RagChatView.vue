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
    title: "知识点总结",
    description: "快速提炼主题核心观点和行动建议",
    question: "请帮我总结这段内容，并提炼 3 到 5 个关键要点。"
  },
  {
    title: "方案对比",
    description: "对多个思路做结构化优缺点分析",
    question: "围绕这个主题给出 3 个可行方案，并比较优缺点和适用场景。"
  },
  {
    title: "排查问题",
    description: "适合接口、前端和联调问题定位",
    question: "请按可能性从高到低帮我排查这个问题，并给出验证步骤。"
  }
];

const ORBIT_NODES = [
  {
    label: "检索",
    left: "73%",
    top: "27%"
  },
  {
    label: "重排",
    left: "78%",
    top: "70%"
  },
  {
    label: "证据",
    left: "23%",
    top: "73%"
  },
  {
    label: "生成",
    left: "22%",
    top: "30%"
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

const currentSessionTitle = computed(() => activeSession.value?.title || "未命名知识航线");
const hasMessages = computed(() => messages.value.length > 0);
const assistantMessageCount = computed(() => {
  return messages.value.filter((message) => message.role === "assistant").length;
});
const completedAssistantCount = computed(() => {
  return messages.value.filter(
    (message) => message.role === "assistant" && message.status === "done"
  ).length;
});
const thinkingMessage = computed(() => {
  return messages.value.find((message) => message.role === "assistant" && message.isThinking);
});
const userInitial = computed(() => {
  const name = currentUserName.value.trim();
  return name ? name.slice(0, 1).toUpperCase() : "U";
});
const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "当前用户";
});
const sendButtonText = computed(() => {
  if (isStreaming.value) {
    return "截停生成";
  }

  return deepThinkingEnabled.value ? "深潜提问" : "发射问题";
});
const cockpitStats = computed(() => [
  {
    label: "会话星群",
    value: sessions.value.length,
    suffix: "个"
  },
  {
    label: "当前消息",
    value: messages.value.length,
    suffix: "条"
  },
  {
    label: "助手回答",
    value: completedAssistantCount.value || assistantMessageCount.value,
    suffix: "轮"
  }
]);

function setNotice(message, type = "info") {
  noticeText.value = message;
  noticeType.value = type;
}

function formatSessionTime(value) {
  if (!value) {
    return "刚刚创建";
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
    ...(sameYear
      ? {}
      : {
          year: "numeric"
        })
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  });
}

function createConversation() {
  if (isStreaming.value) {
    void interruptStreaming();
  }

  currentSessionId.value = "";
  messages.value = [];
  setNotice("", "info");
  focusComposer();
  resizeComposer();
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
  setNotice("", "info");

  try {
    const data = await listRagMessages(sessionId);
    if (currentSessionId.value !== sessionId) {
      return;
    }

    messages.value = Array.isArray(data) ? data.map(mapMessage) : [];
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
    setNotice("已取消本地反馈标记", "info");
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
  <section class="rag-shell">
    <div class="rag-atmosphere" aria-hidden="true">
      <span class="shape shape--one"></span>
      <span class="shape shape--two"></span>
      <span class="shape shape--three"></span>
      <span class="grid-plane"></span>
      <span class="signal-line signal-line--a"></span>
      <span class="signal-line signal-line--b"></span>
    </div>

    <header class="rag-topbar">
      <button class="brand-mark" type="button" @click="createConversation">
        <span class="brand-mark__sigil">R</span>
        <span>
          <strong>RAG Nebula</strong>
          <small>Knowledge cockpit</small>
        </span>
      </button>

      <nav class="top-actions" aria-label="页面导航">
        <button class="nav-pill" type="button" @click="router.push('/workspace')">工作台</button>
        <button class="nav-pill" type="button" @click="router.push('/admin')">后台管理</button>
        <div class="user-chip">
          <span class="user-chip__avatar">{{ userInitial }}</span>
          <span>
            <small>当前登录</small>
            <strong>{{ currentUserName }}</strong>
          </span>
        </div>
        <button class="nav-pill nav-pill--danger" type="button" @click="handleLogout">退出</button>
      </nav>
    </header>

    <div class="rag-shell__body">
      <section class="hero-console">
        <div class="hero-console__copy">
          <p class="eyebrow">RAG 问答重构版</p>
          <h1>
            把博客知识库
            <span>点亮成一张会回答的星图</span>
          </h1>
          <p>
            保留 `frontend` 参考项目里的会话、推荐问题、流式生成、停止任务与反馈链路，
            但界面改成更有识别度的知识驾驶舱。
          </p>
        </div>

        <div class="orbit-card" :class="{ 'is-streaming': isStreaming }" aria-label="RAG 处理状态">
          <div class="orbit-card__core">
            <span>{{ isStreaming ? "LIVE" : "RAG" }}</span>
            <strong>{{ deepThinkingEnabled ? "Deep" : "Fast" }}</strong>
          </div>
          <div class="orbit-card__ring orbit-card__ring--outer"></div>
          <div class="orbit-card__ring orbit-card__ring--inner"></div>
          <span
            v-for="node in ORBIT_NODES"
            :key="node.label"
            class="orbit-node"
            :style="{ '--node-left': node.left, '--node-top': node.top }"
          >
            {{ node.label }}
          </span>
        </div>

        <div class="hero-console__stats">
          <article v-for="stat in cockpitStats" :key="stat.label" class="stat-card">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}<small>{{ stat.suffix }}</small></strong>
          </article>
        </div>
      </section>

      <div v-if="noticeText" :class="['notice-bar', `notice-bar--${noticeType}`]">
        <span class="notice-bar__dot"></span>
        {{ noticeText }}
      </div>

      <section class="rag-page">
        <aside class="session-panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Session constellation</p>
              <h2>会话星群</h2>
            </div>
            <button class="icon-action" type="button" aria-label="新建对话" @click="createConversation">
              +
            </button>
          </div>

          <div class="session-panel__summary">
            <span>{{ sessions.length }} 条轨道</span>
            <span :class="['status-dot', { 'is-hot': isStreaming }]">
              {{ isStreaming ? "生成中" : "待命" }}
            </span>
          </div>

          <div v-if="loadingSessions" class="panel-state">
            <span class="loader"></span>
            正在扫描历史会话...
          </div>

          <div v-else-if="sessions.length === 0" class="empty-state">
            <strong>没有旧轨迹</strong>
            <span>右侧直接发起一次提问，就会生成新的知识航线。</span>
          </div>

          <ul v-else class="session-list">
            <li v-for="session in sessions" :key="session.id">
              <button
                type="button"
                :class="['session-item', { 'is-active': currentSessionId === session.id }]"
                @click="selectSession(session.id)"
              >
                <span class="session-item__beacon"></span>
                <span class="session-item__body">
                  <strong>{{ session.title }}</strong>
                  <small>{{ formatSessionTime(session.lastTime) }}</small>
                </span>
              </button>
              <button class="session-item__delete" type="button" @click="removeSession(session.id)">
                删除
              </button>
            </li>
          </ul>
        </aside>

        <main class="workspace-card">
          <header class="workspace-header">
            <div>
              <p class="eyebrow">Current trajectory</p>
              <h2>{{ currentSessionTitle }}</h2>
              <p>
                {{ activeSession ? "正在读取这条会话轨道。" : "新会话待发射，第一条问题会自动创建会话。" }}
              </p>
            </div>

            <div class="workspace-header__actions">
              <button
                type="button"
                :class="['deep-switch', { 'is-active': deepThinkingEnabled }]"
                :disabled="isStreaming"
                @click="deepThinkingEnabled = !deepThinkingEnabled"
              >
                <span class="deep-switch__orb"></span>
                深度思考
              </button>
              <span class="live-chip">
                <span></span>
                {{ isStreaming ? "流式生成中" : "引擎空闲" }}
              </span>
            </div>
          </header>

          <div class="workspace-body">
            <div v-if="loadingMessages" class="panel-state panel-state--body">
              <span class="loader"></span>
              正在加载消息...
            </div>

            <template v-else>
              <div v-if="!hasMessages" class="welcome-area">
                <section class="welcome-banner">
                  <div class="welcome-banner__badge">Start here</div>
                  <h3>先挑一颗问题种子，或者直接输入你的问题。</h3>
                  <p>
                    这个版本更像一张动态知识星图：左边保存轨迹，中间承载问答，
                    右下角随时可以切换深度思考。
                  </p>
                  <div class="welcome-banner__facts">
                    <span>流式 SSE</span>
                    <span>历史会话</span>
                    <span>推荐问题</span>
                    <span>回答反馈</span>
                  </div>
                </section>

                <section class="suggestions-area">
                  <div class="section-title">
                    <p class="eyebrow">Prompt seeds</p>
                    <h3>推荐提问</h3>
                  </div>
                  <div class="suggestions-grid">
                    <button
                      v-for="(item, index) in suggestions"
                      :key="`${item.title}-${index}`"
                      type="button"
                      class="suggestion-card"
                      :style="{ '--delay': `${index * 80}ms` }"
                      @click="handleSuggestionClick(item.question)"
                    >
                      <span class="suggestion-card__index">0{{ index + 1 }}</span>
                      <strong>{{ item.title }}</strong>
                      <small>{{ item.description }}</small>
                      <span class="suggestion-card__question">{{ item.question }}</span>
                    </button>
                  </div>
                </section>
              </div>

              <div v-else ref="messageScrollerRef" class="message-list">
                <article
                  v-for="message in messages"
                  :key="message.id"
                  :class="['message-row', `message-row--${message.role}`]"
                >
                  <div class="message-avatar">
                    {{ message.role === "user" ? userInitial : "AI" }}
                  </div>

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
                        <span>深度思考轨迹</span>
                        <strong v-if="message.thinkingDuration">{{ message.thinkingDuration }}s</strong>
                      </summary>
                      <pre>{{ message.thinking }}</pre>
                    </details>

                    <div
                      v-if="message.role === 'assistant' && message.status === 'streaming' && !message.content && !message.thinking"
                      class="ai-wait"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <pre class="message-bubble__content">{{
                      message.content || (message.isThinking ? "正在深潜检索与推理..." : "")
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
                      class="message-tools"
                    >
                      <button type="button" @click="copyMessageContent(message.content)">复制</button>
                      <button
                        type="button"
                        :class="{ 'is-active': message.feedback === 'like' }"
                        :disabled="message.id.startsWith('assistant-')"
                        @click="submitFeedback(message, 'like')"
                      >
                        有帮助
                      </button>
                      <button
                        type="button"
                        :class="{ 'is-active': message.feedback === 'dislike' }"
                        :disabled="message.id.startsWith('assistant-')"
                        @click="submitFeedback(message, 'dislike')"
                      >
                        需改进
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </template>
          </div>

          <footer class="composer">
            <div v-if="thinkingMessage" class="thinking-strip">
              <span></span>
              深度思考中，正在把证据线索串起来...
            </div>
            <textarea
              ref="textareaRef"
              v-model="draft"
              class="composer__input"
              rows="2"
              :placeholder="
                deepThinkingEnabled
                  ? '输入需要深入分析的问题，RAG 会先展开推理轨迹...'
                  : '输入你的问题，Enter 发送，Shift + Enter 换行'
              "
              @input="resizeComposer"
              @keydown="handleComposerKeydown"
            />
            <div class="composer__footer">
              <div class="composer__hint">
                <span>Enter 发射</span>
                <span>Shift + Enter 换行</span>
                <span>{{ deepThinkingEnabled ? "深度模式开启" : "快速模式" }}</span>
              </div>
              <button class="send-button" type="button" :class="{ 'is-stop': isStreaming }" @click="sendMessage">
                <span>{{ sendButtonText }}</span>
              </button>
            </div>
          </footer>
        </main>
      </section>
    </div>
  </section>
</template>

<style scoped>
.rag-shell {
  --ink: #172033;
  --muted: #647084;
  --paper: rgba(255, 255, 255, 0.78);
  --paper-strong: rgba(255, 255, 255, 0.92);
  --line: rgba(23, 32, 51, 0.12);
  --blue: #3e8cff;
  --cyan: #21b7d7;
  --coral: #f38c72;
  --sand: #f0c987;
  --green: #36b983;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: var(--ink);
  background:
    linear-gradient(135deg, rgba(225, 236, 245, 0.95), rgba(245, 224, 203, 0.78)),
    #d7e6ee;
}

.rag-shell button,
.rag-shell textarea {
  font: inherit;
}

.rag-atmosphere {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape,
.grid-plane,
.signal-line {
  position: absolute;
  display: block;
}

.shape {
  opacity: 0.72;
  transform: rotate(45deg);
  filter: blur(0.2px) saturate(1.05);
}

.shape--one {
  width: 54vmax;
  height: 54vmax;
  left: -23vmax;
  top: -21vmax;
  background: #7282c7;
  animation: driftA 16s ease-in-out infinite alternate;
}

.shape--two {
  width: 50vmax;
  height: 50vmax;
  right: -21vmax;
  top: -18vmax;
  background: #6fc0d9;
  animation: driftB 18s ease-in-out infinite alternate;
}

.shape--three {
  width: 52vmax;
  height: 52vmax;
  left: 18%;
  bottom: -37vmax;
  background: #e7b297;
  animation: driftC 20s ease-in-out infinite alternate;
}

.grid-plane {
  inset: 12% -10% auto;
  height: 54%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.24) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.24) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at 50% 40%, #000, transparent 68%);
  transform: perspective(780px) rotateX(62deg);
  transform-origin: top;
  opacity: 0.55;
}

.signal-line {
  height: 1px;
  width: 42vw;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.86), transparent);
  animation: signalSweep 7s linear infinite;
}

.signal-line--a {
  left: -12vw;
  top: 34%;
}

.signal-line--b {
  right: -20vw;
  top: 68%;
  animation-delay: 2.2s;
}

.rag-topbar,
.rag-shell__body {
  position: relative;
  z-index: 1;
}

.rag-topbar {
  width: min(1500px, calc(100% - 40px));
  margin: 0 auto;
  padding: 22px 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-mark,
.top-actions,
.user-chip {
  display: flex;
  align-items: center;
}

.brand-mark {
  gap: 12px;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
}

.brand-mark__sigil {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.25)),
    linear-gradient(135deg, var(--blue), var(--coral));
  color: #fff;
  font-size: 25px;
  font-weight: 900;
  box-shadow: 0 14px 34px rgba(55, 93, 145, 0.23);
}

.brand-mark strong,
.brand-mark small {
  display: block;
}

.brand-mark strong {
  font-size: 18px;
  letter-spacing: 0.01em;
}

.brand-mark small,
.user-chip small {
  color: rgba(23, 32, 51, 0.58);
  font-size: 12px;
}

.top-actions {
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-pill,
.user-chip,
.icon-action,
.deep-switch,
.live-chip,
.send-button {
  border: 1px solid rgba(255, 255, 255, 0.54);
  background: rgba(255, 255, 255, 0.34);
  box-shadow: 0 12px 36px rgba(52, 73, 105, 0.11);
  backdrop-filter: blur(16px);
}

.nav-pill {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  color: var(--ink);
  cursor: pointer;
  transition: transform 0.22s ease, background 0.22s ease, color 0.22s ease;
}

.nav-pill:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.66);
}

.nav-pill--danger:hover {
  color: #c24132;
}

.user-chip {
  min-height: 42px;
  gap: 9px;
  padding: 5px 14px 5px 6px;
  border-radius: 999px;
}

.user-chip__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #172033;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
}

.user-chip strong {
  display: block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.rag-shell__body {
  width: min(1500px, calc(100% - 40px));
  margin: 0 auto;
  padding: 22px 0 38px;
}

.hero-console {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px minmax(280px, 0.48fr);
  gap: 24px;
  align-items: stretch;
  margin-bottom: 24px;
}

.hero-console__copy,
.orbit-card,
.stat-card,
.session-panel,
.workspace-card,
.notice-bar {
  border: 1px solid rgba(255, 255, 255, 0.52);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.36));
  box-shadow: 0 24px 70px rgba(54, 74, 103, 0.17);
  backdrop-filter: blur(22px);
}

.hero-console__copy {
  min-height: 250px;
  padding: clamp(26px, 4vw, 46px);
  border-radius: 34px;
  overflow: hidden;
  animation: panelIn 0.48s ease both;
}

.eyebrow {
  margin: 0 0 10px;
  color: rgba(44, 105, 159, 0.92);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-console h1 {
  max-width: 860px;
  margin: 0;
  color: var(--ink);
  font-size: clamp(34px, 4.7vw, 70px);
  line-height: 0.98;
  letter-spacing: -0.07em;
}

.hero-console h1 span {
  display: block;
  margin-top: 8px;
  color: transparent;
  background: linear-gradient(110deg, #172033 15%, #266fb7 42%, #d87562 72%);
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-console__copy > p:last-child {
  max-width: 760px;
  margin: 22px 0 0;
  color: rgba(23, 32, 51, 0.66);
  font-size: 15px;
  line-height: 1.8;
}

.orbit-card {
  position: relative;
  min-height: 250px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  animation: panelIn 0.48s ease 70ms both;
}

.orbit-card::before,
.orbit-card::after {
  content: "";
  position: absolute;
  inset: 24px;
  border-radius: 50%;
}

.orbit-card::before {
  background:
    conic-gradient(from 90deg, transparent 0deg, rgba(62, 140, 255, 0.9), transparent 108deg),
    radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 58%);
  animation: rotateOrb 10s linear infinite;
}

.orbit-card::after {
  border: 1px dashed rgba(23, 32, 51, 0.16);
}

.orbit-card.is-streaming::before {
  animation-duration: 3.6s;
}

.orbit-card__core {
  position: relative;
  z-index: 2;
  width: 112px;
  height: 112px;
  border-radius: 36px;
  display: grid;
  place-items: center;
  align-content: center;
  background:
    radial-gradient(circle at 32% 25%, rgba(255, 255, 255, 0.9), transparent 35%),
    linear-gradient(135deg, #172033, #2b5f9f 58%, #db846c);
  color: #fff;
  box-shadow: 0 20px 48px rgba(21, 42, 72, 0.28);
}

.orbit-card__core span {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.22em;
}

.orbit-card__core strong {
  font-size: 22px;
}

.orbit-card__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.62);
}

.orbit-card__ring--outer {
  inset: 36px;
}

.orbit-card__ring--inner {
  inset: 72px;
}

.orbit-node {
  position: absolute;
  z-index: 3;
  left: var(--node-left);
  top: var(--node-top);
  transform: translate(-50%, -50%);
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  color: rgba(23, 32, 51, 0.7);
  font-size: 12px;
  font-weight: 800;
}

.hero-console__stats {
  display: grid;
  gap: 12px;
}

.stat-card {
  border-radius: 28px;
  padding: 22px;
  animation: panelIn 0.48s ease both;
}

.stat-card:nth-child(2) {
  animation-delay: 80ms;
}

.stat-card:nth-child(3) {
  animation-delay: 140ms;
}

.stat-card span,
.session-panel__summary,
.workspace-header p,
.suggestion-card small,
.message-bubble__meta,
.composer__hint {
  color: rgba(23, 32, 51, 0.58);
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 33px;
  line-height: 1;
}

.stat-card small {
  margin-left: 4px;
  font-size: 14px;
  color: rgba(23, 32, 51, 0.48);
}

.notice-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding: 13px 16px;
  border-radius: 20px;
  color: var(--ink);
  font-size: 14px;
}

.notice-bar__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--blue);
  box-shadow: 0 0 0 7px rgba(62, 140, 255, 0.12);
}

.notice-bar--error .notice-bar__dot {
  background: #e15d51;
  box-shadow: 0 0 0 7px rgba(225, 93, 81, 0.13);
}

.notice-bar--success .notice-bar__dot {
  background: var(--green);
  box-shadow: 0 0 0 7px rgba(54, 185, 131, 0.13);
}

.rag-page {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 24px;
  min-height: 760px;
}

.session-panel,
.workspace-card {
  min-width: 0;
  border-radius: 34px;
}

.session-panel {
  position: sticky;
  top: 18px;
  max-height: calc(100vh - 36px);
  padding: 22px;
  overflow: hidden;
}

.panel-head,
.session-panel__summary,
.workspace-header,
.workspace-header__actions,
.composer__footer,
.message-bubble__meta,
.message-tools {
  display: flex;
  align-items: center;
}

.panel-head,
.workspace-header,
.composer__footer {
  justify-content: space-between;
  gap: 18px;
}

.panel-head h2,
.workspace-header h2,
.section-title h3,
.welcome-banner h3 {
  margin: 0;
  color: var(--ink);
}

.panel-head h2,
.workspace-header h2 {
  font-size: 24px;
  line-height: 1.15;
}

.icon-action {
  width: 44px;
  height: 44px;
  border-radius: 17px;
  color: var(--ink);
  font-size: 26px;
  font-weight: 300;
  cursor: pointer;
  transition: transform 0.22s ease, background 0.22s ease;
}

.icon-action:hover {
  transform: translateY(-2px) rotate(6deg);
  background: rgba(255, 255, 255, 0.72);
}

.session-panel__summary {
  justify-content: space-between;
  margin: 18px 0;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.28);
  font-size: 13px;
}

.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.status-dot::before,
.live-chip span,
.thinking-strip span {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 6px rgba(54, 185, 131, 0.14);
}

.status-dot.is-hot::before,
.live-chip span {
  background: var(--coral);
  box-shadow: 0 0 0 6px rgba(243, 140, 114, 0.14);
  animation: pulseDot 1s ease-in-out infinite;
}

.panel-state,
.empty-state {
  min-height: 160px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 20px;
  color: rgba(23, 32, 51, 0.58);
  text-align: center;
  background: rgba(255, 255, 255, 0.24);
}

.panel-state--body {
  min-height: 540px;
}

.empty-state strong,
.empty-state span {
  display: block;
}

.empty-state strong {
  color: var(--ink);
}

.loader {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(23, 32, 51, 0.12);
  border-top-color: var(--blue);
  animation: spin 0.8s linear infinite;
}

.session-list {
  max-height: calc(100vh - 220px);
  list-style: none;
  padding: 0 6px 0 0;
  margin: 0;
  display: grid;
  gap: 11px;
  overflow: auto;
}

.session-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}

.session-item {
  position: relative;
  width: 100%;
  min-height: 72px;
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 22px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.28);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
}

.session-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.52), transparent);
  transform: translateX(-120%);
  transition: transform 0.55s ease;
}

.session-item:hover::after,
.session-item.is-active::after {
  transform: translateX(120%);
}

.session-item:hover {
  transform: translateX(3px);
  background: rgba(255, 255, 255, 0.52);
}

.session-item.is-active {
  border-color: rgba(62, 140, 255, 0.5);
  background:
    linear-gradient(135deg, rgba(62, 140, 255, 0.22), rgba(255, 255, 255, 0.45));
}

.session-item__beacon {
  width: 12px;
  height: 42px;
  border-radius: 999px;
  background: linear-gradient(var(--blue), var(--coral));
  box-shadow: 0 0 18px rgba(62, 140, 255, 0.28);
}

.session-item__body {
  min-width: 0;
  position: relative;
  z-index: 1;
}

.session-item__body strong,
.session-item__body small {
  display: block;
}

.session-item__body strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.session-item__body small {
  margin-top: 6px;
  color: rgba(23, 32, 51, 0.5);
  font-size: 12px;
}

.session-item__delete {
  border: 0;
  background: transparent;
  color: rgba(23, 32, 51, 0.44);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.session-item__delete:hover {
  color: #c24132;
}

.workspace-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 760px;
  overflow: hidden;
}

.workspace-header {
  padding: 26px 28px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.38);
}

.workspace-header p {
  margin: 9px 0 0;
  line-height: 1.65;
}

.workspace-header__actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.deep-switch,
.live-chip {
  min-height: 42px;
  border-radius: 999px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--ink);
  font-size: 13px;
}

.deep-switch {
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.deep-switch:hover:not(:disabled) {
  transform: translateY(-2px);
}

.deep-switch:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.deep-switch.is-active {
  background: rgba(34, 110, 202, 0.16);
  border-color: rgba(62, 140, 255, 0.32);
  color: #1b5da7;
}

.deep-switch__orb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--sand);
  box-shadow: 0 0 0 6px rgba(240, 201, 135, 0.14);
}

.deep-switch.is-active .deep-switch__orb {
  background: var(--blue);
  box-shadow: 0 0 0 6px rgba(62, 140, 255, 0.16), 0 0 18px rgba(62, 140, 255, 0.36);
}

.live-chip {
  background: rgba(255, 255, 255, 0.26);
}

.workspace-body {
  min-height: 0;
  position: relative;
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.52), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
}

.welcome-area {
  padding: 28px;
  display: grid;
  gap: 24px;
}

.welcome-banner {
  position: relative;
  min-height: 250px;
  padding: clamp(24px, 4vw, 42px);
  border-radius: 32px;
  overflow: hidden;
  background:
    radial-gradient(circle at 84% 18%, rgba(62, 140, 255, 0.22), transparent 24%),
    radial-gradient(circle at 10% 80%, rgba(243, 140, 114, 0.22), transparent 28%),
    rgba(255, 255, 255, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.42);
}

.welcome-banner::after {
  content: "";
  position: absolute;
  right: -74px;
  bottom: -74px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 34px solid rgba(255, 255, 255, 0.26);
}

.welcome-banner__badge {
  width: max-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  color: #2767aa;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.welcome-banner h3 {
  max-width: 700px;
  margin-top: 18px;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.welcome-banner p {
  max-width: 720px;
  margin: 18px 0 0;
  color: rgba(23, 32, 51, 0.66);
  line-height: 1.8;
}

.welcome-banner__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.welcome-banner__facts span {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.46);
  color: rgba(23, 32, 51, 0.68);
  font-size: 13px;
  font-weight: 700;
}

.section-title {
  margin-bottom: 14px;
}

.section-title h3 {
  font-size: 22px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.suggestion-card {
  position: relative;
  min-height: 190px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.34);
  color: var(--ink);
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  transform: translateY(14px);
  animation: cardRise 0.48s ease var(--delay) both;
  transition: transform 0.24s ease, background 0.24s ease, border-color 0.24s ease;
}

.suggestion-card::before {
  content: "";
  position: absolute;
  width: 128px;
  height: 128px;
  right: -46px;
  top: -48px;
  border-radius: 42px;
  background: linear-gradient(135deg, rgba(62, 140, 255, 0.2), rgba(243, 140, 114, 0.16));
  transform: rotate(28deg);
}

.suggestion-card:hover {
  transform: translateY(-6px) rotate(-0.6deg);
  background: rgba(255, 255, 255, 0.56);
  border-color: rgba(62, 140, 255, 0.28);
}

.suggestion-card__index,
.suggestion-card strong,
.suggestion-card small,
.suggestion-card__question {
  position: relative;
  z-index: 1;
  display: block;
}

.suggestion-card__index {
  color: rgba(62, 140, 255, 0.82);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.suggestion-card strong {
  margin-top: 18px;
  font-size: 20px;
}

.suggestion-card small {
  margin-top: 8px;
  line-height: 1.6;
}

.suggestion-card__question {
  margin-top: 18px;
  color: rgba(23, 32, 51, 0.78);
  font-size: 13px;
  line-height: 1.65;
}

.message-list {
  height: 100%;
  max-height: 590px;
  min-height: 590px;
  padding: 28px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(12px);
  animation: messageIn 0.32s ease both;
}

.message-row--user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.5);
  color: rgba(23, 32, 51, 0.78);
  font-size: 12px;
  font-weight: 900;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
}

.message-row--assistant .message-avatar {
  background: linear-gradient(135deg, rgba(62, 140, 255, 0.9), rgba(33, 183, 215, 0.78));
  color: #fff;
}

.message-bubble {
  max-width: min(820px, 88%);
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.48);
  box-shadow: 0 16px 38px rgba(54, 74, 103, 0.12);
}

.message-bubble--user {
  color: #fff;
  background:
    radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.24), transparent 28%),
    linear-gradient(135deg, #172033, #2f75b8);
}

.message-bubble--user .message-bubble__meta,
.message-bubble--user .message-bubble__content {
  color: rgba(255, 255, 255, 0.88);
}

.message-bubble__meta {
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 800;
}

.message-bubble__content,
.thinking-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: rgba(23, 32, 51, 0.86);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.82;
}

.thinking-panel {
  margin: 10px 0 14px;
  border: 1px solid rgba(62, 140, 255, 0.24);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(62, 140, 255, 0.1);
}

.thinking-panel summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  color: #1d5f9f;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
}

.thinking-panel pre {
  padding: 0 14px 14px;
  color: #1f5f99;
  font-size: 13px;
}

.ai-wait {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin: 4px 0 10px;
}

.ai-wait span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--blue);
  animation: dotBounce 0.9s ease-in-out infinite;
}

.ai-wait span:nth-child(2) {
  animation-delay: 0.14s;
}

.ai-wait span:nth-child(3) {
  animation-delay: 0.28s;
}

.message-bubble__status {
  margin: 12px 0 0;
  color: rgba(23, 32, 51, 0.5);
  font-size: 12px;
  font-weight: 700;
}

.message-bubble__status--error {
  color: #c24132;
}

.message-tools {
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
  opacity: 0.78;
  transition: opacity 0.2s ease;
}

.message-bubble:hover .message-tools {
  opacity: 1;
}

.message-tools button {
  border: 1px solid rgba(23, 32, 51, 0.1);
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.42);
  color: rgba(23, 32, 51, 0.58);
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.message-tools button:hover:not(:disabled),
.message-tools button.is-active {
  transform: translateY(-1px);
  background: rgba(62, 140, 255, 0.13);
  color: #1f5f99;
}

.message-tools button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.composer {
  padding: 18px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.4));
}

.thinking-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #1f5f99;
  font-size: 13px;
  font-weight: 800;
}

.composer__input {
  width: 100%;
  min-height: 74px;
  max-height: 180px;
  resize: none;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 24px;
  padding: 17px 18px;
  outline: none;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
  line-height: 1.65;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.composer__input:focus {
  border-color: rgba(62, 140, 255, 0.4);
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 0 0 5px rgba(62, 140, 255, 0.1);
}

.composer__footer {
  margin-top: 13px;
}

.composer__hint {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
}

.composer__hint span {
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.34);
}

.send-button {
  position: relative;
  min-width: 136px;
  min-height: 46px;
  border-radius: 999px;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(135deg, #172033, #2878c7 58%, #e27d65);
  cursor: pointer;
  transition: transform 0.22s ease, filter 0.22s ease;
}

.send-button::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.42), transparent);
  transform: translateX(-120%);
  animation: sendSheen 2.6s ease-in-out infinite;
}

.send-button span {
  position: relative;
  z-index: 1;
  font-weight: 900;
}

.send-button:hover {
  transform: translateY(-2px);
  filter: saturate(1.12);
}

.send-button.is-stop {
  background: linear-gradient(135deg, #431d24, #c5443d, #f38c72);
}

@keyframes driftA {
  from {
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
  to {
    transform: translate(6vmax, 3vmax) rotate(45deg) scale(1.06);
  }
}

@keyframes driftB {
  from {
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
  to {
    transform: translate(-5vmax, 4vmax) rotate(45deg) scale(1.05);
  }
}

@keyframes driftC {
  from {
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
  to {
    transform: translate(2vmax, -5vmax) rotate(45deg) scale(1.04);
  }
}

@keyframes signalSweep {
  from {
    transform: translateX(-30vw) rotate(-8deg);
    opacity: 0;
  }
  18%,
  72% {
    opacity: 0.8;
  }
  to {
    transform: translateX(130vw) rotate(-8deg);
    opacity: 0;
  }
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes rotateOrb {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulseDot {
  50% {
    transform: scale(1.28);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes cardRise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes messageIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotBounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

@keyframes sendSheen {
  42%,
  100% {
    transform: translateX(130%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rag-shell *,
  .rag-shell *::before,
  .rag-shell *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 1240px) {
  .hero-console {
    grid-template-columns: minmax(0, 1fr) 230px;
  }

  .hero-console__stats {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .rag-page {
    grid-template-columns: 300px minmax(0, 1fr);
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .rag-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .top-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-console,
  .rag-page {
    grid-template-columns: 1fr;
  }

  .orbit-card {
    width: min(260px, 100%);
    justify-self: center;
  }

  .session-panel {
    position: relative;
    top: auto;
    max-height: none;
  }

  .session-list {
    max-height: 340px;
  }

  .workspace-header,
  .composer__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .workspace-header__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 680px) {
  .rag-topbar,
  .rag-shell__body {
    width: min(100% - 24px, 1500px);
  }

  .hero-console__stats {
    grid-template-columns: 1fr;
  }

  .hero-console__copy,
  .session-panel,
  .workspace-card {
    border-radius: 26px;
  }

  .message-list,
  .welcome-area {
    padding: 18px;
  }

  .message-list {
    min-height: 520px;
    max-height: 520px;
  }

  .message-bubble {
    max-width: 100%;
  }

  .message-avatar {
    display: none;
  }

  .send-button {
    width: 100%;
  }

  .user-chip {
    width: 100%;
  }
}
</style>
