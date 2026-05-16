<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoginClothScene from "../components/LoginClothScene.vue";
import { saveAuthSession } from "../utils/auth";
import { resolvePublicAssetUrl } from "../utils/assets";

const route = useRoute();
const router = useRouter();
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const AUTH_API_PREFIX = "/luoluo";
const DEFAULT_AUTH_REDIRECT = "/workspace";

const showPassword = ref(false);
const authMode = ref(route.query.mode === "register" ? "register" : "login");
const isRegister = computed(() => authMode.value === "register");

const email = ref("");
const nickname = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const verifyCode = ref("");
const captchaCode = ref("");
const captchaKey = ref("");
const captchaImageSrc = ref("");

const loadingCaptcha = ref(false);
const sendingCode = ref(false);
const submitting = ref(false);
const countdown = ref(0);
const formTip = ref("");
const formTipType = ref("info");
const loginMusicRef = ref(null);
const volumeChargeSfxRef = ref(null);
const loginMusicSrc = ref("");
const volumeChargeSfxSrc = ref("");
const LOGIN_MUSIC_URL = resolvePublicAssetUrl("login-bgm.mp3");
const VOLUME_CHARGE_SFX_URL = resolvePublicAssetUrl("sfx/angry-birds-charge.mp3");
const needMusicGesture = ref(false);
const isMusicPlaying = ref(false);
const loginTrackName = "Drink, Pray, Love!";
const loginVolume = ref(0.45);
const volumeTrackRef = ref(null);
const isVolumeCharging = ref(false);
const volumeChargeRatio = ref(0);
const isVolumeProjectileFlying = ref(false);
const volumeProjectileX = ref(-18);
const volumeProjectileY = ref(0);
const volumeProjectileScale = ref(1);
const volumeProjectileOpacity = ref(0);

let countdownTimer = null;
let volumeChargeFrameId = 0;
let volumeShotFrameId = 0;
let volumeChargeStartedAt = 0;
let activeVolumePointerId = null;

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const phoneValid = computed(() => /^1\d{10}$/.test(phone.value));

const sendCodeText = computed(() => {
  if (sendingCode.value) {
    return "发送中...";
  }

  if (countdown.value > 0) {
    return `${countdown.value}s 后重发`;
  }

  return "发送验证码";
});

const submitText = computed(() => {
  if (submitting.value) {
    return isRegister.value ? "注册中..." : "登录中...";
  }

  return isRegister.value ? "注册" : "登录";
});

const canSendCode = computed(() => {
  return (
    isRegister.value &&
    emailValid.value &&
    captchaCode.value.trim().length > 0 &&
    !!captchaKey.value &&
    !loadingCaptcha.value &&
    !sendingCode.value &&
    countdown.value === 0 &&
    !submitting.value
  );
});
const authCardKey = computed(() => (isRegister.value ? "register-card" : "login-card"));

const musicTooltipText = computed(() => {
  if (needMusicGesture.value) {
    return `${loginTrackName} · 点击播放`;
  }

  return isMusicPlaying.value ? `${loginTrackName} · 正在播放` : `${loginTrackName} · 已暂停`;
});

const volumeFillStyle = computed(() => ({
  transform: `translateY(-50%) scaleX(${Math.max(loginVolume.value, 0.001)})`
}));

const volumeTriggerIconStyle = computed(() => {
  if (!isVolumeCharging.value) {
    return {
      transform: "translateY(0) rotate(0deg) scale(1)"
    };
  }

  const ratio = volumeChargeRatio.value;
  const rotate = -6 - ratio * 30;
  const lift = -1 - ratio * 5;
  const scale = 1 + ratio * 0.08;

  return {
    transform: `translateY(${lift}px) rotate(${rotate}deg) scale(${scale})`
  };
});

const volumeProjectileStyle = computed(() => {
  if (isVolumeCharging.value) {
    return {
      opacity: 0
    };
  }

  if (isVolumeProjectileFlying.value) {
    return {
      left: `${volumeProjectileX.value}px`,
      top: `calc(50% + ${volumeProjectileY.value}px)`,
      transform: `translate(-50%, -50%) scale(${volumeProjectileScale.value})`,
      opacity: volumeProjectileOpacity.value
    };
  }

  return {
    left: `calc(${loginVolume.value * 100}% - 6px)`,
    top: "50%",
    transform: "translateY(-50%) scale(1)",
    opacity: 1
  };
});

const loginPageStyle = computed(() => ({
  "--login-bg-image": `url("${resolvePublicAssetUrl("login-bg-anime.png")}")`
}));

function setTip(message, type = "info") {
  formTip.value = message;
  formTipType.value = type;
}

function clampVolume(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function ensureLoginMusicLoaded() {
  if (!loginMusicSrc.value) {
    loginMusicSrc.value = LOGIN_MUSIC_URL;
  }
}

function ensureVolumeChargeSfxLoaded() {
  if (!volumeChargeSfxSrc.value) {
    volumeChargeSfxSrc.value = VOLUME_CHARGE_SFX_URL;
  }
}

function syncLoginMusicVolume() {
  const audio = loginMusicRef.value;
  if (!audio) {
    return;
  }

  audio.volume = clampVolume(loginVolume.value);
}

function setLoginMusicVolume(nextVolume) {
  loginVolume.value = clampVolume(nextVolume);
  syncLoginMusicVolume();
}

function getVolumeTrackWidth() {
  return Math.max(volumeTrackRef.value?.clientWidth || 0, 132);
}

function stopVolumeChargeLoop() {
  if (volumeChargeFrameId) {
    cancelAnimationFrame(volumeChargeFrameId);
    volumeChargeFrameId = 0;
  }
}

function stopVolumeShotLoop() {
  if (volumeShotFrameId) {
    cancelAnimationFrame(volumeShotFrameId);
    volumeShotFrameId = 0;
  }
}

function startVolumeChargeSound() {
  ensureVolumeChargeSfxLoaded();
  const audio = volumeChargeSfxRef.value;
  if (!audio) {
    return;
  }

  stopVolumeChargeSound();
  audio.loop = true;
  audio.playbackRate = 1;
  audio.volume = 0.62;
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

function updateVolumeChargeSound(ratio) {
  const audio = volumeChargeSfxRef.value;
  if (!audio) {
    return;
  }

  const safeRatio = clampVolume(ratio);
  audio.playbackRate = 1 + safeRatio * 0.18;
  audio.volume = 0.58 + safeRatio * 0.18;
}

function stopVolumeChargeSound() {
  const audio = volumeChargeSfxRef.value;
  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.playbackRate = 1;
}

function resetVolumeProjectile() {
  isVolumeProjectileFlying.value = false;
  volumeProjectileX.value = -18;
  volumeProjectileY.value = 0;
  volumeProjectileScale.value = 1;
  volumeProjectileOpacity.value = 1;
}

function stepVolumeCharge(timestamp) {
  if (!isVolumeCharging.value) {
    return;
  }

  if (!volumeChargeStartedAt) {
    volumeChargeStartedAt = timestamp;
  }

  const elapsed = timestamp - volumeChargeStartedAt;
  const ratio = Math.min(elapsed / 1500, 1);

  volumeChargeRatio.value = ratio;
  updateVolumeChargeSound(ratio);
  volumeChargeFrameId = requestAnimationFrame(stepVolumeCharge);
}

function animateVolumeProjectile(targetVolume, chargeRatio) {
  stopVolumeShotLoop();

  const trackWidth = getVolumeTrackWidth();
  const startX = -31 + chargeRatio * 3;
  const startY = -1 - chargeRatio * 10;
  const startVolume = loginVolume.value;
  const endX = trackWidth * targetVolume;
  const arcHeight = 12 + chargeRatio * 28;
  const duration = 320 + chargeRatio * 280;
  const startTime = performance.now();

  isVolumeProjectileFlying.value = true;
  volumeProjectileX.value = startX;
  volumeProjectileY.value = startY;
  volumeProjectileScale.value = 0.96 + chargeRatio * 0.1;
  volumeProjectileOpacity.value = 1;

  const step = (timestamp) => {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    const nextX = startX + (endX - startX) * eased;
    const nextY = startY * (1 - progress) - Math.sin(Math.PI * progress) * arcHeight;

    volumeProjectileX.value = nextX;
    volumeProjectileY.value = nextY;
    volumeProjectileScale.value = 1.02 - progress * 0.14;
    volumeProjectileOpacity.value = progress > 0.9 ? 1 - (progress - 0.9) / 0.1 : 1;
    setLoginMusicVolume(startVolume + (targetVolume - startVolume) * eased);

    if (progress < 1) {
      volumeShotFrameId = requestAnimationFrame(step);
      return;
    }

    setLoginMusicVolume(targetVolume);
    resetVolumeProjectile();
  };

  volumeShotFrameId = requestAnimationFrame(step);
}

function releaseVolumePointer(event) {
  if (activeVolumePointerId === null) {
    return;
  }

  try {
    event?.currentTarget?.releasePointerCapture?.(activeVolumePointerId);
  } catch {
    return;
  } finally {
    activeVolumePointerId = null;
  }
}

function finishVolumeCharge(event, shouldLaunch = true) {
  if (!isVolumeCharging.value) {
    return;
  }

  const chargeRatio = volumeChargeRatio.value;

  isVolumeCharging.value = false;
  stopVolumeChargeLoop();
  stopVolumeChargeSound();
  releaseVolumePointer(event);
  volumeChargeStartedAt = 0;

  if (!shouldLaunch) {
    resetVolumeProjectile();
    return;
  }

  const targetVolume = clampVolume(0.04 + chargeRatio * 0.96);
  animateVolumeProjectile(targetVolume, chargeRatio);
}

function onVolumePressStart(event) {
  if (isVolumeCharging.value) {
    return;
  }

  event.preventDefault();
  stopVolumeShotLoop();
  isVolumeProjectileFlying.value = false;

  volumeChargeRatio.value = 0;
  volumeChargeStartedAt = 0;
  isVolumeCharging.value = true;

  try {
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    activeVolumePointerId = event.pointerId;
  } catch {
    activeVolumePointerId = null;
  }

  startVolumeChargeSound();
  stopVolumeChargeLoop();
  volumeChargeFrameId = requestAnimationFrame(stepVolumeCharge);
}

function onVolumePressEnd(event) {
  finishVolumeCharge(event, true);
}

function onVolumePressCancel(event) {
  finishVolumeCharge(event, false);
}

function switchAuthMode(mode) {
  if (authMode.value === mode) {
    return;
  }

  authMode.value = mode;
  showPassword.value = false;
  nickname.value = "";
  phone.value = "";
  password.value = "";
  confirmPassword.value = "";
  verifyCode.value = "";
  captchaCode.value = "";
  clearCountdown();
  countdown.value = 0;
  setTip("", "info");
}

function clearCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function startCountdown(seconds = 60) {
  countdown.value = seconds;
  clearCountdown();

  countdownTimer = setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0;
      clearCountdown();
      return;
    }

    countdown.value -= 1;
  }, 1000);
}

function normalizeVerifyCode() {
  verifyCode.value = verifyCode.value.replace(/\D/g, "").slice(0, 6);
}

function normalizeNickname() {
  nickname.value = nickname.value.replace(/\s+/g, " ").trimStart().slice(0, 20);
}

function normalizePhone() {
  phone.value = phone.value.replace(/\D/g, "").slice(0, 11);
}

function normalizeCaptchaCode() {
  captchaCode.value = captchaCode.value.replace(/\s+/g, "").slice(0, 8);
}

function resetCaptchaState() {
  captchaCode.value = "";
  captchaKey.value = "";
  captchaImageSrc.value = "";
}

function unwrapResponseData(payload) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function extractCaptchaPayload(payload) {
  const queue = [payload];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }

    visited.add(current);

    const captchaKey = typeof current.captchaKey === "string" ? current.captchaKey.trim() : "";
    const imageBase64 = typeof current.imageBase64 === "string" ? current.imageBase64.trim() : "";
    if (captchaKey && imageBase64) {
      return { captchaKey, imageBase64 };
    }

    if ("data" in current) {
      queue.push(current.data);
    }

    if ("result" in current) {
      queue.push(current.result);
    }
  }

  return { captchaKey: "", imageBase64: "" };
}

function buildCaptchaFormatError(payload) {
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";
  if (message.startsWith("<!DOCTYPE") || message.startsWith("<html") || message.startsWith("<!doctype")) {
    return "图形验证码接口返回了 HTML 页面，请检查接口地址或网关转发配置";
  }

  return "图形验证码返回格式不正确";
}

async function parseResponsePayload(response) {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();
  const normalizedText = rawText.trim();

  if (!normalizedText) {
    return {};
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(normalizedText);
  }

  // Some backends return JSON without the correct content-type header.
  if (normalizedText.startsWith("{") || normalizedText.startsWith("[")) {
    try {
      return JSON.parse(normalizedText);
    } catch {
      return { message: rawText };
    }
  }

  return { message: rawText };
}

async function refreshCaptcha() {
  if (!isRegister.value || loadingCaptcha.value) {
    return;
  }

  loadingCaptcha.value = true;

  try {
    const payload = await requestAuth("/system/public/captcha/image", {
      method: "GET",
      cache: "no-store"
    });
    const data = unwrapResponseData(payload);
    const { captchaKey: nextCaptchaKey, imageBase64 } = extractCaptchaPayload(data);

    if (!nextCaptchaKey || !imageBase64) {
      console.error("captcha payload mismatch", payload);
      throw new Error(buildCaptchaFormatError(payload));
    }

    captchaKey.value = nextCaptchaKey;
    captchaCode.value = "";
    captchaImageSrc.value = `data:image/svg+xml;base64,${imageBase64}`;
  } catch (error) {
    resetCaptchaState();
    setTip(error?.message || "图形验证码加载失败，请稍后重试", "error");
  } finally {
    loadingCaptcha.value = false;
  }
}

function validatePassword(rawPassword) {
  const value = rawPassword.trim();

  if (!value) {
    return "请输入密码";
  }

  if (value.length < 6) {
    return "密码长度至少 6 位";
  }

  return "";
}

async function requestAuth(path, options = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedOptions =
    options &&
    typeof options === "object" &&
    !Array.isArray(options) &&
    !("method" in options) &&
    !("body" in options) &&
    !("headers" in options) &&
    !("cache" in options)
      ? { body: options }
      : options;
  const {
    method = "POST",
    body,
    headers = {},
    cache = "default"
  } = normalizedOptions;

  const requestHeaders = { ...headers };
  const requestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
    cache
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    requestInit.body = requestHeaders["Content-Type"] === "application/json" ? JSON.stringify(body) : body;
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_API_PREFIX}${normalizedPath}`, requestInit);

  const payload = await parseResponsePayload(response);
  const hasBusinessCode = payload && typeof payload === "object" && "code" in payload;

  if (!response.ok || (hasBusinessCode && payload.code !== 0 && payload.code !== "0")) {
    throw new Error(payload?.message || payload?.error || "请求失败，请稍后重试");
  }

  return payload;
}

function saveAuthToken(payload) {
  return saveAuthSession(payload);
}

function resolvePostLoginRedirect() {
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect.trim() : "";
  if (!redirect.startsWith("/") || redirect.startsWith("/login")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return redirect;
}

function stopLoginMusic() {
  const audio = loginMusicRef.value;
  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  isMusicPlaying.value = false;
  needMusicGesture.value = false;
}

async function tryPlayLoginMusic() {
  ensureLoginMusicLoaded();
  await nextTick();
  const audio = loginMusicRef.value;
  if (!audio) {
    return;
  }

  syncLoginMusicVolume();

  try {
    await audio.play();
    isMusicPlaying.value = true;
    needMusicGesture.value = false;
  } catch {
    isMusicPlaying.value = false;
    needMusicGesture.value = true;
  }
}

function onMusicToggleClick() {
  const audio = loginMusicRef.value;
  if (!audio) {
    return;
  }

  if (audio.paused) {
    void tryPlayLoginMusic();
    return;
  }

  audio.pause();
  isMusicPlaying.value = false;
}

function onMusicPlay() {
  syncLoginMusicVolume();
  isMusicPlaying.value = true;
  needMusicGesture.value = false;
}

function onMusicPause() {
  isMusicPlaying.value = false;
}

async function onSendCode() {
  if (!emailValid.value) {
    setTip("请先输入正确的邮箱地址", "error");
    return;
  }

  if (!canSendCode.value) {
    return;
  }

  normalizeCaptchaCode();

  if (!captchaKey.value || !captchaImageSrc.value) {
    setTip("图形验证码尚未准备好，请刷新后重试", "error");
    return;
  }

  if (!captchaCode.value.trim()) {
    setTip("请输入图形验证码", "error");
    return;
  }

  sendingCode.value = true;
  setTip("", "info");

  try {
    const payload = await requestAuth("/system/public/member/auth/code/send", {
      body: {
        grantType: "email",
        bizType: "REGISTER",
        email: email.value.trim(),
        captchaKey: captchaKey.value,
        captchaCode: captchaCode.value.trim()
      }
    });
    setTip(payload?.message || "验证码已发送，请查收邮箱", "success");
    startCountdown(60);
  } catch (error) {
    setTip(error?.message || "验证码发送失败，请稍后重试", "error");
  } finally {
    sendingCode.value = false;
  }
}

async function onSubmit() {
  if (submitting.value) {
    return;
  }

  setTip("", "info");

  if (!emailValid.value) {
    setTip("请输入正确的邮箱地址", "error");
    return;
  }

  const passwordError = validatePassword(password.value);
  if (passwordError) {
    setTip(passwordError, "error");
    return;
  }

  submitting.value = true;

  try {
    if (isRegister.value) {
      normalizeNickname();
      normalizePhone();
      normalizeVerifyCode();

      if (!nickname.value.trim()) {
        setTip("请输入昵称", "error");
        return;
      }

      if (phone.value && !phoneValid.value) {
        setTip("请输入正确的 11 位手机号，或留空", "error");
        return;
      }

      if (verifyCode.value.length !== 6) {
        setTip("请输入 6 位邮箱验证码", "error");
        return;
      }

      if (!confirmPassword.value.trim()) {
        setTip("请再次输入密码", "error");
        return;
      }

      if (password.value.trim() !== confirmPassword.value.trim()) {
        setTip("两次输入的密码不一致", "error");
        return;
      }

      const payload = await requestAuth("/system/public/member/auth/register", {
        body: {
          grantType: "email",
          deviceType: "web",
          displayName: nickname.value.trim(),
          ...(phone.value ? { phone: phone.value } : {}),
          email: email.value.trim(),
          password: password.value.trim(),
          confirmPassword: confirmPassword.value.trim(),
          emailCode: verifyCode.value
        }
      });

      const token = saveAuthToken(payload);
      nickname.value = "";
      phone.value = "";
      password.value = "";
      confirmPassword.value = "";
      verifyCode.value = "";
      clearCountdown();
      countdown.value = 0;

      if (token) {
        setTip(payload?.message || "注册成功，正在跳转", "success");
        await router.push(resolvePostLoginRedirect());
        return;
      }

      switchAuthMode("login");
      setTip(payload?.message || "注册成功，请登录", "success");
      return;
    }

    const payload = await requestAuth("/system/public/member/auth/login", {
      body: {
        grantType: "password",
        deviceType: "web",
        email: email.value.trim(),
        password: password.value.trim()
      }
    });

    saveAuthToken(payload);
    setTip(payload?.message || "登录成功，正在跳转", "success");
    await router.push(resolvePostLoginRedirect());
  } catch (error) {
    setTip(error?.message || "请求失败，请稍后重试", "error");
  } finally {
    submitting.value = false;
  }
}

watch(
  () => [route.query.mode, route.query.email],
  ([queryMode, queryEmail]) => {
    if (queryMode === "register") {
      switchAuthMode("register");
    } else if (queryMode === "login") {
      switchAuthMode("login");
    }

    if (typeof queryEmail === "string" && queryEmail) {
      email.value = queryEmail;
    }

    nextTick(() => {
      void tryPlayLoginMusic();
    });
  },
  { immediate: true }
);

watch(
  isRegister,
  (registerMode) => {
    if (registerMode) {
      void refreshCaptcha();
      return;
    }

    resetCaptchaState();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearCountdown();
  stopVolumeChargeLoop();
  stopVolumeShotLoop();
  stopVolumeChargeSound();
  stopLoginMusic();
});
</script>

<template>
  <section class="login-page" :style="loginPageStyle">
    <div class="bg-shape bg-a" />
    <div class="bg-shape bg-b" />
    <div class="bg-shape bg-c" />
    <div class="bg-shape bg-d" />
    <div class="bg-shape bg-e" />
    <div class="bg-shape bg-f" />
    <LoginClothScene class="page-particles" />
    <a
      class="github-link"
      href="https://github.com/luoluo10486"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="打开 GitHub 主页"
      title="GitHub"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 .5a11.5 11.5 0 0 0-3.637 22.41c.575.106.785-.25.785-.556 0-.275-.01-1.004-.016-1.97-3.193.694-3.868-1.538-3.868-1.538-.522-1.326-1.276-1.68-1.276-1.68-1.043-.714.079-.699.079-.699 1.153.081 1.759 1.184 1.759 1.184 1.025 1.757 2.69 1.25 3.346.956.103-.743.401-1.25.729-1.538-2.55-.29-5.232-1.275-5.232-5.674 0-1.253.447-2.278 1.18-3.08-.118-.29-.512-1.455.112-3.034 0 0 .962-.308 3.15 1.176a10.95 10.95 0 0 1 5.736 0c2.186-1.484 3.146-1.176 3.146-1.176.626 1.579.232 2.744.114 3.034.735.802 1.178 1.827 1.178 3.08 0 4.41-2.686 5.38-5.244 5.664.412.355.779 1.055.779 2.126 0 1.536-.014 2.775-.014 3.153 0 .309.207.668.79.554A11.5 11.5 0 0 0 12 .5Z"
          fill="currentColor"
        />
      </svg>
    </a>
    <audio ref="loginMusicRef" :src="loginMusicSrc" preload="none" loop @play="onMusicPlay" @pause="onMusicPause" />
    <audio ref="volumeChargeSfxRef" :src="volumeChargeSfxSrc" preload="none" />
    <div class="media-controls">
      <div class="volume-control" :class="{ 'is-charging': isVolumeCharging }">
        <button
          type="button"
          class="volume-trigger"
          aria-label="长按蓄力调节音乐音量"
          @pointerdown="onVolumePressStart"
          @pointerup="onVolumePressEnd"
          @pointercancel="onVolumePressCancel"
          @contextmenu.prevent
        >
          <svg class="volume-trigger__icon" :style="volumeTriggerIconStyle" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M28 19 17.5 28.5H10v7h7.5L28 45V19Z" fill="#f3dd8a" />
            <path
              class="volume-trigger__wave volume-trigger__wave--a"
              d="M37 25.5c2.6 1.8 4.2 4.1 4.2 6.5S39.6 36.7 37 38.5"
              fill="none"
              stroke="#d2ac3f"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              class="volume-trigger__wave volume-trigger__wave--b"
              d="M43 19.5c4.6 3.3 7.2 7.7 7.2 12.5S47.6 41.2 43 44.5"
              fill="none"
              stroke="#d2ac3f"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <div ref="volumeTrackRef" class="volume-track" aria-hidden="true">
          <span class="volume-track__rail" />
          <span class="volume-track__fill" :style="volumeFillStyle" />
          <span class="volume-track__projectile" :style="volumeProjectileStyle" />
        </div>
      </div>

      <button
        type="button"
        class="music-trigger"
        :class="{ 'is-playing': isMusicPlaying, 'is-blocked': needMusicGesture }"
        :aria-label="isMusicPlaying ? '暂停音乐' : '播放音乐'"
        @click="onMusicToggleClick"
      >
        <svg class="music-trigger__icon music-note" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M31 12v27.5M31 12l18 11M31 12c6 1 9 4 11 8.5"
            fill="none"
            stroke="#5853a6"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <ellipse cx="25.5" cy="45.5" rx="9.5" ry="7.5" fill="#f4c24f" />
          <ellipse cx="25.5" cy="45.5" rx="9.5" ry="7.5" fill="none" stroke="#5853a6" stroke-width="3.3" />
        </svg>
        <span class="music-trigger__tooltip" role="tooltip">{{ musicTooltipText }}</span>
      </button>
    </div>

    <div class="login-shell">
      <form :key="authCardKey" class="login-card" @submit.prevent="onSubmit">
        <h1>{{ isRegister ? "创建账号" : "请登录" }}</h1>

        <div class="form-tip-slot" aria-live="polite">
          <p v-if="formTip" :class="['form-tip', `form-tip--${formTipType}`]">{{ formTip }}</p>
        </div>

        <label>
          <span>邮箱</span>
          <input v-model.trim="email" type="email" placeholder="请输入邮箱" autocomplete="email" />
        </label>

        <label v-if="isRegister">
          <span>昵称</span>
          <input
            v-model="nickname"
            type="text"
            maxlength="20"
            placeholder="请输入昵称"
            autocomplete="nickname"
            @input="normalizeNickname"
          />
        </label>

        <label v-if="isRegister">
          <span>手机号（选填）</span>
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            maxlength="11"
            placeholder="请输入手机号（选填）"
            autocomplete="tel"
            @input="normalizePhone"
          />
        </label>

        <label>
          <span>密码</span>
          <div class="password-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              :autocomplete="isRegister ? 'new-password' : 'current-password'"
            />
            <button
              type="button"
              class="toggle"
              :class="showPassword ? 'is-visible' : 'is-hidden'"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              :title="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 15c2.2-2.6 5-4 8-4 3.1 0 5.8 1.4 8 4" />
                <path d="M8.2 18 6.8 20" />
                <path d="M12 17.6V20" />
                <path d="m15.8 18 1.4 2" />
              </svg>
            </button>
          </div>
        </label>

        <label v-if="isRegister">
          <span>确认密码</span>
          <div class="password-wrap">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              autocomplete="new-password"
            />
            <button
              type="button"
              class="toggle"
              :class="showPassword ? 'is-visible' : 'is-hidden'"
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              :title="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 15c2.2-2.6 5-4 8-4 3.1 0 5.8 1.4 8 4" />
                <path d="M8.2 18 6.8 20" />
                <path d="M12 17.6V20" />
                <path d="m15.8 18 1.4 2" />
              </svg>
            </button>
          </div>
        </label>

        <label v-if="isRegister">
          <span>图形验证码</span>
          <div class="captcha-wrap">
            <input
              v-model.trim="captchaCode"
              type="text"
              inputmode="text"
              maxlength="8"
              placeholder="请输入图形验证码"
              autocomplete="off"
              @input="normalizeCaptchaCode"
            />
            <button
              type="button"
              class="captcha-preview"
              :disabled="loadingCaptcha"
              :aria-label="loadingCaptcha ? '图形验证码加载中' : '刷新图形验证码'"
              :title="loadingCaptcha ? '图形验证码加载中' : '点击刷新图形验证码'"
              @click="refreshCaptcha"
            >
              <img v-if="captchaImageSrc" :src="captchaImageSrc" alt="图形验证码" />
              <span v-else>{{ loadingCaptcha ? "加载中..." : "点击刷新" }}</span>
            </button>
          </div>
        </label>

        <label v-if="isRegister">
          <span>邮箱验证码</span>
          <div class="code-wrap">
            <input
              v-model.trim="verifyCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="请输入验证码"
              autocomplete="one-time-code"
              @input="normalizeVerifyCode"
            />
            <button type="button" class="send-code" :disabled="!canSendCode" @click="onSendCode">
              {{ sendCodeText }}
            </button>
          </div>
        </label>

        <button class="submit" type="submit" :disabled="submitting">{{ submitText }}</button>

        <p class="auth-switch">
          <span>{{ isRegister ? "已有账号？" : "还没有账号？" }}</span>
          <button
            type="button"
            class="auth-switch__action"
            @click="switchAuthMode(isRegister ? 'login' : 'register')"
          >
            {{ isRegister ? "立即登录" : "立即注册" }}
          </button>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #a9c8df;
  isolation: isolate;
}

.login-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--login-bg-image) center / cover no-repeat;
  opacity: 0.16;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  transform-origin: center;
  z-index: 1;
  filter: saturate(1.05);
  opacity: 0;
}

.bg-a {
  width: 86vmax;
  height: 86vmax;
  left: -36vmax;
  top: -24vmax;
  background: #6f76bf;
  transform: rotate(45deg);
  animation: shapeInA 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) 0.02s forwards;
}

.bg-b {
  width: 74vmax;
  height: 74vmax;
  right: -30vmax;
  top: -22vmax;
  background: #7fc2de;
  transform: rotate(45deg);
  animation: shapeInB 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
}

.bg-c {
  width: 78vmax;
  height: 78vmax;
  left: -24vmax;
  bottom: -42vmax;
  background: #e4bf9c;
  transform: rotate(45deg);
  animation: shapeInC 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.18s forwards;
}

.bg-d {
  width: 76vmax;
  height: 76vmax;
  right: -32vmax;
  bottom: -36vmax;
  background: #e59ea9;
  transform: rotate(45deg);
  animation: shapeInD 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.24s forwards;
}

.bg-e {
  width: 48vmax;
  height: 48vmax;
  left: 50%;
  top: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%) rotate(45deg);
  animation: shapeInCenter 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.52s forwards;
}

.bg-e::before {
  content: "";
  position: absolute;
  inset: -35%;
  background: var(--login-bg-image) center 42% / cover no-repeat;
  transform: rotate(-45deg) scale(1.42);
  transform-origin: center;
}

.bg-f {
  width: 56vmax;
  height: 56vmax;
  left: 58%;
  top: 52%;
  background: rgba(255, 255, 255, 0.22);
  transform: translate(-50%, -50%) rotate(45deg);
  animation: shapeInCenterSoft 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.64s forwards;
}

.login-shell {
  min-height: 100vh;
  width: 100%;
  max-width: 1160px;
  padding: 0 1.2rem;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
}

.login-card {
  width: min(460px, calc(100% - 1rem));
  justify-self: center;
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
  padding: 0;
  border-radius: 0;
  display: grid;
  gap: 0.9rem;
  opacity: 0;
  transform: translateY(10px) scale(0.99);
  animation: formWrapIn 0.36s ease-out forwards;
}

.login-card > * {
  opacity: 0;
  transform: translateY(8px);
  animation: formItemIn 0.3s ease 0.08s forwards;
}

h1 {
  margin: 0 0 0.2rem;
  text-align: center;
  font-size: clamp(1.7rem, 2.8vw, 2.1rem);
  color: #0f172a;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

label {
  display: grid;
  gap: 0.38rem;
  color: #334155;
  font-weight: 700;
  font-size: 0.95rem;
}

input {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  padding: 0 0.82rem;
  background: rgba(255, 255, 255, 0.14);
  font: inherit;
  color: #0f172a;
  outline: none;
}

input,
input:hover,
input:focus,
input:active {
  background: rgba(255, 255, 255, 0.08);
}

input:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 4px rgba(111, 118, 191, 0.18);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: #0f172a;
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.08) inset;
  box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.08) inset;
  transition: background-color 9999s ease-out 0s;
}

input::-ms-reveal,
input::-ms-clear {
  display: none;
}

.password-wrap,
.code-wrap {
  position: relative;
}

.captcha-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 156px;
  gap: 0.65rem;
}

.password-wrap input {
  padding-right: 3rem;
}

.code-wrap input {
  padding-right: 7.7rem;
}

.captcha-wrap input {
  text-transform: uppercase;
}

.captcha-preview {
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.88);
  color: #334155;
  font: inherit;
  font-weight: 700;
  overflow: hidden;
  cursor: pointer;
}

.captcha-preview img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.captcha-preview:disabled {
  opacity: 0.72;
  cursor: wait;
}

.toggle {
  position: absolute;
  right: 7px;
  top: 7px;
  height: 32px;
  width: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  display: grid;
  place-items: center;
  color: #0f766e;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
}

.toggle:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.18);
}

.toggle.is-visible {
  color: #2563eb;
}

.toggle.is-hidden {
  color: #0f766e;
}

.toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.send-code {
  position: absolute;
  right: 7px;
  top: 7px;
  height: 32px;
  padding: 0 0.62rem;
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #334155;
  font-weight: 700;
  cursor: pointer;
}

.send-code {
  min-width: 100px;
}

.send-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit {
  margin-top: 0.3rem;
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-switch {
  margin: 0.2rem 0 0;
  text-align: center;
  color: #334155;
  font-size: 0.93rem;
}

.auth-switch__action {
  border: 0;
  padding: 0;
  background: transparent;
  margin-left: 0.42rem;
  color: #0f172a;
  font-size: inherit;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.form-tip-slot {
  min-height: 1.4rem;
  display: grid;
  align-items: start;
}

.form-tip {
  margin: 0;
  text-align: center;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.45;
}

.form-tip--info {
  color: #334155;
}

.form-tip--success {
  color: #166534;
}

.form-tip--error {
  color: #b91c1c;
}

.page-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: auto;
}

.github-link {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 5;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #1e293b;
  text-decoration: none;
  transition: color 0.18s ease, transform 0.18s ease, filter 0.18s ease;
}

.github-link:hover,
.github-link:focus-visible {
  color: #3b82f6;
  transform: translateY(-1px) scale(1.06);
  filter: drop-shadow(0 3px 10px rgba(59, 130, 246, 0.28));
}

.github-link svg {
  width: 28px;
  height: 28px;
}

.media-controls {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 5;
  display: flex;
  align-items: flex-end;
  gap: 0.85rem;
}

.volume-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.volume-trigger {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}

.volume-trigger__icon {
  width: 34px;
  height: 34px;
  filter: drop-shadow(0 2px 6px rgba(15, 23, 42, 0.2));
  transform-origin: 18px 32px;
  transition: transform 0.14s ease;
}

.volume-trigger__wave {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.volume-control.is-charging .volume-trigger__wave--a {
  animation: volumeWavePulse 0.34s ease-in-out infinite alternate;
}

.volume-control.is-charging .volume-trigger__wave--b {
  animation: volumeWavePulse 0.42s ease-in-out infinite alternate;
}

.volume-track {
  position: relative;
  width: 154px;
  height: 28px;
  overflow: visible;
}

.volume-track__rail,
.volume-track__fill {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-radius: 999px;
}

.volume-track__rail {
  height: 2px;
  background: rgba(255, 241, 193, 0.95);
  transform: translateY(-50%);
}

.volume-track__fill {
  height: 3px;
  background: linear-gradient(90deg, rgba(247, 228, 153, 0.92), rgba(221, 183, 70, 0.98));
  transform-origin: left center;
}

.volume-track__projectile {
  position: absolute;
  top: 50%;
  border-radius: 999px;
  pointer-events: none;
}

.volume-track__projectile {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle at 35% 35%, #fff6cf, #e4c35e 72%);
  box-shadow: 0 5px 12px rgba(188, 149, 48, 0.28);
}

.music-trigger {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 0;
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  box-shadow: none;
  backdrop-filter: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
  overflow: visible;
}

.music-trigger:hover {
  transform: translateY(-2px) scale(1.06);
}

.music-trigger.is-blocked {
  opacity: 0.88;
}

.music-trigger__icon {
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 2px 5px rgba(15, 23, 42, 0.22));
}

.music-trigger__tooltip {
  position: absolute;
  right: calc(100% + 0.62rem);
  top: 50%;
  transform: translateY(-50%) translateX(6px) scale(0.98);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  padding: 0.18rem 0.1rem;
  border: 0;
  background: transparent;
  color: #f8fafc;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(15, 23, 42, 0.38), 0 1px 2px rgba(15, 23, 42, 0.42);
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.music-trigger:hover .music-trigger__tooltip,
.music-trigger:focus-visible .music-trigger__tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0) scale(1);
}

.music-trigger.is-playing {
  opacity: 1;
}

.music-trigger.is-playing .music-note {
  animation: noteSwing 1.3s ease-in-out infinite;
}

@keyframes noteAlert {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 2px 5px rgba(15, 23, 42, 0.22));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 3px 8px rgba(220, 38, 38, 0.28));
  }
}

.music-trigger.is-blocked .music-note {
  animation: noteAlert 1.2s ease-in-out infinite;
}

@keyframes noteSwing {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-1px) rotate(-4deg);
  }
  75% {
    transform: translateY(-1px) rotate(4deg);
  }
}

@keyframes volumeWavePulse {
  from {
    opacity: 0.55;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1.04);
  }
}


@keyframes shapeInA {
  from {
    opacity: 0;
    transform: translate(-16vmax, -12vmax) rotate(45deg) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
}

@keyframes shapeInB {
  from {
    opacity: 0;
    transform: translate(16vmax, -12vmax) rotate(45deg) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
}

@keyframes shapeInC {
  from {
    opacity: 0;
    transform: translate(-14vmax, 12vmax) rotate(45deg) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
}

@keyframes shapeInD {
  from {
    opacity: 0;
    transform: translate(14vmax, 12vmax) rotate(45deg) scale(0.86);
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(45deg) scale(1);
  }
}

@keyframes shapeInCenter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
  }
}

@keyframes shapeInCenterSoft {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(45deg) scale(1);
  }
}

@keyframes formWrapIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes formItemIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-shape,
  .login-card,
  .login-card > * {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .login-shell {
    padding: 0 0.7rem;
    place-items: center;
  }

  .login-card {
    width: min(460px, calc(100% - 0.2rem));
  }

  .bg-e {
    width: 74vmax;
    height: 74vmax;
  }

  .media-controls {
    right: 0.8rem;
    bottom: 0.8rem;
    gap: 0.6rem;
  }

  .volume-control {
    padding: 0;
  }

  .volume-track {
    width: 132px;
  }

  .music-trigger {
    width: 46px;
    height: 46px;
  }

  .github-link {
    top: 0.78rem;
    right: 0.78rem;
  }
}

@media (max-width: 560px) {
  .login-card {
    width: min(100%, calc(100% - 0.1rem));
  }

  .media-controls {
    align-items: center;
    gap: 0.5rem;
  }

  .volume-control {
    padding: 0;
  }

  .volume-track {
    width: 108px;
  }

  .volume-trigger {
    width: 38px;
    height: 38px;
  }

  .volume-trigger__icon {
    width: 30px;
    height: 30px;
  }

  .captcha-wrap {
    grid-template-columns: minmax(0, 1fr) 138px;
  }
}
</style>
