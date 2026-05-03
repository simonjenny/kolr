<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'
import { rgbToCss } from '@/composables/useColorMath.js'
import { useAudioStore, sfxCheer, sfxGold, sfxSilber, sfxBronze } from '@/stores/audioStore.js'
import { useHighscoreStore } from '@/stores/highscoreStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useProgressStore } from '@/stores/progressStore.js'
import { useDailyStore } from '@/stores/dailyStore.js'
import { animateCounter, animateConfetti } from '@/composables/useAnimations.js'
import AppIcon from '@/components/AppIcon.vue'

const router    = useRouter()
const game      = useGameStore()
const audio     = useAudioStore()
const highscore = useHighscoreStore()
const player    = usePlayerStore()
const progress  = useProgressStore()
const dailyStore = useDailyStore()

const isNewRecord  = ref(false)
const levelUnlocked = ref(null)  // levelId falls neu freigeschaltet
const totalScoreEl = ref(null)
const containerEl  = ref(null)

const avgAccuracy = computed(() => {
  if (!game.roundScores.length) return 0
  return Math.round(game.roundScores.reduce((s, r) => s + r.accuracy, 0) / game.roundScores.length)
})

const bestScore = computed(() => highscore.getBest(game.currentMode))

onMounted(async () => {
  // Highscore speichern
  isNewRecord.value = highscore.addScore({
    mode:       game.currentMode,
    score:      game.totalScore,
    accuracy:   avgAccuracy.value,
    levelId:    game.currentLevelId,
    rounds:     game.roundScores.length,
    playerName: player.name,
  })

  // Level-Fortschritt + Daily speichern
  const mode       = game.currentMode
  const levelId    = game.currentLevelId
  const nextId     = levelId + 1
  if (mode === 'daily') {
    dailyStore.saveResult({ accuracy: avgAccuracy.value, score: game.totalScore })
  } else if (survived.value) {
    const wasLocked = !progress.isUnlocked(mode, nextId)
    const scoreVal  = mode === 'survival' ? 100 : avgAccuracy.value
    progress.saveLevel(mode, levelId, scoreVal)
    if (wasLocked && progress.isUnlocked(mode, nextId)) {
      levelUnlocked.value = nextId
    }
  }

  // Punkte hochzählen
  if (totalScoreEl.value) {
    animateCounter(totalScoreEl.value, 0, game.totalScore, 1.2)
  }

  if (isNewRecord.value) {
    animateConfetti(containerEl.value, 36)
    sfxCheer()
  } else if (avgAccuracy.value >= 90) {
    sfxGold()
  } else if (avgAccuracy.value >= 75) {
    sfxSilber()
  } else if (avgAccuracy.value >= 55) {
    sfxBronze()
  }
})

function goHome() {
  router.push('/')
}

function playAgain() {
  game.startGame(game.currentMode, game.currentLevelId)
  router.push('/game')
}

function nextLevel() {
  const nextId = game.currentLevelId + 1
  game.startGame(game.currentMode, nextId)
  router.push('/game')
}

// Level bestanden?
const survived = computed(() => {
  const mode = game.currentMode
  return !game.isGameOver && (mode !== 'timeAttack' || avgAccuracy.value >= 50)
})

// Nächstes Level verfügbar? (bestanden + nicht letztes Level + kein Daily)
const hasNextLevel = computed(() => {
  if (game.currentMode === 'daily') return false
  if (!survived.value) return false
  const nextId = game.currentLevelId + 1
  return nextId <= 20
})
</script>

<template>
  <div ref="containerEl" class="flex flex-col items-center min-h-screen px-6 pb-10 safe-top gap-6 relative overflow-hidden">
    <!-- Titel -->
    <div class="text-center">
      <h2 class="text-3xl font-black text-white">
        <span v-if="game.currentMode === 'daily'" class="inline-flex items-center gap-2">
          <AppIcon name="calendar" :size="26" /> Daily Challenge
        </span>
        <span v-else>{{ player.name }}, Spiel beendet!</span>
      </h2>
      <div v-if="game.currentMode === 'daily'" class="text-white/50 text-xs mt-1">Heute gemeistert!</div>
      <div v-if="isNewRecord" class="text-sm font-bold mt-1 animate-bounce" style="color: #ffd700;">
        🏆 Neuer Highscore!
      </div>
      <div v-if="levelUnlocked" class="text-sm font-bold mt-1" style="color: #44ff99;">
        🔓 Level {{ levelUnlocked }} freigeschaltet!
      </div>
      <div
        v-if="game.currentMode === 'timeAttack' && !game.isGameOver && avgAccuracy < 50"
        class="text-sm font-bold mt-1" style="color: #ff6666;"
      >
        ∅ {{ avgAccuracy }}% – mind. 50% nötig um Level zu meistern
      </div>
    </div>

    <!-- Gesamtpunktzahl -->
    <div class="text-center">
      <div ref="totalScoreEl" class="text-7xl font-black" style="color: #ffd700;">{{ game.totalScore }}</div>
      <div class="text-white/50 text-sm tracking-widest uppercase mt-1">Punkte</div>
      <div v-if="!isNewRecord && bestScore > 0" class="text-white/30 text-xs mt-1">
        Bestleistung: {{ bestScore }}
      </div>
    </div>

    <!-- Ø Genauigkeit -->
    <div class="text-center">
      <div class="text-3xl font-bold text-white">Ø {{ avgAccuracy }}%</div>
      <div class="text-white/50 text-xs">Durchschnittliche Genauigkeit</div>
    </div>

    <!-- Runden-Liste -->
    <div class="w-full max-w-sm flex flex-col gap-2 max-h-64 overflow-y-auto">
      <div
        v-for="(round, i) in game.roundScores"
        :key="i"
        class="flex items-center gap-3 px-4 py-3 rounded-xl"
        style="background: rgba(255,255,255,0.05);"
      >
        <span class="text-white/40 text-sm w-6">{{ i + 1 }}.</span>
        <div class="w-8 h-8 rounded-full flex-shrink-0" :style="{ background: rgbToCss(round.target) }" />
        <div class="w-8 h-8 rounded-full flex-shrink-0" :style="{ background: rgbToCss(round.mixed) }" />
        <div class="ml-auto text-right">
          <div class="font-bold text-sm" :style="{ color: round.grade.color }">{{ round.accuracy }}%</div>
          <div class="text-white/40 text-xs">+{{ round.score }}</div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-4 mt-4">
      <button
        @click="goHome"
        class="px-6 py-3 rounded-2xl font-bold text-white border border-white/20 hover:bg-white/10 transition-colors"
      >
        Menü
      </button>
      <button
        v-if="survived && hasNextLevel"
        @click="nextLevel"
        class="px-6 py-3 rounded-2xl font-bold text-white active:scale-95 transition-transform"
        style="background: #e94560;"
      >
        Nächstes Level
      </button>
      <button
        v-else-if="!survived || game.currentMode === 'daily'"
        @click="playAgain"
        class="px-6 py-3 rounded-2xl font-bold text-white active:scale-95 transition-transform"
        style="background: #e94560;"
      >
        Nochmal
      </button>
      <button
        v-else
        @click="router.push(`/levels/${game.currentMode}`)"
        class="px-6 py-3 rounded-2xl font-bold text-white active:scale-95 transition-transform"
        style="background: rgba(255,255,255,0.1);"
      >
        Level-Auswahl
      </button>
    </div>
  </div>
</template>
