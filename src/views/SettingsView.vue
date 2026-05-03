<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audioStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import AppIcon from '@/components/AppIcon.vue'

const router  = useRouter()
const audio   = useAudioStore()
const player  = usePlayerStore()

const nameInput = ref(player.name)
const saved     = ref(false)

function saveName() {
  if (nameInput.value.trim()) {
    player.setName(nameInput.value)
    saved.value = true
    setTimeout(() => { saved.value = false }, 1500)
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen px-6 pb-10 safe-top gap-8">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="router.push('/')" class="-ml-2 p-2 text-white/40 text-3xl hover:text-white/70 transition-colors leading-none">‹</button>
      <h2 class="text-2xl font-black text-white">Einstellungen</h2>
    </div>

    <!-- Name -->
    <div class="flex flex-col gap-3">
      <div class="text-white/40 text-xs tracking-widest uppercase px-1">Spielername</div>
      <div class="flex gap-2">
        <input
          v-model="nameInput"
          @keyup.enter="saveName"
          type="text"
          maxlength="20"
          placeholder="Dein Name..."
          class="flex-1 px-4 py-3 rounded-2xl font-bold text-white placeholder-white/20 outline-none border-2 focus:border-[#e94560] transition-colors"
          style="background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15);"
        />
        <button
          @click="saveName"
          :disabled="!nameInput.trim()"
          class="px-5 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-30"
          :style="{ background: saved ? '#22c55e' : '#e94560' }"
        >
          {{ saved ? '✓' : 'OK' }}
        </button>
      </div>
    </div>

    <!-- Sound -->
    <div class="flex flex-col gap-3">
      <div class="text-white/40 text-xs tracking-widest uppercase px-1">Sound</div>
      <button
        @click="audio.toggle()"
        class="flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left"
        style="border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);"
      >
        <div class="flex items-center gap-3">
          <AppIcon :name="audio.enabled ? 'volume' : 'volume-x'" :size="22" class="text-white/70 shrink-0" />
          <div>
            <div class="font-bold text-white text-base">Sound</div>
            <div class="text-white/50 text-xs">Spielgeräusche & Feedback</div>
          </div>
        </div>
        <!-- Toggle-Pill -->
        <div
          class="w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0"
          :style="{ background: audio.enabled ? '#e94560' : 'rgba(255,255,255,0.15)' }"
        >
          <div
            class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
            :style="{ left: audio.enabled ? '28px' : '4px' }"
          />
        </div>
      </button>
    </div>
  </div>
</template>
