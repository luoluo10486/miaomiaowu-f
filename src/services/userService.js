import { requestRag } from "./ragService";
import { withQuery } from "./serviceUtils";

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
