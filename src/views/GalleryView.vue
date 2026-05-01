<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { defaultGalleryDetail, galleryDetails } from "../data/gallerySources";
import { officialGalleryDetails, officialGalleryImages } from "../data/officialGallerySources";
import { resolvePublicAssetUrl } from "../utils/assets";

const router = useRouter();

const localGalleryImages = [
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

const galleryImages = [
  ...localGalleryImages,
  ...officialGalleryImages
];

const allGalleryDetails = {
  ...galleryDetails,
  ...officialGalleryDetails
};

/* ── State ── */
const isReady = ref(false);
const entranceOpacity = ref(0);
const lightboxIndex = ref(-1);
const lightboxVisible = ref(false);
const cursorX = ref(-999);
const cursorY = ref(-999);
const canvasRef = ref(null);
const wallRef = ref(null);
const rotationY = ref(-18);
const rotationX = ref(12);
const sceneScale = ref(0.84);
const isDragging = ref(false);
let lastMouseX = 0;
let lastMouseY = 0;
let animId = null;
let cleanupCanvas = null;

const activeFilename = computed(() => {
  if (lightboxIndex.value < 0) return "";
  return galleryImages[lightboxIndex.value];
});

const activeGalleryDetail = computed(() => {
  return allGalleryDetails[activeFilename.value] || defaultGalleryDetail;
});

function getGalleryImageUrl(filename) {
  return resolvePublicAssetUrl(`gallery/${filename}`);
}

/* ── Bodhi Tree Canopy Layout ──
   Photos arranged in concentric rings that form a wide, flat dome —
   wider at the base, tapering toward the top, like a sacred Bodhi tree canopy. */
const TREE_LAYER_DEFS = [
  { radius: 110, y: -520, weight: 0.34, vine: 22, size: 0.7 },
  { radius: 205, y: -470, weight: 0.48, vine: 28, size: 0.74 },
  { radius: 315, y: -410, weight: 0.66, vine: 36, size: 0.78 },
  { radius: 455, y: -342, weight: 0.88, vine: 45, size: 0.82 },
  { radius: 610, y: -270, weight: 1.07, vine: 56, size: 0.88 },
  { radius: 750, y: -190, weight: 1.19, vine: 70, size: 0.94 },
  { radius: 865, y: -104, weight: 1.22, vine: 84, size: 1 },
  { radius: 930, y: -14, weight: 1.14, vine: 98, size: 1.02 },
  { radius: 900, y: 76, weight: 1.02, vine: 112, size: 0.98 },
  { radius: 805, y: 160, weight: 0.84, vine: 126, size: 0.92 },
  { radius: 655, y: 232, weight: 0.65, vine: 136, size: 0.86 },
  { radius: 475, y: 290, weight: 0.46, vine: 126, size: 0.8 },
  { radius: 300, y: 330, weight: 0.3, vine: 106, size: 0.74 },
];

const hangingLayers = computed(() => {
  const total = galleryImages.length;
  const result = [];
  let idx = 0;
  const totalWeight = TREE_LAYER_DEFS.reduce((sum, layer) => sum + layer.weight, 0);

  for (let i = 0; i < TREE_LAYER_DEFS.length; i++) {
    const layer = TREE_LAYER_DEFS[i];
    const remainingLayers = TREE_LAYER_DEFS.length - i - 1;
    const expected = Math.round(total * (layer.weight / totalWeight));
    const count = Math.min(Math.max(8, expected), total - idx - remainingLayers * 8);
    if (count <= 0) break;
    const items = [];
    for (let j = 0; j < count; j++) {
      const imageIndex = idx + j;
      const seed = imageIndex * 12.9898 + i * 78.233;
      const organic = Math.sin(seed) * 43758.5453;
      const jitter = organic - Math.floor(organic);
      const angle = (360 / count) * j + i * 19 + (j % 2) * 4 + (jitter - 0.5) * 9;
      const verticalDrift = Math.sin(j * 1.61 + i * 0.73) * (12 + i * 1.5);
      const depthDrift = Math.cos(j * 1.27 + i) * 28;
      items.push({
        filename: galleryImages[imageIndex],
        globalIndex: imageIndex,
        angle,
        radius: layer.radius + depthDrift,
        y: verticalDrift,
        vine: layer.vine + (jitter - 0.5) * 28,
        sway: Math.sin(j * 0.93 + i * 1.7) * 7,
        tilt: -4 + Math.cos(j * 0.57 + i) * 8,
        scale: layer.size * (0.9 + jitter * 0.22)
      });
    }
    result.push({ radius: layer.radius, yOffset: layer.y, items });
    idx += count;
  }

  if (idx < total && result.length) {
    const lastLayer = result[result.length - 1];
    const remaining = total - idx;
    for (let offset = 0; offset < remaining; offset++) {
      const imageIndex = idx + offset;
      lastLayer.items.push({
        filename: galleryImages[imageIndex],
        globalIndex: imageIndex,
        angle: (360 / remaining) * offset + 11,
        radius: 260 + Math.sin(offset) * 24,
        y: Math.cos(offset * 1.4) * 18,
        vine: 102 + Math.sin(offset * 0.6) * 18,
        sway: Math.sin(offset * 0.8) * 7,
        tilt: Math.cos(offset * 0.4) * 7,
        scale: 0.72
      });
    }
  }

  return result;
});

/* ── Lightbox ── */
function openLightbox(index) {
  lightboxIndex.value = index;
  document.body.style.overflow = "hidden";
  nextTick(() => { lightboxVisible.value = true; });
}

function closeLightbox() {
  lightboxVisible.value = false;
  document.body.style.overflow = "";
  setTimeout(() => { lightboxIndex.value = -1; }, 400);
}

function prevImage() {
  lightboxIndex.value = lightboxIndex.value > 0
    ? lightboxIndex.value - 1
    : galleryImages.length - 1;
}

function nextImage() {
  lightboxIndex.value = lightboxIndex.value < galleryImages.length - 1
    ? lightboxIndex.value + 1
    : 0;
}

function openSourceLink() {
  const url = activeGalleryDetail.value.sourceUrl;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

/* ── Drag rotation (no auto-rotate) ── */
function onPointerDown(e) {
  if (e.target.closest('.lightbox') || e.target.closest('.back-btn')) return;
  isDragging.value = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  e.preventDefault();
}

function onPointerMove(e) {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
  if (!isDragging.value) return;
  rotationY.value += (e.clientX - lastMouseX) * 0.22;
  rotationX.value = Math.max(-24, Math.min(34, rotationX.value - (e.clientY - lastMouseY) * 0.1));
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function onPointerUp() { isDragging.value = false; }

function onWheel(e) {
  sceneScale.value = Math.max(0.58, Math.min(1.18, sceneScale.value - e.deltaY * 0.00055));
}

function handleKeydown(e) {
  if (lightboxIndex.value >= 0) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  }
}

function handleImgError(e) { e.target.style.display = "none"; }

/* ── Dreamy Canvas: stars + aurora + fireflies ── */
function initCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const stars = Array.from({ length: 85 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.35,
    speed: Math.random() * 0.0003 + 0.0001,
    phase: Math.random() * Math.PI * 2,
    bright: Math.random() * 0.42 + 0.18
  }));

  const fireflies = Array.from({ length: 58 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0004,
    vy: (Math.random() - 0.5) * 0.0003,
    r: Math.random() * 2.5 + 1,
    hue: Math.random() > 0.55 ? 150 + Math.random() * 34 : 38 + Math.random() * 18,
    phase: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.008
  }));

  const auroraBands = Array.from({ length: 3 }, (_, i) => ({
    baseY: 0.15 + i * 0.12,
    amplitude: 30 + i * 15,
    speed: 0.0003 + i * 0.0001,
    phase: i * 2.1,
    hue1: 170 + i * 25,
    hue2: 200 + i * 30,
    opacity: 0.04 + i * 0.01
  }));

  let t = 0;
  function draw() {
    t++;
    ctx.clearRect(0, 0, w, h);

    auroraBands.forEach(band => {
      const y0 = band.baseY * h + Math.sin(t * band.speed + band.phase) * band.amplitude;
      const grad = ctx.createLinearGradient(0, y0 - 60, 0, y0 + 60);
      grad.addColorStop(0, `hsla(${band.hue1}, 65%, 72%, 0)`);
      grad.addColorStop(0.3, `hsla(${band.hue1}, 65%, 70%, ${band.opacity * 1.35})`);
      grad.addColorStop(0.5, `hsla(${band.hue2}, 55%, 68%, ${band.opacity * 1.8})`);
      grad.addColorStop(0.7, `hsla(${band.hue2}, 65%, 72%, ${band.opacity * 1.2})`);
      grad.addColorStop(1, `hsla(${band.hue1}, 65%, 72%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, y0 - 80);
      for (let x = 0; x <= w; x += 8) {
        const wave = Math.sin(x * 0.003 + t * band.speed * 2) * 25
                   + Math.sin(x * 0.007 + t * band.speed * 0.5) * 15;
        ctx.lineTo(x, y0 + wave);
      }
      ctx.lineTo(w, y0 + 80);
      ctx.lineTo(0, y0 + 80);
      ctx.closePath();
      ctx.fill();
    });

    stars.forEach(s => {
      const twinkle = (Math.sin(t * s.speed * 60 + s.phase) + 1) / 2;
      const alpha = s.bright * (0.3 + twinkle * 0.7);
      const x = s.x * w, y = s.y * h;
      ctx.beginPath();
      const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 3);
      g.addColorStop(0, `rgba(255, 255, 245, ${alpha * 0.55})`);
      g.addColorStop(1, "rgba(255, 255, 245, 0)");
      ctx.fillStyle = g;
      ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 252, 230, ${alpha})`;
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    fireflies.forEach(f => {
      f.x += f.vx; f.y += f.vy;
      if (f.x < -0.05) f.x = 1.05;
      if (f.x > 1.05) f.x = -0.05;
      if (f.y < -0.05) f.y = 1.05;
      if (f.y > 1.05) f.y = -0.05;
      const pulse = (Math.sin(t * f.pulseSpeed + f.phase) + 1) / 2;
      const alpha = 0.15 + pulse * 0.45;
      const size = f.r * (0.7 + pulse * 0.6);
      const x = f.x * w, y = f.y * h;
      ctx.beginPath();
      const g = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
      g.addColorStop(0, `hsla(${f.hue}, 80%, 70%, ${alpha * 0.3})`);
      g.addColorStop(1, `hsla(${f.hue}, 80%, 70%, 0)`);
      ctx.fillStyle = g;
      ctx.arc(x, y, size * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `hsla(${f.hue}, 90%, 80%, ${alpha})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }
  draw();
  cleanupCanvas = () => {
    window.removeEventListener("resize", resize);
  };
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  setTimeout(() => {
    isReady.value = true;
    entranceOpacity.value = 1;
    nextTick(() => { initCanvas(); });
  }, 300);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  if (animId) cancelAnimationFrame(animId);
  if (cleanupCanvas) cleanupCanvas();
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="gallery-root" :class="{ 'is-ready': isReady }">
    <!-- Dreamy canvas -->
    <canvas ref="canvasRef" class="dream-canvas"></canvas>

    <!-- Cursor glow -->
    <div
      class="cursor-glow"
      :style="{ transform: `translate(${cursorX - 200}px, ${cursorY - 200}px)` }"
    ></div>

    <!-- Background layers -->
    <div class="bg-deep"></div>

    <!-- Back button -->
    <button class="back-btn" type="button" @click="router.push('/workspace')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>返回</span>
    </button>

    <!-- 3D Viewport -->
    <div ref="wallRef" class="wall-viewport" @pointerdown="onPointerDown" @wheel.prevent="onWheel">
      <div
        class="wall-scene"
        :style="{
          transform: `scale(${sceneScale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          opacity: entranceOpacity
        }"
      >
        <!-- Central trunk — two perpendicular planes for 3D illusion -->
        <div class="tree-halo tree-halo--upper"></div>
        <div class="tree-halo tree-halo--lower"></div>

        <div class="trunk">
          <div class="trunk__column trunk__column--front"></div>
          <div class="trunk__column trunk__column--side"></div>
          <div class="trunk__crown-line trunk__crown-line--one"></div>
          <div class="trunk__crown-line trunk__crown-line--two"></div>
          <div class="trunk__crown-line trunk__crown-line--three"></div>
          <div class="trunk__glow"></div>
        </div>

        <!-- Photo rings forming the canopy -->
        <div
          v-for="(layer, layerIndex) in hangingLayers"
          :key="layerIndex"
          class="hanging-layer"
          :style="{ transform: `translateY(${layer.yOffset}px)` }"
        >
          <div
            v-for="item in layer.items"
            :key="item.filename"
            class="photo-leaf"
            :style="{
              '--vine-height': `${item.vine}px`,
              transform: `rotateY(${item.angle}deg) translateZ(${item.radius}px) translateY(${item.y}px) rotateX(${item.tilt}deg) rotateZ(${item.sway}deg) scale(${item.scale})`
            }"
            @click="openLightbox(item.globalIndex)"
          >
            <div class="photo-leaf__vine"></div>
            <div class="photo-leaf__inner">
              <img
                :src="getGalleryImageUrl(item.filename)"
                :alt="item.filename"
                loading="lazy"
                @error="handleImgError"
              />
            </div>
            <div class="photo-leaf__glint"></div>
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
          <div class="lightbox__backdrop" @click="closeLightbox">
            <img
              class="lightbox__backdrop-img"
              :src="getGalleryImageUrl(activeFilename)"
              alt=""
            />
          </div>

          <button class="lightbox__close" @click="closeLightbox" aria-label="关闭">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <button class="lightbox__arrow lightbox__arrow--left" @click="prevImage" aria-label="上一张">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div class="lightbox__stage">
            <button
              class="lightbox__card"
              type="button"
              :disabled="!activeGalleryDetail.sourceUrl"
              :title="activeGalleryDetail.sourceUrl ? '打开来源链接' : '暂未匹配到来源'"
              @click="openSourceLink"
            >
              <img
                :src="getGalleryImageUrl(activeFilename)"
                :alt="activeGalleryDetail.title"
              />
            </button>
          </div>

          <aside class="lightbox__info">
            <p class="lightbox__eyebrow">{{ activeGalleryDetail.collection }}</p>
            <h2>{{ activeGalleryDetail.title }}</h2>
            <p class="lightbox__original">{{ activeGalleryDetail.originalTitle }}</p>
            <p class="lightbox__desc">{{ activeGalleryDetail.description }}</p>

            <div class="lightbox__tags">
              <span v-for="tag in activeGalleryDetail.tags" :key="tag">{{ tag }}</span>
            </div>

            <button
              class="lightbox__source"
              type="button"
              :disabled="!activeGalleryDetail.sourceUrl"
              @click="openSourceLink"
            >
              <span>{{ activeGalleryDetail.sourceLabel }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7"/>
                <path d="M9 7h8v8"/>
              </svg>
            </button>

            <p class="lightbox__note">{{ activeGalleryDetail.note }}</p>
          </aside>

          <button class="lightbox__arrow lightbox__arrow--right" @click="nextImage" aria-label="下一张">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
   ROOT — Deep celestial night
   ═══════════════════════════════════════════ */
.gallery-root {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #050510;
  font-family: "Noto Serif SC", "EB Garamond", Georgia, "Times New Roman", serif;
  color: rgba(220, 225, 240, 0.85);
  user-select: none;
  cursor: grab;
}

.gallery-root:active { cursor: grabbing; }

.gallery-root * { box-sizing: border-box; }

.bg-deep {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% 100%, rgba(10, 30, 60, 0.6) 0%, transparent 60%),
    radial-gradient(ellipse 80% 50% at 30% 20%, rgba(40, 20, 80, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 75% 30%, rgba(20, 60, 80, 0.2) 0%, transparent 45%),
    linear-gradient(180deg, #050510 0%, #0a0a24 40%, #0d0820 70%, #080812 100%);
  pointer-events: none;
}

.dream-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(61, 216, 176, 0.04) 0%, transparent 65%);
  pointer-events: none;
  z-index: 9998;
  transition: transform 0.15s ease-out;
  will-change: transform;
}

/* ═══════════════════════════════════════════
   BACK BUTTON
   ═══════════════════════════════════════════ */
.back-btn {
  position: fixed;
  top: 28px;
  left: 32px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px 10px 14px;
  border: 1px solid rgba(61, 216, 176, 0.1);
  border-radius: 10px;
  background: rgba(10, 15, 30, 0.5);
  color: rgba(180, 210, 200, 0.5);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  letter-spacing: 0.06em;
  transition: all 0.35s ease;
  backdrop-filter: blur(12px);
}

.back-btn:hover {
  background: rgba(15, 25, 50, 0.7);
  color: rgba(61, 216, 176, 0.8);
  border-color: rgba(61, 216, 176, 0.25);
  transform: translateX(-2px);
  box-shadow: 0 0 20px rgba(61, 216, 176, 0.08);
}

/* ═══════════════════════════════════════════
   3D VIEWPORT
   ═══════════════════════════════════════════ */
.wall-viewport {
  position: fixed;
  inset: 0;
  z-index: 2;
  perspective: 1800px;
  perspective-origin: 50% 42%;
  overflow: hidden;
}

.wall-scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transition: transform 0.04s linear, opacity 1.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* ═══════════════════════════════════════════
   TRUNK — Central glowing tree trunk
   ═══════════════════════════════════════════ */
.trunk {
  position: absolute;
  transform-style: preserve-3d;
  left: 0;
  top: 0;
}

.trunk__glow {
  position: absolute;
  width: 80px;
  height: 500px;
  left: -40px;
  top: -250px;
  background: linear-gradient(
    to bottom,
    rgba(61, 216, 176, 0.0) 0%,
    rgba(61, 216, 176, 0.06) 30%,
    rgba(100, 180, 140, 0.04) 60%,
    rgba(196, 154, 58, 0.0) 100%
  );
  border-radius: 40px;
  filter: blur(20px);
}

/* ═══════════════════════════════════════════
   RING
   ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   PHOTO LEAF — Each hanging photo
   ═══════════════════════════════════════════ */
.photo-leaf {
  position: absolute;
  width: 130px;
  height: 180px;
  left: -65px;
  top: -90px;
  transform-style: preserve-3d;
  cursor: pointer;
}

.photo-leaf__vine {
  position: absolute;
  top: -35px;
  left: 50%;
  width: 1px;
  height: 35px;
  background: linear-gradient(to bottom, transparent, rgba(61, 216, 176, 0.18));
  pointer-events: none;
}

.photo-leaf__inner {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(8, 12, 25, 0.4);
  border: 1px solid rgba(61, 216, 176, 0.08);
  box-shadow:
    0 0 25px rgba(61, 216, 176, 0.05),
    0 8px 30px rgba(0, 0, 0, 0.35);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.photo-leaf:hover .photo-leaf__inner {
  transform: scale(1.15);
  border-color: rgba(61, 216, 176, 0.3);
  box-shadow:
    0 0 50px rgba(61, 216, 176, 0.12),
    0 0 120px rgba(61, 216, 176, 0.06),
    0 16px 50px rgba(0, 0, 0, 0.5);
}

.photo-leaf__inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.5s ease;
  filter: brightness(0.82) saturate(0.85);
}

.photo-leaf:hover .photo-leaf__inner img {
  transform: scale(1.06);
  filter: brightness(1.0) saturate(1.05);
}

/* ═══════════════════════════════════════════
   LIGHTBOX — Dark ethereal theme
   ═══════════════════════════════════════════ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: clamp(24px, 4vw, 70px);
  align-items: center;
  justify-content: center;
  padding: clamp(28px, 5vw, 70px) clamp(24px, 6vw, 100px);
  color: rgba(220, 225, 240, 0.9);
}

.lightbox__backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: rgba(5, 5, 16, 0.94);
  backdrop-filter: blur(60px);
}

.lightbox__backdrop::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(61, 216, 176, 0.03) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 20% 30%, rgba(100, 80, 200, 0.04) 0%, transparent 50%);
  pointer-events: none;
}

.lightbox__backdrop-img {
  position: absolute;
  left: -5vw;
  top: 5vh;
  width: min(50vw, 800px);
  height: 80vh;
  object-fit: cover;
  filter: blur(80px) saturate(0.5) brightness(0.3);
  opacity: 0.15;
}

.lightbox__close {
  position: absolute;
  top: 28px;
  right: 32px;
  z-index: 20;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(61, 216, 176, 0.1);
  border-radius: 50%;
  background: rgba(10, 15, 30, 0.5);
  color: rgba(180, 210, 200, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(12px);
}

.lightbox__close:hover {
  background: rgba(15, 25, 50, 0.7);
  color: rgba(61, 216, 176, 0.9);
  border-color: rgba(61, 216, 176, 0.3);
  transform: rotate(90deg) scale(1.08);
  box-shadow: 0 0 30px rgba(61, 216, 176, 0.1);
}

.lightbox__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(61, 216, 176, 0.08);
  border-radius: 50%;
  background: rgba(10, 15, 30, 0.4);
  color: rgba(180, 210, 200, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(12px);
}

.lightbox__arrow:hover {
  background: rgba(15, 25, 50, 0.6);
  color: rgba(61, 216, 176, 0.85);
  border-color: rgba(61, 216, 176, 0.25);
  box-shadow: 0 0 30px rgba(61, 216, 176, 0.08);
}

.lightbox__arrow--left { left: 32px; }
.lightbox__arrow--right { right: 32px; }
.lightbox__arrow--left:hover { transform: translateY(-50%) translateX(-3px); }
.lightbox__arrow--right:hover { transform: translateY(-50%) translateX(3px); }

.lightbox__stage {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: end;
  width: min(56vw, 800px);
}

.lightbox__card {
  position: relative;
  display: block;
  padding: clamp(14px, 1.8vw, 24px);
  border: 0;
  border-radius: 16px;
  background: rgba(12, 16, 32, 0.8);
  cursor: pointer;
  box-shadow:
    0 0 0 1px rgba(61, 216, 176, 0.06),
    0 40px 80px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(61, 216, 176, 0.04);
  transform: scale(0.88) translateY(20px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.lightbox__card:disabled { cursor: default; }

.lightbox__card:not(:disabled):hover {
  transform: scale(1.012) translateY(-3px);
  box-shadow:
    0 0 0 1px rgba(61, 216, 176, 0.12),
    0 48px 90px rgba(0, 0, 0, 0.55),
    0 0 80px rgba(61, 216, 176, 0.06);
}

.lightbox__card::before {
  content: "";
  position: absolute;
  inset: clamp(14px, 1.8vw, 24px);
  border: 1px solid rgba(61, 216, 176, 0.08);
  border-radius: 8px;
  pointer-events: none;
  z-index: 2;
}

.lightbox.is-visible .lightbox__card {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.lightbox.is-visible .lightbox__card:not(:disabled):hover {
  transform: scale(1.012) translateY(-3px);
}

.lightbox__card img {
  display: block;
  max-width: min(50vw, 720px);
  max-height: 76vh;
  border-radius: 8px;
  object-fit: contain;
}

.lightbox__info {
  position: relative;
  z-index: 6;
  align-self: center;
  min-height: min(65vh, 600px);
  padding-left: clamp(20px, 3vw, 44px);
  border-left: 1px solid rgba(61, 216, 176, 0.1);
  transform: translateX(20px);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.08s;
}

.lightbox.is-visible .lightbox__info {
  transform: translateX(0);
  opacity: 1;
}

.lightbox__eyebrow {
  margin: 0 0 24px;
  color: rgba(61, 216, 176, 0.45);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-family: "EB Garamond", Georgia, serif;
}

.lightbox__info h2 {
  margin: 0;
  color: rgba(230, 235, 245, 0.92);
  font-size: clamp(22px, 2.5vw, 36px);
  font-weight: 400;
  letter-spacing: 0.02em;
  font-family: "Noto Serif SC", Georgia, serif;
}

.lightbox__original {
  margin: 10px 0 28px;
  color: rgba(180, 190, 210, 0.4);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 14px;
  letter-spacing: 0.06em;
}

.lightbox__desc {
  max-width: 310px;
  margin: 0 0 24px;
  color: rgba(200, 210, 225, 0.6);
  font-size: 13px;
  line-height: 1.9;
}

.lightbox__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.lightbox__tags span {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(61, 216, 176, 0.06);
  border: 1px solid rgba(61, 216, 176, 0.08);
  color: rgba(61, 216, 176, 0.5);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.lightbox__source {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 11px 16px;
  border: 1px solid rgba(61, 216, 176, 0.12);
  border-radius: 999px;
  background: rgba(10, 15, 30, 0.4);
  color: rgba(61, 216, 176, 0.65);
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.lightbox__source:hover:not(:disabled) {
  transform: translateY(-2px);
  background: rgba(61, 216, 176, 0.1);
  color: rgba(61, 216, 176, 0.95);
  border-color: rgba(61, 216, 176, 0.3);
  box-shadow: 0 12px 30px rgba(61, 216, 176, 0.08);
}

.lightbox__source:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.lightbox__note {
  max-width: 310px;
  margin: 18px 0 0;
  color: rgba(160, 170, 190, 0.35);
  font-size: 11px;
  line-height: 1.7;
}

.lb-enter-active { transition: opacity 0.4s ease; }
.lb-leave-active { transition: opacity 0.3s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* ═══════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  .photo-leaf {
    width: 90px;
    height: 125px;
    left: -45px;
    top: -62px;
  }

  .photo-leaf__vine { height: 20px; top: -20px; }

  .lightbox { grid-template-columns: 1fr; }
  .lightbox__info { display: none; }
  .lightbox__arrow--left { left: 8px; }
  .lightbox__arrow--right { right: 8px; }
  .lightbox__arrow { width: 40px; height: 40px; }
}
.gallery-root {
  background:
    radial-gradient(circle at 50% 38%, rgba(255, 255, 246, 0.94) 0 16%, rgba(243, 250, 237, 0.75) 17% 34%, transparent 58%),
    linear-gradient(180deg, #f9f4e7 0%, #edf7ef 44%, #f4f0df 100%);
  color: rgba(67, 89, 73, 0.86);
}

.gallery-root::before,
.gallery-root::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.gallery-root::before {
  background:
    radial-gradient(ellipse 54% 32% at 50% 30%, rgba(255, 246, 196, 0.5), transparent 70%),
    radial-gradient(ellipse 34% 28% at 18% 28%, rgba(186, 219, 198, 0.34), transparent 72%),
    radial-gradient(ellipse 36% 30% at 80% 18%, rgba(231, 192, 163, 0.28), transparent 72%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), transparent 55%);
}

.gallery-root::after {
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(136, 160, 131, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(136, 160, 131, 0.12) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(circle at 50% 42%, #000 0, transparent 68%);
}

.bg-deep {
  background:
    radial-gradient(ellipse 80% 36% at 50% 101%, rgba(104, 145, 100, 0.2), transparent 64%),
    radial-gradient(ellipse 58% 44% at 52% 48%, rgba(255, 247, 195, 0.36), transparent 70%),
    linear-gradient(180deg, rgba(255, 252, 239, 0.78), rgba(234, 247, 235, 0.72));
}

.dream-canvas {
  mix-blend-mode: screen;
  opacity: 0.72;
}

.cursor-glow {
  background:
    radial-gradient(circle, rgba(255, 239, 164, 0.28) 0%, rgba(183, 224, 198, 0.18) 28%, transparent 68%);
}

.back-btn {
  border-color: rgba(142, 167, 112, 0.24);
  border-radius: 999px;
  background: rgba(255, 252, 240, 0.62);
  color: rgba(77, 99, 72, 0.78);
  box-shadow: 0 12px 36px rgba(113, 133, 105, 0.14);
}

.back-btn span {
  font-size: 0;
}

.back-btn span::after {
  content: "返回";
  font-size: 13px;
}

.back-btn:hover {
  background: rgba(255, 255, 248, 0.88);
  border-color: rgba(199, 168, 83, 0.45);
  color: rgba(96, 118, 78, 0.95);
  box-shadow: 0 18px 46px rgba(116, 137, 92, 0.18), 0 0 34px rgba(255, 226, 139, 0.18);
}

.wall-viewport {
  perspective: 2100px;
  perspective-origin: 50% 43%;
}

.wall-scene {
  top: 54%;
  transition: transform 0.08s ease-out, opacity 1.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.tree-halo {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  pointer-events: none;
  border-radius: 50%;
}

.tree-halo--upper {
  width: 880px;
  height: 360px;
  margin-left: -440px;
  margin-top: -560px;
  background:
    radial-gradient(ellipse at center, rgba(255, 248, 194, 0.42), rgba(203, 233, 198, 0.2) 45%, transparent 72%);
  filter: blur(18px);
  transform: rotateX(72deg);
}

.tree-halo--lower {
  width: 1280px;
  height: 420px;
  margin-left: -640px;
  margin-top: -150px;
  background: radial-gradient(ellipse at center, rgba(182, 220, 181, 0.18), transparent 70%);
  filter: blur(26px);
  transform: rotateX(78deg);
}

.trunk {
  top: 20px;
}

.trunk__column {
  position: absolute;
  width: 74px;
  height: 720px;
  left: -37px;
  top: -360px;
  border-radius: 999px 999px 44px 44px;
  background:
    linear-gradient(90deg, transparent, rgba(255, 251, 218, 0.72) 34%, rgba(157, 181, 132, 0.32) 64%, transparent),
    linear-gradient(180deg, rgba(247, 230, 168, 0.02), rgba(194, 172, 101, 0.28) 48%, rgba(105, 126, 84, 0.26));
  box-shadow:
    inset 0 0 22px rgba(255, 255, 228, 0.62),
    0 0 60px rgba(255, 236, 151, 0.26),
    0 36px 80px rgba(101, 116, 86, 0.18);
}

.trunk__column--side {
  transform: rotateY(90deg);
  opacity: 0.82;
}

.trunk__glow {
  width: 230px;
  height: 820px;
  left: -115px;
  top: -430px;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(255, 247, 183, 0.64), transparent 38%),
    linear-gradient(180deg, rgba(255, 245, 177, 0.42), rgba(189, 222, 181, 0.22) 54%, rgba(151, 135, 77, 0));
  filter: blur(24px);
}

.trunk__crown-line {
  position: absolute;
  left: -4px;
  top: -354px;
  width: 8px;
  height: 430px;
  border-radius: 999px;
  transform-origin: 50% 100%;
  background: linear-gradient(180deg, rgba(255, 240, 157, 0), rgba(186, 209, 160, 0.5), rgba(122, 146, 104, 0.06));
  filter: blur(0.2px);
}

.trunk__crown-line--one { transform: rotateZ(-34deg) translateY(-20px); }
.trunk__crown-line--two { transform: rotateZ(32deg) translateY(-10px); }
.trunk__crown-line--three { transform: rotateZ(0deg) translateY(-54px) scaleY(1.12); }

.hanging-layer {
  position: absolute;
  transform-style: preserve-3d;
}

.photo-leaf {
  width: 106px;
  height: 150px;
  left: -53px;
  top: -75px;
}

.photo-leaf__vine {
  top: calc(var(--vine-height) * -1);
  height: var(--vine-height);
  width: 1px;
  background:
    linear-gradient(to bottom, rgba(206, 175, 94, 0), rgba(206, 175, 94, 0.32), rgba(125, 166, 113, 0.42));
  box-shadow: 0 0 8px rgba(255, 233, 154, 0.36);
}

.photo-leaf__vine::before {
  content: "";
  position: absolute;
  left: -3px;
  bottom: -3px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 239, 167, 0.9);
  box-shadow: 0 0 14px rgba(255, 226, 127, 0.68);
}

.photo-leaf__inner {
  border-radius: 13px 13px 22px 22px;
  background: rgba(255, 252, 236, 0.78);
  border: 1px solid rgba(255, 250, 214, 0.86);
  box-shadow:
    inset 0 0 0 1px rgba(133, 167, 112, 0.12),
    0 12px 24px rgba(91, 115, 87, 0.16),
    0 0 28px rgba(255, 231, 151, 0.2);
  backdrop-filter: blur(4px);
}

.photo-leaf__inner::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.42), transparent 36%),
    radial-gradient(circle at 50% 100%, rgba(255, 232, 153, 0.18), transparent 52%);
  pointer-events: none;
}

.photo-leaf__inner img {
  filter: brightness(1.06) saturate(0.92) contrast(0.96);
}

.photo-leaf:hover .photo-leaf__inner {
  transform: scale(1.18) translateY(-7px);
  border-color: rgba(255, 225, 132, 0.9);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 235, 0.72),
    0 22px 44px rgba(92, 116, 88, 0.22),
    0 0 54px rgba(255, 225, 132, 0.42);
}

.photo-leaf:hover .photo-leaf__inner img {
  filter: brightness(1.12) saturate(1.05) contrast(0.98);
}

.photo-leaf__glint {
  position: absolute;
  inset: -24px -16px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 243, 185, 0.18), transparent 62%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.photo-leaf:hover .photo-leaf__glint {
  opacity: 1;
}

.lightbox {
  color: rgba(60, 82, 65, 0.92);
}

.lightbox__backdrop {
  background: rgba(250, 247, 231, 0.9);
}

.lightbox__backdrop::before {
  background:
    radial-gradient(ellipse 54% 42% at 50% 48%, rgba(255, 238, 167, 0.28), transparent 66%),
    radial-gradient(ellipse 34% 34% at 22% 26%, rgba(160, 205, 176, 0.2), transparent 58%);
}

.lightbox__card {
  background: rgba(255, 252, 240, 0.82);
  box-shadow:
    0 0 0 1px rgba(172, 148, 80, 0.12),
    0 38px 86px rgba(103, 118, 89, 0.2),
    0 0 70px rgba(255, 231, 151, 0.16);
}

.lightbox__info {
  border-left-color: rgba(142, 167, 112, 0.22);
}

.lightbox__eyebrow,
.lightbox__tags span,
.lightbox__source {
  color: rgba(113, 135, 81, 0.78);
}

.lightbox__info h2 {
  color: rgba(58, 76, 57, 0.94);
}

.lightbox__desc,
.lightbox__original,
.lightbox__note {
  color: rgba(74, 92, 72, 0.58);
}

@media (max-width: 768px) {
  .wall-scene {
    top: 56%;
  }

  .photo-leaf {
    width: 78px;
    height: 110px;
    left: -39px;
    top: -55px;
  }

  .trunk__column {
    height: 600px;
    top: -300px;
  }
}
</style>
