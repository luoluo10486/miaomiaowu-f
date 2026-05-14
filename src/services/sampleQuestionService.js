import { requestRag } from "./ragService";
import { withQuery } from "./serviceUtils";

export function getSampleQuestionsPage(current = 1, size = 10, keyword = "") {
  return requestRag(withQuery("/sample-questions", { current, size, keyword: keyword || undefined }));
}

export function createSampleQuestion(payload) {
  return requestRag("/sample-questions", {
    method: "POST",
    body: payload
  });
}

export function updateSampleQuestion(id, payload) {
  return requestRag(`/sample-questions/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteSampleQuestion(id) {
  return requestRag(`/sample-questions/${id}`, {
    method: "DELETE"
  });
}
