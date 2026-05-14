import { requestRag } from "./ragService";

export async function stopTask(taskId) {
  return requestRag(`/rag/v3/stop?taskId=${encodeURIComponent(taskId)}`, {
    method: "POST"
  });
}

export async function submitFeedback(messageId, vote) {
  return requestRag(`/conversations/messages/${messageId}/feedback`, {
    method: "POST",
    body: {
      vote
    }
  });
}
