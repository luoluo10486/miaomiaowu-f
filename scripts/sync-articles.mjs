import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHeadingId, stripMarkdownDecorators } from "../src/utils/articleAnchors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const sourceDir = process.env.ARTICLE_SOURCE_DIR || "D:\\develop\\Java-notes\\Notes";
const publicArticlesDir = path.join(projectRoot, "public", "articles");
const manifestOutputPath = path.join(projectRoot, "src", "data", "articleManifest.js");

const skippedFiles = new Set(["README copy.md"]);

const categoryRules = [
  { label: "RAG 架构", keywords: ["ragent", "rag", "streamchatpipeline", "全链路", "追踪"] },
  { label: "知识库", keywords: ["知识库", "知识问答"] },
  { label: "数据库", keywords: ["mysql"] },
  { label: "指南", keywords: ["readme", "手册"] }
];

function resolveCategory(title, fileName) {
  const sample = `${title} ${fileName}`.toLowerCase();

  for (const rule of categoryRules) {
    if (rule.keywords.some((keyword) => sample.includes(keyword.toLowerCase()))) {
      return rule.label;
    }
  }

  return "工程随记";
}

function resolvePriority(title, fileName) {
  const sample = `${title} ${fileName}`;

  if (sample.includes("学习手册")) return 100;
  if (sample.includes("总览")) return 92;
  if (sample.includes("完整链路")) return 86;
  if (sample.includes("总结")) return 80;
  if (sample.toLowerCase().includes("readme")) return 20;
  return 60;
}

function estimateReadMinutes(content) {
  const cjkCount = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const latinWordCount = (content.match(/[A-Za-z0-9_]+/g) || []).length;
  const readingUnits = cjkCount + latinWordCount;
  return Math.max(3, Math.round(readingUnits / 320));
}

function extractTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  return stripMarkdownDecorators(match?.[1] || fallback) || fallback;
}

function extractExcerpt(content, title) {
  const paragraphs = content
    .split(/\r?\n\r?\n/)
    .map((chunk) => chunk.replace(/\r?\n/g, " ").trim())
    .filter(Boolean)
    .filter(
      (chunk) =>
        !chunk.startsWith("#") &&
        !chunk.startsWith(">") &&
        !chunk.startsWith("|") &&
        !chunk.startsWith("```") &&
        !chunk.startsWith("![")
    );

  const candidate = paragraphs.find((chunk) => stripMarkdownDecorators(chunk) && !chunk.includes(title)) || paragraphs[0] || "";
  const cleaned = stripMarkdownDecorators(candidate);
  return cleaned.length > 118 ? `${cleaned.slice(0, 118).trim()}...` : cleaned;
}

function extractHeadings(content) {
  const headings = [];
  const seenIds = new Set();

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) {
      continue;
    }

    const text = stripMarkdownDecorators(match[2]);
    if (!text) {
      continue;
    }

    let id = createHeadingId(text, headings.length);
    while (seenIds.has(id)) {
      id = `${id}-alt`;
    }

    seenIds.add(id);

    headings.push({
      depth: match[1].length,
      text,
      id
    });
  }

  return headings;
}

function buildManifestModule(articles) {
  return `export const articleManifest = ${JSON.stringify(articles, null, 2)};\n\nexport default articleManifest;\n`;
}

async function main() {
  await fs.mkdir(publicArticlesDir, { recursive: true });

  const sourceEntries = await fs.readdir(sourceDir, { withFileTypes: true });
  const files = sourceEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .filter((fileName) => !skippedFiles.has(fileName))
    .sort((left, right) => left.localeCompare(right, "zh-CN"));

  const articles = [];

  for (const fileName of files) {
    const sourcePath = path.join(sourceDir, fileName);
    const outputPath = path.join(publicArticlesDir, fileName);
    const content = await fs.readFile(sourcePath, "utf8");
    const stats = await fs.stat(sourcePath);
    const slug = path.basename(fileName, ".md");
    const title = extractTitle(content, slug);
    const headings = extractHeadings(content);
    const readMinutes = estimateReadMinutes(content);

    await fs.copyFile(sourcePath, outputPath);

    articles.push({
      slug,
      title,
      fileName,
      category: resolveCategory(title, fileName),
      excerpt: extractExcerpt(content, title),
      readTime: `${readMinutes} min`,
      readingUnits: (content.match(/[A-Za-z0-9_\u4e00-\u9fff]/g) || []).length,
      sectionCount: headings.filter((heading) => heading.depth === 2).length || headings.length,
      headingCount: headings.length,
      updatedAt: stats.mtime.toISOString(),
      priority: resolvePriority(title, fileName),
      headings
    });
  }

  articles.sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }

    return left.title.localeCompare(right.title, "zh-CN");
  });

  await fs.writeFile(manifestOutputPath, buildManifestModule(articles), "utf8");

  console.log(`Synced ${articles.length} articles from ${sourceDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
