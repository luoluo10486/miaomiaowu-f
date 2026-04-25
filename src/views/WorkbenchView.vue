<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAdminDashboardOverview } from "../services/adminService";
import { clearStoredAuth, getStoredAuthUser } from "../utils/auth";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const currentUser = ref(getStoredAuthUser());
const overview = ref(null);
const overviewLoading = ref(false);
const overviewError = ref("");
const shellRef = ref(null);
const viewportRef = ref(null);
const trackRef = ref(null);
const progress = ref(0);
const activeChapter = ref(0);
const animationContext = ref(null);

const chapters = [
  { key: "opening", label: "开卷" },
  { key: "rag", label: "问答" },
  { key: "admin", label: "管理" },
  { key: "choice", label: "去处" }
];

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "当前用户";
});

const stats = computed(() => {
  const kpis = overview.value?.kpis;

  return [
    { label: "用户", value: kpis?.totalUsers?.value ?? "--" },
    { label: "活跃", value: kpis?.activeUsers?.value ?? "--" },
    { label: "会话", value: kpis?.totalSessions?.value ?? "--" },
    { label: "消息", value: kpis?.totalMessages?.value ?? "--" }
  ];
});

function scrollToChapter(index) {
  const trigger = ScrollTrigger.getById("workbench-horizontal-scroll");
  if (!trigger) {
    return;
  }

  const nextProgress = index / (chapters.length - 1);
  const nextScroll = trigger.start + (trigger.end - trigger.start) * nextProgress;
  window.scrollTo({
    top: nextScroll,
    behavior: "smooth"
  });
}

function handleLogout() {
  clearStoredAuth();
  router.push("/login");
}

async function loadOverview() {
  overviewLoading.value = true;
  overviewError.value = "";

  try {
    overview.value = await getAdminDashboardOverview();
  } catch (error) {
    overviewError.value = error?.message || "后台概览加载失败，请稍后重试";
  } finally {
    overviewLoading.value = false;
  }
}

function setupHorizontalStory() {
  animationContext.value?.revert();

  animationContext.value = gsap.context(() => {
    const track = trackRef.value;
    if (!track || !viewportRef.value || !shellRef.value) {
      return;
    }

    const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);
    const chapterItems = gsap.utils.toArray(".chapter-marker");

    gsap.set(".story-copy, .floating-entry, .final-choice", {
      autoAlpha: 0,
      y: 36,
      filter: "blur(10px)"
    });
    gsap.set(".watercolor-focus", {
      filter: "blur(18px)",
      scale: 0.94,
      autoAlpha: 0.55,
      transformOrigin: "50% 50%"
    });
    gsap.set(".story-copy--opening", {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)"
    });

    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        id: "workbench-horizontal-scroll",
        trigger: shellRef.value,
        pin: viewportRef.value,
        scrub: 0.9,
        start: "top top",
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.value = self.progress;
          activeChapter.value = Math.min(
            chapters.length - 1,
            Math.round(self.progress * (chapters.length - 1))
          );
        }
      }
    });

    chapterItems.forEach((item) => {
      const chapter = item.dataset.chapter;
      const copy = `.story-copy--${chapter}`;

      gsap.to(copy, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: ScrollTrigger.getById("workbench-horizontal-scroll")?.animation,
          start: "left 72%",
          toggleActions: "play none none reverse"
        }
      });
    });

    gsap.utils.toArray(".watercolor-focus").forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: ScrollTrigger.getById("workbench-horizontal-scroll")?.animation,
          start: "left 78%",
          end: "left 34%",
          scrub: true
        }
      });
    });

    gsap.utils.toArray(".floating-entry, .final-choice").forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: ScrollTrigger.getById("workbench-horizontal-scroll")?.animation,
          start: "left 68%",
          toggleActions: "play none none reverse"
        }
      });
    });

    gsap.to(".tree-canopy", {
      y: -16,
      scale: 1.02,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".mist-layer", {
      x: 80,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, shellRef.value);

  ScrollTrigger.refresh();
}

onMounted(async () => {
  void loadOverview();
  await nextTick();
  setupHorizontalStory();
});

onBeforeUnmount(() => {
  animationContext.value?.revert();
  ScrollTrigger.getById("workbench-horizontal-scroll")?.kill();
});
</script>

<template>
  <section ref="shellRef" class="workbench-shell">
    <header class="gallery-nav">
      <button class="gallery-nav__brand" type="button" @click="scrollToChapter(0)">
        RAG 山水阁
      </button>
      <nav class="gallery-nav__links" aria-label="工作台章节">
        <button
          v-for="(chapter, index) in chapters"
          :key="chapter.key"
          type="button"
          :class="{ 'is-active': activeChapter === index }"
          @click="scrollToChapter(index)"
        >
          {{ chapter.label }}
        </button>
      </nav>
      <div class="gallery-nav__actions">
        <span>当前登录 {{ currentUserName }}</span>
        <button type="button" class="dark-button" @click="handleLogout">退出</button>
      </div>
    </header>

    <div ref="viewportRef" class="story-viewport">
      <div ref="trackRef" class="story-track">
        <section class="story-panel story-panel--opening">
          <div class="story-copy story-copy--opening">
            <p>RAG Landscape Workspace</p>
            <h1>
              <span>你从一棵</span>
              <span>水彩树开始</span>
            </h1>
            <strong>滚动鼠标，长卷会向左展开。</strong>
            <small>Scroll to explore</small>
          </div>
          <img class="watercolor-tree person-asset person-asset--opening watercolor-focus" src="/artwork/workbench-person-opening.png" alt="?????" />

          <span class="chapter-marker" data-chapter="opening" />
          <p class="open-note">• Open the landscape</p>
        </section>

        <section class="story-panel story-panel--rag">
          <div class="story-copy story-copy--rag">
            <p>RAG Chat</p>
            <h1>
              <span>当你发问</span>
              <span>万卷回应</span>
            </h1>
            <strong>进入知识问答空间，展开历史会话、流式回答与深度思考。</strong>
            <small>Click to open</small>
          </div>
          <img class="watercolor-cow person-asset person-asset--rag watercolor-focus" src="/artwork/workbench-person-rag.png" alt="RAG ????" />

          <button class="floating-entry floating-entry--rag" type="button" @click="router.push('/rag')">
            打开 RAG 问答
          </button>
          <span class="chapter-marker" data-chapter="rag" />
          <p class="open-note">• Open the RAG chat</p>
        </section>

        <section class="story-panel story-panel--admin">
          <div class="story-copy story-copy--admin">
            <p>Admin Console</p>
            <h1>
              <span>数据有序</span>
              <span>诸事归档</span>
            </h1>
            <strong>进入后台管理页面，查看知识库、链路追踪、系统配置与用户概览。</strong>
            <small>Click to open</small>
          </div>
          <img class="watercolor-village person-asset person-asset--admin watercolor-focus" src="/artwork/workbench-person-admin.png" alt="????" />

          <button class="floating-entry floating-entry--admin" type="button" @click="router.push('/admin')">
            打开后台管理
          </button>
          <span class="chapter-marker" data-chapter="admin" />
          <p class="open-note">• Open the admin console</p>
        </section>

        <section class="story-panel story-panel--choice">
          <div class="story-copy story-copy--choice">
            <p>Choose Your Path</p>
            <h1>
              <span>长卷已开</span>
              <span>请选择去处</span>
            </h1>
            <strong>从这张水彩长卷进入你的知识空间。</strong>
            <small>Final choice</small>
          </div>
          <img class="watercolor-island person-asset person-asset--choice watercolor-focus" src="/artwork/workbench-person-choice.png" alt="????" />

          <div class="final-choice">
            <button type="button" @click="router.push('/rag')">
              <span>问</span>
              <strong>RAG 问答</strong>
              <small>进入知识问答</small>
            </button>
            <button type="button" @click="router.push('/admin')">
              <span>管</span>
              <strong>后台管理</strong>
              <small>进入治理后台</small>
            </button>
          </div>
          <span class="chapter-marker" data-chapter="choice" />
          <p class="open-note">• Choose one entrance</p>
        </section>
      </div>

      <div class="progress-line" aria-hidden="true">
        <span :style="{ width: `${progress * 100}%` }" />
      </div>
    </div>

    <aside class="overview-strip" aria-label="系统概览">
      <article v-for="item in stats" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ overviewLoading ? "..." : item.value }}</strong>
      </article>
    </aside>

    <p v-if="overviewError" class="inline-notice">{{ overviewError }}</p>
  </section>
</template>

<style scoped>
.workbench-shell {
  min-height: 100vh;
  color: #151914;
  background:
    radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.96), transparent 28%),
    linear-gradient(180deg, #f5f5f1 0%, #e8e9e3 100%);
}

.workbench-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(185, 190, 180, 0.2) 1px, transparent 1px),
    linear-gradient(180deg, rgba(185, 190, 180, 0.14) 1px, transparent 1px);
  background-size: 44px 44px;
}

.gallery-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  height: 52px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 34px;
  align-items: center;
  font-size: 12px;
  mix-blend-mode: multiply;
}

.gallery-nav button {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.gallery-nav__brand {
  font-family: Georgia, "Times New Roman", "STSong", serif;
  font-size: 18px !important;
}

.gallery-nav__links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.gallery-nav__links button {
  color: #6b6d65;
}

.gallery-nav__links button.is-active,
.gallery-nav__links button:hover {
  color: #11140f;
}

.gallery-nav__actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.dark-button {
  height: 28px;
  padding: 0 14px;
  background: #0d0d0b !important;
  color: #fff !important;
}

.story-viewport {
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow: hidden;
}

.story-track {
  height: 100%;
  width: max-content;
  display: flex;
  will-change: transform;
}

.story-panel {
  position: relative;
  flex: 0 0 100vw;
  height: 100vh;
  overflow: hidden;
}

.story-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 56% 48%, rgba(255, 255, 255, 0.72), transparent 30%),
    radial-gradient(ellipse at 72% 82%, rgba(170, 174, 164, 0.16), transparent 34%);
}

.story-copy {
  position: absolute;
  left: 10.6vw;
  top: 31vh;
  z-index: 8;
  width: min(370px, 30vw);
}

.story-copy p {
  margin: 0 0 14px;
  color: #777a70;
  font-size: 13px;
}

.story-copy h1 {
  margin: 0;
  color: #111611;
  font-family: Georgia, "Times New Roman", "STSong", serif;
  font-size: clamp(38px, 4.5vw, 68px);
  font-weight: 400;
  line-height: 1.06;
  letter-spacing: -0.045em;
}

.story-copy h1 span,
.story-copy strong,
.story-copy small {
  display: block;
}

.story-copy strong {
  margin-top: 18px;
  color: #30342f;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.68;
}

.story-copy small {
  margin-top: 24px;
  color: #171a16;
  font-size: 12px;
}

.person-asset {
  position: absolute;
  z-index: 4;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  filter:
    drop-shadow(0 34px 36px rgba(80, 76, 66, 0.18))
    saturate(0.94)
    contrast(0.98);
  transform-origin: 50% 72%;
}

.person-asset::selection {
  background: transparent;
}

.watercolor-tree {
  left: 32vw;
  top: 7vh;
  width: min(620px, 44vw);
}

.watercolor-cow {
  left: 38vw;
  bottom: 0;
  width: min(620px, 44vw);
}

.watercolor-village {
  left: 40vw;
  bottom: 0;
  width: min(620px, 44vw);
}

.watercolor-island {
  left: 36vw;
  bottom: 0;
  width: min(680px, 48vw);
}

.story-panel::after {
  content: "";
  position: absolute;
  z-index: 3;
  left: 30vw;
  right: 9vw;
  bottom: 7vh;
  height: 15vh;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(96, 94, 82, 0.16), transparent 66%),
    radial-gradient(ellipse at 30% 42%, rgba(255, 255, 255, 0.52), transparent 58%);
  filter: blur(12px);
}

.floating-entry {
  position: absolute;
  z-index: 9;
  right: 13vw;
  top: 45vh;
  border: 0;
  border-bottom: 1px solid #141711;
  padding: 0 0 4px;
  background: transparent;
  color: #141711;
  font-size: 13px;
  cursor: pointer;
}

.final-choice {
  position: absolute;
  left: 10.6vw;
  bottom: 14vh;
  z-index: 10;
  display: flex;
  gap: 18px;
}

.final-choice button {
  width: 220px;
  padding: 22px;
  border: 1px solid rgba(70, 76, 61, 0.16);
  border-radius: 22px;
  background: rgba(255, 255, 250, 0.74);
  box-shadow: 0 22px 48px rgba(78, 82, 70, 0.12);
  backdrop-filter: blur(12px);
  cursor: pointer;
  text-align: left;
}

.final-choice span,
.final-choice strong,
.final-choice small {
  display: block;
}

.final-choice span {
  width: 34px;
  height: 34px;
  margin-bottom: 14px;
  border: 1px solid rgba(154, 47, 40, 0.64);
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #9a2f28;
}

.final-choice strong {
  color: #111611;
  font-size: 18px;
}

.final-choice small {
  margin-top: 8px;
  color: #686a62;
}

.open-note {
  position: absolute;
  right: 12vw;
  top: 47vh;
  z-index: 8;
  color: #282c26;
  font-size: 12px;
}

.chapter-marker {
  position: absolute;
  left: 52vw;
  top: 50vh;
  width: 1px;
  height: 1px;
}

.progress-line {
  position: fixed;
  right: 28px;
  bottom: 24px;
  z-index: 40;
  width: 48px;
  height: 1px;
  background: rgba(20, 22, 19, 0.2);
}

.progress-line span {
  display: block;
  height: 100%;
  background: rgba(20, 22, 19, 0.76);
}

.overview-strip {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 25;
  display: flex;
  gap: 10px;
  opacity: 0.72;
}

.overview-strip article {
  min-width: 58px;
  padding: 8px 10px;
  border: 1px solid rgba(70, 76, 61, 0.12);
  background: rgba(255, 255, 250, 0.58);
  backdrop-filter: blur(8px);
}

.overview-strip span,
.overview-strip strong {
  display: block;
}

.overview-strip span {
  color: #686a62;
  font-size: 11px;
}

.overview-strip strong {
  color: #111611;
  font-size: 16px;
}

.inline-notice {
  position: fixed;
  left: 50%;
  bottom: 20px;
  z-index: 40;
  transform: translateX(-50%);
  margin: 0;
  padding: 10px 14px;
  border: 1px solid rgba(154, 47, 40, 0.16);
  background: rgba(245, 230, 220, 0.82);
  color: #8f3a32;
  font-size: 12px;
}

@media (max-width: 900px) {
  .gallery-nav {
    gap: 12px;
  }

  .gallery-nav__links,
  .overview-strip {
    display: none;
  }

  .story-copy {
    left: 8vw;
    top: 17vh;
    width: 84vw;
  }

  .watercolor-tree,
  .watercolor-cow,
  .watercolor-village,
  .watercolor-island {
    left: 16vw;
    top: auto;
    bottom: 12vh;
    width: 78vw;
  }

  .final-choice {
    left: 8vw;
    right: 8vw;
    flex-direction: column;
  }

  .final-choice button {
    width: 100%;
  }
}
</style>
