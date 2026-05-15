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
  color: #0f172a;
  font-size: 14px;
  line-height: 1.75;
  word-break: break-word;
}

.rag-markdown :deep(p) {
  margin: 0 0 0.9em;
}

.rag-markdown :deep(p:last-child) {
  margin-bottom: 0;
}

.rag-markdown :deep(h1),
.rag-markdown :deep(h2),
.rag-markdown :deep(h3),
.rag-markdown :deep(h4) {
  margin: 1em 0 0.5em;
  color: #0f172a;
  line-height: 1.35;
  font-weight: 700;
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
  border-left: 3px solid rgba(37, 99, 235, 0.35);
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.06);
  color: #334155;
}

.rag-markdown :deep(code) {
  padding: 0.15em 0.35em;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.06);
  color: #7c2d12;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.95em;
}

.rag-markdown :deep(pre) {
  overflow-x: auto;
  margin: 0.9em 0;
  padding: 14px 16px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.94);
  color: #f8fafc;
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
}

.rag-markdown :deep(th),
.rag-markdown :deep(td) {
  padding: 8px 10px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  text-align: left;
}

.rag-markdown :deep(th) {
  background: rgba(37, 99, 235, 0.08);
  font-weight: 600;
}

.rag-markdown :deep(hr) {
  margin: 1.1em 0;
  border: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
}
</style>
