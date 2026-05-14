<script setup>
import { computed, onMounted, ref } from "vue";
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
  { label: "Chat", data: settings.value?.ai?.chat || {} },
  { label: "Embedding", data: settings.value?.ai?.embedding || {} },
  { label: "Rerank", data: settings.value?.ai?.rerank || {} }
]);

async function loadSettings() {
  loading.value = true;
  errorText.value = "";
  try {
    settings.value = await getSystemSettings();
  } catch (error) {
    errorText.value = error?.message || "加载 settings 失败，请稍后重试。";
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
    <header class="admin-page-header">
      <div>
        <span class="admin-page-eyebrow">Settings</span>
        <h2 class="admin-page-title">系统配置</h2>
        <p class="admin-page-subtitle">只读展示当前 application 配置</p>
      </div>
      <div class="admin-page-actions">
        <button class="admin-button" type="button" :disabled="loading" @click="loadSettings">
          {{ loading ? "刷新中..." : "刷新" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <article class="admin-panel">
      <h3>RAG 默认配置</h3>
      <p class="admin-detail-card-desc">向量空间与检索基础参数</p>
      <div class="admin-info-grid is-3">
        <div class="admin-info-item">
          <span class="admin-info-item-label">Collection</span>
          <span class="admin-info-item-value">{{ ragDefaults.collectionName || "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Dimension</span>
          <span class="admin-info-item-value">{{ ragDefaults.dimension ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Metric Type</span>
          <span class="admin-info-item-value">{{ ragDefaults.metricType || "--" }}</span>
        </div>
      </div>
    </article>

    <article class="admin-panel">
      <h3>查询改写</h3>
      <p class="admin-detail-card-desc">历史上下文压缩与改写策略</p>
      <div class="admin-info-grid is-3">
        <div class="admin-info-item">
          <span class="admin-info-item-label">Enabled</span>
          <span class="admin-info-item-value">
            <span :class="['admin-badge', queryRewrite.enabled ? 'is-success' : 'is-muted']">
              {{ normalizeBooleanLabel(queryRewrite.enabled) }}
            </span>
          </span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Max History Messages</span>
          <span class="admin-info-item-value">{{ queryRewrite.maxHistoryMessages ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Max History Chars</span>
          <span class="admin-info-item-value">{{ queryRewrite.maxHistoryChars ?? "--" }}</span>
        </div>
      </div>
    </article>

    <article class="admin-panel">
      <h3>全局限流</h3>
      <p class="admin-detail-card-desc">并发与租约控制</p>
      <div class="admin-info-grid is-3">
        <div class="admin-info-item">
          <span class="admin-info-item-label">Enabled</span>
          <span class="admin-info-item-value">
            <span :class="['admin-badge', rateLimit.enabled ? 'is-success' : 'is-muted']">
              {{ normalizeBooleanLabel(rateLimit.enabled) }}
            </span>
          </span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Max Concurrent</span>
          <span class="admin-info-item-value">{{ rateLimit.maxConcurrent ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Max Wait Seconds</span>
          <span class="admin-info-item-value">{{ rateLimit.maxWaitSeconds ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Lease Seconds</span>
          <span class="admin-info-item-value">{{ rateLimit.leaseSeconds ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Poll Interval (ms)</span>
          <span class="admin-info-item-value">{{ rateLimit.pollIntervalMs ?? "--" }}</span>
        </div>
      </div>
    </article>

    <article class="admin-panel">
      <h3>记忆管理</h3>
      <p class="admin-detail-card-desc">摘要与上下文保留策略</p>
      <div class="admin-info-grid is-3">
        <div class="admin-info-item">
          <span class="admin-info-item-label">History Keep Turns</span>
          <span class="admin-info-item-value">{{ memory.historyKeepTurns ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Summary Start Turns</span>
          <span class="admin-info-item-value">{{ memory.summaryStartTurns ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Summary Enabled</span>
          <span class="admin-info-item-value">
            <span :class="['admin-badge', memory.summaryEnabled ? 'is-success' : 'is-muted']">
              {{ normalizeBooleanLabel(memory.summaryEnabled) }}
            </span>
          </span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">TTL Minutes</span>
          <span class="admin-info-item-value">{{ memory.ttlMinutes ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Summary Max Chars</span>
          <span class="admin-info-item-value">{{ memory.summaryMaxChars ?? "--" }}</span>
        </div>
        <div class="admin-info-item">
          <span class="admin-info-item-label">Title Max Length</span>
          <span class="admin-info-item-value">{{ memory.titleMaxLength ?? "--" }}</span>
        </div>
      </div>
    </article>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <h3>模型服务提供方</h3>
        </div>
        <div class="admin-page-count">{{ providerEntries.length }} provider(s)</div>
      </div>
      <p class="admin-detail-card-desc">接入地址与端点配置</p>

      <div v-if="providerEntries.length === 0" class="admin-empty">暂无 provider 配置</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>URL</th>
              <th>Endpoints</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[name, provider] in providerEntries" :key="name">
              <td>{{ name }}</td>
              <td class="is-code">{{ provider?.url || "--" }}</td>
              <td>
                <div v-for="(val, key) in (provider?.endpoints || {})" :key="key" class="is-code" style="font-size: 11px;">
                  {{ key }}: {{ val }}
                </div>
                <span v-if="!Object.keys(provider?.endpoints || {}).length">--</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <article v-for="group in modelGroups" :key="group.label" class="admin-panel">
      <h3>{{ group.label }} 模型配置</h3>
      <p class="admin-detail-card-desc">默认模型与候选列表</p>
      <div class="admin-info-grid is-2" style="margin-bottom: 16px;">
        <div class="admin-info-item">
          <span class="admin-info-item-label">Default Model</span>
          <span class="admin-info-item-value">{{ group.data?.defaultModel || "--" }}</span>
        </div>
        <div v-if="group.data?.deepThinkingModel" class="admin-info-item">
          <span class="admin-info-item-label">Deep Thinking Model</span>
          <span class="admin-info-item-value">{{ group.data?.deepThinkingModel || "--" }}</span>
        </div>
      </div>

      <div v-if="Array.isArray(group.data?.candidates) && group.data.candidates.length > 0" class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Model</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in group.data.candidates" :key="item.id">
              <td class="is-code">{{ item.id }}</td>
              <td>{{ item.provider }}</td>
              <td>{{ item.model }}</td>
              <td>{{ item.priority }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="admin-empty">暂无候选模型</div>
    </article>
  </section>
</template>
