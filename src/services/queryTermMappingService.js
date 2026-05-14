import { requestRag } from "./ragService";
import { withQuery } from "./serviceUtils";

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
