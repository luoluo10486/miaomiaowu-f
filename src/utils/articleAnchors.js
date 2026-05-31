export function stripMarkdownDecorators(text = "") {
  return String(text)
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createHeadingId(text = "", index = 0) {
  const normalized = stripMarkdownDecorators(text)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\u4e00-\u9fff\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

  return normalized ? `section-${normalized}-${index + 1}` : `section-${index + 1}`;
}
