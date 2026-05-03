<script setup>
import { computed } from 'vue'
import { rgbToCss } from '@/composables/useColorMath.js'

const props = defineProps({
  color: { type: Object, required: true }, // { r, g, b }
})

const cssColor = computed(() => rgbToCss(props.color))
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="text-white/50 text-xs tracking-widest uppercase">Zielfarbe</div>
    <div
      class="w-40 h-40 rounded-3xl shadow-2xl transition-colors duration-300"
      :style="{ background: cssColor }"
    />

  </div>
</template>
