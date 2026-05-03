<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'
import { useAudioStore, sfxGold, sfxSilber, sfxBronze, sfxBad, sfxGameOver } from '@/stores/audioStore.js'
import { rgbToCss } from '@/composables/useColorMath.js'
import { INPUT_TYPES } from '@/config/levels.js'
import { animateGameIn, animateResultReveal, animateShake, animateConfetti, animateCounter } from '@/composables/useAnimations.js'
import GameHUD from '@/components/game/GameHUD.vue'
import PaintPourInput from '@/components/input/PaintPourInput.vue'
import BubbleInput from '@/components/input/BubbleInput.vue'
import OrbitalInput from '@/components/input/OrbitalInput.vue'
import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const game   = useGameStore()
const audio  = useAudioStore()

const borderColor = computed(() => {
  const acc = game.accuracy
  if (acc >= 90) return '#ffd700'
  if (acc >= 75) return '#c0c0c0'
  if (acc >= 55) return '#cd7f32'
  return 'rgba(255,255,255,0.1)'
})

const showResult   = ref(false)
const lastResult   = ref(null)
const gameEl       = ref(null)
const resultEl     = ref(null)
const scoreEl      = ref(null)
const gradeEl      = ref(null)
let   timerInterval = null

function startTimer() {
  if (game.currentMode !== 'timeAttack') return
  timerInterval = setInterval(() => {
    if (game.timeLeft > 0) {
      game.timeLeft--
    } else {
      clearInterval(timerInterval)
      // Zeit abgelaufen = Game Over für diese Runde
      game.isGameOver = true
      endGame()
    }
  }, 1000)
}

function stopTimer() {
  clearInterval(timerInterval)
}

onMounted(() => {
  if (!game.currentLevel && game.currentMode !== 'daily') {
    router.replace('/')
    return
  }
  animateGameIn(gameEl.value)
  startTimer()
})

onUnmounted(stopTimer)

async function handleSubmit() {
  // Timer bei Submit NICHT stoppen – läuft weiter während Rundenanzeige
  const result = game.submitMix()
  lastResult.value = result
  showResult.value = true

  await nextTick()
  // Animationen nach DOM-Update
  animateResultReveal(scoreEl.value, gradeEl.value)
  if (result.accuracy >= 90) {
    animateConfetti(resultEl.value)
  } else if (result.accuracy < 30) {
    animateShake(resultEl.value)
  }
  // Punkte hochzählen
  if (scoreEl.value) {
    animateCounter(scoreEl.value, 0, result.accuracy, 0.6)
  }

  if      (result.accuracy >= 90) sfxGold()
  else if (result.accuracy >= 75) sfxSilber()
  else if (result.accuracy >= 55) sfxBronze()
  else                            sfxBad()
}

function nextRound() {
  showResult.value = false

  if (game.isLastRound || game.isGameOver) {
    endGame()
    return
  }

  game.startNewRound()
  // Timer läuft für Time Attack durchgehend weiter – kein Reset
}

function endGame() {
  if (game.isGameOver) sfxGameOver()
  router.push('/result')
}
</script>

<template>
  <div ref="gameEl" class="flex flex-col min-h-screen relative">
    <!-- HUD -->
    <GameHUD />

    <!-- Stacked Color Cards: oben an den Rand, versetzt überlappend -->
    <div v-if="!showResult" class="flex flex-col items-center">
      <div class="flex justify-center items-start px-4" style="height: 254px; padding-top: 50px;">
        <!-- Zielfarbe: links, oben -->
        <div
          class="w-44 h-44 rounded-3xl shadow-xl relative z-10 -mr-10 flex flex-col justify-end p-3 shrink-0"
          :style="{ background: rgbToCss(game.targetColor) }"
        >
          <span class="text-white/70 text-xs font-bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.9);">Ziel</span>
        </div>
        <!-- Mix: rechts, etwas tiefer, vorne -->
        <div
          class="w-44 h-44 rounded-3xl shadow-2xl relative z-20 mt-7 border-2 transition-all flex flex-col justify-end p-3 shrink-0"
          :style="{ background: rgbToCss(game.mixedColor), borderColor: borderColor }"
        >
          <span class="text-white/70 text-xs font-bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.9);">Mix</span>
        </div>
      </div>
    </div>

    <!-- Input-Bereich -->
    <div class="flex-1 flex flex-col justify-center px-4">
      <component
        :is="game.inputType === INPUT_TYPES.PAINT_POUR ? PaintPourInput
           : game.inputType === INPUT_TYPES.BUBBLES    ? BubbleInput
           : OrbitalInput"
      />
    </div>

    <!-- Bottom Action Bar: Hilf mir + Abschicken -->
    <div v-if="!showResult" class="flex flex-col items-center gap-2 px-4 pt-2 pb-6">
      <div class="w-full flex gap-3">
        <button
          v-if="game.activeHelpToken"
          @click="game.useHelpToken()"
          :disabled="game.helpTokenUsed"
          class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style="background: rgba(255,200,0,0.1); border: 1.5px solid rgba(255,200,0,0.35); color: #ffd700;"
        >
          <AppIcon name="bulb" :size="16" />
          <span>{{ game.helpTokenUsed ? 'Verwendet' : 'Hilf mir' }}</span>
          <span v-if="!game.helpTokenUsed" class="opacity-50 text-xs font-normal">· {{ game.activeHelpToken.label }}</span>
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 py-3 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
          style="background: linear-gradient(135deg, #e94560, #c62a47);"
        >
          Abschicken ✓
        </button>
      </div>
    </div>

    <!-- Hilf-mir Reveal Overlay -->
    <Transition name="fade">
      <div
        v-if="game.helpTokenVisible"
        class="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        style="background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);"
      >
        <div class="text-yellow-400 font-bold text-sm mb-5 tracking-widest uppercase">💡 Zielfarbe – Einprägen!</div>
        <div class="w-56 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold w-4" style="color: #ff6666;">R</span>
            <div class="flex-1 h-4 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.08);">
              <div class="h-full rounded-full transition-all" :style="{ width: (game.targetColor.r / 255 * 100) + '%', background: '#ff4444' }" />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold w-4" style="color: #66ff66;">G</span>
            <div class="flex-1 h-4 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.08);">
              <div class="h-full rounded-full transition-all" :style="{ width: (game.targetColor.g / 255 * 100) + '%', background: '#44dd44' }" />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold w-4" style="color: #6699ff;">B</span>
            <div class="flex-1 h-4 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.08);">
              <div class="h-full rounded-full transition-all" :style="{ width: (game.targetColor.b / 255 * 100) + '%', background: '#4466ff' }" />
            </div>
          </div>
        </div>
        <div class="text-white/30 text-xs mt-6">Verschwindet in 5 Sekunden…</div>
      </div>
    </Transition>

    <!-- Rundenresultat Overlay -->
    <Transition name="slide-up">
      <div
        v-if="showResult && lastResult"
        ref="resultEl"
        class="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);"
      >
        <!-- Farbvergleich -->
        <div class="flex gap-4 mb-6">
          <div class="flex flex-col items-center gap-1">
            <div class="w-20 h-20 rounded-2xl shadow-xl" :style="{ background: rgbToCss(game.roundScores.at(-1)?.target) }" />
            <span class="text-white/40 text-xs">Ziel</span>
          </div>
          <div class="flex items-center text-white/30 text-2xl">≈</div>
          <div class="flex flex-col items-center gap-1">
            <div class="w-20 h-20 rounded-2xl shadow-xl" :style="{ background: rgbToCss(game.roundScores.at(-1)?.mixed) }" />
            <span class="text-white/40 text-xs">Dein Mix</span>
          </div>
        </div>

        <!-- Genauigkeit (Counter animiert) -->
        <div ref="scoreEl" class="text-7xl font-black" :style="{ color: lastResult.grade.color }">
          {{ lastResult.accuracy }}%
        </div>
        <div ref="gradeEl" class="text-2xl font-bold mt-2" :style="{ color: lastResult.grade.color }">
          {{ lastResult.grade.label }}
        </div>
        <div class="text-white/50 mt-1 text-sm">+{{ lastResult.score }} Punkte</div>

        <button
          @click="nextRound"
          class="mt-8 px-8 py-3 rounded-2xl font-bold text-white text-lg active:scale-95 transition-transform"
          style="background: #e94560;"
        >
          {{ game.isLastRound ? 'Ergebnisse' : 'Weiter →' }}
        </button>
      </div>
    </Transition>
  </div>
</template>
