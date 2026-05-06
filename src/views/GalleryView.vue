<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { defaultGalleryDetail, galleryDetails } from "../data/gallerySources";
import { authorTweetMetaBySourceUrl } from "../data/authorTweetMeta";
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

const allGalleryImages = [
  ...localGalleryImages,
  ...officialGalleryImages
];

const DISPLAY_IMAGE_COUNT = 100;
const GALLERY_SAMPLE_STORAGE_KEY = "gallery_bodhi_sample_v1";
const GALLERY_REFRESH_MODE_STORAGE_KEY = "gallery_bodhi_refresh_mode";
const MEDIA_ONLY_TWEET_MESSAGE = "这条 X 推文仅发布了图片，没有单独的文字说明。";

function pickRandomImages(images, count) {
  const pool = [...images];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function readStoredGallerySample() {
  try {
    const stored = JSON.parse(readStorage(GALLERY_SAMPLE_STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    const available = new Set(allGalleryImages);
    return stored.filter((filename) => available.has(filename)).slice(0, DISPLAY_IMAGE_COUNT);
  } catch {
    return [];
  }
}

function createGallerySample() {
  const sample = pickRandomImages(allGalleryImages, DISPLAY_IMAGE_COUNT);
  writeStorage(GALLERY_SAMPLE_STORAGE_KEY, JSON.stringify(sample));
  return sample;
}

function resolveInitialGallerySample() {
  const mode = readStorage(GALLERY_REFRESH_MODE_STORAGE_KEY);
  const stored = readStoredGallerySample();
  if (mode !== "refresh" && stored.length === DISPLAY_IMAGE_COUNT) return stored;
  return createGallerySample();
}

const galleryImages = ref(resolveInitialGallerySample());

const allGalleryDetails = {
  ...galleryDetails,
  ...officialGalleryDetails
};

/* ── State ── */
const isReady = ref(false);
const entranceOpacity = ref(0);
const galleryPhase = ref("loading");
const galleryLoadProgress = ref(0);
const revealRunId = ref(0);
const sceneImagesMounted = ref(false);
const loaderVariantKey = ref("rose-orbit");
const loaderElapsedMs = ref(0);
const lightboxIndex = ref(-1);
const lightboxVisible = ref(false);
const cursorX = ref(-999);
const cursorY = ref(-999);
const canvasRef = ref(null);
const wallRef = ref(null);
const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1600);
const viewportHeight = ref(typeof window !== "undefined" ? window.innerHeight : 900);
const isDragging = ref(false);
const refreshOnReload = ref(readStorage(GALLERY_REFRESH_MODE_STORAGE_KEY) === "refresh");
const activeTweetMeta = ref(null);
const lightboxCardRef = ref(null);
const lightboxSettled = ref(false);
const lightboxMeasureMode = ref(false);
const lightboxFlight = ref(null);
const lightboxOriginX = ref(50);
const lightboxOriginY = ref(50);
const imageAspects = ref({});
let lastMouseX = 0;
let lastMouseY = 0;
let animId = null;
let cleanupCanvas = null;
let activeTweetRequestId = 0;
let lightboxCloseTimer = 0;
let lightboxRevealTimer = 0;
let lightboxFlightCleanupTimer = 0;
let lightboxFlightFrameA = 0;
let lightboxFlightFrameB = 0;
let galleryRevealTimer = 0;
let loaderAnimId = 0;
let gallerySequenceToken = 0;

const LIGHTBOX_CLOSE_DURATION = 420;
const LIGHTBOX_FLIGHT_DURATION = 640;
const LIGHTBOX_REVEAL_DELAY = 110;
const GALLERY_LOADER_MIN_DURATION = 920;

const GALLERY_LOADER_VARIANTS = [
  {
    key: "rose-orbit",
    label: "Rose Orbit",
    rotate: true,
    particleCount: 52,
    trailSpan: 0.36,
    durationMs: 4200,
    rotationMs: 24000,
    strokeWidth: 3.2,
    point(progress, breath) {
      const t = progress * Math.PI * 2;
      const petals = 5;
      const r = 14 + Math.cos(petals * t) * (8 + breath * 4);
      return {
        x: 50 + Math.cos(t) * r,
        y: 50 + Math.sin(t) * r
      };
    }
  },
  {
    key: "lissajous-drift",
    label: "Lissajous Drift",
    rotate: false,
    particleCount: 46,
    trailSpan: 0.34,
    durationMs: 5200,
    rotationMs: 26000,
    strokeWidth: 3,
    point(progress, breath) {
      const t = progress * Math.PI * 2;
      const amp = 18 + breath * 6;
      return {
        x: 50 + Math.sin(3 * t + Math.PI / 2) * amp,
        y: 50 + Math.sin(4 * t) * amp * 0.82
      };
    }
  },
  {
    key: "hypotrochoid-bloom",
    label: "Hypotrochoid Bloom",
    rotate: true,
    particleCount: 56,
    trailSpan: 0.38,
    durationMs: 4800,
    rotationMs: 30000,
    strokeWidth: 3.1,
    point(progress, breath) {
      const t = progress * Math.PI * 2;
      const R = 18 + breath * 2.4;
      const r = 6;
      const d = 11 + breath * 4.8;
      const k = (R - r) / r;
      const x = (R - r) * Math.cos(t) + d * Math.cos(k * t);
      const y = (R - r) * Math.sin(t) - d * Math.sin(k * t);
      return {
        x: 50 + x * 0.9,
        y: 50 + y * 0.9
      };
    }
  },
  {
    key: "cardioid-wave",
    label: "Cardioid Wave",
    rotate: true,
    particleCount: 48,
    trailSpan: 0.32,
    durationMs: 4400,
    rotationMs: 22000,
    strokeWidth: 3.15,
    point(progress, breath) {
      const t = progress * Math.PI * 2;
      const a = 10 + breath * 3.5;
      const r = a * (1 - Math.cos(t));
      return {
        x: 50 + Math.cos(t) * r * 1.16,
        y: 50 + Math.sin(t) * r * 1.16
      };
    }
  }
];

const activeFilename = computed(() => {
  if (lightboxIndex.value < 0) return "";
  return galleryImages.value[lightboxIndex.value];
});

const activeLoaderVariant = computed(() => {
  return GALLERY_LOADER_VARIANTS.find((variant) => variant.key === loaderVariantKey.value) || GALLERY_LOADER_VARIANTS[0];
});

const galleryLoadPercent = computed(() => {
  return Math.round(galleryLoadProgress.value * 100);
});

const galleryPhaseClasses = computed(() => ({
  "is-loading": galleryPhase.value === "loading",
  "is-revealing": galleryPhase.value === "revealing",
  "is-ready": galleryPhase.value === "ready"
}));

const loaderPathData = computed(() => {
  const variant = activeLoaderVariant.value;
  const breath = getLoaderBreath(loaderElapsedMs.value, variant.durationMs);
  return buildLoaderPath(variant, breath);
});

const loaderParticles = computed(() => {
  const variant = activeLoaderVariant.value;
  const progress = normalizeUnitProgress(loaderElapsedMs.value / variant.durationMs);
  const breath = getLoaderBreath(loaderElapsedMs.value, variant.durationMs);

  return Array.from({ length: variant.particleCount }, (_, index) => {
    const trailOffset = index / Math.max(variant.particleCount - 1, 1);
    const point = variant.point(
      normalizeUnitProgress(progress - trailOffset * variant.trailSpan),
      breath
    );
    const fade = Math.pow(1 - trailOffset, 0.58);

    return {
      cx: point.x.toFixed(2),
      cy: point.y.toFixed(2),
      r: (1 + fade * 2.6).toFixed(2),
      opacity: (0.08 + fade * 0.92).toFixed(3)
    };
  });
});

const loaderGroupTransform = computed(() => {
  const variant = activeLoaderVariant.value;
  if (!variant.rotate) return "";
  const rotation = -normalizeUnitProgress(loaderElapsedMs.value / variant.rotationMs) * 360;
  return `rotate(${rotation.toFixed(2)} 50 50)`;
});

const activeGalleryDetail = computed(() => {
  return allGalleryDetails[activeFilename.value] || defaultGalleryDetail;
});

const localizedGalleryDetail = computed(() => {
  return localizeGalleryDetail(activeFilename.value, activeGalleryDetail.value);
});

const displayAuthorName = computed(() => {
  return localizedGalleryDetail.value.title;
});

const displayAuthorUrl = computed(() => {
  const sourceUrl = activeGalleryDetail.value?.sourceUrl || "";
  return sourceUrl.includes("udon0531") ? activeTweetMeta.value?.authorUrl || "" : "";
});

const displayTweetText = computed(() => {
  const tweetText = formatTweetTextForDisplay(activeTweetMeta.value);
  return tweetText || localizedGalleryDetail.value.description;
});

function getGalleryImageUrl(filename) {
  return resolvePublicAssetUrl(`gallery/${filename}`);
}

/* ── Bodhi Tree Canopy Layout ──
   Photos arranged in concentric rings that form a wide, flat dome —
   wider at the base, tapering toward the top, like a sacred Bodhi tree canopy. */
function looksGarbled(value) {
  return typeof value === "string" && /[?�]|\?\?/.test(value);
}

function formatTitle(title) {
  if (!title || looksGarbled(title)) return "（暂无相关内容）";
  const match = title.match(/^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return title;
  return `${match[1]}年${match[2]}月${match[3]}日 ${match[4]}:${match[5]}`;
}

function formatDateLabel(value) {
  if (!value) return "";
  const dateOnly = value.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (dateOnly) return `${dateOnly[1]}年${dateOnly[2]}月${dateOnly[3]}日`;
  return formatTitle(value);
}

function getTaggedDate(tags) {
  if (!Array.isArray(tags)) return "";
  return formatDateLabel(tags.find((tag) => /^\d{4}\/\d{2}\/\d{2}$/.test(tag)));
}

function localizeTag(tag) {
  const map = {
    Official: "官方",
    Author: "作者",
    X: "X 平台"
  };
  return map[tag] || tag;
}

function cleanupTweetText(text) {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\btakagi3\.me\/\S+/g, "")
    .replace(/\btoho\.co\.jp\/\S+/g, "")
    .replace(/\btheater-ods\.toho\.co\.jp\/\S+/g, "")
    .replace(/#いっしょに高木さん/g, "#一起看高木同学")
    .replace(/#からかい上手の高木さん/g, "#擅长捉弄的高木同学")
    .replace(/#高木さんめ/g, "#高木同学")
    .replace(/‥…━━━☆/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasJapaneseKana(text) {
  return /[\u3040-\u30ff]/.test(text);
}

function ensureChineseTweet(text) {
  const normalized = cleanupTweetText(text);
  if (!hasJapaneseKana(normalized)) return normalized;

  if (normalized.includes("本日放送") || normalized.includes("あす放送") || normalized.includes("まもなく")) {
    const episode = normalized.match(/第(\d+)話/)?.[1];
    return episode
      ? `【官方播出提醒】《擅长捉弄的高木同学》第 ${episode} 集即将播出，官方同步公开了本集相关画面与剧情看点。#高木同学`
      : "【官方播出提醒】《擅长捉弄的高木同学》相关剧集即将播出，官方同步公开了画面与看点。#高木同学";
  }
  if (normalized.includes("ご視聴ありがとうございました")) {
    const episode = normalized.match(/第(\d+)話/)?.[1];
    return episode
      ? `【官方播出回顾】感谢收看第 ${episode} 集。故事里的两人又向前走了一点，下集也请继续关注。#高木同学`
      : "【官方播出回顾】感谢收看本集。高木同学与西片的故事还在继续，请继续关注。#高木同学";
  }
  if (normalized.includes("劇場版")) {
    return "【剧场版官方动态】剧场版《擅长捉弄的高木同学》相关上映、Blu-ray/DVD、主题曲或入场特典信息更新。#高木同学";
  }
  if (normalized.includes("Blu-ray") || normalized.includes("BD&DVD") || normalized.includes("DVD")) {
    return "【官方商品情报】《擅长捉弄的高木同学》Blu-ray/DVD 或相关特典信息公开，请关注官方后续资讯。#高木同学";
  }
  if (normalized.includes("猫の日")) {
    return "【猫之日官方动态】2 月 22 日是猫之日，《擅长捉弄的高木同学》中也有许多猫咪登场的温柔片段。#高木同学";
  }
  if (normalized.includes("ハナの日")) {
    return "【小花之日官方动态】8 月 7 日是“小花之日”，官方回顾了小花与高木同学、西片一起度过的温柔时光。#高木同学";
  }
  if (normalized.includes("キスの日")) {
    return "【吻之日官方动态】官方整理了高木同学围绕“亲吻”展开的捉弄名场面。#高木同学";
  }
  if (normalized.includes("高木神社") || normalized.includes("御朱印")) {
    return "【高木神社联动】官方介绍了高木神社相关联动、参拜或御朱印信息。#高木同学";
  }
  if (normalized.includes("POP UP SHOP") || normalized.includes("グッズ") || normalized.includes("特典")) {
    return "【官方周边情报】《擅长捉弄的高木同学》周边、店铺特典或限时活动信息公开。#高木同学";
  }
  if (normalized.includes("サブタイトル") || normalized.includes("先行カット")) {
    return "【官方先行情报】官方公开了《擅长捉弄的高木同学》相关集数的小标题与先行画面。#高木同学";
  }
  if (normalized.includes("プレイバック") || normalized.includes("振り返り")) {
    return "【官方回顾】官方回顾了《擅长捉弄的高木同学》中的经典集数与名场面。#高木同学";
  }
  if (normalized.includes("EDテーマ") || normalized.includes("挿入歌") || normalized.includes("主題歌")) {
    return "【官方音乐情报】官方公开了《擅长捉弄的高木同学》相关片尾曲、插入歌或主题曲信息。#高木同学";
  }
  if (normalized.includes("上映会")) {
    return "【官方活动情报】《擅长捉弄的高木同学》相关上映会活动信息公开。#高木同学";
  }
  if (normalized.includes("小豆島")) {
    return "【官方舞台介绍】《擅长捉弄的高木同学》的故事舞台与小豆岛有关，官方推荐大家有机会前往探访。#高木同学";
  }

  return "（暂无相关内容）";
}

function translateOfficialTweet(description) {
  const text = cleanupTweetText(description);

  if (text.includes("わー、蛍だ！ きれいだね")) {
    return "【一起看高木同学】“哇，是萤火虫！好漂亮啊！”那天没能看到的萤火虫，这次终于看到了。#高木同学";
  }
  if (text.includes("ちーが登場")) return "【一起看高木同学】小千登场！#高木同学";
  if (text.includes("私も西片を幸せにするよ")) return "【一起看高木同学】“我也会让西片幸福的。”#高木同学";
  if (text.includes("まるで家族のよう")) return "【一起看高木同学】简直像一家人一样。#高木同学";
  if (text.includes("ハマボウの花")) return "【一起看高木同学】插入曲《黄槿之花》/ 大原由衣子，和小花一起度过的日子开始了。#高木同学";
  if (text.includes("いいこだなー、ハナ")) return "【一起看高木同学】“真是个好孩子啊，小花。”这也算暴击吗？#高木同学";
  if (text.includes("花が好きだから、ハナ")) return "【一起看高木同学】“因为喜欢花，所以叫小花！”小花的诞生契机，来自远程剧本会议中偶然入镜的脚本家小猫。#高木同学";
  if (text.includes("二人でこの子の飼い主探そう")) return "【一起看高木同学】“我们两个人一起帮这孩子找主人吧！”#高木同学";
  if (text.includes("キーパーソン")) return "【一起看高木同学】本作的关键角色登场！#高木同学";
  if (text.includes("夏休み突入記念")) return "【一起看高木同学】纪念暑假开始！#高木同学";
  if (text.includes("西片となら見つけられるかな")) return "【一起看高木同学】“我想，如果和西片一起的话，应该能找到吧。”#高木同学";
  if (text.includes("虫送りに いかない")) return "【一起看高木同学】高木同学，要不要一起去虫送祭？#高木同学";
  if (text.includes("す…き")) return "【一起看高木同学】喜……欢……？#高木同学";
  if (text.includes("じゃーんけーん")) return "【一起看高木同学】“石——头——剪——刀——布！”#高木同学";
  if (text.includes("原画を担当したシーン")) return "【一起看高木同学】这里是山本崇一朗老师负责原画的场景。#高木同学";
  if (text.includes("ねえ、西片")) return "【一起看高木同学】“喂，西片。”#高木同学";
  if (text.includes("いい夫婦")) return "真是一对好夫妻啊。#高木同学 #好夫妻之日";

  if (text.includes("本日放送")) {
    return ensureChineseTweet(text
      .replace(/【CBCテレビ 本日放送！】/g, "【CBC电视台今日播出】")
      .replace(/本日(\d+:\d+)よりCBCテレビにて第2期の第(\d+)話が放送！/g, "今天 $1 起，CBC 电视台播出第 2 季第 $2 集！")
      .replace(/夏祭りで一緒に屋台を回ったり勝負をしたりする二人。 やがて花火大会が始まりますが…？/g, "两人在夏日祭一起逛摊、比赛。烟花大会也即将开始……？")
      .replace(/夏休みのある日、宿題の近況を話す二人。 でもほかにも忘れてはいけないことが…？/g, "暑假的某一天，两人聊起作业进度。但还有别的不能忘记的事……？")
      .replace(/帰り道、謎の地図を拾った高木さんと西片。 お宝を求めて探検開始です！/g, "回家路上，高木同学和西片捡到一张神秘地图。寻宝探险开始了！")
      .replace(/ちょっと元気がなさそうな高木さん。 西片もいつもと違う雰囲気が気になる様子です。/g, "高木同学看起来有点没精神。西片也注意到了她和平时不同的气氛。")
      .replace(/ひざを擦りむいてしまった西片。 保健室で高木さんが手当てしてくれることになりますが…？/g, "西片擦伤了膝盖，高木同学在保健室为他处理伤口……？")
      .replace(/林間学校へやってきた高木さんたち。 イベント盛りだくさんということは、からかいのチャンスも…？/g, "高木同学一行来到林间学校。活动这么多，也意味着捉弄的机会更多……？")
      .replace(/1年ぶりのスポーツテストでリベンジを誓う西片。 得意の握力測定で勝負を決められるか…!?/g, "时隔一年的体能测试，西片发誓要复仇。他能在拿手的握力测试中决出胜负吗……？")
      .replace(/西片、14歳の誕生日。 年を重ねても高木さんにからかわれるのは変わらず…？/g, "西片 14 岁生日。就算长大一岁，被高木同学捉弄这件事也不会变……？")
      .replace(/春休み。とある作戦で高木さんを駄菓子屋に誘った西片。 この日は一年に一度の…!?/g, "春假里，西片用某个计划邀请高木同学去粗点心店。这一天是一年一度的……！？"));
  }

  if (text.includes("劇場版")) {
    return ensureChineseTweet(text
      .replace(/🎬劇場版「 #擅长捉弄的高木同学 」/g, "【剧场版《擅长捉弄的高木同学》】")
      .replace(/劇場版「 #擅长捉弄的高木同学 」/g, "剧场版《擅长捉弄的高木同学》")
      .replace(/Blu-ray＆DVDが発売！/g, "Blu-ray 与 DVD 今日发售！")
      .replace(/Blu-ray&DVD 11\/16\(水\)発売/g, "Blu-ray 与 DVD 将于 11 月 16 日发售")
      .replace(/上映劇場情報を更新しました。/g, "上映影院信息已更新。")
      .replace(/セカンドラン上映中/g, "第二轮上映中")
      .replace(/大ヒット上映中！/g, "热映中！")
      .replace(/ご予約は/g, "预约信息请见")
      .replace(/虫送りの夜、ハナと過ごしたやさしい時間。 高木さんと西片の忘れられない夏の思い出を、ぜひお手元でもご鑑賞ください。/g, "虫送祭之夜，与小花一起度过的温柔时光。也请把高木同学和西片难忘的夏日回忆带回身边欣赏。")
      .replace(/商品詳細/g, "商品详情")
      .trim());
  }

  if (text.includes("POP UP SHOP")) {
    return text
      .replace(/【POP UP SHOP開催！】/g, "【POP UP SHOP 开催】")
      .replace(/タワーレコード5店舗とオンラインにて POP UP SHOPを本日より開催/g, "塔唱片 5 家门店与线上商店从今天起举办 POP UP SHOP")
      .replace(/描き下ろしのクリスマス衣装の高木さんグッズが登場です！/g, "全新绘制的圣诞服装高木同学周边登场！")
      .replace(/期間/g, "期间")
      .replace(/詳細/g, "详情");
  }

  return ensureChineseTweet(text);
}

function localizeDescription(description) {
  if (!description || looksGarbled(description)) {
    return "（暂无相关内容）";
  }

  return translateOfficialTweet(description)
    .replace(/【本日発売！】/g, "【今日发售】")
    .replace(/\(金\)/g, "（周五）")
    .replace(/\(水\)/g, "（周三）")
    .replace(/商品详情🔽/g, "商品详情：")
    .replace(/🔽详情：/g, "详情：")
    .replace(/Matched to the original X post by Soichiro Yamamoto\./g, "已匹配到山本崇一朗发布的原始 X 动态。");
}

function formatTweetTextForDisplay(meta) {
  if (!meta || typeof meta !== "object") return "";

  const tweetText = String(meta.tweetText || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!tweetText) {
    return meta.mediaOnly ? MEDIA_ONLY_TWEET_MESSAGE : "";
  }

  const localized = localizeDescription(tweetText);
  return localized && localized !== "（暂无相关内容）" ? localized : tweetText;
}

function stripTweetLabel(text) {
  return text.replace(/^【[^】]+】\s*/, "").trim();
}

function cleanTitleSnippet(text) {
  return text
    .replace(/#\S+/g, "")
    .replace(/[。！？!?.]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text) {
  const body = cleanTitleSnippet(stripTweetLabel(text));
  return body.split(/[。！？!?]/)[0]?.trim() || "";
}

function buildOfficialTitle(description, translatedDescription) {
  const text = cleanupTweetText(description || "");
  const episode = text.match(/第(\d+)話/)?.[1];
  const season = text.match(/第(\d+)期/)?.[1];
  const quote = translatedDescription.match(/“([^”]+)”/)?.[1];

  if (description?.includes("#いっしょに高木さん") || text.includes("#一起看高木同学") || translatedDescription.startsWith("【一起看高木同学】")) {
    if (quote) return `一起看高木同学：${cleanTitleSnippet(quote)}`;
    return `一起看高木同学：${firstSentence(translatedDescription)}`;
  }
  if (text.includes("本日放送") && episode) {
    return season ? `第 ${season} 季第 ${episode} 集播出提醒` : `第 ${episode} 集播出提醒`;
  }
  if (text.includes("ご視聴ありがとうございました") && episode) {
    return `第 ${episode} 集播出回顾`;
  }
  if (text.includes("POP UP SHOP")) return "圣诞 POP UP SHOP 开催";
  if ((text.includes("Blu-ray") || text.includes("BD&DVD") || text.includes("DVD")) && text.includes("発売")) {
    return text.includes("劇場版") ? "剧场版 Blu-ray / DVD 发售" : "Blu-ray / DVD 情报";
  }
  if (text.includes("上映劇場情報")) return "剧场版上映影院更新";
  if (text.includes("劇場版")) return "剧场版官方情报";
  if (text.includes("猫の日")) return "猫之日官方回顾";
  if (text.includes("ハナの日")) return "小花之日官方回顾";
  if (text.includes("キスの日")) return "吻之日名场面回顾";
  if (text.includes("高木神社") || text.includes("御朱印")) return "高木神社联动情报";
  if (text.includes("サブタイトル") || text.includes("先行カット")) return "官方先行画面公开";
  if (text.includes("EDテーマ") || text.includes("挿入歌") || text.includes("主題歌")) return "官方音乐情报";
  if (text.includes("小豆島")) return "小豆岛舞台巡礼";

  const label = translatedDescription.match(/^【([^】]+)】/)?.[1];
  if (label) return label;
  return firstSentence(translatedDescription) || "（暂无相关内容）";
}

function buildAuthorTitle(detail) {
  return "山本崇一朗";
}

function buildAuthorDescription(detail) {
  if (detail?.description?.includes("Matched to the original X post by Soichiro Yamamoto")) {
    return "山本崇一朗在 X 发布的《擅长捉弄的高木同学》相关插画，当前图片已匹配到原始来源链接。";
  }
  return localizeDescription(detail?.description);
}

function buildOfficialMatchedDescription() {
  return "《擅长捉弄的高木同学》动画官方账号发布的图片，当前图片已匹配到原始 X 推文来源。";
}

function localizeGalleryDetail(filename, detail) {
  const sourceUrl = detail?.sourceUrl || "";
  const isAuthor = sourceUrl.includes("udon0531")
    || detail?.title === "Author X Illustration"
    || detail?.collection?.includes("Author X Illustration")
    || detail?.description?.includes("Soichiro Yamamoto");
  const isMatchedOfficial = !isAuthor && detail?.description?.includes("anime official account");
  const isOfficial = !isAuthor && (
    filename.includes("official/")
    || sourceUrl.includes("takagi3_anime")
    || detail?.title === "Official Anime Artwork"
    || detail?.collection?.includes("Official")
    || isMatchedOfficial
  );
  const description = isMatchedOfficial ? buildOfficialMatchedDescription() : isAuthor ? buildAuthorDescription(detail) : localizeDescription(detail?.description);
  const publishedAt = isAuthor || isMatchedOfficial ? getTaggedDate(detail?.tags) : formatTitle(detail?.title);
  const workTitle = detail?.originalTitle === "Karakai Jozu no Takagi-san"
    ? "擅长捉弄的高木同学"
    : detail?.originalTitle || "（暂无相关内容）";
  const sourceLabel = sourceUrl
    ? isAuthor
      ? "查看作者来源"
      : isOfficial
        ? "查看官方来源"
        : "查看来源"
    : "暂无来源";

  return {
    ...detail,
    collection: isAuthor ? "作者 X 插画" : isOfficial ? "官方 X 图集" : "私人收藏图集",
    title: isAuthor ? buildAuthorTitle(detail) : isMatchedOfficial ? `动画官方图 · ${publishedAt || "来源已匹配"}` : isOfficial ? buildOfficialTitle(detail?.description, description) : formatTitle(detail?.title),
    originalTitle: isOfficial || isAuthor
      ? `《${workTitle}》${publishedAt ? ` · 发布于 ${publishedAt}` : ""}`
      : workTitle,
    description,
    sourceLabel,
    note: sourceUrl
      ? "点击图片或来源按钮，可以打开这张图对应的原始页面。"
      : "（暂无相关内容）",
    tags: Array.isArray(detail?.tags) ? detail.tags.map(localizeTag) : []
  };
}

function seededUnit(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
}

function normalizeUnitProgress(progress) {
  return ((progress % 1) + 1) % 1;
}

function getLoaderBreath(elapsed, durationMs) {
  const angle = normalizeUnitProgress(elapsed / Math.max(durationMs, 1)) * Math.PI * 2;
  return 0.5 + (Math.sin(angle * 1.6 - 0.45) + 1) * 0.25;
}

function buildLoaderPath(variant, breath, steps = 320) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = variant.point(index / steps, breath);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(" ");
}

function getStoredImageAspect(filename, fallbackSeed) {
  const measuredAspect = imageAspects.value[filename];
  if (measuredAspect) return measuredAspect;

  const r = seededUnit(fallbackSeed);
  if (r > 0.76) return 16 / 10;
  if (r > 0.54) return 4 / 3;
  if (r > 0.3) return 1;
  return 3 / 4;
}

const photoWallItems = computed(() => {
  const width = viewportWidth.value || 1600;
  const height = viewportHeight.value || 900;
  const isCompact = width < 760;
  const paperBase = isCompact
    ? clampNumber(width / 2.8, 120, 175)
    : clampNumber(width / 5, 240, 360);
  const bleed = paperBase * 2.5;
  const targetCount = isCompact
    ? clampNumber(Math.round((width * height) / 12000), 40, 70)
    : clampNumber(Math.round((width * height) / 9000), 80, 130);
  const columnCount = clampNumber(
    Math.round(Math.sqrt(targetCount * (width / height))),
    isCompact ? 6 : 10,
    isCompact ? 10 : 16
  );
  const rowCount = Math.ceil(targetCount / columnCount);
  const stepX = (width + bleed * 2) / Math.max(columnCount - 1, 1);
  const stepY = (height + bleed * 2) / Math.max(rowCount - 1, 1);
  const slots = [];

  for (let row = 0; row < rowCount; row++) {
    for (let column = 0; column < columnCount; column++) {
      slots.push({
        row,
        column,
        order: seededUnit(row * 97.13 + column * 31.71 + width * 0.003 + height * 0.005)
      });
    }
  }

  slots.sort((a, b) => a.order - b.order);

  return slots.map((slot, index) => {
    const imageIndex = index % galleryImages.value.length;
    const filename = galleryImages.value[imageIndex];
    const r1 = seededUnit(index + 0.31);
    const r2 = seededUnit(index + 1.17);
    const r3 = seededUnit(index + 2.73);
    const r4 = seededUnit(index + 4.11);
    const r5 = seededUnit(index + 6.21);
    const r6 = seededUnit(index + 8.67);
    const r7 = seededUnit(index + 11.23);
    const imageAspect = clampNumber(getStoredImageAspect(filename, index + 37.9), 0.52, 1.95);
    const matte = clampNumber(paperBase * (0.052 + r5 * 0.016), 7, 13);
    const mediaLongSide = paperBase * (0.92 + r4 * 0.26);
    const mediaWidth = imageAspect >= 1 ? mediaLongSide : mediaLongSide * imageAspect;
    const mediaHeight = imageAspect >= 1 ? mediaLongSide / imageAspect : mediaLongSide;
    const cardWidth = mediaWidth + matte * 2;
    const cardHeight = mediaHeight + matte * 2;
    const gridX = -width / 2 - bleed + slot.column * stepX;
    const gridY = -height / 2 - bleed + slot.row * stepY;
    const x = gridX + (r2 - 0.5) * paperBase * 0.35;
    const y = gridY + (r3 - 0.5) * paperBase * 0.3;
    const fromLeft = index % 2 === 0;
    const pasteX = fromLeft
      ? -(width * (0.6 + r6 * 0.28) + paperBase * (0.5 + r5 * 0.32))
      : (seededUnit(index + 19.17) - 0.5) * width * 0.14;
    const pasteY = fromLeft
      ? (seededUnit(index + 23.41) - 0.5) * height * 0.18
      : height * (0.58 + r7 * 0.24) + paperBase * (0.45 + r6 * 0.4);
    const pasteRotate = (r2 - 0.5) * 22;
    const driftStartX = pasteX;
    const driftStartY = pasteY;
    const driftStartRotate = pasteRotate * 0.92 + (r5 - 0.5) * 10;
    const driftMidX = fromLeft
      ? pasteX * 0.34 + clampNumber(paperBase * (0.28 + r4 * 0.12), 28, 92)
      : (r4 - 0.5) * paperBase * 0.18;
    const driftMidY = fromLeft
      ? (r3 - 0.5) * paperBase * 0.16
      : pasteY * 0.3 - clampNumber(paperBase * (0.18 + r6 * 0.08), 10, 36);
    const driftMidRotate = pasteRotate * 0.28;
    const revealSpacing = isCompact ? 0.09 : 0.07;

    return {
      filename,
      globalIndex: imageIndex,
      instanceIndex: index,
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      rotate: (r1 - 0.5) * 10,
      matte,
      glow: 0.08 + r1 * 0.14,
      zIndex: 1000 + index,
      pasteX,
      pasteY,
      pasteRotate,
      driftStartX,
      driftStartY,
      driftStartRotate,
      driftMidX,
      driftMidY,
      driftMidRotate,
      pasteDelay: index * revealSpacing + r7 * 0.52,
      pasteDuration: 1.7 + r6 * 1.15,
      angle: (r1 - 0.5) * 8,
      sway: (r1 - 0.5) * 10,
      tilt: (r4 - 0.5) * 6
    };
  });
});

/* ── Lightbox ── */
function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cancelLightboxMotion() {
  if (lightboxCloseTimer) {
    window.clearTimeout(lightboxCloseTimer);
    lightboxCloseTimer = 0;
  }
  if (lightboxRevealTimer) {
    window.clearTimeout(lightboxRevealTimer);
    lightboxRevealTimer = 0;
  }
  if (lightboxFlightCleanupTimer) {
    window.clearTimeout(lightboxFlightCleanupTimer);
    lightboxFlightCleanupTimer = 0;
  }
  if (lightboxFlightFrameA) {
    cancelAnimationFrame(lightboxFlightFrameA);
    lightboxFlightFrameA = 0;
  }
  if (lightboxFlightFrameB) {
    cancelAnimationFrame(lightboxFlightFrameB);
    lightboxFlightFrameB = 0;
  }
}

function cancelGalleryMotion() {
  if (galleryRevealTimer) {
    window.clearTimeout(galleryRevealTimer);
    galleryRevealTimer = 0;
  }
  if (loaderAnimId) {
    cancelAnimationFrame(loaderAnimId);
    loaderAnimId = 0;
  }
}

function createLightboxFlightStyle(sourceRect, targetRect, item) {
  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const offsetX = sourceCenterX / window.innerWidth - 0.5;
  const offsetY = sourceCenterY / window.innerHeight - 0.5;
  const rotateZ = clampNumber((item?.sway || 0) * 1.3 + offsetX * 12 - offsetY * 6, -16, 16);
  const rotateX = clampNumber(18 + Math.abs(offsetY) * 26 + Math.abs(item?.tilt || 0) * 1.2, 16, 36);
  const rotateY = clampNumber(offsetX * 30 + (item?.angle || 0) * 1, -28, 28);
  const startRadius = clampNumber(sourceRect.width * 0.012, 2, 5);
  const endRadius = clampNumber(targetRect.width * 0.012, 6, 12);
  const frameInset = clampNumber(targetRect.width * 0.018, 10, 18);
  const flightPadding = clampNumber(sourceRect.width * 0.055, 8, 18);

  return {
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    "--flight-dx": `${targetRect.left - sourceRect.left}px`,
    "--flight-dy": `${targetRect.top - sourceRect.top}px`,
    "--flight-scale-x": `${targetRect.width / sourceRect.width}`,
    "--flight-scale-y": `${targetRect.height / sourceRect.height}`,
    "--flight-rotate-x": `${rotateX.toFixed(2)}deg`,
    "--flight-rotate-y": `${rotateY.toFixed(2)}deg`,
    "--flight-rotate-z": `${rotateZ.toFixed(2)}deg`,
    "--flight-radius-start": `${startRadius.toFixed(2)}px`,
    "--flight-radius-end": `${endRadius.toFixed(2)}px`,
    "--flight-frame-inset": `${frameInset.toFixed(2)}px`,
    "--flight-padding": `${flightPadding.toFixed(2)}px`
  };
}

function spawnFlightGhost(src, x, y, w, h, rx, ry, rz, radius, blur) {
  var ghost = document.createElement("div");
  var img = document.createElement("img");
  img.src = src;
  img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
  ghost.appendChild(img);
  ghost.style.cssText =
    "position:fixed;left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;" +
    "overflow:hidden;border-radius:" + radius + "px;pointer-events:none;z-index:10025;" +
    "opacity:0.36;transform:perspective(1200px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) rotateZ(" + rz + "deg);" +
    "filter:blur(" + (blur + 3) + "px) brightness(1.12);" +
    "transition:opacity 0.44s ease-out,filter 0.44s ease-out,transform 0.44s ease-out;" +
    "box-shadow:0 0 20px rgba(255,235,160,0.28);";
  document.body.appendChild(ghost);
  requestAnimationFrame(function () {
    ghost.style.opacity = "0";
    ghost.style.filter = "blur(" + (blur + 12) + "px) brightness(1.28)";
    ghost.style.transform += " scale(0.8)";
  });
  setTimeout(function () { ghost.remove(); }, 500);
}

function spawnArrivalParticles(cx, cy) {
  for (var i = 0; i < 16; i++) {
    var p = document.createElement("div");
    var angle = (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    var dist = 45 + Math.random() * 100;
    var tx = Math.cos(angle) * dist;
    var ty = Math.sin(angle) * dist;
    var size = 3 + Math.random() * 5;
    p.style.cssText =
      "position:fixed;left:" + cx + "px;top:" + cy + "px;" +
      "width:" + size + "px;height:" + size + "px;border-radius:50%;" +
      "background:rgba(255,235,160,0.92);pointer-events:none;z-index:10035;" +
      "transform:translate(-50%,-50%);opacity:1;" +
      "transition:all 0.58s cubic-bezier(0.16,1,0.3,1);" +
      "box-shadow:0 0 8px rgba(255,235,160,0.6);";
    document.body.appendChild(p);
    (function (el, dx, dy) {
      requestAnimationFrame(function () {
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
        el.style.opacity = "0";
      });
    })(p, tx, ty);
    setTimeout((function (el) { return function () { el.remove(); }; })(p), 650);
  }
}

async function runLightboxOpenFlight(sourceRect, item) {
  lightboxMeasureMode.value = true;
  await nextTick();
  const targetRect = lightboxCardRef.value?.getBoundingClientRect?.();
  lightboxMeasureMode.value = false;

  if (!targetRect?.width || !targetRect?.height) {
    lightboxSettled.value = true;
    return;
  }

  const src = getGalleryImageUrl(activeFilename.value);

  const sx = sourceRect.left;
  const sy = sourceRect.top;
  const sw = sourceRect.width;
  const sh = sourceRect.height;
  const tx = targetRect.left;
  const ty = targetRect.top;
  const tw = targetRect.width;
  const th = targetRect.height;

  const travelDist = Math.hypot(tx - sx, ty - sy);
  const arcHeight = -Math.min(travelDist * 0.14, 80);

  const normX = (sx + sw / 2) / window.innerWidth - 0.5;
  const normY = (sy + sh / 2) / window.innerHeight - 0.5;
  const startRotZ = clampNumber((item?.sway || 0) * 1.3 + normX * 14, -16, 16);
  const startRotX = clampNumber(22 + Math.abs(normY) * 24, 18, 40);
  const startRotY = clampNumber(normX * 32, -30, 30);

  const startRadius = clampNumber(sw * 0.012, 2, 5);
  const endRadius = clampNumber(tw * 0.012, 6, 12);
  const frameInset = clampNumber(tw * 0.018, 10, 18);

  lightboxFlight.value = {
    src,
    style: {
      left: sx + "px",
      top: sy + "px",
      width: sw + "px",
      height: sh + "px",
      transition: "none",
      transform: "translate(0px,0px) perspective(1200px) rotateX(" + startRotX + "deg) rotateY(" + startRotY + "deg) rotateZ(" + startRotZ + "deg) scale(1,1)",
      filter: "none",
      borderRadius: startRadius + "px",
      "--flight-radius-start": startRadius + "px",
      "--flight-radius-end": endRadius + "px",
      "--flight-frame-inset": frameInset + "px"
    },
    phase: "active"
  };

  await nextTick();
  await nextTick();

  const flightEl = document.querySelector(".lightbox-flight");
  if (!flightEl) {
    lightboxSettled.value = true;
    lightboxFlight.value = null;
    return;
  }

  const duration = 840;
  const startTime = performance.now();
  let prevPosT = 0;
  let lastGhostTime = 0;

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -13 * t);
  }
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const rawT = Math.min(elapsed / duration, 1);

    const posT = easeOutExpo(rawT);
    const rotT = easeOutQuint(rawT);

    const cx = sx + (tx - sx) * posT;
    const cy = sy + (ty - sy) * posT + arcHeight * Math.sin(posT * Math.PI);
    const cw = sw + (tw - sw) * posT;
    const ch = sh + (th - sh) * posT;

    const rx = startRotX * (1 - rotT);
    const ry = startRotY * (1 - rotT);
    const rz = startRotZ * (1 - rotT);

    const speed = Math.abs(posT - prevPosT);
    prevPosT = posT;
    const motionBlur = Math.min(speed * 200, 7);

    const scaleBoost = rawT > 0.72 && rawT < 1
      ? Math.sin((rawT - 0.72) / 0.28 * Math.PI) * 0.012
      : 0;

    const dx = cx - sx;
    const dy = cy - sy;
    const scaleX = cw / sw + scaleBoost;
    const scaleY = ch / sh + scaleBoost;
    const radius = startRadius + (endRadius - startRadius) * posT;

    flightEl.style.transform =
      "translate(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px) " +
      "perspective(1200px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) rotateZ(" + rz.toFixed(2) + "deg) " +
      "scale(" + scaleX.toFixed(4) + "," + scaleY.toFixed(4) + ")";
    flightEl.style.borderRadius = radius.toFixed(1) + "px";

    if (motionBlur > 0.4) {
      flightEl.style.filter = "blur(" + motionBlur.toFixed(1) + "px) brightness(" + (1 + (1 - posT) * 0.06).toFixed(3) + ")";
    } else if (rawT < 0.96) {
      flightEl.style.filter = "brightness(" + (1 + (1 - posT) * 0.03).toFixed(3) + ")";
    } else {
      flightEl.style.filter = "none";
    }

    if (now - lastGhostTime > 65 && rawT > 0.04 && rawT < 0.88) {
      lastGhostTime = now;
      spawnFlightGhost(src, cx, cy, cw, ch, rx, ry, rz, radius, motionBlur);
    }

    if (rawT < 1) {
      requestAnimationFrame(tick);
    } else {
      spawnArrivalParticles(tx + tw / 2, ty + th / 2);
      window.setTimeout(function () {
        lightboxFlight.value = null;
      }, 80);
    }
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(tick);
  });

  window.setTimeout(function () {
    lightboxSettled.value = true;
  }, 130);
}

async function openLightbox(index, event, item) {
  cancelLightboxMotion();
  const sourceNode = event?.currentTarget?.querySelector(".photo-leaf__paper") || event?.currentTarget;
  const sourceRect = sourceNode?.getBoundingClientRect?.();

  lightboxVisible.value = false;
  lightboxSettled.value = false;
  lightboxMeasureMode.value = false;
  lightboxFlight.value = null;
  lightboxOriginX.value = sourceRect
    ? ((sourceRect.left + sourceRect.width / 2) / window.innerWidth * 100).toFixed(1)
    : 50;
  lightboxOriginY.value = sourceRect
    ? ((sourceRect.top + sourceRect.height / 2) / window.innerHeight * 100).toFixed(1)
    : 50;
  lightboxIndex.value = index;
  document.body.style.overflow = "hidden";

  await nextTick();
  lightboxVisible.value = true;
  await nextTick();

  if (sourceRect?.width && sourceRect?.height) {
    runLightboxOpenFlight(sourceRect, item);
    return;
  }

  lightboxSettled.value = true;
}

function closeLightbox() {
  cancelLightboxMotion();
  lightboxVisible.value = false;
  lightboxSettled.value = false;
  lightboxMeasureMode.value = false;
  lightboxFlight.value = null;
  document.body.style.overflow = "";
  lightboxCloseTimer = window.setTimeout(() => {
    lightboxIndex.value = -1;
  }, LIGHTBOX_CLOSE_DURATION);
}

function prevImage() {
  lightboxIndex.value = lightboxIndex.value > 0
    ? lightboxIndex.value - 1
    : galleryImages.value.length - 1;
}

function nextImage() {
  lightboxIndex.value = lightboxIndex.value < galleryImages.value.length - 1
    ? lightboxIndex.value + 1
    : 0;
}

function toggleRefreshMode() {
  refreshOnReload.value = !refreshOnReload.value;
  writeStorage(GALLERY_REFRESH_MODE_STORAGE_KEY, refreshOnReload.value ? "refresh" : "fixed");
  if (refreshOnReload.value) {
    galleryImages.value = createGallerySample();
    if (lightboxIndex.value >= galleryImages.value.length) lightboxIndex.value = galleryImages.value.length - 1;
    beginGallerySequence();
  }
}

function getSourceTitle() {
  return localizedGalleryDetail.value.sourceUrl ? "打开来源链接" : "暂未匹配到来源";
}

function getCloseLabel() {
  return "关闭";
}

function getPrevLabel() {
  return "上一张";
}

function getNextLabel() {
  return "下一张";
}

function getBackLabel() {
  return "返回";
}

function decodeHtmlEntities(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function extractTweetTextFromHtml(html) {
  const match = html?.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return "";
  return decodeHtmlEntities(
    match[1]
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<a [^>]*>pic\.twitter\.com\/[^<]+<\/a>/gi, "")
      .replace(/<a [^>]*>([\s\S]*?)<\/a>/gi, "$1")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getTweetMetaCacheKey(sourceUrl) {
  return `gallery_tweet_meta:${sourceUrl}`;
}

function readTweetMetaCache(sourceUrl) {
  try {
    const raw = window.localStorage.getItem(getTweetMetaCacheKey(sourceUrl));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeTweetMeta(parsed);
  } catch {
    return null;
  }
}

function writeTweetMetaCache(sourceUrl, data) {
  const normalized = normalizeTweetMeta(data);
  if (!normalized) return;

  try {
    window.localStorage.setItem(getTweetMetaCacheKey(sourceUrl), JSON.stringify(normalized));
  } catch {
    return;
  }
}

function normalizeTweetMeta(meta) {
  if (!meta || typeof meta !== "object") return null;

  const normalized = {
    authorName: String(meta.authorName || "").trim(),
    authorUrl: String(meta.authorUrl || "").trim(),
    tweetText: String(meta.tweetText || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim(),
    mediaOnly: Boolean(meta.mediaOnly)
  };

  return normalized.authorName || normalized.authorUrl || normalized.tweetText || normalized.mediaOnly
    ? normalized
    : null;
}

function getStaticTweetMeta(sourceUrl) {
  return normalizeTweetMeta(authorTweetMetaBySourceUrl[sourceUrl]);
}

function parseTweetSource(sourceUrl) {
  const match = String(sourceUrl || "").match(/^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^/?#]+)\/status\/(\d+)/i);
  if (!match) return null;

  return {
    handle: match[1],
    tweetId: match[2]
  };
}

async function requestTweetMetaFromFx(sourceUrl, requestId) {
  const tweetSource = parseTweetSource(sourceUrl);
  if (!tweetSource) return null;

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), 10000)
    : 0;

  try {
    const response = await fetch(`https://api.fxtwitter.com/${tweetSource.handle}/status/${tweetSource.tweetId}`, {
      headers: {
        Accept: "application/json"
      },
      signal: controller?.signal
    });
    if (!response.ok) return null;

    const payload = await response.json();
    if (requestId !== activeTweetRequestId) return null;

    const tweet = payload?.tweet;
    const meta = normalizeTweetMeta({
      authorName: String(tweet?.author?.name || "").trim(),
      authorUrl: String(tweet?.author?.url || "").trim(),
      tweetText: String(tweet?.text || "").trim() || cleanupTweetText(String(tweet?.raw_text?.text || ""))
    });

    return meta;
  } catch {
    return null;
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

function requestTweetMetaFromOEmbed(sourceUrl, requestId) {
  const callbackName = `__galleryTweetMeta_${requestId}_${Date.now()}`;
  const cleanup = () => {
    try { delete window[callbackName]; } catch { window[callbackName] = undefined; }
    script.remove();
  };
  const script = document.createElement("script");
  const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(sourceUrl)}&omit_script=true&callback=${callbackName}`;

  window[callbackName] = (payload) => {
    if (requestId !== activeTweetRequestId) {
      cleanup();
      return;
    }
    const meta = normalizeTweetMeta({
      authorName: payload?.author_name || "",
      authorUrl: payload?.author_url || "",
      tweetText: extractTweetTextFromHtml(payload?.html || "")
    });
    if (meta) {
      activeTweetMeta.value = meta;
      writeTweetMetaCache(sourceUrl, meta);
    }
    cleanup();
  };

  script.onerror = cleanup;
  script.src = endpoint;
  document.body.appendChild(script);
}

async function loadTweetMeta(sourceUrl) {
  const requestId = ++activeTweetRequestId;
  activeTweetMeta.value = null;

  const tweetSource = parseTweetSource(sourceUrl);
  if (!tweetSource) return;

  const staticMeta = getStaticTweetMeta(sourceUrl);
  if (staticMeta) {
    activeTweetMeta.value = staticMeta;
    writeTweetMetaCache(sourceUrl, staticMeta);
    return;
  }

  const cached = readTweetMetaCache(sourceUrl);
  if (cached) {
    activeTweetMeta.value = cached;
  }

  const fxMeta = await requestTweetMetaFromFx(sourceUrl, requestId);
  if (requestId !== activeTweetRequestId) return;

  if (fxMeta) {
    activeTweetMeta.value = fxMeta;
    writeTweetMetaCache(sourceUrl, fxMeta);
    return;
  }

  requestTweetMetaFromOEmbed(sourceUrl, requestId);
}

function openSourceLink() {
  const url = activeGalleryDetail.value.sourceUrl;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

function openAuthorLink() {
  const url = displayAuthorUrl.value;
  if (url) window.open(url, "_blank", "noopener,noreferrer");
}

/* ── Drag rotation (no auto-rotate) ── */
function onPointerMove(e) {
  cursorX.value = e.clientX;
  cursorY.value = e.clientY;
}

function updateViewportSize() {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;
}

function handleKeydown(e) {
  if (lightboxIndex.value >= 0) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  }
}

function handleImgLoad(filename, e) {
  const image = e.target;
  const width = image?.naturalWidth || 0;
  const height = image?.naturalHeight || 0;
  if (!width || !height) return;

  const aspect = clampNumber(width / height, 0.52, 1.95);
  if (Math.abs((imageAspects.value[filename] || 0) - aspect) < 0.01) return;
  imageAspects.value = {
    ...imageAspects.value,
    [filename]: aspect
  };
}

function handleImgError(e) { e.target.style.display = "none"; }

async function preloadGalleryImages(filenames, sequenceId) {
  let loaded = 0;
  const total = Math.max(filenames.length, 1);

  const tasks = filenames.map((filename) => new Promise((resolve) => {
    const image = new Image();
    const src = getGalleryImageUrl(filename);
    image.decoding = "async";
    image.loading = "eager";

    const finalize = () => {
      loaded += 1;
      if (sequenceId === gallerySequenceToken) {
        galleryLoadProgress.value = loaded / total;
      }
      resolve();
    };

    image.onload = async () => {
      const width = image.naturalWidth || 0;
      const height = image.naturalHeight || 0;
      if (width && height) {
        const aspect = clampNumber(width / height, 0.52, 1.95);
        imageAspects.value = {
          ...imageAspects.value,
          [filename]: aspect
        };
      }

      try {
        if (typeof image.decode === "function") {
          await image.decode();
        }
      } catch {
        // Ignore decode failures and continue to reveal after load.
      }

      finalize();
    };

    image.onerror = finalize;
    image.src = src;

    if (image.complete) {
      image.onload?.();
    }
  }));

  await Promise.all(tasks);
}

function animateGalleryLoader(startedAt, sequenceId) {
  const tick = (now) => {
    if (sequenceId !== gallerySequenceToken || galleryPhase.value !== "loading") {
      loaderAnimId = 0;
      return;
    }

    loaderElapsedMs.value = now - startedAt;
    loaderAnimId = requestAnimationFrame(tick);
  };

  cancelGalleryMotion();
  loaderAnimId = requestAnimationFrame(tick);
}

async function startGalleryReveal(sequenceId) {
  if (sequenceId !== gallerySequenceToken) return;

  cancelGalleryMotion();
  galleryPhase.value = "revealing";
  loaderElapsedMs.value = 0;
  entranceOpacity.value = 0;
  isReady.value = false;
  revealRunId.value += 1;
  sceneImagesMounted.value = false;

  await nextTick();
  sceneImagesMounted.value = true;
  await nextTick();

  entranceOpacity.value = 1;
  isReady.value = true;

  const revealDuration = photoWallItems.value.reduce((maxDelay, item) => {
    return Math.max(maxDelay, item.pasteDelay + item.pasteDuration);
  }, 0);

  galleryRevealTimer = window.setTimeout(() => {
    if (sequenceId !== gallerySequenceToken) return;
    galleryPhase.value = "ready";
  }, Math.ceil(revealDuration * 1000) + 180);
}

async function beginGallerySequence() {
  const sequenceId = ++gallerySequenceToken;
  const startedAt = performance.now();

  cancelGalleryMotion();
  galleryPhase.value = "loading";
  galleryLoadProgress.value = 0;
  entranceOpacity.value = 0;
  isReady.value = false;
  sceneImagesMounted.value = false;
  loaderVariantKey.value = GALLERY_LOADER_VARIANTS[Math.floor(Math.random() * GALLERY_LOADER_VARIANTS.length)].key;
  loaderElapsedMs.value = 0;

  animateGalleryLoader(startedAt, sequenceId);

  await preloadGalleryImages(galleryImages.value, sequenceId);
  const elapsed = performance.now() - startedAt;
  const waitMs = Math.max(0, GALLERY_LOADER_MIN_DURATION - elapsed);
  if (waitMs) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, waitMs);
    });
  }

  await startGalleryReveal(sequenceId);
}

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

watch(activeFilename, () => {
  loadTweetMeta(activeGalleryDetail.value?.sourceUrl || "");
});

onMounted(() => {
  updateViewportSize();
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", updateViewportSize);
  initCanvas();
  beginGallerySequence();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("resize", updateViewportSize);
  cancelLightboxMotion();
  cancelGalleryMotion();
  if (animId) cancelAnimationFrame(animId);
  if (cleanupCanvas) cleanupCanvas();
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="gallery-root" :class="galleryPhaseClasses">
    <!-- Dreamy canvas -->
    <canvas ref="canvasRef" class="dream-canvas"></canvas>

    <!-- Cursor glow -->
    <div
      class="cursor-glow"
      :style="{ transform: `translate(${cursorX - 200}px, ${cursorY - 200}px)` }"
    ></div>

    <!-- Background layers -->
    <div class="bg-deep"></div>

    <Transition name="gallery-loader-fade">
      <div v-if="galleryPhase === 'loading'" class="gallery-loader">
        <div class="gallery-loader__orbit" aria-label="loading">
          <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <g :transform="loaderGroupTransform">
              <path
                class="gallery-loader__path"
                :d="loaderPathData"
              />
              <circle
                v-for="(particle, index) in loaderParticles"
                :key="`${loaderVariantKey}-${index}`"
                class="gallery-loader__particle"
                :cx="particle.cx"
                :cy="particle.cy"
                :r="particle.r"
                :opacity="particle.opacity"
              />
            </g>
          </svg>
        </div>
      </div>
    </Transition>

    <button
      class="sample-toggle"
      type="button"
      :class="{ 'is-refreshing': refreshOnReload }"
      :aria-pressed="refreshOnReload"
      :title="refreshOnReload ? '刷新抽样' : '固定图集'"
      @click="toggleRefreshMode"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    </button>

    <!-- Back button -->
    <button class="back-btn" type="button" title="返回" @click="router.push('/workspace')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Photo wall -->
    <div ref="wallRef" class="wall-viewport">
      <div
        class="wall-scene"
        :style="{
          opacity: entranceOpacity
        }"
      >
        <div class="photo-wall">
          <template v-if="sceneImagesMounted">
            <div
              v-for="item in photoWallItems"
              :key="`${item.filename}-${item.instanceIndex}-${revealRunId}`"
              class="photo-leaf"
              :style="{
                '--matte-padding': `${item.matte}px`,
                '--glow-strength': item.glow,
                '--x': `${item.x}px`,
                '--y': `${item.y}px`,
                '--rotate': `${item.rotate}deg`,
                '--paste-x': `${item.pasteX}px`,
                '--paste-y': `${item.pasteY}px`,
                '--paste-rotate': `${item.pasteRotate}deg`,
                '--drift-start-x': `${item.driftStartX}px`,
                '--drift-start-y': `${item.driftStartY}px`,
                '--drift-start-rotate': `${item.driftStartRotate}deg`,
                '--drift-mid-x': `${item.driftMidX}px`,
                '--drift-mid-y': `${item.driftMidY}px`,
                '--drift-mid-rotate': `${item.driftMidRotate}deg`,
                '--paste-delay': `${item.pasteDelay}s`,
                '--paste-duration': `${item.pasteDuration}s`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                zIndex: item.zIndex
              }"
              @click="openLightbox(item.globalIndex, $event, item)"
            >
              <div class="photo-leaf__paper">
                <div class="photo-leaf__inner">
                  <img
                    :src="getGalleryImageUrl(item.filename)"
                    :alt="item.filename"
                    loading="eager"
                    @load="handleImgLoad(item.filename, $event)"
                    @error="handleImgError"
                  />
                </div>
              </div>
              <div class="photo-leaf__glint"></div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="lightboxIndex >= 0"
          class="lightbox"
          :class="{
            'is-visible': lightboxVisible,
            'is-settled': lightboxSettled,
            'is-measuring': lightboxMeasureMode
          }"
          :style="{
            '--origin-x': lightboxOriginX + '%',
            '--origin-y': lightboxOriginY + '%'
          }"
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
            <div class="lightbox__halo" aria-hidden="true"></div>
            <button
              ref="lightboxCardRef"
              class="lightbox__card"
              type="button"
              :disabled="!localizedGalleryDetail.sourceUrl"
              :title="getSourceTitle()"
              @click="openSourceLink"
            >
              <div class="lightbox__card-shimmer" aria-hidden="true"></div>
              <img
                :src="getGalleryImageUrl(activeFilename)"
                :alt="localizedGalleryDetail.title"
              />
            </button>
            <div class="lightbox__shadow" aria-hidden="true"></div>
          </div>

          <aside class="lightbox__info">
            <p class="lightbox__eyebrow">{{ localizedGalleryDetail.collection }}</p>
            <h2>
              <button
                class="lightbox__author"
                type="button"
                :disabled="!displayAuthorUrl"
                @click="openAuthorLink"
              >
                <span>{{ displayAuthorName }}</span>
                <svg v-if="displayAuthorUrl" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 17L17 7"/>
                  <path d="M9 7h8v8"/>
                </svg>
              </button>
            </h2>
            <p class="lightbox__original">{{ localizedGalleryDetail.originalTitle }}</p>
            <p class="lightbox__desc">{{ displayTweetText }}</p>

            <div class="lightbox__tags">
              <span v-for="tag in localizedGalleryDetail.tags" :key="tag">{{ tag }}</span>
            </div>

            <button
              class="lightbox__source"
              type="button"
              :disabled="!localizedGalleryDetail.sourceUrl"
              @click="openSourceLink"
            >
              <span>{{ localizedGalleryDetail.sourceLabel }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17L17 7"/>
                <path d="M9 7h8v8"/>
              </svg>
            </button>

            <p class="lightbox__note">{{ localizedGalleryDetail.note }}</p>
          </aside>

          <button class="lightbox__arrow lightbox__arrow--right" @click="nextImage" aria-label="下一张">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </Transition>
      <div
        v-if="lightboxFlight"
        class="lightbox-flight"
        :class="{ 'is-active': lightboxFlight.phase === 'active' }"
        :style="lightboxFlight.style"
        aria-hidden="true"
      >
        <img :src="lightboxFlight.src" alt="" />
        <div class="lightbox-flight__veil"></div>
        <div class="lightbox-flight__frame"></div>
        <div class="lightbox-flight__dust"></div>
      </div>
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
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid rgba(61, 216, 176, 0.1);
  border-radius: 50%;
  background: rgba(10, 15, 30, 0.5);
  color: rgba(180, 210, 200, 0.5);
  cursor: pointer;
  transition: all 0.35s ease;
  backdrop-filter: blur(12px);
}

.back-btn svg {
  width: 18px;
  height: 18px;
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
  background: transparent;
  backdrop-filter: none;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox__backdrop::before,
.lightbox__backdrop::after {
  display: none;
}

.lightbox.is-visible .lightbox__backdrop {
  opacity: 1;
}

.lightbox__backdrop-img {
  position: absolute;
  left: -5vw;
  top: 5vh;
  width: min(50vw, 800px);
  height: 80vh;
  object-fit: cover;
  filter: blur(80px) saturate(0.5) brightness(0.3);
  opacity: 0;
  transform: scale(1.08);
  transition:
    opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox.is-visible .lightbox__backdrop-img {
  opacity: 0.15;
  transform: scale(1);
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
  perspective: 2200px;
  transform: translateY(18px);
  opacity: 0;
  transition:
    transform 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s ease;
}

.lightbox.is-settled .lightbox__stage {
  transform: translateY(0);
  opacity: 1;
}

.lightbox__card {
  position: relative;
  display: block;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  box-shadow: none;
  overflow: hidden;
  transform: translateY(34px) scale(0.94) rotateX(10deg);
  transform-origin: 50% 64%;
  opacity: 0;
  filter: blur(10px);
  will-change: transform, opacity, filter;
  transition:
    transform 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s ease,
    filter 0.7s ease;
}

.lightbox__card:disabled { cursor: default; }

.lightbox__card:not(:disabled):hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: none;
}

.lightbox__card::before {
  display: none;
}

.lightbox__card::after {
  display: none;
}

.lightbox.is-settled .lightbox__card {
  transform: translateY(0) scale(1) rotateX(0deg);
  opacity: 1;
  filter: blur(0);
}

.lightbox.is-settled .lightbox__card:not(:disabled):hover {
  transform: translateY(-4px) scale(1.01);
}

.lightbox.is-measuring .lightbox__card {
  transform: none;
  opacity: 0;
  filter: none;
  transition: none;
}

.lightbox__card img {
  display: block;
  max-width: min(50vw, 720px);
  max-height: 76vh;
  border-radius: 8px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  transform: scale(1.02);
  opacity: 0.88;
  transition:
    transform 0.78s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.5s ease,
    filter 0.5s ease;
}

.lightbox.is-settled .lightbox__card img {
  transform: scale(1);
  opacity: 1;
}

.lightbox__info {
  position: relative;
  z-index: 6;
  align-self: center;
  min-height: min(65vh, 600px);
  padding-left: clamp(20px, 3vw, 44px);
  border-left: 1px solid rgba(61, 216, 176, 0.1);
  transform: translateX(28px);
  opacity: 0;
  filter: blur(12px);
  transition:
    transform 0.78s cubic-bezier(0.22, 1, 0.36, 1) 0.05s,
    opacity 0.5s ease 0.05s,
    filter 0.6s ease 0.05s;
}

.lightbox.is-settled .lightbox__info {
  transform: translateX(0);
  opacity: 1;
  filter: blur(0);
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

.lightbox__author {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 0.25s ease, transform 0.25s ease;
}

.lightbox__author:hover:not(:disabled) {
  color: rgba(61, 216, 176, 0.88);
  transform: translateX(2px);
}

.lightbox__author:disabled {
  cursor: default;
}

.lightbox__author svg {
  flex: 0 0 auto;
  opacity: 0.65;
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
  white-space: pre-line;
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

.lightbox-flight {
  position: fixed;
  z-index: 10030;
  overflow: hidden;
  pointer-events: none;
  transform-origin: top left;
  border-radius: var(--flight-radius-start);
  background: rgba(255, 251, 237, 0.82);
  box-shadow:
    0 24px 48px rgba(96, 118, 89, 0.2),
    0 0 36px rgba(255, 228, 141, 0.28);
  opacity: 0.98;
  filter: saturate(1.02) brightness(1.04);
  will-change: transform, border-radius, filter, opacity, box-shadow;
  transition:
    transform 0.92s cubic-bezier(0.2, 1, 0.22, 1),
    border-radius 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.62s ease;
  transform:
    perspective(1700px)
    translate3d(0, 0, 0)
    rotateX(var(--flight-rotate-x))
    rotateY(var(--flight-rotate-y))
    rotateZ(var(--flight-rotate-z))
    scale3d(1, 1, 1);
}

.lightbox-flight.is-active {
  border-radius: var(--flight-radius-end);
  box-shadow:
    0 52px 118px rgba(100, 118, 87, 0.26),
    0 0 86px rgba(255, 227, 135, 0.18);
  filter: saturate(1.05) brightness(1.06);
  transform:
    perspective(1700px)
    translate3d(var(--flight-dx), var(--flight-dy), 0)
    rotateX(0deg)
    rotateY(0deg)
    rotateZ(0deg)
    scale3d(var(--flight-scale-x), var(--flight-scale-y), 1);
}

.lightbox-flight img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
}

.lightbox-flight__veil,
.lightbox-flight__frame,
.lightbox-flight__dust {
  position: absolute;
  inset: 0;
}

.lightbox-flight__veil {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.28), transparent 34%),
    radial-gradient(circle at 50% 14%, rgba(255, 248, 215, 0.42), transparent 34%),
    linear-gradient(180deg, rgba(255, 244, 201, 0.06), rgba(168, 202, 177, 0.14));
  mix-blend-mode: screen;
  opacity: 0.92;
}

.lightbox-flight__frame {
  inset: var(--flight-frame-inset);
  border: 1px solid rgba(255, 248, 222, 0.78);
  border-radius: calc(var(--flight-radius-start) * 0.72);
  box-shadow: inset 0 0 0 1px rgba(125, 155, 102, 0.08);
  transition:
    inset 0.82s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.82s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox-flight.is-active .lightbox-flight__frame {
  border-radius: calc(var(--flight-radius-end) - 7px);
}

.lightbox-flight__dust {
  inset: -22%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 240, 170, 0.34), transparent 28%),
    radial-gradient(circle at 50% 50%, rgba(171, 209, 184, 0.18), transparent 52%);
  filter: blur(22px);
  opacity: 0.68;
  transform: scale(0.84);
  transition:
    transform 0.92s cubic-bezier(0.2, 1, 0.22, 1),
    opacity 0.92s ease;
}

.lightbox-flight.is-active .lightbox-flight__dust {
  transform: scale(1.18);
  opacity: 0.34;
}

.lb-enter-active { transition: opacity 0.06s ease; }
.lb-leave-active { transition: opacity 0.32s ease; }
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
  color: rgba(77, 99, 72, 0.5);
}

.back-btn:hover {
  color: rgba(96, 118, 78, 0.85);
}

.sample-toggle {
  position: fixed;
  right: 28px;
  bottom: 26px;
  z-index: 120;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: rgba(77, 99, 72, 0.5);
  box-shadow: none;
  backdrop-filter: none;
  cursor: pointer;
  transition: color 0.25s ease;
}

.sample-toggle svg {
  width: 17px;
  height: 17px;
}

.sample-toggle:hover {
  color: rgba(96, 118, 78, 0.85);
}

.sample-toggle.is-refreshing {
  color: rgba(205, 158, 76, 0.92);
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
  background: transparent;
}

.lightbox__backdrop::before {
  display: none;
}

.lightbox__card {
  background: transparent;
  box-shadow: none;
  border: 0;
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

.wall-viewport {
  perspective: 1780px;
  perspective-origin: 50% 50%;
}

.wall-scene {
  top: 52%;
  transition: transform 0.12s ease-out, opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.photo-wall {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

.photo-wall::before,
.photo-wall::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.photo-wall::before {
  left: -800px;
  top: -560px;
  width: 1600px;
  height: 1120px;
  border-radius: 44px;
  background:
    linear-gradient(180deg, rgba(255, 254, 247, 0.42), rgba(244, 238, 221, 0.16)),
    radial-gradient(circle at 50% 48%, rgba(255, 246, 197, 0.32), transparent 48%);
  box-shadow:
    inset 0 0 0 1px rgba(223, 212, 185, 0.18),
    0 44px 120px rgba(154, 173, 126, 0.1),
    0 0 120px rgba(255, 234, 156, 0.14);
  opacity: 0.75;
  transform: translateZ(-80px);
}

.photo-wall::after {
  left: -760px;
  top: -520px;
  width: 1520px;
  height: 1040px;
  border-radius: 36px;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.28), transparent 18%),
    radial-gradient(circle at 82% 28%, rgba(238, 248, 236, 0.18), transparent 24%),
    radial-gradient(circle at 48% 68%, rgba(255, 239, 164, 0.16), transparent 22%);
  filter: blur(24px);
  opacity: 0.8;
  transform: translateZ(-120px);
}

.photo-leaf {
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
}

.photo-leaf__paper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: rgba(255, 254, 250, 0.96);
  border: 1px solid rgba(231, 221, 196, 0.88);
  box-shadow:
    0 20px 34px rgba(109, 126, 92, 0.16),
    0 2px 0 rgba(255, 255, 255, 0.75) inset,
    0 0 0 1px rgba(255, 247, 230, 0.55);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  isolation: isolate;
  transition:
    transform 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.48s ease;
}

.photo-leaf__paper::before,
.photo-leaf__paper::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 254, 250, 0.98);
  border: 1px solid rgba(231, 221, 196, 0.68);
  z-index: -1;
}

.photo-leaf__paper::before {
  transform: translate3d(calc(var(--stack-shift-x) * -0.72), calc(var(--stack-shift-y) * -0.72), -8px) rotateZ(-2.6deg);
  box-shadow: 0 18px 30px rgba(109, 126, 92, 0.12);
}

.photo-leaf__paper::after {
  transform: translate3d(var(--stack-shift-x), var(--stack-shift-y), -14px) rotateZ(2.3deg);
  box-shadow: 0 22px 32px rgba(109, 126, 92, 0.14);
  opacity: 0.92;
}

.photo-leaf__inner {
  position: absolute;
  inset: var(--matte-padding);
  overflow: hidden;
  border-radius: 13px;
  background: linear-gradient(180deg, rgba(248, 244, 236, 0.94), rgba(240, 233, 219, 0.84));
  box-shadow:
    inset 0 0 0 1px rgba(222, 211, 184, 0.48),
    inset 0 18px 24px rgba(255, 255, 255, 0.2);
}

.photo-leaf__inner::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent 36%),
    radial-gradient(circle at 50% 100%, rgba(255, 236, 172, 0.12), transparent 48%);
  pointer-events: none;
}

.photo-leaf__inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.03) saturate(0.94) contrast(0.98);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease;
}

.photo-leaf__glint {
  position: absolute;
  inset: -28px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 244, 191, calc(var(--glow-strength) * 0.4)), transparent 56%);
  opacity: 0;
  transform: scale(0.82);
  pointer-events: none;
  transition: opacity 0.36s ease, transform 0.42s ease;
}

.photo-leaf:hover .photo-leaf__paper {
  transform: translateY(-10px) scale(1.038);
  box-shadow:
    0 30px 54px rgba(109, 126, 92, 0.22),
    0 2px 0 rgba(255, 255, 255, 0.78) inset,
    0 0 0 1px rgba(255, 243, 211, 0.72);
  filter: saturate(1.02);
}

.photo-leaf:hover .photo-leaf__inner {
  transform: none;
}

.photo-leaf:hover .photo-leaf__inner img {
  transform: scale(1.08);
  filter: brightness(1.08) saturate(1.02) contrast(0.99);
}

.photo-leaf:hover .photo-leaf__glint {
  opacity: 1;
  transform: scale(1.06);
}

@media (max-width: 1100px) {
  .photo-wall {
    transform: scale(0.82);
  }
}

@media (max-width: 768px) {
  .wall-scene {
    top: 50%;
  }

  .photo-wall {
    transform: scale(0.58);
  }

  .photo-wall::before {
    width: 1420px;
    height: 1240px;
    left: -710px;
    top: -620px;
  }

  .photo-wall::after {
    width: 1360px;
    height: 1160px;
    left: -680px;
    top: -580px;
  }
}

.gallery-root {
  cursor: default;
}

.gallery-root:active {
  cursor: default;
}

.dream-canvas {
  opacity: 0.18;
}

.wall-viewport {
  perspective: none;
  perspective-origin: 50% 50%;
}

.wall-scene {
  left: 50%;
  top: 50%;
  transform: none;
  transform-style: flat;
  transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.photo-wall {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform: none;
  transform-style: flat;
}

.photo-wall::before,
.photo-wall::after {
  display: none;
}

.photo-leaf {
  left: 0;
  top: 0;
  transform-style: flat;
  opacity: 0;
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1);
  animation: photoPasteIn var(--paste-duration) cubic-bezier(0.18, 0.98, 0.22, 1) var(--paste-delay) both;
}

.photo-leaf__paper {
  border-radius: 7px;
  background: rgba(255, 255, 252, 0.98);
  border: 1px solid rgba(214, 214, 214, 0.92);
  box-shadow:
    0 8px 15px rgba(118, 124, 112, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.82) inset;
  transform-style: flat;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s ease,
    filter 0.28s ease;
}

.photo-leaf__paper::before,
.photo-leaf__paper::after {
  display: none;
}

.photo-leaf__inner {
  inset: var(--matte-padding);
  border-radius: 5px;
  background: rgba(245, 245, 242, 0.92);
}

.photo-leaf__inner::after {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(220, 220, 210, 0.05));
}

.photo-leaf__inner img {
  filter: brightness(1.02) saturate(0.96) contrast(0.98);
}

.photo-leaf__glint {
  display: none;
}

.photo-leaf:hover .photo-leaf__paper {
  transform: translateY(-5px) scale(1.018);
  box-shadow:
    0 14px 26px rgba(96, 108, 92, 0.26),
    0 1px 0 rgba(255, 255, 255, 0.88) inset;
  filter: brightness(1.02);
}

.photo-leaf:hover .photo-leaf__inner img {
  transform: scale(1.045);
  filter: brightness(1.06) saturate(1.02) contrast(0.99);
}

.lightbox-flight,
.lightbox-flight.is-active {
  transform-origin: top left;
}

.lightbox-flight {
  transform:
    translate3d(0, 0, 0)
    rotate(var(--flight-rotate-z))
    scale3d(1, 1, 1);
}

.lightbox-flight.is-active {
  transform:
    translate3d(var(--flight-dx), var(--flight-dy), 0)
    rotate(0deg)
    scale3d(var(--flight-scale-x), var(--flight-scale-y), 1);
}

@keyframes photoPasteIn {
  0% {
    opacity: 0;
    transform:
      translate(calc(var(--x) + var(--paste-x)), calc(var(--y) + var(--paste-y)))
      rotate(calc(var(--rotate) + var(--paste-rotate)))
      scale(1.22);
    filter: blur(7px) brightness(1.18);
  }
  62% {
    opacity: 1;
    transform:
      translate(calc(var(--x) - 3px), calc(var(--y) + 2px))
      rotate(calc(var(--rotate) - 0.6deg))
      scale(0.985);
    filter: blur(0) brightness(1.03);
  }
  100% {
    opacity: 1;
    transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1);
    filter: blur(0) brightness(1);
  }
}

@media (max-width: 768px) {
  .wall-scene {
    top: 50%;
  }

  .photo-wall {
    transform: none;
  }
}

/* Final flat paper-wall treatment: close to the reference image, no 3D depth. */
.gallery-root {
  cursor: default;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.38) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.34) 1px, transparent 1px),
    #e6e6e6;
  background-size: 38px 38px;
  color: #596057;
}

.gallery-root.is-loading .sample-toggle,
.gallery-root.is-loading .back-btn {
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
}

.gallery-root::before,
.gallery-root::after,
.bg-deep,
.dream-canvas,
.cursor-glow {
  display: none;
}

.wall-viewport {
  z-index: 2;
  perspective: none;
  background:
    radial-gradient(circle at 48% 42%, rgba(255, 255, 255, 0.32), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.22), rgba(214, 214, 214, 0.18));
}

.wall-scene,
.photo-wall,
.photo-leaf,
.photo-leaf__paper {
  transform-style: flat;
}

.wall-scene {
  left: 50%;
  top: 50%;
  transform: none;
  transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.photo-wall {
  transform: none;
}

.gallery-loader {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 90;
  width: min(160px, 28vw);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.gallery-loader__orbit {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 248, 221, 0.36), rgba(247, 242, 224, 0.14) 42%, transparent 72%);
  filter: drop-shadow(0 6px 18px rgba(168, 157, 112, 0.12));
}

.gallery-loader__orbit svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  color: rgba(143, 156, 111, 0.9);
}

.gallery-loader__path {
  stroke: currentColor;
  stroke-width: 3.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  opacity: 0.12;
}

.gallery-loader__particle {
  fill: currentColor;
}

.gallery-loader-fade-enter-active,
.gallery-loader-fade-leave-active {
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-loader-fade-enter-from,
.gallery-loader-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.96);
}

.photo-leaf {
  opacity: 0;
  transform: translate(var(--x), var(--y)) rotate(var(--rotate));
  animation: photoDriftPasteIn var(--paste-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--paste-delay) both;
}

.photo-leaf__paper {
  display: block;
  width: 100%;
  height: 100%;
  padding: var(--matte-padding);
  overflow: hidden;
  border-radius: 2px;
  background: #f8f8f5;
  border: 1px solid rgba(206, 206, 202, 0.9);
  box-shadow:
    0 9px 14px rgba(64, 64, 58, 0.18),
    0 2px 3px rgba(64, 64, 58, 0.12);
  backdrop-filter: none;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.photo-leaf__paper::before,
.photo-leaf__paper::after,
.photo-leaf__glint {
  display: none;
}

.photo-leaf__inner {
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  border-radius: 1px;
  background: #e9e9e6;
  border: none;
  box-shadow: none;
}

.photo-leaf__inner::after {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 44%);
}

.photo-leaf__inner img {
  display: block;
  filter: grayscale(0.06) brightness(1.03) saturate(0.9) contrast(0.96);
  transition: transform 0.25s ease, filter 0.25s ease;
}

.photo-leaf:hover .photo-leaf__paper {
  transform: translateY(-2px);
  box-shadow:
    0 12px 19px rgba(64, 64, 58, 0.22),
    0 2px 4px rgba(64, 64, 58, 0.13),
    inset 0 0 0 1px rgba(255, 255, 255, 0.86);
}

.photo-leaf:hover .photo-leaf__inner img {
  transform: none;
  filter: grayscale(0) brightness(1.05) saturate(0.96) contrast(0.98);
}

.back-btn,
.sample-toggle {
  z-index: 120;
  border: 0;
  background: transparent;
  color: rgba(80, 86, 78, 0.55);
  box-shadow: none;
  backdrop-filter: none;
}

.back-btn:hover,
.sample-toggle:hover {
  background: transparent;
  color: rgba(62, 68, 60, 0.88);
  box-shadow: none;
}

.sample-toggle.is-refreshing {
  color: rgba(80, 86, 78, 0.55);
}

@keyframes photoPasteIn {
  0% {
    opacity: 0;
    transform:
      translate(calc(var(--x) + var(--paste-x)), calc(var(--y) + var(--paste-y)))
      rotate(calc(var(--rotate) + var(--paste-rotate)))
      scale(0.86);
    filter: blur(4px);
  }
  72% {
    opacity: 1;
    transform:
      translate(calc(var(--x) + 2px), calc(var(--y) - 2px))
      rotate(calc(var(--rotate) + 0.4deg))
      scale(1.012);
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1);
    filter: blur(0);
  }
}

@keyframes photoDriftPasteIn {
  0% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(0.82);
    filter: blur(12px) brightness(1.14) saturate(0.78);
  }
  45% {
    opacity: 1;
    transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1.015);
    filter: blur(1px) brightness(1.04) saturate(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(1);
    filter: blur(0) brightness(1) saturate(1);
  }
}

@media (max-width: 768px) {
  .gallery-root {
    background-size: 30px 30px;
  }

  .gallery-loader {
    width: min(148px, 42vw);
  }

  .back-btn {
    top: 18px;
    left: 18px;
    padding: 9px 15px 9px 12px;
  }

  .sample-toggle {
    right: 16px;
    bottom: 16px;
  }
}

/* Lightbox motion polish: expand as a paper card instead of a glowing rounded poster. */
.lightbox {
  background: transparent;
}

.lightbox__stage {
  isolation: isolate;
  transform: translateY(10px);
  transition:
    transform 0.72s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.42s ease;
}

.lightbox.is-settled .lightbox__stage {
  transform: translateY(0);
}

.lightbox__halo {
  position: absolute;
  inset: auto 10% 5% 10%;
  height: clamp(140px, 24vw, 260px);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 240, 186, 0.5) 0%, rgba(255, 240, 186, 0.18) 34%, transparent 72%);
  filter: blur(30px);
  opacity: 0;
  transform: translateY(28px) scale(0.72);
  transition:
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.06s,
    opacity 0.8s ease 0.06s;
  z-index: 0;
  pointer-events: none;
}

.lightbox.is-settled .lightbox__halo {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.lightbox__card {
  border-radius: 10px;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  transform:
    perspective(1800px)
    translateY(30px)
    scale(0.94)
    rotateX(11deg)
    rotateZ(-1.35deg);
  transform-origin: 50% 78%;
  filter: blur(8px) saturate(0.92);
  transition:
    transform 0.88s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.42s ease,
    filter 0.64s ease;
}

.lightbox.is-settled .lightbox__card {
  transform:
    perspective(1800px)
    translateY(0)
    scale(1)
    rotateX(0deg)
    rotateZ(0deg);
  filter: blur(0) saturate(1);
}

.lightbox__card::before,
.lightbox__card::after {
  display: none;
}

.lightbox__card img {
  border-radius: 4px;
  background: rgba(228, 223, 207, 0.9);
  box-shadow: 0 10px 22px rgba(95, 87, 67, 0.12);
  transform: scale(1.045);
  transform-origin: 50% 50%;
  opacity: 0.72;
  filter: saturate(0.94) contrast(0.98);
  transition:
    transform 0.96s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s ease,
    filter 0.7s ease;
}

.lightbox.is-settled .lightbox__card img {
  transform: scale(1);
  opacity: 1;
  filter: saturate(1) contrast(1);
}

.lightbox__shadow {
  display: none;
}

.lightbox__info {
  position: relative;
  padding: clamp(24px, 2.4vw, 34px) 0;
  transform: translateX(28px) translateY(12px);
  filter: blur(10px);
  opacity: 0;
  transition:
    transform 0.72s cubic-bezier(0.16, 1, 0.3, 1) 0.12s,
    opacity 0.42s ease 0.12s,
    filter 0.58s ease 0.12s;
}

.lightbox__info::before {
  content: "";
  position: absolute;
  left: -20px;
  top: 10%;
  width: 1px;
  height: 72%;
  background: linear-gradient(180deg, transparent, rgba(170, 155, 112, 0.68), transparent);
  transform: scaleY(0.72);
  transform-origin: 50% 0;
  opacity: 0.32;
  transition:
    transform 0.76s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
    opacity 0.46s ease 0.18s;
}

.lightbox.is-settled .lightbox__info::before {
  transform: scaleY(1);
  opacity: 0.7;
}

.lightbox__info > * {
  transform: translateY(16px);
  opacity: 0;
  transition:
    transform 0.62s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.38s ease;
}

.lightbox__info > *:nth-child(1) { transition-delay: 0.16s; }
.lightbox__info > *:nth-child(2) { transition-delay: 0.22s; }
.lightbox__info > *:nth-child(3) { transition-delay: 0.28s; }
.lightbox__info > *:nth-child(4) { transition-delay: 0.34s; }
.lightbox__info > *:nth-child(5) { transition-delay: 0.4s; }
.lightbox__info > *:nth-child(6) { transition-delay: 0.46s; }

.lightbox.is-settled .lightbox__info > * {
  transform: translateY(0);
  opacity: 1;
}

.lightbox-flight {
  box-sizing: border-box;
  padding: var(--flight-padding);
  border-radius: var(--flight-radius-start);
  background:
    linear-gradient(180deg, rgba(255, 253, 246, 0.98), rgba(241, 235, 219, 0.92));
  border: 1px solid rgba(212, 202, 172, 0.9);
  box-shadow:
    0 30px 60px rgba(108, 100, 76, 0.3),
    0 12px 24px rgba(108, 100, 76, 0.16),
    0 0 50px rgba(255, 235, 160, 0.4),
    0 0 100px rgba(255, 222, 125, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
  opacity: 0.98;
  transition: none;
  will-change: transform, filter, border-radius;
}

.lightbox-flight img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: contain;
  background: #ebe5d3;
  box-shadow: 0 8px 18px rgba(95, 87, 67, 0.1);
  transform: scale(1.018);
}

.lightbox-flight__veil,
.lightbox-flight__frame,
.lightbox-flight__dust {
  display: block;
}

.lightbox-flight__veil {
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.5), transparent 22%),
    radial-gradient(circle at 50% 12%, rgba(255, 244, 198, 0.48), transparent 34%);
  opacity: 0.78;
  mix-blend-mode: screen;
}

.lightbox-flight__frame {
  inset: var(--flight-frame-inset);
  border: 1px solid rgba(205, 193, 160, 0.72);
  border-radius: calc(var(--flight-radius-start) * 0.78);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.lightbox-flight__dust {
  inset: -18%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 233, 164, 0.3) 0%, rgba(255, 233, 164, 0.08) 28%, transparent 60%),
    radial-gradient(circle at 50% 60%, rgba(165, 184, 129, 0.16) 0%, transparent 56%);
  filter: blur(18px);
  opacity: 0.6;
  transform: scale(0.86);
}

.lightbox-flight::before {
  content: "";
  position: absolute;
  inset: -50%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 240, 175, 0.5) 0%, rgba(255, 240, 175, 0.14) 32%, transparent 60%);
  filter: blur(28px);
  opacity: 0.7;
  pointer-events: none;
  z-index: -1;
  animation: flightAura 0.84s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes flightAura {
  0% { transform: scale(0.5); opacity: 0.85; }
  100% { transform: scale(1.5); opacity: 0.18; }
}

/* ═══════════════════════════════════════════
   CINEMATIC LIGHTBOX OPEN TRANSITION
   ═══════════════════════════════════════════ */

/* Radial backdrop reveal from click origin */
.lightbox__backdrop {
  opacity: 1;
  clip-path: circle(0% at var(--origin-x, 50%) var(--origin-y, 50%));
  transition: clip-path 0.92s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox.is-visible .lightbox__backdrop {
  clip-path: circle(150% at var(--origin-x, 50%) var(--origin-y, 50%));
}

/* Flash burst at card destination */
.lightbox__stage::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 46%;
  width: 140%;
  height: 140%;
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 242, 180, 0.7) 0%, rgba(255, 236, 160, 0.3) 30%, transparent 65%);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

.lightbox.is-settled .lightbox__stage::before {
  animation: flashBurst 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes flashBurst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.9;
  }
  35% {
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

/* Stage wrapper: float-in */
.lightbox__stage {
  transform: translateY(28px) scale(0.94);
  opacity: 0;
  filter: blur(10px);
  transition:
    transform 0.96s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s ease,
    filter 0.76s ease;
}

.lightbox.is-settled .lightbox__stage {
  transform: translateY(0) scale(1);
  opacity: 1;
  filter: blur(0);
}

/* Card: 6-axis 3D morph entrance */
.lightbox__card {
  opacity: 0;
  transform:
    perspective(1800px)
    translateY(65px)
    translateZ(-260px)
    rotateX(22deg)
    rotateY(-18deg)
    rotateZ(-3.5deg)
    scale(0.72);
  filter: blur(20px) saturate(0.74) brightness(0.82);
  transition:
    transform 1.12s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s ease,
    filter 0.88s ease,
    box-shadow 0.76s cubic-bezier(0.2, 1, 0.3, 1),
    border-color 0.5s ease;
}

.lightbox.is-settled .lightbox__card {
  opacity: 1;
  transform:
    perspective(1800px)
    translateY(0)
    translateZ(0)
    rotateX(0deg)
    rotateY(0deg)
    rotateZ(0deg)
    scale(1);
  filter: blur(0) saturate(1) brightness(1);
  box-shadow: none;
}

.lightbox.is-settled .lightbox__card:not(:disabled):hover {
  transform:
    perspective(1800px)
    translateY(-8px)
    translateZ(10px)
    rotateX(1.5deg)
    rotateY(-0.8deg)
    scale(1.018);
  box-shadow: none;
}

.lightbox.is-measuring .lightbox__card {
  opacity: 0;
  transform: none;
  filter: none;
  transition: none;
}

/* Card image: delayed reveal */
.lightbox__card img {
  transform: scale(1.1);
  opacity: 0;
  filter: saturate(0.76) brightness(0.84) contrast(0.92);
  transition:
    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
    opacity 0.6s ease 0.16s,
    filter 0.9s ease 0.12s;
}

.lightbox.is-settled .lightbox__card img {
  transform: scale(1);
  opacity: 1;
  filter: saturate(1) brightness(1) contrast(1);
}

/* Halo: golden glow burst */
.lightbox__halo {
  display: none;
}

.lightbox.is-settled .lightbox__halo {
  display: none;
}

.lightbox__shadow {
  display: none;
}

.lightbox.is-settled .lightbox__shadow {
  display: none;
}

/* Info panel: staggered cascade */
.lightbox__info {
  transform: translateX(44px) translateY(20px);
  opacity: 0;
  filter: blur(18px);
  transition:
    transform 0.88s cubic-bezier(0.16, 1, 0.3, 1) 0.12s,
    opacity 0.54s ease 0.12s,
    filter 0.76s ease 0.12s;
}

.lightbox.is-settled .lightbox__info {
  transform: translateX(0) translateY(0);
  opacity: 1;
  filter: blur(0);
}

/* Shimmer sweep on card after reveal */
.lightbox__card-shimmer {
  display: none;
}

.lightbox.is-settled .lightbox__card-shimmer {
  display: none;
}

@keyframes cardShimmerSweep {
  0% {
    transform: translateX(-180%);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(180%);
    opacity: 0;
  }
}
</style>
