<script setup>
/**
 * BubbleInput – Level 6-12
 * Tap fügt +17 pro Tap (~6.7%) hinzu. Doppel-Tap leert Kanal.
 * Visuelles "Aufblasen" des Kreises mit GSAP.
 */
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { clamp255 } from '@/composables/useColorMath.js'
import { gsap } from 'gsap'

const game  = useGameStore()

const TAP_AMOUNT = 17  // ~6.7% pro Tap (15 Taps = 255)

const channels = [
  { key: 'r', label: 'R', color: '#ff4444', bg: 'rgba(255,68,68,0.15)'  },
  { key: 'g', label: 'G', color: '#44ff44', bg: 'rgba(68,255,68,0.15)'  },
  { key: 'b', label: 'B', color: '#4444ff', bg: 'rgba(68,68,255,0.15)'  },
]

const bubbleRefs = ref({})
const lastTap = { r: 0, g: 0, b: 0 }
const DOUBLE_TAP_MS = 300

function tap(ch) {
  const now = Date.now()
  const isDblTap = now - lastTap[ch] < DOUBLE_TAP_MS
  lastTap[ch] = now

  if (isDblTap) {
    game.updateChannel(ch, 0)
    const el = bubbleRefs.value[ch]
    if (el) {
      gsap.fromTo(el,
        { scale: 1.2, opacity: 0.5 },
        { scale: 1,   opacity: 1,   duration: 0.3, ease: 'elastic.out(1, 0.5)' }
      )
    }
    return
  }

  const newVal = clamp255(game.mixedColor[ch] + TAP_AMOUNT)
  game.updateChannel(ch, newVal)

  const el = bubbleRefs.value[ch]
  if (el) {
    gsap.fromTo(el,
      { scale: 1.15 },
      { scale: 1, duration: 0.25, ease: 'bounce.out' }
    )
  }
}

// Größe des Kreises proportional zum Wert
function bubbleSize(val) {
  const min = 64
  const max = 100
  return min + (val / 255) * (max - min)
}
</script>

<template>
  <div class="flex flex-col gap-6 pb-6 items-center">
    <!-- Hinweis -->
    <p class="text-white/40 text-xs text-center">Tippe zum Füllen · Doppel-Tap zum Leeren</p>

    <!-- Bubbles -->
    <div class="flex justify-center gap-8 items-end">
      <div v-for="ch in channels" :key="ch.key" class="flex flex-col items-center gap-3">
        <!-- Wert -->
        <span class="font-mono text-sm font-bold" :style="{ color: ch.color }">
          {{ game.mixedColor[ch.key] }}
        </span>

        <!-- Bubble -->
        <button
          :ref="el => bubbleRefs[ch.key] = el"
          @click="tap(ch.key)"
          class="rounded-full flex items-center justify-center font-black text-white text-2xl select-none border-4 transition-colors duration-150"
          :style="{
            width:  bubbleSize(game.mixedColor[ch.key]) + 'px',
            height: bubbleSize(game.mixedColor[ch.key]) + 'px',
            background: ch.bg,
            borderColor: ch.color,
          }"
        >
          {{ ch.label }}
        </button>
      </div>
    </div>

  </div>
</template>
