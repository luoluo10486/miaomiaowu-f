<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
  router.replace("/workspace");
}
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <p class="not-found-code">404</p>
      <h1>页面不存在</h1>
      <p>你访问的路径没有匹配到任何页面。可以回到问答页继续，或返回管理入口。</p>
      <div class="not-found-actions">
        <button type="button" class="not-found-button" @click="goHome">回到工作台</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at top, #f8fafc, #eef2ff 55%, #e2e8f0);
}

.not-found-card {
  width: min(520px, 100%);
  padding: 32px 28px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
  text-align: center;
}

.not-found-code {
  margin: 0 0 10px;
  font-size: 54px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1d4ed8;
}

.not-found-card h1 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.not-found-card p {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.7;
}

.not-found-actions {
  margin-top: 24px;
}

.not-found-button {
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 11px 18px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.not-found-button:hover {
  background: #1d4ed8;
}
</style>
