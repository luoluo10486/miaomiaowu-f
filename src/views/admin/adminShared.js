export const adminNavGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Trace Runs", to: "/admin/traces" }
    ]
  },
  {
    title: "Knowledge",
    items: [
      { label: "Knowledge Bases", to: "/admin/knowledge" },
      { label: "Intent Tree", to: "/admin/intent-tree" },
      { label: "Mappings", to: "/admin/mappings" },
      { label: "Sample Questions", to: "/admin/sample-questions" }
    ]
  },
  {
    title: "System",
    items: [
      { label: "Ingestion", to: "/admin/ingestion" },
      { label: "Users", to: "/admin/users" },
      { label: "Settings", to: "/admin/settings" }
    ]
  }
];

export function formatDateTime(value) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatRelativeStatus(value) {
  if (!value) {
    return "--";
  }

  return String(value).replace(/_/g, " ");
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function pageRecords(page) {
  return safeArray(page?.records);
}

export function pageTotal(page) {
  return Number(page?.total ?? page?.records?.length ?? 0);
}

export function trimPromptValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function askText(message, defaultValue = "") {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const result = window.prompt(message, defaultValue);
  if (result === null) {
    return null;
  }

  return result.trim();
}

export function askNumber(message, defaultValue = "") {
  const input = askText(message, String(defaultValue ?? ""));
  if (input === null || input === "") {
    return input;
  }

  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}

export function confirmAction(message) {
  if (typeof window === "undefined") {
    return true;
  }

  return window.confirm(message);
}

export function normalizeBooleanLabel(value) {
  return value ? "Enabled" : "Disabled";
}

export function flattenIntentTree(nodes = [], depth = 0, parent = null) {
  return safeArray(nodes).flatMap((node) => {
    const current = {
      ...node,
      depth,
      parentName: parent?.name || ""
    };

    return [current, ...flattenIntentTree(node.children || [], depth + 1, current)];
  });
}

export function escapeHtml(raw = "") {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
