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

    return `${item.title || ""} ${item.excerpt || ""} ${item.fileName || ""}`
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

const currentArticleOrder = computed(() =>
  currentIndex.value >= 0 ? String(currentIndex.value + 1).padStart(2, "0") : "--"
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
      y: 18,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.05
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

watch(filteredArticles, (list) => {
  if (!list.length) {
    articleContent.value = "";
    return;
  }

  const currentSlug = currentArticle.value?.slug;
  if (!currentSlug || !list.some((item) => item.slug === currentSlug)) {
    void selectArticle(list[0].slug, true);
  }
});

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
    <header class="articles-hero article-fade-up">
      <div class="hero-topline">
        <button type="button" class="header-link" @click="goBackToWorkspace">返回控制台</button>
        <span>Reading Archive</span>
      </div>

      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">文章馆</p>
          <h1>让正文重新成为屏幕中心。</h1>
          <p class="hero-summary">
            上方负责选文与切换，下方只负责阅读。文章不再被长期挤在侧边栏旁边，而是回到完整、舒展的主视野里。
          </p>
        </div>

        <div class="hero-stats">
          <article>
            <span>馆藏总量</span>
            <strong>{{ catalog.length }}</strong>
          </article>
          <article>
            <span>主题分区</span>
            <strong>{{ categories.length - 1 }}</strong>
          </article>
          <article>
            <span>当前序号</span>
            <strong>{{ currentArticleOrder }}</strong>
          </article>
          <article>
            <span>阅读时长</span>
            <strong>{{ currentArticle?.readTime || "--" }}</strong>
          </article>
        </div>
      </div>
    </header>

    <section class="catalog-board article-fade-up">
      <div class="catalog-board__controls">
        <div class="catalog-heading">
          <p>馆藏索引</p>
          <h2>先选文章，再沉浸阅读</h2>
        </div>

        <label class="catalog-search">
          <span>检索文章</span>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="搜索标题、摘要或文件名"
          />
        </label>

        <div class="catalog-categories">
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

        <div class="catalog-tools">
          <span>共找到 {{ filteredArticles.length }} 篇文章</span>
          <button
            v-if="searchTerm || activeCategory !== '全部'"
            type="button"
            class="clear-button"
            @click="resetFilters"
          >
            清空筛选
          </button>
        </div>
      </div>

      <div v-if="filteredArticles.length" class="catalog-grid">
        <button
          v-for="(item, index) in filteredArticles"
          :key="item.slug"
          type="button"
          :class="['catalog-card', { 'is-active': currentArticle?.slug === item.slug }]"
          @click="selectArticle(item.slug)"
        >
          <div class="catalog-card__top">
            <span>{{ String(index + 1).padStart(2, "0") }}</span>
            <span>{{ item.readTime }}</span>
          </div>
          <p class="catalog-card__category">{{ item.category }}</p>
          <strong>{{ item.title }}</strong>
          <p class="catalog-card__excerpt">{{ item.excerpt || "暂无摘要" }}</p>
        </button>
      </div>

      <div v-else class="catalog-empty">
        当前筛选条件下没有匹配文章，请尝试调整关键词或分类。
      </div>
    </section>

    <main class="reader-stage">
      <section class="reading-intro article-fade-up">
        <div class="reading-intro__mark">{{ currentArticleOrder }}</div>

        <div class="reading-intro__main">
          <p class="reading-intro__eyebrow">{{ currentArticle?.category || "文章" }}</p>
          <h2>{{ currentArticle?.title || "正在载入文章" }}</h2>
          <p>{{ currentArticle?.excerpt || "内容正在准备中，稍后即可开始阅读。" }}</p>
        </div>

        <div class="reading-intro__meta">
          <div>
            <span>章节数</span>
            <strong>{{ currentArticle?.sectionCount || 0 }}</strong>
          </div>
          <div>
            <span>标题锚点</span>
            <strong>{{ currentArticle?.headingCount || 0 }}</strong>
          </div>
          <div>
            <span>最近更新</span>
            <strong>{{ formatDate(currentArticle?.updatedAt) }}</strong>
          </div>
        </div>
      </section>

      <section class="reader-shell article-fade-up">
        <div class="reader-progress" aria-hidden="true">
          <span :style="{ width: `${readingProgress * 100}%` }" />
        </div>

        <div class="reader-toolbar">
          <div class="reader-toolbar__heading">
            <p>阅读定位</p>
            <span>{{ outlineHeadings.length }} 节</span>
          </div>

          <div v-if="outlineHeadings.length" class="outline-strip">
            <button
              v-for="heading in outlineHeadings"
              :key="heading.id"
              type="button"
              :class="['outline-chip', { 'is-active': activeHeadingId === heading.id }]"
              @click="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </button>
          </div>

          <div v-else class="toolbar-empty">这篇文章暂时没有可提取的目录。</div>

          <div class="reader-pager">
            <button
              type="button"
              class="pager-card"
              :disabled="!previousArticle"
              @click="previousArticle && selectArticle(previousArticle.slug)"
            >
              <small>上一篇</small>
              <strong>{{ previousArticle?.title || "已经是第一篇" }}</strong>
            </button>

            <button
              type="button"
              class="pager-card"
              :disabled="!nextArticle"
              @click="nextArticle && selectArticle(nextArticle.slug)"
            >
              <small>下一篇</small>
              <strong>{{ nextArticle?.title || "已经是最后一篇" }}</strong>
            </button>
          </div>
        </div>

        <article class="reader-paper">
          <header class="reader-paper__head">
            <div>
              <p>馆内阅读</p>
            </div>
            <span>{{ Math.round(readingProgress * 100) }}%</span>
          </header>

          <div v-if="articleLoading" class="reader-state">正在载入文章内容...</div>
          <div v-else-if="articleError" class="reader-state reader-state--error">
            {{ articleError }}
          </div>
          <div v-else ref="readerBodyRef" class="reader-body">
            <ArticleMarkdownRenderer :catalog="catalog" :content="articleContent" />
          </div>
        </article>
      </section>
    </main>
  </section>
</template>

<style scoped>
.articles-page {
  --ink: #1e231f;
  --ink-soft: rgba(30, 35, 31, 0.7);
  --ink-faint: rgba(30, 35, 31, 0.46);
  --line: rgba(43, 35, 24, 0.12);
  --line-soft: rgba(43, 35, 24, 0.08);
  --accent: #996731;
  --accent-deep: #2a5448;
  --paper: rgba(254, 250, 243, 0.92);
  --paper-strong: rgba(255, 253, 249, 0.96);
  --dark: #1f2824;
  --dark-soft: rgba(244, 236, 221, 0.74);
  position: relative;
  min-height: 100vh;
  padding: 28px clamp(16px, 2.6vw, 34px) 64px;
  color: var(--ink);
  background:
    radial-gradient(circle at 10% 8%, rgba(255, 250, 240, 0.95), transparent 18%),
    radial-gradient(circle at 88% 14%, rgba(174, 126, 62, 0.18), transparent 20%),
    radial-gradient(circle at 80% 88%, rgba(42, 84, 72, 0.14), transparent 22%),
    linear-gradient(135deg, #f7f0e4 0%, #efe0ca 32%, #f8f3ea 64%, #ebdbc3 100%);
  overflow: hidden;
}

.articles-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.78), transparent 96%);
  opacity: 0.5;
}

.articles-page::after {
  content: "";
  position: fixed;
  inset: auto auto -14vh -10vw;
  width: min(42vw, 640px);
  height: min(42vw, 640px);
  border-radius: 50%;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.4), transparent 48%),
    radial-gradient(circle at 52% 52%, rgba(42, 84, 72, 0.08), transparent 62%);
  filter: blur(24px);
  pointer-events: none;
}

.articles-hero,
.catalog-board,
.reader-stage {
  width: min(1540px, 100%);
  margin: 0 auto;
  position: relative;
}

.articles-hero {
  margin-bottom: 20px;
  padding: 22px 24px 24px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(255, 251, 244, 0.88), rgba(248, 240, 227, 0.72));
  box-shadow:
    0 24px 72px rgba(48, 35, 21, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
}

.hero-topline {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  color: var(--ink-soft);
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.header-link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--accent-deep);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.8fr);
  gap: 28px;
  align-items: end;
  margin-top: 16px;
}

.hero-kicker,
.catalog-heading p,
.reading-intro__eyebrow,
.reader-toolbar__heading p,
.reader-paper__head p {
  margin: 0;
  color: var(--accent);
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 14px 0 0;
  max-width: 11ch;
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: clamp(2.5rem, 4.4vw, 4.6rem);
  line-height: 0.98;
  letter-spacing: -0.06em;
}

.hero-summary {
  max-width: 46rem;
  margin: 16px 0 0;
  color: var(--ink-soft);
  line-height: 1.85;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 22px;
}

.hero-stats article {
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.hero-stats span,
.reading-intro__meta span {
  display: block;
  color: var(--ink-faint);
  font-size: 0.84rem;
}

.hero-stats strong,
.reading-intro__meta strong {
  display: block;
  margin-top: 10px;
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: clamp(1.2rem, 1.8vw, 1.55rem);
}

.catalog-board {
  margin-bottom: 22px;
  padding: 18px 18px 20px;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(31, 40, 36, 0.98), rgba(25, 33, 29, 0.96));
  box-shadow:
    0 32px 84px rgba(16, 18, 16, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  color: #fbf2e2;
  overflow: hidden;
}

.catalog-board::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 28%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px 34px);
  pointer-events: none;
}

.catalog-board__controls {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(260px, 1fr) auto;
  gap: 18px 24px;
  align-items: end;
  padding: 6px 6px 18px;
  border-bottom: 1px solid rgba(251, 242, 226, 0.1);
}

.catalog-heading h2 {
  margin: 8px 0 0;
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: clamp(1.4rem, 2vw, 1.9rem);
  color: #fff7ea;
}

.catalog-search span {
  display: block;
  margin-bottom: 8px;
  color: var(--dark-soft);
  font-size: 0.86rem;
}

.catalog-search input {
  width: 100%;
  height: 46px;
  padding: 0 2px;
  border: 0;
  border-bottom: 1px solid rgba(251, 242, 226, 0.18);
  background: transparent;
  color: #fff9ee;
  font: inherit;
  outline: none;
}

.catalog-search input::placeholder {
  color: rgba(251, 242, 226, 0.42);
}

.catalog-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.catalog-categories button,
.catalog-card,
.outline-chip,
.pager-card,
.clear-button {
  font: inherit;
}

.catalog-categories button {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(251, 242, 226, 0.14);
  border-radius: 999px;
  background: transparent;
  color: var(--dark-soft);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.catalog-categories button:hover,
.catalog-categories button.is-active {
  background: rgba(251, 242, 226, 0.08);
  border-color: rgba(251, 242, 226, 0.24);
  color: #fff7ea;
  transform: translateY(-1px);
}

.catalog-tools {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  align-items: center;
  color: var(--dark-soft);
  font-size: 0.86rem;
}

.clear-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #f5d8aa;
  cursor: pointer;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.catalog-card {
  padding: 18px 18px 20px;
  border: 1px solid rgba(251, 242, 226, 0.08);
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015));
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease;
}

.catalog-card:hover,
.catalog-card.is-active {
  transform: translateY(-4px);
  border-color: rgba(251, 242, 226, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);
}

.catalog-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: rgba(251, 242, 226, 0.54);
  font-size: 0.8rem;
}

.catalog-card__category {
  margin: 18px 0 0;
  color: #d0b283;
  font-size: 0.82rem;
}

.catalog-card strong {
  display: block;
  margin-top: 8px;
  color: #fff8ec;
  font-size: 1.08rem;
  line-height: 1.45;
}

.catalog-card__excerpt {
  margin: 10px 0 0;
  color: rgba(251, 242, 226, 0.64);
  line-height: 1.7;
}

.catalog-empty,
.toolbar-empty,
.reader-state {
  color: var(--ink-soft);
  line-height: 1.72;
}

.catalog-empty {
  margin-top: 18px;
  color: var(--dark-soft);
}

.reader-stage {
  display: grid;
  gap: 22px;
}

.reading-intro {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) minmax(280px, 340px);
  gap: 22px 28px;
  align-items: start;
  padding: 22px 26px;
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.44);
  background:
    linear-gradient(135deg, rgba(255, 252, 246, 0.9), rgba(247, 238, 223, 0.84));
  box-shadow:
    0 24px 70px rgba(48, 35, 21, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.reading-intro__mark {
  color: rgba(153, 103, 49, 0.9);
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: clamp(2.2rem, 3vw, 3rem);
  line-height: 1;
}

.reading-intro__main h2 {
  margin: 8px 0 0;
  max-width: 18ch;
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.reading-intro__main p:last-child {
  margin: 10px 0 0;
  max-width: 56rem;
  color: var(--ink-soft);
  line-height: 1.76;
}

.reading-intro__meta {
  display: grid;
  gap: 16px;
}

.reading-intro__meta div {
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.reader-shell {
  overflow: hidden;
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.46);
  background:
    linear-gradient(180deg, rgba(255, 252, 246, 0.72), rgba(247, 239, 226, 0.82));
  box-shadow:
    0 30px 92px rgba(44, 31, 19, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.reader-progress {
  height: 4px;
  background: rgba(30, 35, 31, 0.06);
}

.reader-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #a36d35, #2a5448);
}

.reader-toolbar {
  padding: 16px 20px 14px;
  border-bottom: 1px solid rgba(43, 35, 24, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 252, 247, 0.72), rgba(248, 240, 228, 0.48));
}

.reader-toolbar__heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.reader-toolbar__heading span {
  color: var(--ink-faint);
  font-size: 0.84rem;
}

.outline-strip {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow: auto;
  padding-bottom: 4px;
}

.outline-chip {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(43, 35, 24, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.64);
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.outline-chip:hover,
.outline-chip.is-active {
  transform: translateY(-1px);
  color: var(--accent-deep);
  border-color: rgba(42, 84, 72, 0.16);
  background: rgba(255, 255, 255, 0.9);
}

.toolbar-empty {
  margin-top: 14px;
}

.reader-pager {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.pager-card {
  padding: 14px 16px;
  border: 1px solid rgba(43, 35, 24, 0.08);
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(248, 241, 230, 0.82));
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.pager-card:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(42, 84, 72, 0.14);
  box-shadow: 0 16px 34px rgba(48, 35, 21, 0.08);
}

.pager-card small {
  display: block;
  color: var(--ink-faint);
  font-size: 0.78rem;
}

.pager-card strong {
  display: block;
  margin-top: 8px;
  line-height: 1.56;
}

.pager-card:disabled {
  color: rgba(30, 35, 31, 0.36);
  cursor: default;
}

.reader-paper {
  margin: 22px;
  padding: clamp(22px, 3vw, 40px);
  border-radius: 30px;
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.98), rgba(250, 245, 237, 0.97));
  box-shadow:
    0 24px 64px rgba(47, 34, 20, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}

.reader-paper__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(43, 35, 24, 0.1);
}

.reader-paper__head span {
  color: var(--accent-deep);
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: 1.28rem;
  white-space: nowrap;
}

.reader-state {
  padding-top: 20px;
}

.reader-state--error {
  color: #92443d;
}

.reader-body {
  padding-top: 18px;
}

.reader-body :deep(.article-markdown) {
  max-width: 82ch;
  margin: 0 auto;
  --article-ink: #242820;
}

.reader-body :deep(.article-markdown p:first-of-type)::first-letter {
  float: left;
  margin: 0.12em 0.14em 0 0;
  color: var(--accent-deep);
  font-family:
    "Noto Serif SC",
    "Source Han Serif SC",
    "Songti SC",
    serif;
  font-size: 3.2rem;
  line-height: 0.8;
}

@media (max-width: 1320px) {
  .catalog-board__controls {
    grid-template-columns: minmax(220px, 260px) minmax(220px, 1fr);
  }

  .catalog-tools {
    grid-column: 1 / -1;
    justify-content: space-between;
  }

  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .reading-intro {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .reading-intro__meta {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy h1,
  .reading-intro__main h2 {
    max-width: none;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .reader-pager {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .catalog-board__controls,
  .reading-intro {
    grid-template-columns: 1fr;
  }

  .reading-intro__meta {
    grid-template-columns: 1fr;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .reader-paper {
    margin: 14px;
    padding: 22px 18px 26px;
  }
}

@media (max-width: 720px) {
  .articles-page {
    padding-inline: 12px;
  }

  .articles-hero,
  .catalog-board,
  .reading-intro,
  .reader-shell,
  .reader-paper {
    border-radius: 26px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .reader-toolbar {
    padding: 18px 16px 16px;
  }

  .outline-chip {
    min-height: 38px;
    padding-inline: 14px;
  }

  .reader-body :deep(.article-markdown p:first-of-type)::first-letter {
    font-size: 2.6rem;
  }
}
</style>
