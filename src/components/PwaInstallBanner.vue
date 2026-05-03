<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const isIos = ref(false)
let deferredPrompt = null

const DISMISSED_KEY = 'pwa-banner-dismissed-v2'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

function detectIos() {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) && !window.MSStream
}

function onBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt = e
  if (!localStorage.getItem(DISMISSED_KEY)) {
    show.value = true
  }
}

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  show.value = false
  localStorage.setItem(DISMISSED_KEY, '1')
}

function dismiss() {
  show.value = false
  localStorage.setItem(DISMISSED_KEY, '1')
}

onMounted(() => {
  if (isStandalone()) return
  if (localStorage.getItem(DISMISSED_KEY)) return

  if (detectIos()) {
    isIos.value = true
    // Kurze Verzögerung damit der erste Eindruck nicht gestört wird
    setTimeout(() => { show.value = true }, 3000)
  } else {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-0 left-0 right-0 z-50 flex items-start gap-3 px-5 py-4 shadow-2xl"
      style="background: #16213e; border-top: 1px solid rgba(255,255,255,0.1);"
    >
      <div class="text-2xl mt-0.5">📲</div>

      <!-- iOS: manuelle Anleitung -->
      <div v-if="isIos" class="flex-1 min-w-0">
        <p class="font-semibold text-white text-sm leading-tight">Kolr zum Homescreen</p>
        <p class="text-xs mt-1 leading-relaxed" style="color: rgba(255,255,255,0.6);">
          Tippe auf <span class="font-bold text-white">Teilen</span> <span style="font-size:1.1em;">⎙</span>
          → <span class="font-bold text-white">Zum Home-Bildschirm</span>
        </p>
      </div>

      <!-- Android / Chrome: nativer Prompt -->
      <div v-else class="flex-1 min-w-0">
        <p class="font-semibold text-white text-sm leading-tight">Kolr installieren</p>
        <p class="text-xs mt-0.5" style="color: rgba(255,255,255,0.55);">Spiele offline, direkt vom Homescreen</p>
      </div>

      <button
        v-if="!isIos"
        @click="install"
        class="shrink-0 px-4 py-2 rounded-xl text-sm font-bold"
        style="background: #7c3aed; color: white;"
      >
        Installieren
      </button>
      <button
        @click="dismiss"
        class="shrink-0 text-lg leading-none pt-0.5"
        style="color: rgba(255,255,255,0.4);"
        aria-label="Schliessen"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
