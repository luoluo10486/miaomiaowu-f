<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { resolvePublicAssetUrl } from "../utils/assets";

const router = useRouter();

const galleryImages = [
  "1648137658919.jpg","1648137770487.jpg","1648137785223.jpg","1648137830647.png",
  "1648137860154.jpg","1648137894790.jpg","1648138153799.jpg","1648138193841.jpg",
  "1648138372413.jpg","1648138386361.jpg","1648138415955.jpg","1648138507557.png",
  "1648138782891.jpg","1648138957448.png","1648139287731.jpg","1648273354658.png",
  "1648273360795.png","1648273449357.jpg","1658981436323.jpg","1658981438855.jpg",
  "1658994580234.jpg","1658994589737.jpg","1658994616828.jpg","1658994626086.jpg",
  "1658994662012.jpg","1658994679568.jpg","1658994729031.jpg","1658994757730.jpg",
  "1658994859377.png","1658994866961.jpg","1658994898378.jpg","1658994901494.jpg",
  "1658994906851.jpg","1658994915792.jpg","1658994929791.jpg","1658994948667.jpg",
  "1658995042914.jpg","1658995057112.jpg","1658995079208.jpg","1658995094457.jpg",
  "1658995110708.jpg","1658995127841.jpg","1658995145883.jpg","1658995156914.jpg",
  "1658995171064.jpg","1658995177537.jpg","1658995190821.jpg","1658995197201.jpg",
  "1658995212722.jpg","1658995217829.jpg","1658995255368.jpg","1658995331523.jpg",
  "1658995342136.jpg","1658995359263.jpg","1658995372533.jpg","1658995380796.jpg",
  "1658995391050.jpg","1658995424734.jpg","1658995471460.jpg","1658995493496.jpg",
  "1658995554877.jpg","1658995598630.jpg","1658995619875.jpg","1658995636152.jpg",
  "1658995643536.jpg","1658995650205.jpg","1658995657355.jpg","1658995690927.jpg",
  "1658995714367.jpg","1658995730850.jpg","1658995747018.jpg","1660410690929.jpg",
  "20220326_220157.jpg","20220326_220159.jpg","20220326_220243.jpg","20220326_221005.jpg",
  "20220326_221021.jpg","20220410_150545.jpg","20220701_125642.jpg","20220728_152959.jpg",
  "20220728_153029.jpg","20220728_153206.jpg","20220728_153218.jpg","20220728_153236.jpg",
  "20220728_153244.jpg","20220728_153253.jpg","20220728_153307.jpg","20220728_153333.jpg",
  "20220728_153338.jpg","20220728_153401.jpg","20220728_153417.jpg","20220728_153426.jpg",
  "20220728_153447.jpg","20220728_153456.jpg","20220728_153501.jpg","20220728_153505.jpg",
  "20220728_153513.jpg","20220728_153516.jpg","20220728_153542.jpg","20220728_153549.jpg",
  "20220728_153629.jpg","20220728_153706.jpg","20220728_153718.jpg","20220728_153731.jpg",
  "20220728_153743.jpg","20220728_153754.jpg","20220728_153808.jpg","20220728_153816.jpg",
  "20220728_153828.jpg","20220728_153833.jpg","20220728_153842.jpg","20220728_153849.jpg",
  "20220728_153907_edit_210440232998617.jpg","20220728_153935.jpg","20220728_153947.jpg",
  "20220728_154019.jpg","20220728_154032.jpg","20220728_154051.jpg","20220728_154111.jpg",
  "20220728_154120.jpg","20220728_154126.jpg","20220728_154129.jpg","20220728_154136.jpg",
  "20220728_154217.jpg","20220728_154241.jpg","20220728_154329.jpg","20220728_154408.jpg",
  "20220728_154415.jpg","20220728_154427.jpg","20220728_154432.jpg","20220728_154436.jpg",
  "20220728_154441.jpg","20220728_154448.jpg","20220728_154454.jpg","20220728_154500.jpg",
  "20220728_154503.jpg","20220728_154510.jpg","20220728_154515.jpg","20220728_154540.jpg",
  "20220728_154733.jpg","20220731_112104.jpg","20220817_173445.jpg","20220902_113214.jpg",
  "22d4fe712106a6f6c0720a88022af4f70c01d3f2_raw.jpg",
  "3da71d1bcf6c00d48fb0ae6a3171226d2616caed_raw.jpg",
  "432A36E39343392508726671D7B09DBD.jpg","48766259C9A745F6F893FBC9B02E0D07.jpg",
  "496CF412B9D1D8F46C6B186907FE936B.jpg","56C3AF814ED10A5C112EE23BD79002E2.jpg",
  "5b11ea4adc6a77f4c63c2e5b9e22ba3335ee0162_raw.jpg",
  "939FEF6C39D5130730822A7B83D4706B.jpg",
  "a61f8dd3c17bf8f446a700d434662784ced3aa53_raw.jpg",
  "CAD60F9C1B671EE7D286CA0EA01F88DE.jpg",
  "ea5b731f2e0f5711c01adcc56628fafbfe3f6301_raw.jpg",
  "mmexport1660496830830.jpg",
  "Screenshot_20220326_021606_tv.danmaku.bili_edit_31859944189928.jpg",
  "Screenshot_20220326_124557_tv.danmaku.bili_edit_2648981042824.jpg",
  "Screenshot_20220326_124816_tv.danmaku.bili_edit_2763624156869.jpg",
  "top-main.jpg"
];

/* ── Config ── */
const RING_COUNT = 20; // photos per ring
const RING_RADIUS = 560; // px from center (increased to avoid clipping)
const RING2_RADIUS = 820;
const RING3_RADIUS = 1080;

/* ── State ── */
const isReady = ref(false);
const lightboxIndex = ref(-1);
const lightboxVisible = ref(false);
const cursorX = ref(-999);
const cursorY = ref(-999);
const snowCanvasRef = ref(null);
const wallRef = ref(null);
const rotationY = ref(0);
const rotationX = ref(5);
const autoRotate = ref(true);
const isDragging = ref(false);
let lastMouseX = 0;
let lastMouseY = 0;
let animId = null;
let snowAnimId = null;

/* ── Split images into rings ── */
const rings = computed(() => {
  const r = [];
  let idx = 0;
  const perRing = [RING_COUNT, RING_COUNT, RING_COUNT];
  for (let ring = 0; ring < 3; ring++) {
    const count = Math.min(perRing[ring], galleryImages.length - idx);
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        filename: galleryImages[idx + i],
        globalIndex: idx + i,
        angle: (360 / count) * i
      });
    }
    r.push({
      radius: ring === 0 ? RING_RADIUS : ring === 1 ? RING2_RADIUS : RING3_RADIUS,
      items,
      yOffset: ring === 0 ? -60 : ring === 1 ? 40 : 140
    });
    idx += count;
  }
  return r;
});

/* ── Lightbox ── */
function openLightbox(index) {
  lightboxIndex.value = index;
  document.body.style.overflow = "hidden";
  nextTick(() => {
    lightboxVisible.value = true;
  });
}

function closeLightbox() {
  lightboxVisible.value = false;
  document.body.style.overflow = "";
  setTimeout(() => {
    lightboxIndex.value = -1;
  }, 400);
}

function prevImage() {
  if (lightboxIndex.value > 0) lightboxIndex.value--;
  else lightboxIndex.value = galleryImages.length - 1;
}

function nextImage() {
  if (lightboxIndex.value < galleryImages.length - 1) lightboxIndex.value++;
  else lightboxIndex.value = 0;
}

/* ── Mouse drag rotation ── */
function onPointerDown(e) {
  if (e.target.closest('.lightbox') || e.target.closest('.icon-btn')) return;
  isDragging.value = true;
  autoRotate.value = false;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  e.preventDefault();
}

function onPointerMove(e) {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
  if (!isDragging.value) return;
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  rotationY.value += dx * 0.3;
  rotationX.value = Math.max(-30, Math.min(30, rotationX.value - dy * 0.15));
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function onPointerUp() {
  if (isDragging.value) {
    isDragging.value = false;
    setTimeout(() => { autoRotate.value = true; }, 2000);
  }
}

/* ── Auto rotation loop ── */
function startAutoRotate() {
  function tick() {
    if (autoRotate.value && !isDragging.value) {
      rotationY.value += 0.12;
    }
    animId = requestAnimationFrame(tick);
  }
  tick();
}

/* ── Keyboard ── */
function handleKeydown(e) {
  if (lightboxIndex.value >= 0) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  }
}

/* ── Image error ── */
function handleImgError(e) {
  e.target.style.display = "none";
}

/* ── Snow & Starlight Canvas ── */
function initSnowCanvas() {
  const canvas = snowCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const snowflakes = [];
  for (let i = 0; i < 60; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.5 + 0.15,
      wind: Math.random() * 0.3 - 0.15,
      opacity: Math.random() * 0.4 + 0.15,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.008 + 0.003
    });
  }

  const stars = [];
  for (let i = 0; i < 35; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: [
        `rgba(200, 180, 255, `,
        `rgba(180, 210, 255, `,
        `rgba(255, 220, 240, `,
        `rgba(220, 255, 240, `
      ][Math.floor(Math.random() * 4)]
    });
  }

  let time = 0;
  function animate() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      const twinkle = (Math.sin(time * star.twinkleSpeed + star.twinklePhase) + 1) / 2;
      const alpha = star.opacity * (0.3 + twinkle * 0.7);
      const size = star.size * (0.8 + twinkle * 0.4);

      ctx.beginPath();
      const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 3.5);
      g.addColorStop(0, star.color + (alpha * 0.5) + ")");
      g.addColorStop(1, star.color + "0)");
      ctx.fillStyle = g;
      ctx.arc(star.x, star.y, size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = star.color + alpha + ")";
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fill();

      if (twinkle > 0.7) {
        ctx.strokeStyle = star.color + (alpha * 0.3) + ")";
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(star.x - size * 2.5, star.y);
        ctx.lineTo(star.x + size * 2.5, star.y);
        ctx.moveTo(star.x, star.y - size * 2.5);
        ctx.lineTo(star.x, star.y + size * 2.5);
        ctx.stroke();
      }
    });

    snowflakes.forEach((f) => {
      f.swing += f.swingSpeed;
      f.y += f.speed;
      f.x += f.wind + Math.sin(f.swing) * 0.25;
      if (f.y > canvas.height + 10) { f.y = -10; f.x = Math.random() * canvas.width; }
      if (f.x > canvas.width + 10) f.x = -10;
      if (f.x < -10) f.x = canvas.width + 10;

      ctx.beginPath();
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.5);
      glow.addColorStop(0, `rgba(220, 230, 255, ${f.opacity * 0.35})`);
      glow.addColorStop(1, "rgba(220, 230, 255, 0)");
      ctx.fillStyle = glow;
      ctx.arc(f.x, f.y, f.r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });

    snowAnimId = requestAnimationFrame(animate);
  }
  animate();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  setTimeout(() => {
    isReady.value = true;
    nextTick(() => {
      startAutoRotate();
      initSnowCanvas();
    });
  }, 200);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  if (animId) cancelAnimationFrame(animId);
  if (snowAnimId) cancelAnimationFrame(snowAnimId);
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="gallery-root" :class="{ 'is-ready': isReady }">
    <!-- Snow canvas -->
    <canvas ref="snowCanvasRef" class="snow-canvas"></canvas>

    <!-- Cursor glow -->
    <div
      class="cursor-glow"
      :style="{ transform: `translate(${cursorX - 150}px, ${cursorY - 150}px)` }"
    ></div>

    <!-- Background -->
    <div class="bg-canvas">
      <div class="bg-mesh"></div>
      <div class="bg-soft"></div>
    </div>

    <!-- Back button -->
    <button class="back-btn" type="button" @click="router.push('/workspace')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>返回</span>
    </button>

    <!-- Title -->
    <div class="title-bar">
      <h1 class="title">美图鉴赏</h1>
      <p class="subtitle">高木同学 · {{ galleryImages.length }} 张壁纸收藏 · 拖拽旋转</p>
    </div>

    <!-- 3D Wall container -->
    <div
      ref="wallRef"
      class="wall-viewport"
      @pointerdown="onPointerDown"
    >
      <div
        class="wall-scene"
        :style="{
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
        }"
      >
        <div
          v-for="(ring, ri) in rings"
          :key="ri"
          class="ring"
          :style="{ transform: `translateY(${ring.yOffset}px)` }"
        >
          <div
            v-for="item in ring.items"
            :key="item.filename"
            class="photo-card"
            :style="{
              transform: `rotateY(${item.angle}deg) translateZ(${ring.radius}px)`
            }"
            @click="openLightbox(item.globalIndex)"
          >
            <div class="photo-card__inner">
              <img
                :src="resolvePublicAssetUrl(`gallery/${item.filename}`)"
                :alt="item.filename"
                loading="lazy"
                @error="handleImgError"
              />
              <div class="photo-card__label">
                <span>{{ String(item.globalIndex + 1).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="lightboxIndex >= 0"
          class="lightbox"
          :class="{ 'is-visible': lightboxVisible }"
        >
          <div class="lightbox__backdrop" @click="closeLightbox"></div>

          <button class="lightbox__close" @click="closeLightbox" aria-label="关闭">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <button class="lightbox__arrow lightbox__arrow--left" @click="prevImage" aria-label="上一张">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="lightbox__stage">
            <div class="lightbox__card">
              <img
                :src="resolvePublicAssetUrl(`gallery/${galleryImages[lightboxIndex]}`)"
                :alt="galleryImages[lightboxIndex]"
              />
            </div>
            <div class="lightbox__caption">
              <span class="lightbox__index">{{ lightboxIndex + 1 }} / {{ galleryImages.length }}</span>
              <span class="lightbox__sep">·</span>
              <span class="lightbox__fname">{{ galleryImages[lightboxIndex] }}</span>
            </div>
          </div>

          <button class="lightbox__arrow lightbox__arrow--right" @click="nextImage" aria-label="下一张">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════ */
.gallery-root {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(160deg, #f0eaf8 0%, #e8f0fa 30%, #faf5f0 60%, #f5eef8 100%);
  font-family: "Inter", "SF Pro Display", -apple-system, "Noto Sans SC", sans-serif;
  color: #3a3545;
  user-select: none;
  cursor: grab;
}

.gallery-root:active {
  cursor: grabbing;
}

.snow-canvas {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 170, 230, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9998;
  transition: transform 0.12s ease-out;
  will-change: transform;
}

/* Background */
.bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-mesh {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(200, 180, 240, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(180, 200, 240, 0.1) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 50% 80%, rgba(240, 200, 220, 0.08) 0%, transparent 50%);
  animation: meshDrift 30s ease-in-out infinite alternate;
}

@keyframes meshDrift {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(2%, -1%) scale(1.01); }
  100% { transform: translate(-1%, 2%) scale(0.99); }
}

.bg-soft {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 70% at 50% 40%, transparent 20%, rgba(240, 235, 250, 0.4) 100%);
}

/* ═══════════════════════════════════════════
   BACK BUTTON
   ═══════════════════════════════════════════ */
.back-btn {
  position: fixed;
  top: 24px;
  left: 28px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px 10px 14px;
  border: 1px solid rgba(120, 100, 160, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  color: rgba(80, 60, 120, 0.6);
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #5a3d80;
  border-color: rgba(120, 100, 160, 0.25);
  transform: translateX(-2px);
  box-shadow: 0 4px 20px rgba(160, 140, 200, 0.12);
}

/* ═══════════════════════════════════════════
   TITLE
   ═══════════════════════════════════════════ */
.title-bar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  text-align: center;
  pointer-events: none;
}

.title {
  margin: 0;
  font-size: clamp(24px, 4vw, 40px);
  font-weight: 200;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #8b6aae 0%, #b088c8 30%, #7ea8d0 60%, #a88cc0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: rgba(100, 80, 140, 0.4);
}

/* ═══════════════════════════════════════════
   3D WALL VIEWPORT
   ═══════════════════════════════════════════ */
.wall-viewport {
  position: fixed;
  inset: 0;
  z-index: 1;
  perspective: 1600px;
  perspective-origin: 50% 45%;
  overflow: hidden;
}

.wall-scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
}

/* ═══════════════════════════════════════════
   RING
   ═══════════════════════════════════════════ */
.ring {
  position: absolute;
  transform-style: preserve-3d;
}

/* ═══════════════════════════════════════════
   PHOTO CARD
   ═══════════════════════════════════════════ */
.photo-card {
  position: absolute;
  width: 160px;
  height: 220px;
  left: -80px;
  top: -110px;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.photo-card__inner {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(180, 160, 220, 0.15);
  box-shadow:
    0 8px 32px rgba(100, 80, 140, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  transition: all 0.35s ease;
  backdrop-filter: blur(6px);
  position: relative;
}

.photo-card:hover .photo-card__inner {
  transform: scale(1.12);
  box-shadow:
    0 16px 50px rgba(100, 80, 140, 0.2),
    0 0 30px rgba(200, 180, 240, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  border-color: rgba(180, 160, 220, 0.3);
}

.photo-card__inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease, filter 0.4s ease;
  filter: brightness(0.95) saturate(0.9);
}

.photo-card:hover .photo-card__inner img {
  transform: scale(1.08);
  filter: brightness(1.03) saturate(1.05);
}

.photo-card__label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 10px 8px;
  background: linear-gradient(to top, rgba(50, 30, 70, 0.4) 0%, transparent 100%);
  text-align: center;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease;
}

.photo-card:hover .photo-card__label {
  opacity: 1;
  transform: translateY(0);
}

.photo-card__label span {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.75);
  font-variant-numeric: tabular-nums;
}

/* ═══════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(240, 235, 250, 0.92);
  backdrop-filter: blur(40px) saturate(0.8);
  -webkit-backdrop-filter: blur(40px) saturate(0.8);
}

.lightbox__close {
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 10;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(120, 100, 160, 0.15);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  color: rgba(80, 60, 120, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.85);
  color: #5a3d80;
  transform: rotate(90deg);
}

.lightbox__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(120, 100, 160, 0.12);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  color: rgba(80, 60, 120, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lightbox__arrow:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #5a3d80;
  border-color: rgba(120, 100, 160, 0.25);
}

.lightbox__arrow--left { left: 28px; }
.lightbox__arrow--right { right: 28px; }
.lightbox__arrow--left:hover { transform: translateY(-50%) translateX(-2px); }
.lightbox__arrow--right:hover { transform: translateY(-50%) translateX(2px); }

.lightbox__stage {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 88vw;
  max-height: 85vh;
}

.lightbox__card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 30px 100px rgba(100, 80, 140, 0.12),
    0 0 0 1px rgba(180, 160, 220, 0.1);
  transform: scale(0.92);
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.lightbox.is-visible .lightbox__card {
  transform: scale(1);
  opacity: 1;
}

.lightbox__card img {
  display: block;
  max-width: 85vw;
  max-height: 78vh;
  object-fit: contain;
}

.lightbox__caption {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: rgba(100, 80, 140, 0.45);
  letter-spacing: 0.05em;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease 0.2s;
}

.lightbox.is-visible .lightbox__caption {
  opacity: 1;
  transform: translateY(0);
}

.lightbox__sep { opacity: 0.3; }

.lb-enter-active { transition: opacity 0.4s ease; }
.lb-leave-active { transition: opacity 0.3s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .photo-card {
    width: 110px;
    height: 150px;
    left: -55px;
    top: -75px;
  }

  .title { font-size: 24px; }
  .subtitle { font-size: 10px; }

  .lightbox__arrow--left { left: 10px; }
  .lightbox__arrow--right { right: 10px; }
  .lightbox__arrow { width: 40px; height: 40px; }
}
</style>