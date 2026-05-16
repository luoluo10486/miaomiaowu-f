<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  search: {
    type: String,
    default: ""
  },
  currentSessionId: {
    type: String,
    default: ""
  },
  currentUserName: {
    type: String,
    default: ""
  },
  userInitial: {
    type: String,
    default: "U"
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  formatTime: {
    type: Function,
    default: (value) => value || "刚刚"
  }
});

const emit = defineEmits([
  "update:search",
  "create",
  "select",
  "delete",
  "rename",
  "logout",
  "open-admin",
  "close"
]);

const hasGroups = computed(() => Array.isArray(props.groups) && props.groups.length > 0);
const activeMenuSessionId = ref("");

function updateSearch(event) {
  emit("update:search", event.target.value);
}

function toggleMenu(sessionId) {
  activeMenuSessionId.value = activeMenuSessionId.value === sessionId ? "" : sessionId;
}

function closeMenu() {
  activeMenuSessionId.value = "";
}

function handleWindowClick() {
  closeMenu();
}

onMounted(() => {
  window.addEventListener("click", handleWindowClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleWindowClick);
});
</script>

<template>
  <div class="sidebar-shell">
    <div
      v-if="isOpen"
      class="sidebar-shell__overlay"
      aria-hidden="true"
      @click="emit('close')"
    />

    <aside class="sidebar" :class="{ 'is-open': isOpen }">
      <div class="sidebar__brand">
        <div class="sidebar__brand-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 3c4.97 0 9 3.58 9 8 0 4.1-3.52 7.54-8 7.95L8 21v-2.76A8.69 8.69 0 0 1 3 11c0-4.42 4.03-8 9-8Z"
            />
          </svg>
        </div>
        <div class="sidebar__brand-copy">
          <p>Ragent AI 智能问答</p>
          <small>Powered by knowledge retrieval</small>
        </div>
      </div>

      <div class="sidebar__quick">
        <div class="sidebar__quick-head">
          <span>快速开始</span>
          <span class="sidebar__quick-tag">新内容</span>
        </div>
        <button type="button" class="sidebar__new" @click="emit('create')">
          <span class="sidebar__new-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span>
            <strong>新建会话</strong>
            <small>从空白开始提问</small>
          </span>
        </button>
        <button
          v-if="isAdmin"
          type="button"
          class="sidebar__admin"
          @click="emit('open-admin')"
        >
          管理后台
        </button>
      </div>

      <div class="sidebar__search">
        <div class="sidebar__search-head">
          <span>搜索对话</span>
          <span class="sidebar__search-hint">Ctrl / Cmd + K</span>
        </div>
        <div class="sidebar__search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input
            :value="search"
            type="search"
            placeholder="搜索会话..."
            @input="updateSearch"
          />
        </div>
      </div>

      <div class="sidebar__list-wrap">
        <div v-if="loading" class="sidebar__state">
          <div class="sidebar__dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div v-else-if="!hasGroups" class="sidebar__state sidebar__state--empty">
          暂无会话记录
        </div>

        <div v-else class="sidebar__list">
          <section v-for="group in groups" :key="group.key" class="sidebar__group">
            <div class="sidebar__group-head">
              <h3>{{ group.label }}</h3>
              <span>{{ group.count ?? group.items?.length ?? 0 }}</span>
            </div>

            <ul>
              <li v-for="session in group.items" :key="session.id">
                <button
                  type="button"
                  class="sidebar__item"
                  :class="{ 'is-active': currentSessionId === session.id }"
                  @click="
                    emit('select', session);
                    emit('close');
                    closeMenu();
                  "
                >
                  <span class="sidebar__item-title">{{ session.title }}</span>
                  <span class="sidebar__item-time">{{ formatTime(session.lastTime) }}</span>
                </button>

                <div class="sidebar__item-menu">
                  <button
                    type="button"
                    class="sidebar__action"
                    :class="{ 'is-open': activeMenuSessionId === session.id }"
                    title="会话操作"
                    aria-label="会话操作"
                    @click.stop="toggleMenu(session.id)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </button>

                  <div
                    v-if="activeMenuSessionId === session.id"
                    class="sidebar__menu"
                    @click.stop
                  >
                    <button
                      type="button"
                      class="sidebar__menu-item"
                      @click="emit('rename', session); closeMenu();"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 20h16" />
                        <path d="M5 15.5 15.5 5a2.1 2.1 0 0 1 3 3L8 18.5 4 20z" />
                      </svg>
                      <span>重命名</span>
                    </button>
                    <button
                      type="button"
                      class="sidebar__menu-item is-danger"
                      @click="emit('delete', session.id); closeMenu();"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="sidebar__footer">
        <div class="sidebar__user">
          <div class="sidebar__avatar">{{ userInitial }}</div>
          <div class="sidebar__user-copy">
            <strong>{{ currentUserName }}</strong>
            <small>{{ isAdmin ? "管理员" : "当前用户" }}</small>
          </div>
        </div>

        <div class="sidebar__footer-actions">
          <button v-if="isAdmin" type="button" class="sidebar__footer-btn" @click="emit('open-admin')">
            后台入口
          </button>
          <button type="button" class="sidebar__footer-btn is-ghost" @click="emit('logout')">
            退出登录
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.sidebar-shell {
  position: relative;
  min-width: 0;
}

.sidebar-shell__overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(4px);
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: calc(100vh - 36px);
  padding: 14px 12px 12px;
  background: #fafafa;
  box-shadow: none;
  backdrop-filter: none;
}

.sidebar__brand,
.sidebar__quick,
.sidebar__search,
.sidebar__footer {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.sidebar__brand {
  display: flex;
  gap: 12px;
  padding: 0 0 14px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar__brand-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #fff;
  flex-shrink: 0;
}

.sidebar__brand-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.sidebar__brand-copy p {
  margin: 0;
  color: #111827;
  font-size: 15px;
  font-weight: 700;
}

.sidebar__brand-copy small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
}

.sidebar__quick {
  margin-top: 14px;
  padding: 0;
}

.sidebar__quick-head,
.sidebar__search-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sidebar__quick-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  letter-spacing: normal;
}

.sidebar__new {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid #eaeaea;
  border-radius: 16px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar__new:hover {
  border-color: #dbeafe;
  background: #f8fbff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.sidebar__new-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #fff;
  flex-shrink: 0;
}

.sidebar__new-icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar__new strong {
  display: block;
  color: #1f2937;
  font-size: 14px;
  font-weight: 700;
}

.sidebar__new small {
  display: block;
  margin-top: 3px;
  color: #94a3b8;
  font-size: 12px;
}

.sidebar__admin {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.sidebar__search {
  margin-top: 14px;
  padding: 0;
}

.sidebar__search-hint {
  color: #cbd5e1;
  font-size: 10px;
  letter-spacing: 0;
}

.sidebar__search-box {
  position: relative;
  margin-top: 12px;
}

.sidebar__search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: #94a3b8;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: translateY(-50%);
  pointer-events: none;
}

.sidebar__search-box input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #f8fafc;
  color: #1f2937;
  font-size: 13px;
  outline: none;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.sidebar__search-box input:focus {
  border-color: #93c5fd;
  background: #fff;
}

.sidebar__list-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  margin-top: 14px;
  background: transparent;
  overflow: hidden;
}

.sidebar__state {
  display: grid;
  place-items: center;
  min-height: 180px;
  color: #94a3b8;
  font-size: 13px;
}

.sidebar__state--empty {
  padding: 24px;
}

.sidebar__dots {
  display: flex;
  gap: 6px;
}

.sidebar__dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  animation: pulse 1.2s ease-in-out infinite;
}

.sidebar__dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.sidebar__dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.sidebar__list {
  max-height: calc(100vh - 430px);
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(37, 99, 235, 0.2) transparent;
}

.sidebar__group + .sidebar__group {
  margin-top: 16px;
}

.sidebar__group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.sidebar__group-head h3 {
  margin: 0;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar__group-head span {
  color: #94a3b8;
  font-size: 11px;
}

.sidebar__group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.sidebar__group li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sidebar__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.18s ease;
}

.sidebar__item:hover {
  background: #f5f5f5;
}

.sidebar__item.is-active {
  background: #dbeafe;
}

.sidebar__item-title {
  overflow: hidden;
  color: #333333;
  font-size: 13px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__item-time {
  color: #999999;
  font-size: 11px;
}

.sidebar__item-menu {
  position: relative;
}

.sidebar__action {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.16s ease;
}

.sidebar__action:hover {
  border-color: #dbeafe;
  background: rgba(37, 99, 235, 0.06);
  color: #2563eb;
}

.sidebar__action.is-open {
  background: #f5f5f5;
  color: #1f2937;
}

.sidebar__action svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 20;
  min-width: 124px;
  padding: 6px 0;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.sidebar__menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  background: transparent;
  color: #333333;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.sidebar__menu-item:hover {
  background: #f5f5f5;
}

.sidebar__menu-item.is-danger {
  color: #ff4d4f;
}

.sidebar__menu-item svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar__rename {
  grid-column: 1 / -1;
}

.sidebar__rename input {
  width: 100%;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(191, 219, 254, 0.9);
  border-radius: 12px;
  background: #fff;
  color: #1f2937;
  font-size: 13px;
  outline: none;
}

.sidebar__footer {
  margin-top: 14px;
  padding: 14px 0 0;
  border-top: 1px solid #f0f0f0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar__avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #2563eb);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.sidebar__user-copy strong {
  display: block;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 700;
}

.sidebar__user-copy small {
  display: block;
  margin-top: 3px;
  color: #999999;
  font-size: 11px;
}

.sidebar__footer-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.sidebar__footer-btn {
  flex: 1;
  height: 32px;
  border: 1px solid rgba(191, 219, 254, 0.9);
  border-radius: 999px;
  background: rgba(239, 246, 255, 0.9);
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.sidebar__footer-btn.is-ghost {
  border-color: rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.9);
  color: #64748b;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@media (max-width: 1024px) {
  .sidebar-shell__overlay {
    display: block;
  }

  .sidebar {
    position: fixed;
    inset: 16px auto 16px 16px;
    z-index: 31;
    width: min(320px, calc(100vw - 32px));
    min-height: calc(100vh - 32px);
    transform: translateX(-110%);
    transition: transform 0.22s ease;
  }

  .sidebar.is-open {
    transform: translateX(0);
  }
}

@media (min-width: 1025px) {
  .sidebar-shell__overlay {
    display: none;
  }

  .sidebar {
    position: sticky;
    transform: none !important;
  }
}
</style>
