<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { prepareBgMusic, startBgMusic } from '@/stores/audioStore.js'
import PwaInstallBanner from '@/components/PwaInstallBanner.vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const route = useRoute()
const showBg = computed(() => !['game', 'result'].includes(route.name))

onMounted(() => {
  prepareBgMusic()
  // startBgMusic() direkt im pointerdown – kein Pinia-Wrapper, direkte User-Geste
  document.addEventListener('pointerdown', startBgMusic, { once: true })
})
</script>

<template>
  <div class="min-h-screen relative" style="background-color: #1a1a2e; color: white;">
    <AnimatedBackground v-if="showBg" />
    <div class="relative z-10">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
    <PwaInstallBanner />
  </div>
</template>
