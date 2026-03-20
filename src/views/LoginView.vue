<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const showPassword = ref(false);
const isRegister = computed(() => route.meta.authMode === "register");

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const verifyCode = ref("");

const sendingCode = ref(false);
const countdown = ref(0);
const formTip = ref("");

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

const canSendCode = computed(() => {
  return isRegister.value && emailValid.value && !sendingCode.value && countdown.value === 0;
});

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

async function onSendCode() {
  if (!emailValid.value) {
    formTip.value = "请先输入正确的邮箱地址";
    return;
  }

  if (!canSendCode.value) {
    return;
  }

  sendingCode.value = true;
  formTip.value = "";

  try {
    // TODO: 接入后端发送邮箱验证码接口。
    await new Promise((resolve) => setTimeout(resolve, 600));
    formTip.value = "验证码已发送，请查收邮箱";
    startCountdown(60);
  } catch (error) {
    formTip.value = "验证码发送失败，请稍后重试";
  } finally {
    sendingCode.value = false;
  }
}

function onSubmit() {
  formTip.value = "";

  if (!emailValid.value) {
    formTip.value = "请输入正确的邮箱地址";
    return;
  }

  if (!password.value) {
    formTip.value = "请输入密码";
    return;
  }

  if (isRegister.value) {
    if (!verifyCode.value) {
      formTip.value = "请输入邮箱验证码";
      return;
    }

    if (!confirmPassword.value) {
      formTip.value = "请再次输入密码";
      return;
    }

    if (password.value !== confirmPassword.value) {
      formTip.value = "两次输入的密码不一致";
      return;
    }

    // TODO: 接入后端注册接口。
    formTip.value = "注册信息校验通过，等待接入后端接口";
    return;
  }

  // TODO: 接入后端登录接口。
  formTip.value = "登录信息校验通过，等待接入后端接口";
}

onBeforeUnmount(() => {
  clearCountdown();
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

        <button class="submit" type="submit">{{ isRegister ? "注册" : "登录" }}</button>

        <p class="auth-switch">
          <span>{{ isRegister ? "已有账号？" : "还没有账号？" }}</span>
          <RouterLink :to="isRegister ? '/login' : '/register'">
            {{ isRegister ? "立即登录" : "立即注册" }}
          </RouterLink>
        </p>

        <p v-if="formTip" class="form-tip">{{ formTip }}</p>
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
  color: #1e293b;
  text-align: center;
  font-size: 0.92rem;
  font-weight: 600;
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
}
</style>
