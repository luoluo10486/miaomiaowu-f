<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "../../components/admin/PageHeader.vue";
import StatCard from "../../components/admin/StatCard.vue";
import { getSystemSettings } from "../../services/settingsService";
import { normalizeBooleanLabel } from "./adminShared";

const loading = ref(false);
const errorText = ref("");
const settings = ref(null);

const ragDefaults = computed(() => settings.value?.rag?.default || {});
const queryRewrite = computed(() => settings.value?.rag?.queryRewrite || {});
const rateLimit = computed(() => settings.value?.rag?.rateLimit?.global || {});
const memory = computed(() => settings.value?.rag?.memory || {});
const selection = computed(() => settings.value?.ai?.selection || {});
const stream = computed(() => settings.value?.ai?.stream || {});
const providerEntries = computed(() => Object.entries(settings.value?.ai?.providers || {}));
const providerCount = computed(() => providerEntries.value.length);
const modelCountLabel = computed(() => {
  const chat = settings.value?.ai?.chat?.defaultModel || "--";
  const embedding = settings.value?.ai?.embedding?.defaultModel || "--";
  const rerank = settings.value?.ai?.rerank?.defaultModel || "--";
  return `${chat} / ${embedding} / ${rerank}`;
});
const modelCoverageLabel = computed(() => {
  const chat = Array.isArray(settings.value?.ai?.chat?.candidates) ? settings.value.ai.chat.candidates.length : 0;
  const embedding = Array.isArray(settings.value?.ai?.embedding?.candidates) ? settings.value.ai.embedding.candidates.length : 0;
  const rerank = Array.isArray(settings.value?.ai?.rerank?.candidates) ? settings.value.ai.rerank.candidates.length : 0;
  return `${chat} / ${embedding} / ${rerank}`;
});
const modelGroups = computed(() => [
  { label: "Chat", data: settings.value?.ai?.chat || {}, tone: "indigo" },
  { label: "Embedding", data: settings.value?.ai?.embedding || {}, tone: "cyan" },
  { label: "Rerank", data: settings.value?.ai?.rerank || {}, tone: "emerald" }
]);
const strategyOverview = computed(() => [
  {
    label: "Failure Threshold",
    value: selection.value.failureThreshold ?? "--",
    hint: "模型切换触发阈值"
  },
  {
    label: "Open Duration",
    value: selection.value.openDurationMs ?? "--",
    hint: "熔断窗口毫秒数"
  },
  {
    label: "Stream Chunk",
    value: stream.value.messageChunkSize ?? "--",
    hint: "流式输出分片大小"
  }
]);

const stats = computed(() => [
  {
    title: "Collection",
    value: ragDefaults.value.collectionName || "--",
    hint: "RAG 默认集合",
    tone: "indigo"
  },
  {
    title: "Rewrite",
    value: normalizeBooleanLabel(queryRewrite.value.enabled),
    hint: "查询改写开关",
    tone: "cyan"
  },
  {
    title: "Rate Limit",
    value: normalizeBooleanLabel(rateLimit.value.enabled),
    hint: "全局限流开关",
    tone: "emerald"
  },
  {
    title: "Memory",
    value: normalizeBooleanLabel(memory.value.summaryEnabled),
    hint: "记忆摘要开关",
    tone: "amber"
  }
]);

async function loadSettings() {
  loading.value = true;
  errorText.value = "";
  try {
    settings.value = await getSystemSettings();
  } catch (error) {
    errorText.value = error?.message || "加载系统设置失败。";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadSettings();
});
</script>

<template>
  <section class="admin-page">
    <PageHeader
      tag="Settings"
      title="系统设置"
      description="只读查看当前应用配置，便于排查模型、限流和记忆策略的运行状态。"
    >
      <template #meta>
        <div class="admin-header-meta">
          <span class="admin-badge is-muted">Collection：{{ ragDefaults.collectionName || "--" }}</span>
          <span class="admin-badge is-muted">Provider：{{ providerCount }}</span>
          <span class="admin-badge is-muted">模型：{{ modelCountLabel }}</span>
        </div>
      </template>
      <template #actions>
        <button class="admin-button" type="button" :disabled="loading" @click="loadSettings">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :tone="stat.tone"
      />
    </div>

    <section class="admin-detail-card settings-hero">
      <div class="settings-hero-copy">
        <p class="trace-hero-tag">System Control</p>
        <h2>配置总览与模型基线</h2>
        <p>集中查看 RAG 默认值、查询改写、限流、记忆策略和模型提供方信息。</p>
      </div>
      <div class="settings-hero-side">
        <div class="settings-hero-cardline">
          <span class="settings-hero-cardlabel">Collection</span>
          <strong>{{ ragDefaults.collectionName || "--" }}</strong>
        </div>
        <div class="settings-hero-cardline">
          <span class="settings-hero-cardlabel">Providers</span>
          <strong>{{ providerCount }}</strong>
        </div>
        <div class="settings-hero-cardline">
          <span class="settings-hero-cardlabel">Chat / Embedding / Rerank</span>
          <strong>{{ modelCountLabel }}</strong>
        </div>
        <div class="settings-hero-cardline">
          <span class="settings-hero-cardlabel">Candidates</span>
          <strong>{{ modelCoverageLabel }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-split">
      <article class="admin-table-card">
        <div class="admin-table-card__header">
          <div>
            <h2>核心配置</h2>
            <p>RAG 默认参数、查询改写、限流和记忆策略。</p>
          </div>
          <span class="admin-page-count">{{ loading ? "加载中" : "已加载" }}</span>
        </div>

        <div class="admin-card-list">
          <div class="admin-card-item">
            <h3>RAG 默认配置</h3>
            <div class="admin-kv">
              <div><dt>Collection</dt><dd>{{ ragDefaults.collectionName || "--" }}</dd></div>
              <div><dt>Dimension</dt><dd>{{ ragDefaults.dimension ?? "--" }}</dd></div>
              <div><dt>Metric</dt><dd>{{ ragDefaults.metricType || "--" }}</dd></div>
            </div>
          </div>

          <div class="admin-card-item">
            <h3>查询改写</h3>
            <div class="admin-kv">
              <div><dt>Enabled</dt><dd>{{ normalizeBooleanLabel(queryRewrite.enabled) }}</dd></div>
              <div><dt>Max History Messages</dt><dd>{{ queryRewrite.maxHistoryMessages ?? "--" }}</dd></div>
              <div><dt>Max History Chars</dt><dd>{{ queryRewrite.maxHistoryChars ?? "--" }}</dd></div>
            </div>
          </div>

          <div class="admin-card-item">
            <h3>全局限流</h3>
            <div class="admin-kv">
              <div><dt>Enabled</dt><dd>{{ normalizeBooleanLabel(rateLimit.enabled) }}</dd></div>
              <div><dt>Max Concurrent</dt><dd>{{ rateLimit.maxConcurrent ?? "--" }}</dd></div>
              <div><dt>Max Wait Seconds</dt><dd>{{ rateLimit.maxWaitSeconds ?? "--" }}</dd></div>
              <div><dt>Lease Seconds</dt><dd>{{ rateLimit.leaseSeconds ?? "--" }}</dd></div>
              <div><dt>Poll Interval (ms)</dt><dd>{{ rateLimit.pollIntervalMs ?? "--" }}</dd></div>
            </div>
          </div>

          <div class="admin-card-item">
            <h3>记忆管理</h3>
            <div class="admin-kv">
              <div><dt>History Keep Turns</dt><dd>{{ memory.historyKeepTurns ?? "--" }}</dd></div>
              <div><dt>Summary Start Turns</dt><dd>{{ memory.summaryStartTurns ?? "--" }}</dd></div>
              <div><dt>Summary Enabled</dt><dd>{{ normalizeBooleanLabel(memory.summaryEnabled) }}</dd></div>
              <div><dt>TTL Minutes</dt><dd>{{ memory.ttlMinutes ?? "--" }}</dd></div>
              <div><dt>Summary Max Chars</dt><dd>{{ memory.summaryMaxChars ?? "--" }}</dd></div>
              <div><dt>Title Max Length</dt><dd>{{ memory.titleMaxLength ?? "--" }}</dd></div>
            </div>
          </div>
        </div>
      </article>

      <aside class="admin-dashboard-aside">
        <article class="admin-detail-card">
          <h3>模型策略</h3>
          <p class="admin-detail-card-desc">对照前端参考页的“选择策略”和“流式响应”分区，便于快速排查模型路由。</p>
          <div class="admin-card-list">
            <div v-for="item in strategyOverview" :key="item.label" class="admin-card-item">
              <h3>{{ item.label }}</h3>
              <p class="admin-badge is-muted">{{ item.value }}</p>
              <p class="admin-list-meta">{{ item.hint }}</p>
            </div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>AI Provider</h3>
          <p class="admin-detail-card-desc">当前提供商和端点信息。</p>
          <div v-if="providerEntries.length === 0" class="admin-empty-sm">暂无 provider 配置</div>
          <div v-else class="admin-card-list">
            <div v-for="[name, provider] in providerEntries" :key="name" class="admin-card-item">
              <h3>{{ name }}</h3>
              <p class="is-code">{{ provider?.url || "--" }}</p>
              <p v-if="provider?.endpoints && Object.keys(provider.endpoints).length > 0">
                {{ Object.entries(provider.endpoints).map(([key, val]) => `${key}: ${val}`).join(" | ") }}
              </p>
              <p v-else>--</p>
            </div>
          </div>
        </article>

        <article class="admin-detail-card">
          <h3>模型分组</h3>
          <p class="admin-detail-card-desc">Chat、Embedding 和 Rerank 的默认模型信息。</p>
          <div class="admin-card-list">
            <div v-for="group in modelGroups" :key="group.label" class="admin-card-item">
              <h3>{{ group.label }}</h3>
              <p class="admin-badge" :class="`is-${group.tone}`">{{ group.data?.defaultModel || "--" }}</p>
              <p v-if="group.data?.deepThinkingModel" class="admin-list-meta">
                Deep Thinking: {{ group.data.deepThinkingModel }}
              </p>
              <div v-if="Array.isArray(group.data?.candidates) && group.data.candidates.length > 0" class="admin-list-meta">
                <div v-for="item in group.data.candidates" :key="item.id" class="admin-table-small-row">
                  {{ item.provider }} / {{ item.model }} / P{{ item.priority }}
                </div>
              </div>
              <p v-else class="admin-list-meta">暂无候选模型</p>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </section>
</template>

<style scoped>
.admin-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.settings-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.settings-hero-copy {
  display: grid;
  gap: 8px;
}

.settings-hero-copy h2 {
  margin: 0;
  font-size: 24px;
}

.settings-hero-copy p,
.settings-hero-side p {
  margin: 0;
  color: var(--admin-ink-soft);
  line-height: 1.7;
}

.settings-hero-side {
  display: grid;
  gap: 12px;
  min-width: 280px;
  padding: 14px;
  border: 1px solid var(--admin-line);
  border-radius: var(--admin-radius-lg);
  background: rgba(255, 255, 255, 0.76);
}

.settings-hero-cardline {
  display: grid;
  gap: 4px;
}

.settings-hero-cardlabel {
  color: var(--admin-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.settings-hero-cardline strong {
  color: var(--admin-ink);
  font-size: 14px;
  word-break: break-word;
}

@media (max-width: 960px) {
  .settings-hero {
    flex-direction: column;
  }

  .settings-hero-side {
    min-width: 0;
  }
}
</style>
