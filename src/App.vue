<script setup>
import { RouterView } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="route-fade" mode="out-in">
      <component v-if="route.meta.fullscreen" :is="Component" />
      <MainLayout v-else>
        <component :is="Component" />
      </MainLayout>
    </Transition>
  </RouterView>
</template>
