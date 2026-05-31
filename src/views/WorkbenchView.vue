<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkbenchLive2DScene from "../components/WorkbenchLive2DScene.vue";
import { clearStoredAuth, getStoredAuthUser } from "../utils/auth";
import { resolvePublicAssetUrl } from "../utils/assets";

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const currentUser = ref(getStoredAuthUser());
const shellRef = ref(null);
const viewportRef = ref(null);
const trackRef = ref(null);
const progress = ref(0);
const activeChapter = ref(0);

let animationContext = null;

const artworkUrls = {
  rag: resolvePublicAssetUrl("artwork/workbench-person-rag.png"),
  admin: resolvePublicAssetUrl("artwork/workbench-person-admin.png"),
  ideas: resolvePublicAssetUrl("artwork/workbench-person-idea.png"),
  gallery: resolvePublicAssetUrl("artwork/workbench-person-gallery.png"),
  articles: resolvePublicAssetUrl("artwork/workbench-person-articles.png"),
  todo: resolvePublicAssetUrl("artwork/workbench-person-choice.png")
};

const chapters = [
  {
    key: "home",
    label: "起始",
    title: "工作台总览",
    description: "向右滚动浏览模块。"
  },
  {
    key: "rag",
    label: "问答",
    title: "RAG 问答",
    description: "进入对话工作台。",
    action: () => router.push("/chat")
  },
  {
    key: "admin",
    label: "后台",
    title: "管理控制台",
    description: "进入后台管理。",
    action: () => router.push("/admin")
  },
  {
    key: "ideas",
    label: "灵感",
    title: "灵感随记",
    description: "记录想法与草稿。",
    action: () => router.push("/ideas")
  },
  {
    key: "gallery",
    label: "画廊",
    title: "美图鉴赏",
    description: "浏览图片内容。",
    action: () => router.push("/gallery")
  },
  {
    key: "articles",
    label: "文章",
    title: "文章馆",
    description: "阅读整理后的文章。",
    action: () => router.push("/articles")
  },
  {
    key: "todo",
    label: "待开发",
    title: "待开发区域",
    description: "后续功能预留。"
  }
];

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "当前用户";
});

function scrollToChapter(index) {
  const trigger = ScrollTrigger.getById("workbench-horizontal-scroll");
  if (!trigger || chapters.length <= 1) {
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

function setupHorizontalStory() {
  animationContext?.revert();

  animationContext = gsap.context(() => {
    const track = trackRef.value;
    const viewport = viewportRef.value;
    const shell = shellRef.value;

    if (!track || !viewport || !shell) {
      return;
    }

    const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

    gsap.set(".scene-copy", {
      autoAlpha: 0,
      y: 28,
      filter: "blur(10px)"
    });

    gsap.set(".person-asset", {
      autoAlpha: 0,
      y: 34,
      scale: 0.97,
      filter: "blur(12px) saturate(0.95)"
    });

    const horizontalTween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        id: "workbench-horizontal-scroll",
        trigger: shell,
        pin: viewport,
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

    gsap.utils.toArray(".person-asset").forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px) saturate(1)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: horizontalTween,
          start: "left 86%",
          end: "left 40%",
          scrub: true
        }
      });
    });

    gsap.utils.toArray(".scene-copy").forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: horizontalTween,
          start: "left 72%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }, shellRef.value);

  ScrollTrigger.refresh();
}

onMounted(async () => {
  await nextTick();
  setupHorizontalStory();
});

onBeforeUnmount(() => {
  animationContext?.revert();
  ScrollTrigger.getById("workbench-horizontal-scroll")?.kill();
});
</script>

<template>
  <section ref="shellRef" class="workbench-shell">
    <header class="workbench-nav">
      <button type="button" class="workbench-nav__brand" @click="scrollToChapter(0)">
        落落妙香居
      </button>

      <nav class="workbench-nav__links" aria-label="工作台导航">
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

      <div class="workbench-nav__actions">
        <span>当前登录 {{ currentUserName }}</span>
        <button type="button" class="dark-button" @click="handleLogout">退出</button>
      </div>
    </header>

    <div ref="viewportRef" class="story-viewport">
      <div ref="trackRef" class="story-track">
        <section class="story-panel story-panel--home">
          <div class="scene-copy scene-copy--home">
            <span class="scene-copy__eyebrow">Workspace</span>
            <h1>工作台总览</h1>
            <p>向右滚动进入不同模块。</p>
          </div>
          <WorkbenchLive2DScene class="person-asset person-asset--home" />
        </section>

        <section class="story-panel story-panel--rag">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">RAG</span>
            <button type="button" class="scene-copy__action" @click="chapters[1].action()">
              {{ chapters[1].title }}
            </button>
            <p>{{ chapters[1].description }}</p>
          </div>
          <img class="person-asset person-asset--rag" :src="artworkUrls.rag" alt="RAG 问答人物" />
        </section>

        <section class="story-panel story-panel--admin">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">Admin</span>
            <button type="button" class="scene-copy__action" @click="chapters[2].action()">
              {{ chapters[2].title }}
            </button>
            <p>{{ chapters[2].description }}</p>
          </div>
          <img class="person-asset person-asset--admin" :src="artworkUrls.admin" alt="后台管理人物" />
        </section>

        <section class="story-panel story-panel--ideas">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">Ideas</span>
            <button type="button" class="scene-copy__action" @click="chapters[3].action()">
              {{ chapters[3].title }}
            </button>
            <p>{{ chapters[3].description }}</p>
          </div>
          <img class="person-asset person-asset--ideas" :src="artworkUrls.ideas" alt="灵感随记人物" />
        </section>

        <section class="story-panel story-panel--gallery">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">Gallery</span>
            <button type="button" class="scene-copy__action" @click="chapters[4].action()">
              {{ chapters[4].title }}
            </button>
            <p>{{ chapters[4].description }}</p>
          </div>
          <img class="person-asset person-asset--gallery" :src="artworkUrls.gallery" alt="美图鉴赏人物" />
        </section>

        <section class="story-panel story-panel--articles">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">Articles</span>
            <button type="button" class="scene-copy__action" @click="chapters[5].action()">
              {{ chapters[5].title }}
            </button>
            <p>{{ chapters[5].description }}</p>
          </div>
          <img class="person-asset person-asset--articles" :src="artworkUrls.articles" alt="文章馆人物" />
        </section>

        <section class="story-panel story-panel--todo">
          <div class="scene-copy">
            <span class="scene-copy__eyebrow">Next</span>
            <div class="scene-copy__static">{{ chapters[6].title }}</div>
            <p>{{ chapters[6].description }}</p>
          </div>
          <img class="person-asset person-asset--todo" :src="artworkUrls.todo" alt="待开发人物" />
        </section>
      </div>

      <div class="progress-line" aria-hidden="true">
        <span :style="{ width: `${progress * 100}%` }" />
      </div>
    </div>
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
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.92), transparent 96%);
}

.workbench-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  height: 58px;
  padding: 0 30px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 36px;
  align-items: center;
  font-size: 14px;
  mix-blend-mode: multiply;
}

.workbench-nav button {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.workbench-nav__brand {
  font-family: "STSong", "Songti SC", serif;
  font-size: 24px;
  letter-spacing: 0.02em;
}

.workbench-nav__links {
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: center;
}

.workbench-nav__links button {
  color: #444940;
  transition: color 0.22s ease, transform 0.22s ease;
}

.workbench-nav__links button.is-active,
.workbench-nav__links button:hover {
  color: #0f120f;
  font-weight: 700;
  transform: translateY(-1px);
}

.workbench-nav__actions {
  display: flex;
  gap: 14px;
  align-items: center;
  font-size: 13px;
}

.dark-button {
  height: 34px;
  padding: 0 18px;
  border-radius: 999px;
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

.story-panel::after {
  content: "";
  position: absolute;
  z-index: 3;
  left: 32vw;
  right: 8vw;
  bottom: 6vh;
  height: 13vh;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(96, 94, 82, 0.14), transparent 66%),
    radial-gradient(ellipse at 30% 42%, rgba(255, 255, 255, 0.52), transparent 58%);
  filter: blur(12px);
}

.story-panel--ideas::before,
.story-panel--articles::before {
  background:
    radial-gradient(ellipse at 60% 42%, rgba(255, 255, 255, 0.8), transparent 30%),
    radial-gradient(ellipse at 68% 82%, rgba(122, 146, 132, 0.2), transparent 34%),
    radial-gradient(ellipse at 22% 18%, rgba(212, 223, 215, 0.34), transparent 24%);
}

.scene-copy {
  position: absolute;
  left: 12vw;
  top: 25vh;
  z-index: 8;
  max-width: min(440px, 34vw);
}

.scene-copy--home {
  top: 20vh;
  max-width: min(520px, 38vw);
}

.scene-copy__eyebrow {
  display: inline-flex;
  margin-bottom: 18px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(20, 22, 19, 0.06);
  color: rgba(20, 22, 19, 0.72);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
}

.scene-copy h1,
.scene-copy__action,
.scene-copy__static {
  margin: 0;
  color: #111611;
  font-family: "STSong", "Songti SC", serif;
  font-size: clamp(46px, 5vw, 88px);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.scene-copy__action {
  display: inline-block;
  border-bottom: 2px solid currentColor !important;
  padding: 0 0 10px;
  cursor: pointer;
  transition: color 0.24s ease, transform 0.24s ease;
}

.scene-copy__action:hover {
  color: #8f3a32;
  transform: translateY(-2px);
}

.scene-copy p {
  margin: 18px 0 0;
  color: rgba(17, 22, 17, 0.78);
  font-size: 16px;
  line-height: 1.85;
}

.person-asset {
  position: absolute;
  z-index: 6;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  filter:
    drop-shadow(0 34px 36px rgba(80, 76, 66, 0.18))
    saturate(0.98)
    contrast(0.99);
  transform-origin: 50% 72%;
}

.person-asset--home {
  left: 35vw;
  top: 4vh;
  width: min(620px, 40vw);
  height: min(760px, 82vh);
  pointer-events: auto;
}

.person-asset--rag {
  left: 39vw;
  top: 16vh;
  width: min(680px, 50vw);
}

.person-asset--admin {
  left: 42vw;
  top: 7vh;
  width: min(680px, 50vw);
}

.person-asset--ideas {
  left: 41vw;
  top: 10vh;
  width: min(700px, 50vw);
}

.person-asset--gallery {
  left: 40vw;
  top: 8vh;
  width: min(700px, 52vw);
}

.person-asset--articles {
  left: 40vw;
  top: 8vh;
  width: min(640px, 46vw);
}

.person-asset--todo {
  left: 38vw;
  top: 5vh;
  width: min(720px, 54vw);
}

.progress-line {
  position: fixed;
  right: 28px;
  bottom: 24px;
  z-index: 40;
  width: 68px;
  height: 2px;
  background: rgba(20, 22, 19, 0.18);
}

.progress-line span {
  display: block;
  height: 100%;
  background: rgba(20, 22, 19, 0.78);
}

@media (max-width: 980px) {
  .workbench-nav {
    grid-template-columns: 1fr auto;
    gap: 12px;
    height: auto;
    padding: 14px 16px 10px;
    align-items: start;
  }

  .workbench-nav__brand {
    font-size: 22px;
  }

  .workbench-nav__links {
    grid-column: 1 / -1;
    justify-content: flex-start;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .workbench-nav__actions span {
    display: none;
  }

  .scene-copy {
    left: 8vw;
    top: 20vh;
    max-width: 76vw;
  }

  .scene-copy h1,
  .scene-copy__action,
  .scene-copy__static {
    font-size: 48px;
  }

  .person-asset {
    left: 23vw;
    top: 26vh;
    width: 66vw;
  }

  .person-asset--home {
    left: 17vw;
    top: 24vh;
    width: 66vw;
    height: min(62vh, 560px);
  }
}
</style>
