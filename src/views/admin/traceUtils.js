export const PAGE_SIZE = 10;

export const DEFAULT_FILTERS = {
  traceId: "",
  conversationId: "",
  taskId: "",
  status: ""
};

export const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "running", label: "运行中" },
  { value: "success", label: "成功" },
  { value: "failed", label: "失败" }
];

export function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

export function statusLabel(status) {
  const normalized = normalizeStatus(status);
  if (!normalized) return "UNKNOWN";
  if (normalized === "success") return "SUCCESS";
  if (normalized === "failed") return "FAILED";
  if (normalized === "running") return "RUNNING";
  if (normalized === "timeout") return "TIMEOUT";
  return normalized.toUpperCase();
}

export function statusBadgeClass(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "failed" || normalized === "timeout") return "is-danger";
  if (normalized === "running") return "is-warn";
  if (normalized === "success") return "is-success";
  return "is-outline";
}

export function toTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = new Date(value).getTime();
  if (!Number.isNaN(parsed)) return parsed;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : null;
}

export function formatDateTime(value) {
  const timestamp = toTimestamp(value);
  if (timestamp === null) return "-";
  return new Date(timestamp).toLocaleString("zh-CN");
}

export function formatDuration(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  if (value < 1000) return `${Math.round(value)}ms`;
  if (value < 60000) return `${(value / 1000).toFixed(2)}s`;
  const minute = Math.floor(value / 60000);
  const second = ((value % 60000) / 1000).toFixed(1);
  return `${minute}m ${second}s`;
}

export function percentile(values, ratio) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.ceil(sorted.length * ratio) - 1));
  return sorted[index];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function resolveNodeDuration(node) {
  const durationMs = Number(node.durationMs ?? 0);
  if (Number.isFinite(durationMs) && durationMs > 0) return durationMs;
  const start = toTimestamp(node.startTime);
  const end = toTimestamp(node.endTime);
  if (start !== null && end !== null && end >= start) return end - start;
  return 0;
}
