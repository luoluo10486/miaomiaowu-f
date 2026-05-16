export const adminNavGroups = [
  {
    title: "导航",
    items: [
      { label: "Dashboard", to: "/admin/dashboard", icon: "DB" },
      { label: "知识库管理", to: "/admin/knowledge", icon: "KB" },
      {
        id: "intent",
        label: "意图管理",
        to: "/admin/intent-tree",
        icon: "IT",
        children: [
          { label: "意图树配置", to: "/admin/intent-tree", icon: "TR" },
          { label: "意图列表", to: "/admin/intent-list", icon: "LS" }
        ]
      },
      {
        id: "ingestion",
        label: "数据通道",
        to: "/admin/ingestion",
        icon: "IN",
        children: [
          { label: "流水线管理", to: "/admin/ingestion?tab=pipelines", icon: "PL" },
          { label: "流水线任务", to: "/admin/ingestion?tab=tasks", icon: "TS" }
        ]
      },
      { label: "关键词映射", to: "/admin/mappings", icon: "MP" },
      { label: "链路追踪", to: "/admin/traces", icon: "TR" }
    ]
  },
  {
    title: "设置",
    items: [
      { label: "用户管理", to: "/admin/users", icon: "US" },
      { label: "示例问题", to: "/admin/sample-questions", icon: "SQ" },
      { label: "系统设置", to: "/admin/settings", icon: "ST" }
    ]
  }
];

export function formatDateTime(value) {
  if (!value && value !== 0) {
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
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}

export function formatDuration(value) {
  if (value === null || value === undefined) {
    return "--";
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "--";
  }

  if (numeric < 1000) {
    return `${Math.round(numeric)}ms`;
  }

  if (numeric < 60000) {
    return `${(numeric / 1000).toFixed(2)}s`;
  }

  const minutes = Math.floor(numeric / 60000);
  const seconds = ((numeric % 60000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
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

export function pageCount(page) {
  const total = pageTotal(page);
  const size = Number(page?.size ?? 50);
  return size > 0 ? Math.max(1, Math.ceil(total / size)) : 1;
}

export function normalizeBooleanLabel(value) {
  return value ? "启用" : "禁用";
}

export function flattenIntentTree(nodes = [], depth = 0, parent = null, parentNames = [], parentCodes = []) {
  return safeArray(nodes).flatMap((node) => {
    const children = safeArray(node.children);
    const currentNames = [...parentNames, node.name];
    const currentCodes = [...parentCodes, node.intentCode];
    const current = {
      ...node,
      depth,
      parentName: parent?.name || "",
      parentCode: node.parentCode || parent?.intentCode || null,
      pathText: currentNames.join(" > "),
      pathNames: currentNames,
      pathCodes: currentCodes,
      childCount: children.length,
      exampleCount: parseExamplesCount(node.examples)
    };

    return [current, ...flattenIntentTree(children, depth + 1, current, currentNames, currentCodes)];
  });
}

function parseExamplesCount(value) {
  if (!value) {
    return 0;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.length;
    }
  } catch {
    // ignore parse errors
  }

  return String(value).split("\n").filter(Boolean).length;
}

export function escapeHtml(raw = "") {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
