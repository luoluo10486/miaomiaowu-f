import { requestRag } from "./ragService";
import { buildFormData, withQuery } from "./serviceUtils";

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
