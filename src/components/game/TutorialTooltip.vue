<script setup>
defineProps({
  text: { type: String, required: true },
  arrow: { type: String, default: 'top' }, // top | bottom
})
const emit = defineEmits(['dismiss'])
</script>

<template>
  <Transition name="tooltip-pop">
    <div class="flex flex-col items-center gap-1 pointer-events-auto" @click="emit('dismiss')">
      <!-- Arrow oben -->
      <div
        v-if="arrow === 'top'"
        class="w-0 h-0"
        style="border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 8px solid #e94560;"
      />
      <div
        class="px-4 py-3 rounded-2xl text-sm font-semibold text-white flex items-center gap-2 max-w-xs text-center shadow-xl"
        style="background: #e94560; border: 1px solid rgba(255,255,255,0.15);"
      >
        <span>{{ text }}</span>
        <span class="text-white/60 text-xs shrink-0">Tippe zum Schliessen</span>
      </div>
      <!-- Arrow unten -->
      <div
        v-if="arrow === 'bottom'"
        class="w-0 h-0"
        style="border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #e94560;"
      />
    </div>
  </Transition>
</template>

<style scoped>
.tooltip-pop-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.tooltip-pop-leave-active { transition: opacity 0.15s ease; }
.tooltip-pop-enter-from { opacity: 0; transform: scale(0.9); }
.tooltip-pop-leave-to   { opacity: 0; }
</style>
