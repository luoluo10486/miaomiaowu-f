import { requestRag } from "./ragService";
import { buildFormData, withQuery } from "./serviceUtils";

export function getIngestionPipelines(pageNo = 1, pageSize = 10, keyword = "") {
  return requestRag(withQuery("/ingestion/pipelines", { pageNo, pageSize, keyword: keyword || undefined }));
}

export function getIngestionPipeline(id) {
  return requestRag(`/ingestion/pipelines/${id}`);
}

export function createIngestionPipeline(payload) {
  return requestRag("/ingestion/pipelines", {
    method: "POST",
    body: payload
  });
}

export function updateIngestionPipeline(id, payload) {
  return requestRag(`/ingestion/pipelines/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteIngestionPipeline(id) {
  return requestRag(`/ingestion/pipelines/${id}`, {
    method: "DELETE"
  });
}

export function getIngestionTasks(pageNo = 1, pageSize = 10, status = "") {
  return requestRag(withQuery("/ingestion/tasks", { pageNo, pageSize, status: status || undefined }));
}

export function getIngestionTask(id) {
  return requestRag(`/ingestion/tasks/${id}`);
}

export function getIngestionTaskNodes(id) {
  return requestRag(`/ingestion/tasks/${id}/nodes`);
}

export function createIngestionTask(payload) {
  return requestRag("/ingestion/tasks", {
    method: "POST",
    body: payload
  });
}

export function uploadIngestionTask(pipelineId, file) {
  const formData = buildFormData({ file });
  return requestRag(withQuery("/ingestion/tasks/upload", { pipelineId }), {
    method: "POST",
    body: formData
  });
}
