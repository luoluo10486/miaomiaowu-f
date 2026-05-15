import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { marked } from "marked";
import {
  createRagChatStream,
  deleteRagSession,
  listRagMessages,
  listRagSessions,
  listSampleQuestions,
  renameRagSession,
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

export function useRagChat() {
  const router = useRouter();
  const route = useRoute();
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

  function escapeHtml(raw) {
    return String(raw || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderMarkdown(content) {
    return marked.parse(escapeHtml(content || ""), {
      gfm: true,
      breaks: true
    });
  }

  function getRouteSessionId() {
    return typeof route.params.sessionId === "string" ? route.params.sessionId : "";
  }

  function syncRouteWithSession(sessionId, replace = false) {
    const target = sessionId ? `/chat/${sessionId}` : "/chat";
    if (route.fullPath === target) {
      return;
    }

    if (replace) {
      router.replace(target);
      return;
    }

    router.push(target);
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

  async function promptRenameSession(session) {
    const targetSessionId = session?.id || currentSessionId.value;
    const currentTitle = session?.title || activeSession.value?.title || "新对话";

    if (!targetSessionId) {
      return;
    }

    const nextTitle =
      typeof window === "undefined"
        ? currentTitle
        : window.prompt("请输入新的会话名称", currentTitle);

    if (!nextTitle || !nextTitle.trim() || nextTitle.trim() === currentTitle) {
      return;
    }

    try {
      await renameRagSession(targetSessionId, nextTitle.trim());
      updateSessionTitle(targetSessionId, nextTitle.trim());
      setNotice("会话名称已更新", "success");
    } catch (error) {
      setNotice(error?.message || "重命名会话失败，请稍后重试", "error");
    }
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
    syncRouteWithSession("", true);
    focusComposer();
    resizeComposer();
  }

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/chat");
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
      const routeSessionId = getRouteSessionId();

      if (!autoSelect) {
        return;
      }

      if (routeSessionId) {
        const matchedSession = nextSessions.find((item) => item.id === routeSessionId);
        if (matchedSession) {
          await selectSession(routeSessionId, {
            updateRoute: false,
            replaceRoute: true
          });
          return;
        }
      }

      if (currentSessionId.value && nextSessions.some((item) => item.id === currentSessionId.value)) {
        return;
      }

      if (nextSessions.length > 0) {
        await selectSession(nextSessions[0].id, {
          replaceRoute: true
        });
        return;
      }

      createConversation();
    } catch (error) {
      setNotice(error?.message || "加载会话失败，请稍后重试", "error");
    } finally {
      loadingSessions.value = false;
    }
  }

  async function selectSession(sessionId, options = {}) {
    const { updateRoute = true, replaceRoute = false } = options;

    if (!sessionId) {
      createConversation();
      return;
    }

    if (isStreaming.value) {
      await interruptStreaming();
    }

    currentSessionId.value = sessionId;
    if (updateRoute) {
      syncRouteWithSession(sessionId, replaceRoute);
    }
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
          await selectSession(remaining[0].id, {
            replaceRoute: true
          });
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
            syncRouteWithSession(nextSessionId, true);
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
            syncRouteWithSession(currentSessionId.value, true);
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

  function openSession(session) {
    void selectSession(session?.id);
  }

  function handleSessionRename(session) {
    void promptRenameSession(session);
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

  watch(
    () => route.fullPath,
    (nextPath) => {
      if (!nextPath.startsWith("/chat") && !nextPath.startsWith("/rag")) {
        return;
      }

      const sessionId = getRouteSessionId();
      if (!sessionId || sessionId === currentSessionId.value) {
        return;
      }

      void selectSession(sessionId, {
        updateRoute: false,
        replaceRoute: true
      });
    }
  );

  return {
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
    currentUser,
    activeSession,
    hasMessages,
    thinkingMessage,
    currentSessionTitle,
    currentUserName,
    userInitial,
    sessionSearch,
    showRetrievalPanel,
    retrievalSources,
    citationSnippet,
    filteredSessions,
    hasCompletedRagAnswer,
    groupedSessions,
    requestStats,
    setNotice,
    escapeHtml,
    renderMarkdown,
    getRouteSessionId,
    syncRouteWithSession,
    formatSessionTime,
    mapVoteToFeedback,
    mapSession,
    mapMessage,
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
  };
}
