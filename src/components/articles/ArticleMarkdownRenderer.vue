<script setup>
import { computed } from "vue";
import { marked } from "marked";
import { useRouter } from "vue-router";
import { createHeadingId, stripMarkdownDecorators } from "../../utils/articleAnchors";

const props = defineProps({
  catalog: {
    type: Array,
    default: () => []
  },
  content: {
    type: String,
    default: ""
  }
});

const router = useRouter();

function escapeAttribute(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripHtmlTags(value = "") {
  return String(value).replace(/<[^>]*>/g, " ");
}

const articleSlugLookup = computed(() => {
  const lookup = new Map();

  for (const article of props.catalog) {
    lookup.set(article.slug, article.slug);
    lookup.set(article.fileName?.replace(/\.md$/i, ""), article.slug);
  }

  return lookup;
});

function resolveInternalArticleLink(href = "") {
  const normalized = decodeURIComponent(String(href))
    .replace(/\\/g, "/")
    .trim();

  const match = normalized.match(/([^/]+)\.md(?:[#?].*)?$/i);
  if (!match) {
    return null;
  }

  return articleSlugLookup.value.get(match[1]) || null;
}

const renderedHtml = computed(() => {
  let headingIndex = 0;

  try {
    const renderer = new marked.Renderer();

    renderer.heading = function heading({ tokens, depth }) {
      const inlineHtml = this.parser.parseInline(tokens);
      const titleText = stripHtmlTags(inlineHtml);

      if (depth === 1) {
        return "";
      }

      if (depth === 2 || depth === 3) {
        const id = createHeadingId(stripMarkdownDecorators(titleText), headingIndex);
        headingIndex += 1;
        return `<h${depth} id="${id}">${inlineHtml}</h${depth}>`;
      }

      return `<h${depth}>${inlineHtml}</h${depth}>`;
    };

    renderer.link = function link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      const internalSlug = resolveInternalArticleLink(href);

      if (internalSlug) {
        return `<a href="/articles/${encodeURIComponent(internalSlug)}" data-article-link="${escapeAttribute(internalSlug)}">${label}</a>`;
      }

      const safeHref = escapeAttribute(href || "#");
      const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";

      return `<a href="${safeHref}"${titleAttribute} target="_blank" rel="noreferrer">${label}</a>`;
    };

    return marked.parse(props.content || "", {
      gfm: true,
      breaks: true,
      renderer
    });
  } catch (error) {
    console.error(error);
    return `
      <div class="article-markdown__fallback">
        <p>当前文章渲染失败，请稍后重试。</p>
      </div>
    `;
  }
});

function handleContentClick(event) {
  const internalLink = event.target.closest("a[data-article-link]");
  if (!internalLink) {
    return;
  }

  event.preventDefault();
  const slug = internalLink.getAttribute("data-article-link");

  if (slug) {
    router.push(`/articles/${encodeURIComponent(slug)}`);
  }
}
</script>

<template>
  <div class="article-markdown" v-html="renderedHtml" @click="handleContentClick" />
</template>

<style scoped>
.article-markdown {
  color: var(--article-ink, #1e221e);
  font-size: 16px;
  line-height: 1.92;
  word-break: break-word;
}

.article-markdown :deep(*) {
  scroll-margin-top: 124px;
}

.article-markdown :deep(p) {
  margin: 0 0 1.2rem;
}

.article-markdown :deep(p:first-of-type) {
  font-size: 1.08rem;
  color: rgba(30, 34, 30, 0.9);
}

.article-markdown :deep(h2),
.article-markdown :deep(h3),
.article-markdown :deep(h4) {
  margin: 2.4rem 0 0.9rem;
  color: #181d18;
  line-height: 1.2;
}

.article-markdown :deep(h2) {
  font-family: "STSong", "Songti SC", "Noto Serif SC", serif;
  font-size: clamp(1.7rem, 2vw, 2.2rem);
  font-weight: 700;
  letter-spacing: 0.01em;
}

.article-markdown :deep(h3) {
  font-size: 1.26rem;
  font-weight: 700;
}

.article-markdown :deep(h4) {
  font-size: 1.05rem;
  font-weight: 700;
}

.article-markdown :deep(ul),
.article-markdown :deep(ol) {
  margin: 0 0 1.35rem;
  padding-left: 1.4rem;
}

.article-markdown :deep(li + li) {
  margin-top: 0.42rem;
}

.article-markdown :deep(blockquote) {
  margin: 1.45rem 0;
  padding: 1rem 1.2rem 1rem 1.35rem;
  border-left: 3px solid rgba(135, 110, 66, 0.7);
  border-radius: 0 18px 18px 0;
  background: linear-gradient(135deg, rgba(255, 248, 236, 0.88), rgba(246, 240, 223, 0.55));
  color: rgba(42, 45, 40, 0.86);
}

.article-markdown :deep(code) {
  padding: 0.16rem 0.38rem;
  border-radius: 0.55rem;
  background: rgba(44, 52, 44, 0.07);
  color: #1b2a1f;
  font-family: "Cascadia Code", Consolas, "SFMono-Regular", monospace;
  font-size: 0.92em;
}

.article-markdown :deep(pre) {
  overflow-x: auto;
  margin: 1.5rem 0;
  padding: 1.1rem 1.2rem;
  border: 1px solid rgba(28, 38, 28, 0.08);
  border-radius: 1.1rem;
  background:
    linear-gradient(180deg, rgba(32, 37, 32, 0.94), rgba(20, 24, 20, 0.98)),
    radial-gradient(circle at top left, rgba(154, 202, 156, 0.14), transparent 36%);
  color: rgba(242, 247, 242, 0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.article-markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.article-markdown :deep(table) {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 48px rgba(24, 30, 24, 0.06);
}

.article-markdown :deep(th),
.article-markdown :deep(td) {
  padding: 0.9rem 0.95rem;
  border: 1px solid rgba(38, 44, 38, 0.08);
  text-align: left;
  vertical-align: top;
}

.article-markdown :deep(th) {
  background: rgba(243, 238, 226, 0.85);
  font-weight: 700;
}

.article-markdown :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid rgba(29, 33, 29, 0.12);
}

.article-markdown :deep(a) {
  color: #6d4a17;
  text-decoration: none;
  border-bottom: 1px solid rgba(109, 74, 23, 0.28);
  transition: color 0.25s ease, border-color 0.25s ease;
}

.article-markdown :deep(a:hover) {
  color: #2e5d49;
  border-color: rgba(46, 93, 73, 0.52);
}

.article-markdown :deep(img) {
  display: block;
  max-width: 100%;
  margin: 1.5rem auto;
  border-radius: 1.2rem;
  box-shadow: 0 22px 54px rgba(22, 28, 22, 0.16);
}

.article-markdown :deep(.article-markdown__fallback) {
  padding: 1.1rem 1.2rem;
  border: 1px solid rgba(146, 68, 61, 0.18);
  border-radius: 1rem;
  background: rgba(146, 68, 61, 0.06);
  color: #7c352f;
}

@media (max-width: 720px) {
  .article-markdown {
    font-size: 15px;
    line-height: 1.84;
  }
}
</style>
