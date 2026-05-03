<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'

const game   = useGameStore()
const player = usePlayerStore()
const router = useRouter()

const progressPct = computed(() => (game.currentRound / game.totalRounds) * 100)
</script>

<template>
  <div class="flex items-center justify-between px-5 pb-2 safe-top">
    <!-- Zurück -->
    <button @click="router.push('/')" class="-ml-2 p-2 text-white/40 text-3xl hover:text-white/70 transition-colors leading-none">
      ‹
    </button>

    <!-- Runden-Info -->
    <div class="text-center">
      <div class="text-white font-bold text-sm">
        <span v-if="game.currentMode === 'timeAttack'">
          <span :style="{ color: game.timeLeft <= 15 ? '#ff4444' : 'white' }" class="font-mono font-black">{{ game.timeLeft }}s</span>
          <span class="text-white/30 text-xs font-normal"> / {{ game.currentLevel?.timeLimit }}s</span>
          <span class="text-white/50 text-xs font-normal"> · R {{ game.currentRound }}/{{ game.totalRounds }}</span>
        </span>
        <span v-else>Runde {{ game.currentRound }} / {{ game.totalRounds }}</span>
      </div>
      <!-- Fortschrittsbalken -->
      <div class="w-32 h-1 rounded-full mt-1 overflow-hidden" style="background: rgba(255,255,255,0.1);">
        <div
          class="h-full rounded-full transition-all duration-500"
          style="background: #e94560;"
          :style="{ width: progressPct + '%' }"
        />
      </div>
    </div>

    <!-- Punkte & Leben -->
    <div class="text-right">
      <div class="text-white font-black text-base">{{ game.totalScore }}</div>
      <div v-if="game.currentMode === 'survival'" class="flex gap-0.5 justify-end">
        <AppIcon v-for="i in game.lives" :key="i" name="heart" :size="13" style="color: #ff6666;" />
      </div>
      <div v-else class="text-white/40 text-xs">{{ player.name }}</div>
    </div>
  </div>
</template>
