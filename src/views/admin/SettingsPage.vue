<script setup>
import { computed, onMounted, ref } from "vue";
import { getSystemSettings } from "../../services/adminService";

const loading = ref(false);
const errorText = ref("");
const settings = ref(null);

const providerEntries = computed(() => Object.entries(settings.value?.ai?.providers || {}));
const modelGroups = computed(() => [
  ["Chat", settings.value?.ai?.chat],
  ["Embedding", settings.value?.ai?.embedding],
  ["Rerank", settings.value?.ai?.rerank]
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
        <h2 class="admin-page-title">系统设置</h2>
        <p class="admin-page-subtitle">对齐参考前端的配置查看入口，覆盖上传限制、RAG 默认项和 AI provider / model 选择。</p>
      </div>

      <div class="admin-page-actions">
        <button class="admin-button" type="button" :disabled="loading" @click="loadSettings">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>
    </header>

    <p v-if="errorText" class="admin-notice is-error">{{ errorText }}</p>

    <section class="admin-grid-3">
      <article class="admin-detail-card">
        <h3>Upload</h3>
        <dl class="admin-kv">
          <div>
            <dt>Max File Size</dt>
            <dd>{{ settings?.upload?.maxFileSize ?? "--" }}</dd>
          </div>
          <div>
            <dt>Max Request Size</dt>
            <dd>{{ settings?.upload?.maxRequestSize ?? "--" }}</dd>
          </div>
        </dl>
      </article>

      <article class="admin-detail-card">
        <h3>RAG Defaults</h3>
        <dl class="admin-kv">
          <div>
            <dt>Collection</dt>
            <dd>{{ settings?.rag?.default?.collectionName || "--" }}</dd>
          </div>
          <div>
            <dt>Dimension</dt>
            <dd>{{ settings?.rag?.default?.dimension ?? "--" }}</dd>
          </div>
          <div>
            <dt>Metric</dt>
            <dd>{{ settings?.rag?.default?.metricType || "--" }}</dd>
          </div>
        </dl>
      </article>

      <article class="admin-detail-card">
        <h3>Memory / Rewrite</h3>
        <dl class="admin-kv">
          <div>
            <dt>Rewrite</dt>
            <dd>{{ settings?.rag?.queryRewrite?.enabled ? "Enabled" : "Disabled" }}</dd>
          </div>
          <div>
            <dt>Summary</dt>
            <dd>{{ settings?.rag?.memory?.summaryEnabled ? "Enabled" : "Disabled" }}</dd>
          </div>
          <div>
            <dt>History Turns</dt>
            <dd>{{ settings?.rag?.memory?.historyKeepTurns ?? "--" }}</dd>
          </div>
        </dl>
      </article>
    </section>

    <section class="admin-grid-3">
      <article v-for="[label, group] in modelGroups" :key="label" class="admin-detail-card">
        <h3>{{ label }} Models</h3>
        <dl class="admin-kv">
          <div>
            <dt>Default</dt>
            <dd>{{ group?.defaultModel || "--" }}</dd>
          </div>
          <div>
            <dt>Deep Thinking</dt>
            <dd>{{ group?.deepThinkingModel || "--" }}</dd>
          </div>
          <div>
            <dt>Candidates</dt>
            <dd>{{ Array.isArray(group?.candidates) ? group.candidates.length : 0 }}</dd>
          </div>
        </dl>
      </article>
    </section>

    <article class="admin-table-card">
      <div class="admin-toolbar">
        <div class="admin-toolbar-left">
          <h3>Providers</h3>
        </div>
        <div class="admin-page-count">{{ providerEntries.length }} provider(s)</div>
      </div>

      <div v-if="providerEntries.length === 0" class="admin-empty">暂无 provider 配置</div>
      <div v-else class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Endpoints</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[name, provider] in providerEntries" :key="name">
              <td>{{ name }}</td>
              <td class="is-code">{{ provider?.url || "--" }}</td>
              <td class="is-code">{{ Object.keys(provider?.endpoints || {}).join(", ") || "--" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>
