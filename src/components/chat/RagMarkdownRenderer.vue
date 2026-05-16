<script setup>
import { computed } from "vue";
import { marked } from "marked";

const props = defineProps({
  content: {
    type: String,
    default: ""
  }
});

function escapeHtml(raw = "") {
  return String(raw)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const renderedHtml = computed(() =>
  marked.parse(escapeHtml(props.content || ""), {
    gfm: true,
    breaks: true
  })
);
</script>

<template>
  <div class="rag-markdown" v-html="renderedHtml" />
</template>

<style scoped>
.rag-markdown {
  color: #333333;
  font-size: 14px;
  line-height: 1.75;
  word-break: break-word;
  font-variant-numeric: tabular-nums;
}

.rag-markdown :deep(p) {
  margin: 0 0 0.85em;
}

.rag-markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.rag-markdown :deep(h1),
.rag-markdown :deep(h2),
.rag-markdown :deep(h3),
.rag-markdown :deep(h4) {
  margin: 1.1em 0 0.55em;
  color: #1a1a1a;
  line-height: 1.35;
  font-weight: 700;
}

.rag-markdown :deep(h1) {
  font-size: 1.35em;
}

.rag-markdown :deep(h2) {
  font-size: 1.2em;
}

.rag-markdown :deep(h3) {
  font-size: 1.08em;
}

.rag-markdown :deep(ul),
.rag-markdown :deep(ol) {
  margin: 0.5em 0 0.9em;
  padding-left: 1.3em;
}

.rag-markdown :deep(li + li) {
  margin-top: 0.3em;
}

.rag-markdown :deep(blockquote) {
  margin: 0.9em 0;
  padding: 0.8em 1em;
  border-left: 4px solid #3b82f6;
  background: #f0f7ff;
  color: #333333;
}

.rag-markdown :deep(code) {
  padding: 0.15em 0.35em;
  border-radius: 6px;
  background: #f6f8fa;
  color: #24292f;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.95em;
}

.rag-markdown :deep(pre) {
  overflow-x: auto;
  margin: 0.9em 0;
  padding: 14px 16px;
  border: 1px solid #d0d7de;
  border-radius: 12px;
  background: #f6f8fa;
  color: #24292f;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  line-height: 1.7;
}

.rag-markdown :deep(pre code) {
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-size: inherit;
}

.rag-markdown :deep(table) {
  width: 100%;
  margin: 0.9em 0;
  border-collapse: collapse;
  font-size: 13px;
  overflow: hidden;
  border: 1px solid #d0d7de;
  border-radius: 12px;
}

.rag-markdown :deep(th),
.rag-markdown :deep(td) {
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  text-align: left;
}

.rag-markdown :deep(th) {
  background: #f6f8fa;
  color: #24292f;
  font-weight: 600;
}

.rag-markdown :deep(hr) {
  margin: 1.1em 0;
  border: 0;
  border-top: 1px solid #d0d7de;
}

.rag-markdown :deep(img) {
  display: block;
  max-width: 100%;
  margin: 0.9em 0;
  border-radius: 12px;
}

.rag-markdown :deep(a) {
  color: #0969da;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.rag-markdown :deep(a:hover) {
  color: #0969da;
}
</style>
