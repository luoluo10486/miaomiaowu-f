<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();

const showPassword = ref(false);
const isRegister = computed(() => route.meta.authMode === "register");

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const verifyCode = ref("");

const sendingCode = ref(false);
const submitting = ref(false);
const countdown = ref(0);
const formTip = ref("");
const formTipType = ref("info");
const loginMusicRef = ref(null);
const needMusicGesture = ref(false);
const isMusicPlaying = ref(false);
const loginTrackName = "Drink, Pray, Love!";

let countdownTimer = null;

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

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
  return isRegister.value && emailValid.value && !sendingCode.value && countdown.value === 0 && !submitting.value;
});

const musicTooltipText = computed(() => {
  if (needMusicGesture.value) {
    return `${loginTrackName} · 点击播放`;
  }

  return isMusicPlaying.value ? `${loginTrackName} · 正在播放` : `${loginTrackName} · 已暂停`;
});

function setTip(message, type = "info") {
  formTip.value = message;
  formTipType.value = type;
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

async function requestAuth(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : { message: await response.text() };

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "请求失败，请稍后重试");
  }

  return payload;
}

function saveAuthToken(payload) {
  const token = payload?.token || payload?.data?.token || "";
  if (token) {
    localStorage.setItem("auth_token", token);
  }
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
  if (isRegister.value) {
    return;
  }

  const audio = loginMusicRef.value;
  if (!audio) {
    return;
  }

  audio.volume = 0.45;

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

  sendingCode.value = true;
  setTip("", "info");

  try {
    const payload = await requestAuth("/api/auth/send-code", { email: email.value.trim() });
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
      normalizeVerifyCode();

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

      const payload = await requestAuth("/api/auth/register", {
        email: email.value.trim(),
        password: password.value.trim(),
        code: verifyCode.value
      });

      setTip(payload?.message || "注册成功，请登录", "success");
      password.value = "";
      confirmPassword.value = "";
      verifyCode.value = "";
      clearCountdown();
      countdown.value = 0;
      await router.push({ path: "/login", query: { email: email.value.trim(), registered: "1" } });
      return;
    }

    const payload = await requestAuth("/api/auth/login", {
      email: email.value.trim(),
      password: password.value.trim()
    });

    saveAuthToken(payload);
    setTip(payload?.message || "登录成功，正在跳转", "success");
    await router.push("/");
  } catch (error) {
    setTip(error?.message || "请求失败，请稍后重试", "error");
  } finally {
    submitting.value = false;
  }
}

watch(
  () => route.fullPath,
  () => {
    showPassword.value = false;
    password.value = "";
    confirmPassword.value = "";
    verifyCode.value = "";
    clearCountdown();
    countdown.value = 0;

    const queryEmail = typeof route.query.email === "string" ? route.query.email : "";
    if (queryEmail) {
      email.value = queryEmail;
    }

    if (route.query.registered === "1" && !isRegister.value) {
      setTip("注册成功，请使用账号密码登录", "success");
    } else {
      setTip("", "info");
    }

    nextTick(() => {
      if (isRegister.value) {
        stopLoginMusic();
        return;
      }

      void tryPlayLoginMusic();
    });
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearCountdown();
  stopLoginMusic();
});
</script>

<template>
  <section class="login-page">
    <div class="bg-shape bg-a" />
    <div class="bg-shape bg-b" />
    <div class="bg-shape bg-c" />
    <div class="bg-shape bg-d" />
    <div class="bg-shape bg-e" />
    <div class="bg-shape bg-f" />
    <audio ref="loginMusicRef" src="/login-bgm.mp3" preload="auto" loop @play="onMusicPlay" @pause="onMusicPause" />
    <button
      v-if="!isRegister"
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

    <div class="login-shell">
      <form class="login-card" @submit.prevent="onSubmit">
        <h1>{{ isRegister ? "创建账号" : "请登录" }}</h1>

        <label>
          <span>邮箱</span>
          <input v-model.trim="email" type="email" placeholder="请输入邮箱" autocomplete="email" />
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
            <button type="button" class="toggle" @click="showPassword = !showPassword">
              {{ showPassword ? "隐藏" : "显示" }}
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

        <label v-if="isRegister">
          <span>确认密码</span>
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请再次输入密码"
            autocomplete="new-password"
          />
        </label>

        <button class="submit" type="submit" :disabled="submitting">{{ submitText }}</button>

        <p class="auth-switch">
          <span>{{ isRegister ? "已有账号？" : "还没有账号？" }}</span>
          <RouterLink :to="isRegister ? '/login' : '/register'">
            {{ isRegister ? "立即登录" : "立即注册" }}
          </RouterLink>
        </p>

        <p v-if="formTip" :class="['form-tip', `form-tip--${formTipType}`]">{{ formTip }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-page {
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
  background: url("/login-bg-anime.png") center / cover no-repeat;
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
  background: url("/login-bg-anime.png") center 42% / cover no-repeat;
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
  width: min(1160px, calc(100% - 2.4rem));
  margin: 0 auto;
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
}

.login-card {
  width: min(460px, calc(100% - 1rem));
  background: transparent;
  border: 0;
  box-shadow: none;
  padding: 0;
  display: grid;
  gap: 0.9rem;
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: formWrapIn 0.55s ease-out 0.95s forwards;
}

.login-card > * {
  opacity: 0;
  transform: translateY(10px);
  animation: formItemIn 0.5s ease forwards;
}

.login-card > *:nth-child(1) {
  animation-delay: 1.05s;
}

.login-card > *:nth-child(2) {
  animation-delay: 1.14s;
}

.login-card > *:nth-child(3) {
  animation-delay: 1.22s;
}

.login-card > *:nth-child(4) {
  animation-delay: 1.3s;
}

.login-card > *:nth-child(5) {
  animation-delay: 1.38s;
}

.login-card > *:nth-child(6) {
  animation-delay: 1.46s;
}

.login-card > *:nth-child(7) {
  animation-delay: 1.54s;
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

input:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 4px rgba(111, 118, 191, 0.18);
}

.password-wrap,
.code-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 4.4rem;
}

.code-wrap input {
  padding-right: 7.7rem;
}

.toggle,
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

.auth-switch a {
  margin-left: 0.42rem;
  color: #0f172a;
  font-weight: 700;
  text-decoration: underline;
}

.form-tip {
  margin: 0;
  text-align: center;
  font-size: 0.92rem;
  font-weight: 600;
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

.music-trigger {
  position: fixed;
  right: 1.15rem;
  bottom: 1.15rem;
  z-index: 4;
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
    width: min(1160px, calc(100% - 1.4rem));
  }

  .login-card {
    padding: 0;
  }

  .bg-e {
    width: 74vmax;
    height: 74vmax;
  }

  .music-trigger {
    right: 0.8rem;
    bottom: 0.8rem;
    width: 46px;
    height: 46px;
  }
}
</style>
