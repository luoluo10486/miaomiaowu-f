<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const active = computed(() => route.name);

const navLinks = [
  { name: "workspace-home", label: "工作台", to: "/workspace" },
  { name: "rag-chat", label: "RAG 问答", to: "/chat" },
  { name: "rag-admin", label: "后台管理", to: "/admin" }
];
</script>

<template>
  <header class="nav-wrap">
    <nav class="nav" aria-label="主导航">
      <RouterLink class="brand" to="/workspace" aria-label="返回工作台">
        <span class="brand__dot" />
        RAG Studio
      </RouterLink>

      <div class="nav__links">
        <RouterLink
          v-for="item in navLinks"
          :key="item.name"
          :class="['nav__link', { 'is-active': active === item.name }]"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <RouterLink class="nav__cta" to="/login">登录</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.nav-wrap {
  width: min(1200px, calc(100% - 3rem));
  margin: 1.1rem auto 0;
  position: relative;
  z-index: 3;
}

.nav {
  height: 66px;
  border-radius: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 1.2rem;
  border: 1px solid rgba(15, 23, 42, 0.15);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.04em;
}

.brand__dot {
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  background: conic-gradient(from 180deg, #22d3ee, #f97316, #22d3ee);
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.nav__link {
  text-decoration: none;
  color: #334155;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 99px;
  transition: all 0.25s ease;
}

.nav__link:hover {
  color: #111827;
  background: rgba(255, 255, 255, 0.66);
}

.nav__link.is-active {
  color: #020617;
  background: #e5e7eb;
}

.nav__cta {
  text-decoration: none;
  color: #ffffff;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 14px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.nav__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.3);
}

@media (max-width: 960px) {
  .nav-wrap {
    width: min(1200px, calc(100% - 1.4rem));
  }

  .nav {
    height: auto;
    padding: 0.85rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
