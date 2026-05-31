<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";
import ArticleMarkdownRenderer from "../components/articles/ArticleMarkdownRenderer.vue";
import articleManifest from "../data/articleManifest.js";
import { resolvePublicAssetUrl } from "../utils/assets";

const router = useRouter();
const route = useRoute();

const pageRef = ref(null);
const readerBodyRef = ref(null);
const articleContent = ref("");
const articleError = ref("");
const articleLoading = ref(false);
const searchTerm = ref("");
const activeCategory = ref("全部");
const readingProgress = ref(0);
const activeHeadingId = ref("");

const contentCache = new Map();
let animationContext = null;

const catalog = articleManifest.map((item) => ({ ...item }));

const routeSlug = computed(() =>
  typeof route.params.slug === "string" ? decodeURIComponent(route.params.slug) : ""
);

const categories = computed(() => [
  "全部",
  ...new Set(catalog.map((item) => item.category))
]);

const filteredArticles = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase();

  return catalog.filter((item) => {
    const inCategory =
      activeCategory.value === "全部" || item.category === activeCategory.value;

    if (!inCategory) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    return `${item.title} ${item.excerpt} ${item.fileName}`
      .toLowerCase()
      .includes(keyword);
  });
});

const fallbackArticle = computed(() => filteredArticles.value[0] || catalog[0] || null);

const currentArticle = computed(() => {
  if (routeSlug.value) {
    return catalog.find((item) => item.slug === routeSlug.value) || fallbackArticle.value;
  }

  return fallbackArticle.value;
});

const outlineHeadings = computed(() => {
  const headings = currentArticle.value?.headings || [];
  const major = headings.filter((item) => item.depth === 2);
  return (major.length ? major : headings).slice(0, 12);
});

const currentIndex = computed(() =>
  currentArticle.value ? catalog.findIndex((item) => item.slug === currentArticle.value.slug) : -1
);

const previousArticle = computed(() =>
  currentIndex.value > 0 ? catalog[currentIndex.value - 1] : null
);

const nextArticle = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < catalog.length - 1
    ? catalog[currentIndex.value + 1]
    : null
);

function formatDate(dateString) {
  if (!dateString) {
    return "刚刚同步";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "刚刚同步";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

async function selectArticle(slug, replace = false) {
  if (!slug) {
    return;
  }

  const target = `/articles/${encodeURIComponent(slug)}`;
  if (replace) {
    await router.replace(target);
    return;
  }

  await router.push(target);
}

function goBackToWorkspace() {
  router.push("/workspace");
}

function resetFilters() {
  searchTerm.value = "";
  activeCategory.value = "全部";
}

function scrollToHeading(headingId) {
  const escapedId =
    typeof window !== "undefined" && window.CSS?.escape
      ? window.CSS.escape(headingId)
      : headingId;

  const target = readerBodyRef.value?.querySelector(`#${escapedId}`);
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function updateReadingProgress() {
  const body = readerBodyRef.value;
  if (!body) {
    readingProgress.value = 0;
    activeHeadingId.value = "";
    return;
  }

  const rect = body.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const totalDistance = Math.max(body.offsetHeight - viewportHeight * 0.68, 1);
  const travelled = Math.min(
    Math.max(viewportHeight * 0.2 - rect.top, 0),
    totalDistance
  );

  readingProgress.value = totalDistance > 0 ? travelled / totalDistance : 0;

  const headings = [...body.querySelectorAll("h2[id], h3[id]")];
  const current = headings
    .filter((heading) => heading.getBoundingClientRect().top <= 170)
    .at(-1);

  activeHeadingId.value = current?.id || headings[0]?.id || "";
}

function handleWindowScroll() {
  updateReadingProgress();
}

async function loadArticleContent(article) {
  if (!article) {
    articleContent.value = "";
    return;
  }

  articleLoading.value = true;
  articleError.value = "";

  try {
    if (contentCache.has(article.slug)) {
      articleContent.value = contentCache.get(article.slug);
    } else {
      const response = await fetch(
        resolvePublicAssetUrl(`articles/${encodeURIComponent(article.fileName)}`)
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${article.fileName}`);
      }

      const content = (await response.text()).replace(/^\uFEFF/, "");
      contentCache.set(article.slug, content);
      articleContent.value = content;
    }

    await nextTick();
    updateReadingProgress();
  } catch (error) {
    console.error(error);
    articleContent.value = "";
    articleError.value = "文章内容加载失败，请稍后再试。";
  } finally {
    articleLoading.value = false;
  }
}

function setupEntranceAnimation() {
  animationContext?.revert();

  animationContext = gsap.context(() => {
    gsap.from(".article-fade-up", {
      autoAlpha: 0,
      y: 20,
      duration: 0.72,
      ease: "power2.out",
      stagger: 0.06
    });
  }, pageRef.value);
}

async function hydrateCurrentArticle(previousPath = "") {
  const article = currentArticle.value;
  if (!article) {
    articleContent.value = "";
    return;
  }

  const hasMismatchedSlug = Boolean(routeSlug.value) && routeSlug.value !== article.slug;

  await loadArticleContent(article);

  if (hasMismatchedSlug) {
    await selectArticle(article.slug, true);
  }

  if (route.fullPath !== previousPath) {
    window.scrollTo({
      top: 0,
      behavior: previousPath ? "smooth" : "auto"
    });
  }
}

watch(
  () => route.fullPath,
  async (nextPath, previousPath = "") => {
    await hydrateCurrentArticle(previousPath);
  },
  { immediate: true }
);

watch(
  filteredArticles,
  (list) => {
    if (!list.length) {
      articleContent.value = "";
      return;
    }

    const currentSlug = currentArticle.value?.slug;
    if (!currentSlug || !list.some((item) => item.slug === currentSlug)) {
      void selectArticle(list[0].slug, true);
    }
  }
);

onMounted(async () => {
  await nextTick();
  setupEntranceAnimation();
  await hydrateCurrentArticle();
  updateReadingProgress();
  window.addEventListener("scroll", handleWindowScroll, { passive: true });
  window.addEventListener("resize", handleWindowScroll);
});

onBeforeUnmount(() => {
  animationContext?.revert();
  window.removeEventListener("scroll", handleWindowScroll);
  window.removeEventListener("resize", handleWindowScroll);
});
</script>

<template>
  <section ref="pageRef" class="articles-page">
    <header class="articles-header article-fade-up">
      <div>
        <button type="button" class="header-link" @click="goBackToWorkspace">返回控制台</button>
        <h1>文章馆</h1>
        <p>整理后的 Markdown 长文阅读页。</p>
      </div>

      <div class="header-meta">
        <span>{{ catalog.length }} 篇文章</span>
        <span>{{ categories.length - 1 }} 个主题</span>
        <span>{{ currentArticle?.readTime || "--" }}</span>
      </div>
    </header>

    <div class="articles-layout">
      <aside class="article-sidebar article-fade-up">
        <div class="sidebar-card">
          <label class="search-box">
            <span>检索文章</span>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="搜索标题或摘要"
            />
          </label>

          <div class="category-pills">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              :class="{ 'is-active': activeCategory === category }"
              @click="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <button
            v-if="searchTerm || activeCategory !== '全部'"
            type="button"
            class="clear-button"
            @click="resetFilters"
          >
            清除筛选
          </button>
        </div>

        <div class="sidebar-card article-list-card">
          <div class="sidebar-title">
            <span>文章列表</span>
            <strong>{{ filteredArticles.length }}</strong>
          </div>

          <div v-if="filteredArticles.length" class="article-list">
            <button
              v-for="item in filteredArticles"
              :key="item.slug"
              type="button"
              :class="['article-item', { 'is-active': currentArticle?.slug === item.slug }]"
              @click="selectArticle(item.slug)"
            >
              <div class="article-item__top">
                <span>{{ item.category }}</span>
                <span>{{ item.readTime }}</span>
              </div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.excerpt }}</p>
            </button>
          </div>

          <div v-else class="sidebar-empty">
            当前筛选条件下没有匹配文章。
          </div>
        </div>
      </aside>

      <main class="article-main article-fade-up">
        <section class="article-summary">
          <div class="article-summary__copy">
            <span class="summary-kicker">{{ currentArticle?.category || "文章" }}</span>
            <h2>{{ currentArticle?.title || "文章加载中" }}</h2>
            <p>{{ currentArticle?.excerpt || "正在准备文章内容。" }}</p>
          </div>

          <div class="article-summary__facts">
            <article>
              <strong>{{ currentArticle?.readTime || "--" }}</strong>
              <span>阅读时间</span>
            </article>
            <article>
              <strong>{{ currentArticle?.sectionCount || 0 }}</strong>
              <span>章节数</span>
            </article>
            <article>
              <strong>{{ formatDate(currentArticle?.updatedAt) }}</strong>
              <span>最近同步</span>
            </article>
          </div>
        </section>

        <section class="reader-shell">
          <div class="reader-progress" aria-hidden="true">
            <span :style="{ width: `${readingProgress * 100}%` }" />
          </div>

          <div class="reader-layout">
            <div class="reader-column">
              <div v-if="articleLoading" class="reader-state">正在载入文章内容...</div>
              <div v-else-if="articleError" class="reader-state reader-state--error">
                {{ articleError }}
              </div>
              <article v-else ref="readerBodyRef" class="reader-body">
                <ArticleMarkdownRenderer :catalog="catalog" :content="articleContent" />
              </article>
            </div>

            <aside class="outline-column">
              <div class="outline-card">
                <div class="sidebar-title">
                  <span>目录</span>
                  <strong>{{ outlineHeadings.length }}</strong>
                </div>

                <div v-if="outlineHeadings.length" class="outline-list">
                  <button
                    v-for="heading in outlineHeadings"
                    :key="heading.id"
                    type="button"
                    :class="['outline-item', { 'is-active': activeHeadingId === heading.id }]"
                    @click="scrollToHeading(heading.id)"
                  >
                    {{ heading.text }}
                  </button>
                </div>

                <div v-else class="sidebar-empty">
                  这篇文章没有可提取的目录。
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section class="article-pagination article-fade-up">
          <button
            type="button"
            class="pager-button"
            :disabled="!previousArticle"
            @click="previousArticle && selectArticle(previousArticle.slug)"
          >
            {{ previousArticle ? `上一篇 · ${previousArticle.title}` : "已经是第一篇" }}
          </button>

          <button
            type="button"
            class="pager-button"
            :disabled="!nextArticle"
            @click="nextArticle && selectArticle(nextArticle.slug)"
          >
            {{ nextArticle ? `下一篇 · ${nextArticle.title}` : "已经是最后一篇" }}
          </button>
        </section>
      </main>
    </div>
  </section>
</template>

<style scoped>
.articles-page {
  --paper: #f5efe4;
  --surface: rgba(255, 251, 244, 0.92);
  --surface-soft: rgba(255, 255, 255, 0.68);
  --ink: #1f241f;
  --ink-soft: rgba(31, 36, 31, 0.68);
  --line: rgba(31, 36, 31, 0.08);
  --accent: #8a6f41;
  --accent-deep: #2d5849;
  min-height: 100vh;
  padding: 28px clamp(16px, 3vw, 32px) 48px;
  color: var(--ink);
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.86), transparent 24%),
    linear-gradient(180deg, #f6f1e7 0%, #eee5d8 100%);
}

.articles-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-end;
  margin: 0 auto 24px;
  max-width: 1480px;
}

.articles-header h1 {
  margin: 10px 0 0;
  font-family: "STSong", "Songti SC", "Noto Serif SC", serif;
  font-size: clamp(2rem, 4vw, 3.3rem);
  letter-spacing: -0.04em;
}

.articles-header p {
  margin: 10px 0 0;
  color: var(--ink-soft);
}

.header-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--accent-deep);
  font: inherit;
  cursor: pointer;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.header-meta span {
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  color: var(--ink-soft);
  font-size: 0.92rem;
}

.articles-layout {
  display: grid;
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  max-width: 1480px;
  margin: 0 auto;
}

.article-sidebar {
  position: sticky;
  top: 18px;
  display: grid;
  gap: 16px;
}

.sidebar-card,
.article-summary,
.reader-shell,
.article-pagination {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  box-shadow: 0 18px 42px rgba(32, 32, 28, 0.06);
  backdrop-filter: blur(18px);
}

.sidebar-card {
  padding: 18px;
}

.search-box {
  display: block;
}

.search-box span {
  display: block;
  margin-bottom: 10px;
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.search-box input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface-soft);
  color: var(--ink);
  font: inherit;
  outline: none;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.category-pills button,
.clear-button,
.article-item,
.outline-item,
.pager-button {
  font: inherit;
}

.category-pills button {
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: rgba(31, 36, 31, 0.05);
  color: var(--ink-soft);
  cursor: pointer;
}

.category-pills button.is-active,
.category-pills button:hover {
  background: rgba(45, 88, 73, 0.12);
  color: var(--accent-deep);
}

.clear-button {
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
}

.sidebar-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.sidebar-title span {
  color: var(--ink-soft);
  font-size: 0.88rem;
}

.article-list {
  display: grid;
  gap: 10px;
  max-height: calc(100vh - 250px);
  overflow: auto;
  padding-right: 4px;
}

.article-item {
  width: 100%;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.56);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.article-item:hover,
.article-item.is-active {
  transform: translateY(-2px);
  border-color: rgba(45, 88, 73, 0.18);
  box-shadow: 0 12px 28px rgba(32, 32, 28, 0.08);
}

.article-item__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--ink-soft);
  font-size: 0.8rem;
}

.article-item strong {
  display: block;
  margin-top: 8px;
  line-height: 1.5;
}

.article-item p {
  margin: 8px 0 0;
  color: var(--ink-soft);
  font-size: 0.88rem;
  line-height: 1.65;
}

.sidebar-empty {
  color: var(--ink-soft);
  line-height: 1.7;
}

.article-main {
  display: grid;
  gap: 18px;
}

.article-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  padding: 24px 26px;
}

.summary-kicker {
  display: inline-flex;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(138, 111, 65, 0.08);
  color: var(--accent);
  font-size: 0.82rem;
}

.article-summary h2 {
  margin: 14px 0 0;
  font-family: "STSong", "Songti SC", "Noto Serif SC", serif;
  font-size: clamp(1.9rem, 3.5vw, 2.7rem);
  line-height: 1.14;
  letter-spacing: -0.04em;
}

.article-summary p {
  margin: 12px 0 0;
  color: var(--ink-soft);
  line-height: 1.82;
}

.article-summary__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.article-summary__facts article {
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.54);
}

.article-summary__facts strong {
  display: block;
  font-size: 1rem;
}

.article-summary__facts span {
  display: block;
  margin-top: 5px;
  color: var(--ink-soft);
  font-size: 0.84rem;
}

.reader-shell {
  overflow: hidden;
}

.reader-progress {
  height: 4px;
  background: rgba(31, 36, 31, 0.06);
}

.reader-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #947744, #315c4d);
}

.reader-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 0;
}

.reader-column {
  min-width: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 252, 246, 0.58));
}

.reader-body,
.reader-state {
  padding: 34px clamp(22px, 4vw, 44px) 42px;
}

.reader-state {
  color: var(--ink-soft);
}

.reader-state--error {
  color: #92443d;
}

.outline-column {
  border-left: 1px solid var(--line);
  background: rgba(248, 242, 232, 0.72);
}

.outline-card {
  position: sticky;
  top: 18px;
  padding: 22px 18px;
}

.reader-body :deep(.article-markdown) {
  max-width: 860px;
  margin: 0 auto;
}

.outline-list {
  display: grid;
  gap: 8px;
}

.outline-item {
  padding: 10px 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--ink-soft);
  text-align: left;
  cursor: pointer;
}

.outline-item.is-active,
.outline-item:hover {
  background: rgba(45, 88, 73, 0.1);
  color: var(--accent-deep);
}

.article-pagination {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 14px;
}

.pager-button {
  min-height: 54px;
  padding: 12px 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.52);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.pager-button:disabled {
  color: rgba(31, 36, 31, 0.36);
  cursor: default;
}

@media (max-width: 1180px) {
  .reader-layout {
    grid-template-columns: 1fr;
  }

  .outline-column {
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .outline-card {
    position: relative;
    top: 0;
  }
}

@media (max-width: 920px) {
  .articles-header,
  .article-summary,
  .articles-layout {
    grid-template-columns: 1fr;
  }

  .article-sidebar {
    position: relative;
    top: 0;
  }

  .article-list {
    max-height: none;
  }

  .article-summary__facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .articles-page {
    padding-inline: 12px;
  }

  .reader-body,
  .reader-state {
    padding: 22px 18px 30px;
  }

  .article-pagination {
    grid-template-columns: 1fr;
  }
}
</style>
