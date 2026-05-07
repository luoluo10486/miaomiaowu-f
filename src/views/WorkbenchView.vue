<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkbenchLive2DScene from "../components/WorkbenchLive2DScene.vue";
import { clearStoredAuth, getStoredAuthUser } from "../utils/auth";
import { resolvePublicAssetUrl } from "../utils/assets";
import { isAdminUser } from "../router";

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
  todo: resolvePublicAssetUrl("artwork/workbench-person-choice.png")
};

const chapters = [
  { key: "home", label: "首页" },
  { key: "rag", label: "问答" },
  { key: "admin", label: "管理" },
  { key: "ideas", label: "小巧思" },
  { key: "gallery", label: "美图鉴赏" },
  { key: "todo", label: "待开发" }
];

const isAdmin = computed(() => isAdminUser(currentUser.value));
const visibleChapters = computed(() =>
  isAdmin.value ? chapters : chapters.filter((c) => c.key !== "admin")
);

const currentUserName = computed(() => {
  const user = currentUser.value;
  return user?.displayName || user?.username || user?.email || "当前用户";
});

function scrollToChapter(index) {
  const trigger = ScrollTrigger.getById("workbench-horizontal-scroll");
  if (!trigger) {
    return;
  }

  const nextProgress = index / (chapters.length - 1);
  const nextScroll = trigger.start + (trigger.end - trigger.start) * nextProgress;
  window.scrollTo({ top: nextScroll, behavior: "smooth" });
}

function handleLogout() {
  clearStoredAuth();
  router.push("/login");
}

function setupHorizontalStory() {
  animationContext?.revert();

  animationContext = gsap.context(() => {
    const track = trackRef.value;
    if (!track || !viewportRef.value || !shellRef.value) {
      return;
    }

    const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

    gsap.set(".scene-label", {
      autoAlpha: 0,
      y: 34,
      filter: "blur(10px)"
    });

    gsap.set(".person-asset", {
      y: 42,
      scale: 0.96,
      filter: "blur(10px) saturate(0.95) contrast(0.98)"
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
            visibleChapters.value.length - 1,
            Math.round(self.progress * (visibleChapters.value.length - 1))
          );
        }
      }
    });

    gsap.utils.toArray(".person-asset").forEach((item) => {
      gsap.to(item, {
        y: 0,
        scale: 1,
        filter: "blur(0px) saturate(0.98) contrast(0.99)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: ScrollTrigger.getById("workbench-horizontal-scroll")?.animation,
          start: "left 82%",
          end: "left 38%",
          scrub: true
        }
      });
    });

    gsap.utils.toArray(".scene-label").forEach((item) => {
      gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          containerAnimation: ScrollTrigger.getById("workbench-horizontal-scroll")?.animation,
          start: "left 70%",
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
    <header class="gallery-nav">
      <button class="gallery-nav__brand" type="button" @click="scrollToChapter(0)">
        落落妙妙屋
      </button>

      <nav class="gallery-nav__links" aria-label="工作台导航">
        <button
          v-for="(chapter, index) in visibleChapters"
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
        <section class="story-panel story-panel--home">
          <WorkbenchLive2DScene class="person-asset person-asset--home" />
        </section>

        <section class="story-panel story-panel--rag">
          <button class="scene-label scene-label--button" type="button" @click="router.push('/rag')">
            RAG 问答
          </button>
          <img
            class="person-asset person-asset--rag"
            :src="artworkUrls.rag"
            alt="RAG 问答人物主体"
          />
        </section>

        <section v-if="isAdmin" class="story-panel story-panel--admin">
          <button class="scene-label scene-label--button" type="button" @click="router.push('/admin')">
            后台管理
          </button>
          <img
            class="person-asset person-asset--admin"
            :src="artworkUrls.admin"
            alt="后台管理人物主体"
          />
        </section>

        <section class="story-panel story-panel--ideas">
          <button class="scene-label scene-label--button" type="button" @click="router.push('/ideas')">
            小巧思
          </button>
          <img
            class="person-asset person-asset--ideas"
            :src="artworkUrls.ideas"
            alt="小巧思人物主题"
          />
        </section>

        <section class="story-panel story-panel--gallery">
          <button class="scene-label scene-label--button" type="button" @click="router.push('/gallery')">
            美图鉴赏
          </button>
          <img
            class="person-asset person-asset--gallery"
            :src="artworkUrls.gallery"
            alt="美图鉴赏人物主体"
          />
        </section>

        <section class="story-panel story-panel--todo">
          <div class="scene-label scene-label--static">待开发</div>
          <img
            class="person-asset person-asset--todo"
            :src="artworkUrls.todo"
            alt="待开发人物主题"
          />
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
}

.gallery-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  height: 52px;
  padding: 0 30px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 44px;
  align-items: center;
  font-size: 14px;
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
  font-size: 22px !important;
  letter-spacing: 0.02em;
}

.gallery-nav__links {
  display: flex;
  gap: 40px;
  align-items: center;
}

.gallery-nav__links button {
  color: #444940;
}

.gallery-nav__links button.is-active,
.gallery-nav__links button:hover {
  color: #0f120f;
  font-weight: 700;
}

.gallery-nav__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 13px;
}

.dark-button {
  height: 32px;
  padding: 0 18px;
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

.story-panel--ideas::before {
  background:
    radial-gradient(ellipse at 60% 42%, rgba(255, 255, 255, 0.78), transparent 30%),
    radial-gradient(ellipse at 68% 82%, rgba(122, 146, 132, 0.18), transparent 34%),
    radial-gradient(ellipse at 22% 18%, rgba(212, 223, 215, 0.34), transparent 24%);
}

.person-asset {
  position: absolute;
  z-index: 6;
  height: auto;
  max-height: none;
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
  top: 7vh;
  width: min(620px, 44vw);
}

.person-asset--home.live2d-stage {
  left: 33vw;
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

.person-asset--todo {
  left: 38vw;
  top: 5vh;
  width: min(720px, 54vw);
}

.scene-label {
  position: absolute;
  left: 14vw;
  top: 45vh;
  z-index: 8;
  color: #111611;
  font-size: clamp(48px, 6vw, 92px);
  line-height: 1;
  letter-spacing: -0.04em;
}

.scene-label--button {
  border: 0;
  border-bottom: 2px solid currentColor;
  padding: 0 0 10px;
  background: transparent;
  cursor: pointer;
}

.scene-label--button:hover {
  color: #8f3a32;
}

.scene-label--static {
  color: rgba(17, 22, 17, 0.86);
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

@media (max-width: 900px) {
  .gallery-nav {
    gap: 12px;
    padding: 0 16px;
  }

  .gallery-nav__links {
    gap: 18px;
  }

  .gallery-nav__actions span {
    display: none;
  }

  .person-asset {
    left: 24vw;
    top: 18vh;
    width: 66vw;
    max-height: 72vh;
  }

  .person-asset--home.live2d-stage {
    left: 17vw;
    top: 15vh;
    width: 66vw;
    height: min(62vh, 560px);
    max-height: none;
  }

  .scene-label {
    left: 8vw;
    top: 24vh;
    font-size: 48px;
  }
}
</style>
