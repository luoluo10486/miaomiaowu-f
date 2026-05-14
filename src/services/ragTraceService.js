import { requestRag } from "./ragService";
import { withQuery } from "./serviceUtils";

export function getRagTraceRuns(current = 1, size = 10, params = {}) {
  return requestRag(
    withQuery("/rag/traces/runs", {
      current,
      size,
      traceId: params.traceId || undefined,
      conversationId: params.conversationId || undefined,
      taskId: params.taskId || undefined,
      status: params.status || undefined
    })
  );
}

export function getRagTraceDetail(traceId) {
  return requestRag(`/rag/traces/runs/${traceId}`);
}

export function getRagTraceNodes(traceId) {
  return requestRag(`/rag/traces/runs/${traceId}/nodes`);
}
