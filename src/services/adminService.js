import { requestRag } from "./ragService";

function withQuery(path, params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function buildFormData(payload = {}) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export function getAdminDashboardOverview(window = "24h") {
  return requestRag(withQuery("/admin/dashboard/overview", { window }));
}

export function getAdminDashboardPerformance(window = "24h") {
  return requestRag(withQuery("/admin/dashboard/performance", { window }));
}

export function getAdminDashboardTrends(metric = "sessions", window = "7d", granularity = "day") {
  return requestRag(withQuery("/admin/dashboard/trends", { metric, window, granularity }));
}

export function getKnowledgeBases(current = 1, size = 10, name = "") {
  return requestRag(withQuery("/knowledge-base", { current, size, name: name || undefined }));
}

export function getKnowledgeBase(id) {
  return requestRag(`/knowledge-base/${id}`);
}

export function createKnowledgeBase(payload) {
  return requestRag("/knowledge-base", {
    method: "POST",
    body: payload
  });
}

export function updateKnowledgeBase(id, payload) {
  return requestRag(`/knowledge-base/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function renameKnowledgeBase(id, name) {
  return updateKnowledgeBase(id, { name });
}

export function deleteKnowledgeBase(id) {
  return requestRag(`/knowledge-base/${id}`, {
    method: "DELETE"
  });
}

export function getChunkStrategies() {
  return requestRag("/knowledge-base/chunk-strategies");
}

export function getKnowledgeDocumentsPage(kbId, params = {}) {
  return requestRag(
    withQuery(`/knowledge-base/${kbId}/docs`, {
      current: params.current ?? 1,
      size: params.size ?? 10,
      status: params.status || undefined,
      keyword: params.keyword || undefined
    })
  );
}

export function searchKnowledgeDocuments(keyword, limit = 8) {
  return requestRag(withQuery("/knowledge-base/docs/search", { keyword, limit }));
}

export function getKnowledgeDocument(docId) {
  return requestRag(`/knowledge-base/docs/${docId}`);
}

export function uploadKnowledgeDocument(kbId, payload) {
  const formData = buildFormData(payload);
  return requestRag(`/knowledge-base/${kbId}/docs/upload`, {
    method: "POST",
    body: formData
  });
}

export function updateKnowledgeDocument(docId, payload) {
  return requestRag(`/knowledge-base/docs/${docId}`, {
    method: "PUT",
    body: payload
  });
}

export function startKnowledgeDocumentChunk(docId) {
  return requestRag(`/knowledge-base/docs/${docId}/chunk`, {
    method: "POST"
  });
}

export function setKnowledgeDocumentEnabled(docId, enabled) {
  return requestRag(withQuery(`/knowledge-base/docs/${docId}/enable`, { value: enabled }), {
    method: "PATCH"
  });
}

export function deleteKnowledgeDocument(docId) {
  return requestRag(`/knowledge-base/docs/${docId}`, {
    method: "DELETE"
  });
}

export function getKnowledgeChunksPage(docId, params = {}) {
  return requestRag(
    withQuery(`/knowledge-base/docs/${docId}/chunks`, {
      current: params.current ?? 1,
      size: params.size ?? 10,
      enabled: params.enabled ?? undefined
    })
  );
}

export function createKnowledgeChunk(docId, payload) {
  return requestRag(`/knowledge-base/docs/${docId}/chunks`, {
    method: "POST",
    body: payload
  });
}

export function updateKnowledgeChunk(docId, chunkId, payload) {
  return requestRag(`/knowledge-base/docs/${docId}/chunks/${chunkId}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteKnowledgeChunk(docId, chunkId) {
  return requestRag(`/knowledge-base/docs/${docId}/chunks/${chunkId}`, {
    method: "DELETE"
  });
}

export function toggleKnowledgeChunk(docId, chunkId, enabled) {
  return requestRag(withQuery(`/knowledge-base/docs/${docId}/chunks/${chunkId}/enable`, { value: enabled }), {
    method: "PATCH"
  });
}

export function batchToggleKnowledgeChunks(docId, enabled, chunkIds = []) {
  return requestRag(withQuery(`/knowledge-base/docs/${docId}/chunks/batch-enable`, { value: enabled }), {
    method: "PATCH",
    body: {
      chunkIds
    }
  });
}

export function getKnowledgeChunkLogsPage(docId, current = 1, size = 10) {
  return requestRag(withQuery(`/knowledge-base/docs/${docId}/chunk-logs`, { current, size }));
}

export function getSystemSettings() {
  return requestRag("/rag/settings");
}

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

export function getUsersPage(current = 1, size = 10, keyword = "") {
  return requestRag(withQuery("/users", { current, size, keyword: keyword || undefined }));
}

export function createUser(payload) {
  return requestRag("/users", {
    method: "POST",
    body: payload
  });
}

export function updateUser(id, payload) {
  return requestRag(`/users/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteUser(id) {
  return requestRag(`/users/${id}`, {
    method: "DELETE"
  });
}

export function changeCurrentUserPassword(payload) {
  return requestRag("/user/password", {
    method: "PUT",
    body: payload
  });
}

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

export function getQueryTermMappingsPage(current = 1, size = 10, keyword = "") {
  return requestRag(withQuery("/mappings", { current, size, keyword: keyword || undefined }));
}

export function createQueryTermMapping(payload) {
  return requestRag("/mappings", {
    method: "POST",
    body: payload
  });
}

export function updateQueryTermMapping(id, payload) {
  return requestRag(`/mappings/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteQueryTermMapping(id) {
  return requestRag(`/mappings/${id}`, {
    method: "DELETE"
  });
}

export function getIntentTree() {
  return requestRag("/intent-tree/trees");
}

export function createIntentNode(payload) {
  return requestRag("/intent-tree", {
    method: "POST",
    body: payload
  });
}

export function updateIntentNode(id, payload) {
  return requestRag(`/intent-tree/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteIntentNode(id) {
  return requestRag(`/intent-tree/${id}`, {
    method: "DELETE"
  });
}

export function batchEnableIntentNodes(ids = []) {
  return requestRag("/intent-tree/batch/enable", {
    method: "POST",
    body: {
      ids
    }
  });
}

export function batchDisableIntentNodes(ids = []) {
  return requestRag("/intent-tree/batch/disable", {
    method: "POST",
    body: {
      ids
    }
  });
}

export function batchDeleteIntentNodes(ids = []) {
  return requestRag("/intent-tree/batch/delete", {
    method: "POST",
    body: {
      ids
    }
  });
}

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
  const formData = new FormData();
  formData.append("file", file);

  return requestRag(withQuery("/ingestion/tasks/upload", { pipelineId }), {
    method: "POST",
    body: formData
  });
}
