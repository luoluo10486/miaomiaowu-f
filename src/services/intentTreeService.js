import { requestRag } from "./ragService";

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
