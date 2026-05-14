<script setup>
defineProps({
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
  formatTime: {
    type: Function,
    default: (value) => value || "刚刚"
  }
});

const emit = defineEmits(["update:search", "create", "select", "delete", "rename"]);

function updateSearch(event) {
  emit("update:search", event.target.value);
}
</script>

<template>
  <aside class="sidebar-card">
    <div class="sidebar-card__header">
      <div>
        <p class="sidebar-card__eyebrow">会话</p>
        <h2>聊天记录</h2>
      </div>
      <button class="new-chat-button" type="button" title="新建对话" @click="$emit('create')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>

    <div class="sidebar-search">
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

    <div v-if="loading" class="panel-state">
      <div class="state-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div v-else-if="groups.length === 0" class="panel-state panel-state--compact">
      暂无会话记录
    </div>

    <div v-else class="session-list">
      <section v-for="group in groups" :key="group.key" class="session-group">
        <div class="session-group__header">
          <h3>{{ group.label }}</h3>
          <span>{{ group.count ?? group.items?.length ?? 0 }}</span>
        </div>
        <ul>
          <li v-for="session in group.items" :key="session.id">
            <button
              type="button"
              :class="['session-item', { 'is-active': currentSessionId === session.id }]"
              @click="$emit('select', session)"
            >
              <span class="session-item__title">{{ session.title }}</span>
              <span class="session-item__time">{{ formatTime(session.lastTime) }}</span>
            </button>
            <button
              class="session-item__delete"
              type="button"
              title="删除会话"
              @click="$emit('delete', session.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <button
              class="session-item__edit"
              type="button"
              title="重命名会话"
              @click="$emit('rename', session)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20h16" />
                <path d="M5 15.5 15.5 5a2.1 2.1 0 0 1 3 3L8 18.5 4 20z" />
              </svg>
            </button>
          </li>
        </ul>
      </section>
    </div>

    <div class="sidebar-footer">
      <div class="user-pill">
        <span class="user-pill__avatar">{{ userInitial }}</span>
        <span class="user-pill__name">{{ currentUserName }}</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-card {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  padding: 16px;
}

.sidebar-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sidebar-card__eyebrow {
  margin: 0 0 2px;
  color: var(--text-muted);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar-card__header h2 {
  margin: 0;
  color: var(--text);
  font-family: var(--serif);
  font-size: 20px;
  letter-spacing: 0.04em;
}

.new-chat-button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-chat-button svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.new-chat-button:hover {
  color: var(--accent);
  background: rgba(107, 127, 90, 0.08);
}

.sidebar-search {
  position: relative;
  margin-bottom: 14px;
}

.sidebar-search svg {
  position: absolute;
  left: 12px;
  top: 50%;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--text-muted);
  stroke-width: 2;
  stroke-linecap: round;
  transform: translateY(-50%);
  pointer-events: none;
}

.sidebar-search input {
  width: 100%;
  height: 38px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 0 12px 0 34px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;
}

.sidebar-search input:focus {
  border-color: rgba(103, 83, 49, 0.3);
}

.sidebar-search input::placeholder {
  color: var(--text-muted);
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 80px;
  color: var(--text-muted);
  font-size: 13px;
}

.panel-state--compact {
  min-height: 100px;
}

.state-dots {
  display: flex;
  gap: 6px;
}

.state-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.state-dots span:nth-child(2) {
  animation-delay: 0.15s;
}

.state-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

.session-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 111, 61, 0.2) transparent;
}

.session-list::-webkit-scrollbar {
  width: 4px;
}

.session-list::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(139, 111, 61, 0.2);
}

.session-group + .session-group {
  margin-top: 16px;
}

.session-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.session-group__header h3 {
  margin: 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.session-group__header span {
  color: var(--text-muted);
  font-size: 11px;
}

.session-group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.session-group li {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 6px;
  align-items: center;
}

.session-item {
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.session-item:hover {
  border-color: rgba(107, 127, 90, 0.14);
  background: rgba(107, 127, 90, 0.05);
}

.session-item.is-active {
  border-color: rgba(107, 127, 90, 0.25);
  background: rgba(107, 127, 90, 0.08);
}

.session-item__title {
  overflow: hidden;
  color: var(--text);
  font-size: 13px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-item__time {
  color: var(--text-muted);
  font-size: 11px;
}

.session-item__delete,
.session-item__edit {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
}

.session-item__delete:hover,
.session-item__edit:hover {
  border-color: rgba(107, 127, 90, 0.12);
  background: rgba(107, 127, 90, 0.06);
  color: var(--accent);
}

.session-item__delete svg,
.session-item__edit svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sidebar-footer {
  padding-top: 14px;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: rgba(255, 252, 246, 0.45);
}

.user-pill__avatar {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7f5a, #8b9f72);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

.user-pill__name {
  color: var(--text);
  font-size: 13px;
  font-weight: 500;
}

@keyframes dotPulse {
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
</style>
