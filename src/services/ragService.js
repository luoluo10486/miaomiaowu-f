import { clearStoredAuth, getStoredAuthToken } from "../utils/auth";
import { deleteSession, listMessages, listSessions, renameSession } from "./sessionService";
import { stopTask, submitFeedback } from "./chatService";

const RAG_API_BASE_URL = (import.meta.env.VITE_RAG_API_BASE_URL || "/api/ragent").trim().replace(/\/$/, "");

function joinUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${RAG_API_BASE_URL}${normalizedPath}`;
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function parseResponsePayload(response) {
  const text = await response.text();
  const normalized = text.trim();

  if (!normalized) {
    return {};
  }

  if (normalized.startsWith("{") || normalized.startsWith("[")) {
    try {
      return JSON.parse(normalized);
    } catch {
      return { message: text };
    }
  }

  return { message: text };
}

function handleUnauthorized() {
  clearStoredAuth();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function requestRag(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    signal
  } = options;

  const authToken = getStoredAuthToken();
  const requestHeaders = {
    ...headers
  };

  if (authToken) {
    requestHeaders.Authorization = authToken;
  }

  const requestInit = {
    method,
    headers: requestHeaders,
    signal
  };

  if (body !== undefined) {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    if (!isFormData) {
      requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    }

    requestInit.body =
      !isFormData && requestHeaders["Content-Type"] === "application/json"
        ? JSON.stringify(body)
        : body;
  }

  const response = await fetch(joinUrl(path), requestInit);

  if (response.status === 401) {
    handleUnauthorized();
  }

  const payload = await parseResponsePayload(response);
  const businessCode = payload && typeof payload === "object" ? payload.code : undefined;
  const isBusinessError =
    businessCode !== undefined && businessCode !== 0 && businessCode !== "0";

  if (!response.ok || isBusinessError) {
    throw new Error(payload?.message || payload?.error || "请求失败，请稍后重试");
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function parseSseData(raw) {
  if (!raw) {
    return "";
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function readSseStream(response, handlers, signal) {
  if (!response.body) {
    throw new Error("流式响应为空");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let currentEvent = "message";
  let dataLines = [];

  const dispatchEvent = () => {
    if (dataLines.length === 0) {
      currentEvent = "message";
      return;
    }

    const payload = parseSseData(dataLines.join("\n"));

    switch (currentEvent) {
      case "meta":
        handlers.onMeta?.(payload);
        break;
      case "message":
        handlers.onMessage?.(payload);
        break;
      case "title":
        handlers.onTitle?.(payload);
        break;
      case "finish":
        handlers.onFinish?.(payload);
        break;
      case "cancel":
        handlers.onCancel?.(payload);
        break;
      case "done":
        handlers.onDone?.();
        break;
      case "reject":
        handlers.onReject?.(payload);
        break;
      case "error":
        handlers.onError?.(
          new Error(String(payload?.error || payload?.message || payload || "生成失败"))
        );
        break;
      default:
        break;
    }

    currentEvent = "message";
    dataLines = [];
  };

  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      break;
    }

    const { value, done } = await reader.read();

    if (done) {
      dispatchEvent();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line) {
        dispatchEvent();
        continue;
      }

      if (line.startsWith(":")) {
        continue;
      }

      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
        continue;
      }

      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }
  }
}

export async function listRagSessions() {
  return listSessions();
}

export async function listRagMessages(conversationId) {
  return listMessages(conversationId);
}

export async function deleteRagSession(conversationId) {
  return deleteSession(conversationId);
}

export async function renameRagSession(conversationId, title) {
  return renameSession(conversationId, title);
}

export async function listSampleQuestions() {
  return requestRag("/rag/sample-questions");
}

export async function stopRagTask(taskId) {
  return stopTask(taskId);
}

export async function submitRagMessageFeedback(messageId, vote) {
  return submitFeedback(messageId, vote);
}

export function createRagChatStream(params, handlers = {}) {
  const authToken = getStoredAuthToken();
  const controller = new AbortController();
  const url = joinUrl(`/rag/v3/chat${buildQuery(params)}`);

  return {
    start: async () => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          ...(authToken ? { Authorization: authToken } : {})
        },
        signal: controller.signal
      });

      if (response.status === 401) {
        handleUnauthorized();
      }

      if (!response.ok) {
        const payload = await parseResponsePayload(response);
        throw new Error(payload?.message || `流式请求失败：${response.status}`);
      }

      await readSseStream(response, handlers, controller.signal);
    },
    cancel: () => controller.abort()
  };
}
