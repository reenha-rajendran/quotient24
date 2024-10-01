<template>
  <div class="flex flex-col min-h-screen font-NotoSerif bg-white">
    <div class="flex flex-col min-h-screen">
      <RouterView v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AppFooter from "@/components/AppFooter.vue";
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
