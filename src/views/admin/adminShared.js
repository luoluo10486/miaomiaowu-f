export const adminNavGroups = [
  {
    title: "导航",
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
    title: "设置",
    items: [
      { label: "用户管理", to: "/admin/users", icon: "●" },
      { label: "示例问题", to: "/admin/sample-questions", icon: "◈" },
      { label: "系统设置", to: "/admin/settings", icon: "⚙" }
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

export function pageCount(page) {
  const total = pageTotal(page);
  const size = Number(page?.size ?? 50);
  return size > 0 ? Math.max(1, Math.ceil(total / size)) : 1;
}

export function normalizeBooleanLabel(value) {
  return value ? "Enabled" : "Disabled";
}

export function flattenIntentTree(nodes = [], depth = 0, parent = null, parentNames = [], parentCodes = []) {
  return safeArray(nodes).flatMap((node) => {
    const currentNames = [...parentNames, node.name];
    const currentCodes = [...parentCodes, node.intentCode];
    const children = node.children || [];
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
  if (!value) return 0;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.length;
  } catch {}
  return String(value).split("\n").filter(Boolean).length;
}

export function parseIntentExamples(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }
  } catch {
    // fall through to plain text parsing
  }

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveIntentLevelLabel(value) {
  const map = {
    0: "DOMAIN",
    1: "CATEGORY",
    2: "TOPIC"
  };
  return map[value] || "UNKNOWN";
}

export function resolveIntentKindLabel(value) {
  const map = {
    0: "KB",
    1: "SYSTEM",
    2: "MCP"
  };
  return map[value] || "UNKNOWN";
}

export function resolveIntentKindBadgeClass(value) {
  if (value === 2) {
    return "is-primary";
  }
  if (value === 1) {
    return "is-muted";
  }
  return "is-info";
}

export function findIntentNodeById(nodes = [], id) {
  for (const node of safeArray(nodes)) {
    if (String(node.id) === String(id)) {
      return node;
    }
    const found = findIntentNodeById(node.children || [], id);
    if (found) {
      return found;
    }
  }
  return null;
}

export function escapeHtml(raw = "") {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
