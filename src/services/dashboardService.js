import { requestRag } from "./ragService";
import { withQuery } from "./serviceUtils";

export function getAdminDashboardOverview(window = "24h") {
  return requestRag(withQuery("/admin/dashboard/overview", { window }));
}

export function getAdminDashboardPerformance(window = "24h") {
  return requestRag(withQuery("/admin/dashboard/performance", { window }));
}

export function getAdminDashboardTrends(metric = "sessions", window = "7d", granularity = "day") {
  return requestRag(withQuery("/admin/dashboard/trends", { metric, window, granularity }));
}
