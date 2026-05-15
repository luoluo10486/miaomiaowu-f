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
const providerEntries = computed(() => Object.entries(settings.value?.ai?.providers || {}));
const modelGroups = computed(() => [
  { label: "Chat", data: settings.value?.ai?.chat || {}, tone: "indigo" },
  { label: "Embedding", data: settings.value?.ai?.embedding || {}, tone: "cyan" },
  { label: "Rerank", data: settings.value?.ai?.rerank || {}, tone: "emerald" }
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
      <template #actions>
        <button class="admin-button" type="button" :disabled="loading" @click="loadSettings">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </template>
    </PageHeader>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <div class="admin-stat-grid">
      <StatCard v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :tone="stat.tone" />
    </div>

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
