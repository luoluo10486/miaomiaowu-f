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

const allGalleryImages = [
  ...localGalleryImages,
  ...officialGalleryImages
];

const DISPLAY_IMAGE_COUNT = 64;
const GALLERY_SAMPLE_STORAGE_KEY = "gallery_bodhi_sample_v1";
const GALLERY_REFRESH_MODE_STORAGE_KEY = "gallery_bodhi_refresh_mode";

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
const refreshOnReload = ref(readStorage(GALLERY_REFRESH_MODE_STORAGE_KEY) === "refresh");
let lastMouseX = 0;
let lastMouseY = 0;
let animId = null;
let cleanupCanvas = null;

const activeFilename = computed(() => {
  if (lightboxIndex.value < 0) return "";
  return galleryImages.value[lightboxIndex.value];
});

const activeGalleryDetail = computed(() => {
  return allGalleryDetails[activeFilename.value] || defaultGalleryDetail;
});

const localizedGalleryDetail = computed(() => {
  return localizeGalleryDetail(activeFilename.value, activeGalleryDetail.value);
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
  if (!title || looksGarbled(title)) return "高木同学美图";
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

  return "【官方推文】《擅长捉弄的高木同学》官方发布的相关动态，包含作品画面、播出信息或活动资讯。#高木同学";
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
    return "这张图暂时没有完整说明，先把它安静地挂在树上，留给画面自己说话。";
  }

  return translateOfficialTweet(description)
    .replace(/【本日発売！】/g, "【今日发售】")
    .replace(/\(金\)/g, "（周五）")
    .replace(/\(水\)/g, "（周三）")
    .replace(/商品详情🔽/g, "商品详情：")
    .replace(/🔽详情：/g, "详情：")
    .replace(/Matched to the original X post by Soichiro Yamamoto\./g, "已匹配到山本崇一朗发布的原始 X 动态。");
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
  return firstSentence(translatedDescription) || "官方推文";
}

function buildAuthorTitle(detail) {
  const date = getTaggedDate(detail?.tags);
  return date ? `山本崇一朗插画 · ${date}` : "山本崇一朗插画";
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
  const isOfficial = filename.includes("official/")
    || sourceUrl.includes("takagi3_anime")
    || detail?.title === "Official Anime Artwork"
    || detail?.description?.includes("anime official account");
  const isAuthor = sourceUrl.includes("udon0531")
    || detail?.title === "Author X Illustration"
    || detail?.description?.includes("Soichiro Yamamoto");
  const isMatchedOfficial = detail?.description?.includes("anime official account");
  const description = isMatchedOfficial ? buildOfficialMatchedDescription() : isAuthor ? buildAuthorDescription(detail) : localizeDescription(detail?.description);
  const publishedAt = isAuthor || isMatchedOfficial ? getTaggedDate(detail?.tags) : formatTitle(detail?.title);
  const workTitle = detail?.originalTitle === "Karakai Jozu no Takagi-san"
    ? "擅长捉弄的高木同学"
    : detail?.originalTitle || "美图鉴赏";
  const sourceLabel = sourceUrl
    ? isOfficial
      ? "查看官方来源"
      : isAuthor
        ? "查看作者来源"
        : "查看来源"
    : "暂无来源";

  return {
    ...detail,
    collection: isOfficial ? "官方 X 图集" : isAuthor ? "作者 X 插画" : "私人收藏图集",
    title: isMatchedOfficial ? `动画官方图 · ${publishedAt || "来源已匹配"}` : isOfficial ? buildOfficialTitle(detail?.description, description) : isAuthor ? buildAuthorTitle(detail) : formatTitle(detail?.title),
    originalTitle: isOfficial || isAuthor
      ? `《${workTitle}》${publishedAt ? ` · 发布于 ${publishedAt}` : ""}`
      : workTitle,
    description,
    sourceLabel,
    note: sourceUrl
      ? "点击图片或来源按钮，可以打开这张图对应的原始页面。"
      : "这张图暂时没有匹配到来源链接。",
    tags: Array.isArray(detail?.tags) ? detail.tags.map(localizeTag) : []
  };
}

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
  const total = galleryImages.value.length;
  const result = [];
  let idx = 0;
  const layerCount = Math.min(TREE_LAYER_DEFS.length, Math.max(6, Math.ceil(total / 8)));
  const start = Math.max(0, Math.floor((TREE_LAYER_DEFS.length - layerCount) / 2));
  const layerDefs = TREE_LAYER_DEFS.slice(start, start + layerCount);
  const totalWeight = layerDefs.reduce((sum, layer) => sum + layer.weight, 0);

  for (let i = 0; i < layerDefs.length; i++) {
    const layer = layerDefs[i];
    const remainingLayers = layerDefs.length - i - 1;
    const remainingImages = total - idx;
    const expected = Math.round(total * (layer.weight / totalWeight));
    const count = i === layerDefs.length - 1
      ? remainingImages
      : Math.min(Math.max(4, expected), Math.max(0, remainingImages - remainingLayers * 4));
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
        filename: galleryImages.value[imageIndex],
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
        filename: galleryImages.value[imageIndex],
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

    <button
      class="sample-toggle"
      type="button"
      :class="{ 'is-refreshing': refreshOnReload }"
      :aria-pressed="refreshOnReload"
      @click="toggleRefreshMode"
    >
      <span class="sample-toggle__dot"></span>
      <span>{{ refreshOnReload ? "刷新抽样" : "固定图集" }}</span>
    </button>

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
        <div class="canopy-mist canopy-mist--left"></div>
        <div class="canopy-mist canopy-mist--right"></div>
        <div class="canopy-mist canopy-mist--crown"></div>
        <div class="leaf-veil leaf-veil--front"></div>
        <div class="leaf-veil leaf-veil--back"></div>

        <div class="trunk">
          <div class="trunk__column trunk__column--front"></div>
          <div class="trunk__column trunk__column--side"></div>
          <div class="trunk__crown-line trunk__crown-line--one"></div>
          <div class="trunk__crown-line trunk__crown-line--two"></div>
          <div class="trunk__crown-line trunk__crown-line--three"></div>
          <div class="branch branch--left branch--left-a"></div>
          <div class="branch branch--left branch--left-b"></div>
          <div class="branch branch--left branch--left-c"></div>
          <div class="branch branch--right branch--right-a"></div>
          <div class="branch branch--right branch--right-b"></div>
          <div class="branch branch--right branch--right-c"></div>
          <div class="root root--left-a"></div>
          <div class="root root--left-b"></div>
          <div class="root root--right-a"></div>
          <div class="root root--right-b"></div>
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
              :disabled="!localizedGalleryDetail.sourceUrl"
              :title="getSourceTitle()"
              @click="openSourceLink"
            >
              <img
                :src="getGalleryImageUrl(activeFilename)"
                :alt="localizedGalleryDetail.title"
              />
            </button>
          </div>

          <aside class="lightbox__info">
            <p class="lightbox__eyebrow">{{ localizedGalleryDetail.collection }}</p>
            <h2>{{ localizedGalleryDetail.title }}</h2>
            <p class="lightbox__original">{{ localizedGalleryDetail.originalTitle }}</p>
            <p class="lightbox__desc">{{ localizedGalleryDetail.description }}</p>

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

.sample-toggle {
  position: fixed;
  right: 28px;
  bottom: 26px;
  z-index: 120;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 112px;
  padding: 11px 15px;
  border: 1px solid rgba(142, 167, 112, 0.26);
  border-radius: 999px;
  background: rgba(255, 252, 240, 0.66);
  color: rgba(77, 99, 72, 0.78);
  box-shadow: 0 14px 40px rgba(113, 133, 105, 0.14);
  backdrop-filter: blur(14px);
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  letter-spacing: 0.02em;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.sample-toggle:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 248, 0.9);
  border-color: rgba(199, 168, 83, 0.45);
  box-shadow: 0 18px 46px rgba(116, 137, 92, 0.18), 0 0 34px rgba(255, 226, 139, 0.18);
}

.sample-toggle__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(119, 151, 103, 0.82);
  box-shadow: 0 0 0 4px rgba(119, 151, 103, 0.12);
}

.sample-toggle.is-refreshing .sample-toggle__dot {
  background: rgba(205, 158, 76, 0.92);
  box-shadow: 0 0 0 4px rgba(205, 158, 76, 0.14), 0 0 18px rgba(255, 216, 128, 0.4);
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

.canopy-mist {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  border-radius: 50%;
  transform-style: preserve-3d;
  mix-blend-mode: multiply;
}

.canopy-mist--left {
  width: 720px;
  height: 380px;
  margin-left: -680px;
  margin-top: -430px;
  transform: rotateZ(-8deg) rotateX(62deg) translateZ(-60px);
  background:
    radial-gradient(ellipse at 54% 48%, rgba(169, 202, 142, 0.2), transparent 58%),
    radial-gradient(ellipse at 26% 42%, rgba(216, 206, 126, 0.18), transparent 52%);
  filter: blur(18px);
}

.canopy-mist--right {
  width: 760px;
  height: 390px;
  margin-left: -70px;
  margin-top: -440px;
  transform: rotateZ(9deg) rotateX(62deg) translateZ(-70px);
  background:
    radial-gradient(ellipse at 42% 50%, rgba(155, 196, 142, 0.2), transparent 60%),
    radial-gradient(ellipse at 68% 38%, rgba(238, 217, 139, 0.16), transparent 54%);
  filter: blur(18px);
}

.canopy-mist--crown {
  width: 620px;
  height: 360px;
  margin-left: -310px;
  margin-top: -650px;
  transform: rotateX(56deg) translateZ(36px);
  background:
    radial-gradient(ellipse at 50% 45%, rgba(255, 246, 183, 0.26), transparent 48%),
    radial-gradient(ellipse at 52% 72%, rgba(146, 190, 134, 0.2), transparent 66%);
  filter: blur(16px);
}

.leaf-veil {
  position: absolute;
  left: 0;
  top: 0;
  width: 1220px;
  height: 640px;
  margin-left: -610px;
  margin-top: -570px;
  pointer-events: none;
  border-radius: 48% 52% 46% 54%;
  opacity: 0.54;
  transform-style: preserve-3d;
  background:
    radial-gradient(ellipse 8% 5% at 15% 58%, rgba(112, 157, 95, 0.3), transparent 72%),
    radial-gradient(ellipse 9% 6% at 28% 34%, rgba(181, 199, 112, 0.25), transparent 72%),
    radial-gradient(ellipse 7% 5% at 40% 22%, rgba(119, 166, 102, 0.22), transparent 72%),
    radial-gradient(ellipse 10% 6% at 56% 30%, rgba(199, 191, 106, 0.24), transparent 72%),
    radial-gradient(ellipse 8% 5% at 72% 40%, rgba(112, 157, 95, 0.28), transparent 72%),
    radial-gradient(ellipse 7% 5% at 84% 62%, rgba(190, 207, 123, 0.24), transparent 72%),
    radial-gradient(ellipse 9% 6% at 48% 62%, rgba(130, 172, 103, 0.2), transparent 72%);
  filter: blur(0.4px);
  mask-image: radial-gradient(ellipse at 50% 48%, #000 0 42%, transparent 74%);
}

.leaf-veil--front {
  transform: translateZ(120px) rotateX(62deg);
}

.leaf-veil--back {
  transform: translateZ(-160px) rotateX(64deg) rotateZ(180deg);
  opacity: 0.34;
}

.trunk {
  top: 20px;
}

.trunk__column {
  position: absolute;
  width: 118px;
  height: 760px;
  left: -59px;
  top: -374px;
  border-radius: 58% 42% 34% 38% / 18% 24% 12% 12%;
  background:
    radial-gradient(ellipse at 58% 16%, rgba(255, 247, 191, 0.7), transparent 22%),
    linear-gradient(90deg, rgba(80, 98, 64, 0.02), rgba(255, 248, 210, 0.76) 28%, rgba(171, 153, 91, 0.44) 54%, rgba(82, 116, 75, 0.22) 82%, rgba(70, 94, 62, 0.05)),
    repeating-linear-gradient(96deg, rgba(110, 124, 74, 0.14) 0 2px, transparent 2px 14px),
    linear-gradient(180deg, rgba(255, 237, 161, 0.12), rgba(184, 161, 93, 0.34) 54%, rgba(94, 119, 78, 0.32));
  box-shadow:
    inset 16px 0 28px rgba(255, 255, 224, 0.48),
    inset -24px 0 32px rgba(91, 115, 72, 0.18),
    0 0 70px rgba(255, 236, 151, 0.28),
    0 40px 90px rgba(94, 113, 74, 0.2);
}

.trunk__column--side {
  transform: rotateY(82deg) scaleX(0.78);
  opacity: 0.74;
}

.trunk__glow {
  width: 360px;
  height: 880px;
  left: -180px;
  top: -470px;
  background:
    radial-gradient(ellipse at 50% 17%, rgba(255, 247, 183, 0.74), transparent 35%),
    radial-gradient(ellipse at 50% 54%, rgba(186, 222, 172, 0.28), transparent 52%),
    linear-gradient(180deg, rgba(255, 245, 177, 0.36), rgba(189, 222, 181, 0.2) 54%, rgba(151, 135, 77, 0));
  filter: blur(28px);
}

.trunk__crown-line {
  position: absolute;
  left: -5px;
  top: -390px;
  width: 10px;
  height: 520px;
  border-radius: 999px;
  transform-origin: 50% 100%;
  background: linear-gradient(180deg, rgba(255, 240, 157, 0), rgba(206, 219, 154, 0.52), rgba(118, 143, 89, 0.12));
  filter: blur(0.3px);
  box-shadow: 0 0 18px rgba(255, 237, 155, 0.18);
}

.trunk__crown-line--one { transform: rotateZ(-42deg) translateY(-12px) scaleY(1.05); }
.trunk__crown-line--two { transform: rotateZ(40deg) translateY(-10px) scaleY(1.03); }
.trunk__crown-line--three { transform: rotateZ(2deg) translateY(-78px) scaleY(1.18); }

.branch,
.root {
  position: absolute;
  pointer-events: none;
  transform-origin: 0 50%;
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(255, 246, 196, 0.66), rgba(162, 155, 88, 0.42) 42%, rgba(95, 126, 78, 0.08) 100%);
  box-shadow:
    inset 0 4px 8px rgba(255, 252, 215, 0.38),
    0 0 20px rgba(255, 235, 154, 0.14);
}

.branch::after,
.root::after {
  content: "";
  position: absolute;
  right: -2px;
  top: 42%;
  width: 34%;
  height: 30%;
  border-radius: 999px;
  background: rgba(109, 145, 88, 0.18);
  filter: blur(3px);
}

.branch--left {
  left: -18px;
}

.branch--right {
  left: 18px;
}

.branch--left-a {
  top: -318px;
  width: 420px;
  height: 32px;
  transform: rotateZ(206deg) rotateY(-20deg) translateZ(32px);
}

.branch--left-b {
  top: -238px;
  width: 520px;
  height: 24px;
  transform: rotateZ(190deg) rotateY(-32deg) translateZ(-24px);
}

.branch--left-c {
  top: -140px;
  width: 360px;
  height: 20px;
  transform: rotateZ(218deg) rotateY(-10deg) translateZ(66px);
}

.branch--right-a {
  top: -330px;
  width: 430px;
  height: 32px;
  transform: rotateZ(-26deg) rotateY(22deg) translateZ(24px);
}

.branch--right-b {
  top: -244px;
  width: 540px;
  height: 24px;
  transform: rotateZ(-12deg) rotateY(34deg) translateZ(-38px);
}

.branch--right-c {
  top: -132px;
  width: 380px;
  height: 20px;
  transform: rotateZ(-42deg) rotateY(12deg) translateZ(70px);
}

.root {
  top: 332px;
  height: 28px;
  background:
    linear-gradient(90deg, rgba(132, 148, 91, 0.42), rgba(255, 244, 191, 0.48) 48%, rgba(95, 126, 78, 0.04) 100%);
}

.root--left-a {
  left: -28px;
  width: 260px;
  transform: rotateZ(162deg) rotateX(16deg) translateZ(20px);
}

.root--left-b {
  left: -20px;
  width: 190px;
  height: 18px;
  transform: rotateZ(202deg) rotateX(24deg) translateZ(-26px);
}

.root--right-a {
  left: 24px;
  width: 270px;
  transform: rotateZ(18deg) rotateX(16deg) translateZ(18px);
}

.root--right-b {
  left: 20px;
  width: 200px;
  height: 18px;
  transform: rotateZ(-28deg) rotateX(24deg) translateZ(-26px);
}

.hanging-layer {
  position: absolute;
  transform-style: preserve-3d;
}

.photo-leaf {
  width: 96px;
  height: 136px;
  left: -48px;
  top: -68px;
  z-index: 3;
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
  border-radius: 16px 16px 24px 24px;
  background: rgba(255, 252, 236, 0.7);
  border: 1px solid rgba(255, 250, 214, 0.86);
  box-shadow:
    inset 0 0 0 1px rgba(133, 167, 112, 0.12),
    0 10px 20px rgba(91, 115, 87, 0.13),
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
