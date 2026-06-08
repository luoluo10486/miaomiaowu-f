import { requestRag } from "./ragService";

export function getSystemSettings() {
  return requestRag("/rag/settings");
}

export function updateDailyQuestionLimit(limit) {
  return requestRag("/rag/question-quota/daily-limit", {
    method: "PUT",
    body: {
      limit
    }
  });
}
