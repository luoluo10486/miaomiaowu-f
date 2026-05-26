const DEFAULT_API_BASE_URL = "/api/ragent";

export const API_BASE_URL = (import.meta.env.VITE_RAG_API_BASE_URL || DEFAULT_API_BASE_URL)
  .trim()
  .replace(/\/$/, "");

export function joinApiPath(path, baseUrl = API_BASE_URL) {
  const normalizedBaseUrl = String(baseUrl || "").trim().replace(/\/$/, "");
  const normalizedPath = String(path || "").trim().startsWith("/") ? String(path || "").trim() : `/${String(path || "").trim()}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}
