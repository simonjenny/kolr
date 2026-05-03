<script setup>
/**
 * PaintPourInput – Level 1-5
 * Press & Hold auf R/G/B: Farbe fliesst kontinuierlich, loslassen stoppt.
 */
import { ref, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { clamp255 } from '@/composables/useColorMath.js'
import { gsap } from 'gsap'

const game  = useGameStore()

const channels = [
  { key: 'r', label: 'R', color: '#ff4444', glow: '0 0 20px rgba(255,68,68,0.6)' },
  { key: 'g', label: 'G', color: '#44ff44', glow: '0 0 20px rgba(68,255,68,0.6)' },
  { key: 'b', label: 'B', color: '#4444ff', glow: '0 0 20px rgba(68,68,255,0.6)' },
]

const pressing = ref({ r: false, g: false, b: false })
const intervals = {}
const FLOW_RATE = 8  // pro Tick (50ms) → ca. 160/s

const buttonRefs = ref({})

function startPour(ch) {
  if (pressing.value[ch]) return
  pressing.value[ch] = true

  // GSAP Pulse-Animation
  const el = buttonRefs.value[ch]
  if (el) gsap.to(el, { scale: 1.12, duration: 0.15, ease: 'power2.out' })

  intervals[ch] = setInterval(() => {
    const current = game.mixedColor[ch]
    if (current >= 255) return
    game.updateChannel(ch, clamp255(current + FLOW_RATE))
    // Kein Sound im Interval – war zu nervig
  }, 50)
}

function stopPour(ch) {
  if (!pressing.value[ch]) return
  pressing.value[ch] = false
  clearInterval(intervals[ch])

  const el = buttonRefs.value[ch]
  if (el) gsap.to(el, { scale: 1, duration: 0.2, ease: 'bounce.out' })
}

function resetChannel(ch) {
  game.updateChannel(ch, 0)
}

onUnmounted(() => {
  Object.values(intervals).forEach(clearInterval)
})
</script>

<template>
  <div class="flex flex-col gap-4 pb-6">
    <!-- Kanalwerte -->
    <div class="flex justify-center gap-6 text-sm font-mono">
      <span v-for="ch in channels" :key="ch.key" :style="{ color: ch.color }">
        {{ ch.label }}: {{ game.mixedColor[ch.key] }}
      </span>
    </div>

    <!-- Pour-Buttons -->
    <div class="flex justify-center gap-5">
      <div v-for="ch in channels" :key="ch.key" class="flex flex-col items-center gap-2">
        <!-- Pour-Button -->
        <button
          :ref="el => buttonRefs[ch.key] = el"
          @touchstart.prevent="startPour(ch.key)"
          @touchend.prevent="stopPour(ch.key)"
          @mousedown="startPour(ch.key)"
          @mouseup="stopPour(ch.key)"
          @mouseleave="stopPour(ch.key)"
          class="w-20 h-20 rounded-2xl font-black text-3xl text-white select-none transition-shadow duration-150 active:scale-110"
          :style="{
            background: ch.color,
            boxShadow: pressing[ch.key] ? ch.glow : 'none',
          }"
        >
          {{ ch.label }}
        </button>
        <!-- Mini Fortschrittsbalken -->
        <div class="w-20 h-2 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.1);">
          <div
            class="h-full rounded-full transition-all duration-75"
            :style="{ width: (game.mixedColor[ch.key] / 255 * 100) + '%', background: ch.color }"
          />
        </div>
        <!-- Reset-Tap -->
        <button
          @click="resetChannel(ch.key)"
          class="text-white/30 text-xs hover:text-white/60 transition-colors"
        >reset</button>
      </div>
    </div>

  </div>
</template>
