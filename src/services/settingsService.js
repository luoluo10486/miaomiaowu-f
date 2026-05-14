import { requestRag } from "./ragService";

export function getSystemSettings() {
  return requestRag("/rag/settings");
}
