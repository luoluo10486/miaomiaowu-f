import { requestRag } from "./ragService";

export async function listSessions() {
  return requestRag("/conversations");
}

export async function listMessages(conversationId) {
  return requestRag(`/conversations/${conversationId}/messages`);
}

export async function deleteSession(conversationId) {
  return requestRag(`/conversations/${conversationId}`, {
    method: "DELETE"
  });
}

export async function renameSession(conversationId, title) {
  return requestRag(`/conversations/${conversationId}`, {
    method: "PUT",
    body: {
      title
    }
  });
}
