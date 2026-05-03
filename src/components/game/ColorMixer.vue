<script setup>
import { computed } from 'vue'
import { rgbToCss, calcAccuracy } from '@/composables/useColorMath.js'
import { useGameStore } from '@/stores/gameStore.js'

const game = useGameStore()

const props = defineProps({
  color: { type: Object, required: true }, // { r, g, b }
})

const cssColor  = computed(() => rgbToCss(props.color))
const accuracy  = computed(() => calcAccuracy(game.targetColor, props.color))

// Rahmenfarbe je nach Genauigkeit
const borderColor = computed(() => {
  if (accuracy.value >= 90) return '#ffd700'
  if (accuracy.value >= 75) return '#c0c0c0'
  if (accuracy.value >= 55) return '#cd7f32'
  return 'rgba(255,255,255,0.1)'
})
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="text-white/50 text-xs tracking-widest uppercase">Dein Mix</div>
    <div
      class="w-40 h-40 rounded-3xl shadow-2xl transition-all duration-150 border-4"
      :style="{ background: cssColor, borderColor: borderColor }"
    />

  </div>
</template>
