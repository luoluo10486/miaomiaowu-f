<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import LoginClothScene from "../components/LoginClothScene.vue";

const route = useRoute();
const router = useRouter();
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const AUTH_API_PREFIX = "/luoluo";

const showPassword = ref(false);
const authMode = ref(route.query.mode === "register" ? "register" : "login");
const isRegister = computed(() => authMode.value === "register");

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
const authCardKey = computed(() => (isRegister.value ? "register-card" : "login-card"));

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

function switchAuthMode(mode) {
  if (authMode.value === mode) {
    return;
  }

  authMode.value = mode;
  showPassword.value = false;
  password.value = "";
  confirmPassword.value = "";
  verifyCode.value = "";
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
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${AUTH_API_PREFIX}${normalizedPath}`, {
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

      password.value = "";
      confirmPassword.value = "";
      verifyCode.value = "";
      clearCountdown();
      countdown.value = 0;
      switchAuthMode("login");
      setTip(payload?.message || "注册成功，请登录", "success");
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
    <audio ref="loginMusicRef" src="/login-bgm.mp3" preload="auto" loop @play="onMusicPlay" @pause="onMusicPause" />
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

    <div class="login-shell">
      <form :key="authCardKey" class="login-card" @submit.prevent="onSubmit">
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

.password-wrap input {
  padding-right: 3rem;
}

.code-wrap input {
  padding-right: 7.7rem;
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

.music-trigger {
  position: fixed;
  right: 1.15rem;
  bottom: 1.15rem;
  z-index: 5;
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
    place-items: center;
  }

  .login-card {
    width: min(460px, calc(100% - 0.2rem));
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

  .github-link {
    top: 0.78rem;
    right: 0.78rem;
  }
}

@media (max-width: 560px) {
  .login-card {
    width: min(100%, calc(100% - 0.1rem));
  }
}
</style>
