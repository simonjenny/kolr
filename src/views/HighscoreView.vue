<script setup>
import { useRouter } from 'vue-router'
import { useHighscoreStore } from '@/stores/highscoreStore.js'
import { rgbToCss } from '@/composables/useColorMath.js'
import AppIcon from '@/components/AppIcon.vue'

const router    = useRouter()
const highscore = useHighscoreStore()

const modes = [
  { id: 'classic',    label: 'Classic',        icon: 'palette'  },
  { id: 'timeAttack', label: 'Time Attack',     icon: 'bolt'     },
  { id: 'survival',   label: 'Survival',        icon: 'heart'    },
  { id: 'daily',      label: 'Daily Challenge', icon: 'calendar' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col min-h-screen px-6 pb-10 safe-top gap-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="router.push('/')" class="-ml-2 p-2 text-white/40 text-3xl hover:text-white/70 transition-colors leading-none">‹</button>
      <h2 class="text-2xl font-black text-white">Highscores</h2>
    </div>

    <!-- Pro Modus -->
    <div v-for="mode in modes" :key="mode.id" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 px-1">
        <AppIcon :name="mode.icon" :size="14" class="text-white/40" />
        <span class="text-white/50 text-xs tracking-widest uppercase">{{ mode.label }}</span>
      </div>

      <!-- Keine Einträge -->
      <div
        v-if="!highscore.getScores(mode.id).length"
        class="px-4 py-3 rounded-xl text-white/20 text-sm text-center"
        style="background: rgba(255,255,255,0.03);"
      >
        Noch keine Einträge
      </div>

      <!-- Einträge -->
      <div v-else class="flex flex-col gap-1">
        <div
          v-for="(entry, i) in highscore.getScores(mode.id)"
          :key="i"
          class="flex items-center gap-3 px-4 py-3 rounded-xl"
          :style="{ background: i === 0 ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.04)' }"
        >
          <!-- Rang -->
          <span class="w-5 text-center font-black text-sm" :style="{ color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'rgba(255,255,255,0.2)' }">
            {{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 }}
          </span>
          <!-- Name -->
          <span class="flex-1 text-white text-sm font-bold truncate">{{ entry.playerName || '–' }}</span>
          <!-- Genauigkeit -->
          <span class="text-white/40 text-xs">{{ entry.accuracy }}%</span>
          <!-- Datum -->
          <span class="text-white/25 text-xs">{{ formatDate(entry.date) }}</span>
          <!-- Score -->
          <span class="font-mono font-black text-sm ml-1" :style="{ color: i === 0 ? '#ffd700' : 'rgba(255,255,255,0.7)' }">
            {{ entry.score }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
