<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: ""
  },
  src: {
    type: String,
    default: ""
  },
  alt: {
    type: String,
    default: ""
  }
});

const hasImageError = ref(false);

watch(
  () => props.src,
  () => {
    hasImageError.value = false;
  }
);

const fallback = computed(() => {
  const text = String(props.name || props.alt || "U").trim();
  return text ? text.charAt(0).toUpperCase() : "U";
});

const showImage = computed(() => Boolean(props.src && !hasImageError.value));
</script>

<template>
  <div class="avatar">
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || name || 'Avatar'"
      class="avatar__image"
      @error="hasImageError = true"
    />
    <span v-else class="avatar__fallback">{{ fallback }}</span>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  color: #2563eb;
  font-weight: 700;
}

.avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__fallback {
  font-size: 0.95em;
  line-height: 1;
}
</style>
