<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'
import { useHighscoreStore } from '@/stores/highscoreStore.js'
import { useProgressStore } from '@/stores/progressStore.js'
import { LEVELS, INPUT_TYPES } from '@/config/levels.js'
import AppIcon from '@/components/AppIcon.vue'

const props = defineProps({
  mode: { type: String, required: true },
})

const router    = useRouter()
const game      = useGameStore()
const highscore = useHighscoreStore()
const prog      = useProgressStore()

const inputLabels = {
  [INPUT_TYPES.ORBITAL]:    { icon: 'crosshair', label: 'Orbital' },
  [INPUT_TYPES.PAINT_POUR]: { icon: 'drop',      label: 'Pour' },
  [INPUT_TYPES.BUBBLES]:    { icon: 'bubbles',   label: 'Bubbles' },
}

const diffColors = {
  easy:   '#44ff44',
  medium: '#ffd700',
  hard:   '#ff4444',
}

// Beste Genauigkeit pro Level aus dem Highscore-Store
// (wir speichern levelId im Score – hier vereinfacht via Mode-Scores)
const levelGroups = computed(() => [
  { title: 'Einsteiger',    levels: LEVELS.filter(l => l.difficulty === 'easy') },
  { title: 'Fortgeschritten', levels: LEVELS.filter(l => l.difficulty === 'medium') },
  { title: 'Experte',       levels: LEVELS.filter(l => l.difficulty === 'hard') },
])

function startLevel(levelId) {
  if (!prog.isUnlocked(props.mode, levelId)) return
  game.startGame(props.mode, levelId)
  router.push('/game')
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col min-h-screen px-5 pb-8 safe-top gap-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button @click="goBack" class="-ml-2 p-2 text-white/40 text-3xl hover:text-white/70 transition-colors leading-none">
        ‹
      </button>
      <div>
        <h2 class="text-2xl font-black text-white">Level wählen</h2>
        <p class="text-white/40 text-xs capitalize">Modus: {{ mode }}</p>
      </div>
    </div>

    <!-- Level-Gruppen -->
    <div v-for="group in levelGroups" :key="group.title" class="flex flex-col gap-2">
      <div class="text-white/40 text-xs tracking-widest uppercase px-1">{{ group.title }}</div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="level in group.levels"
          :key="level.id"
          @click="startLevel(level.id)"
          :disabled="!prog.isUnlocked(props.mode, level.id)"
          class="flex flex-col items-center gap-1 py-4 px-2 rounded-2xl border-2 transition-all duration-150 active:scale-95 disabled:cursor-not-allowed"
          :style="prog.isUnlocked(props.mode, level.id) ? {
            borderColor: `${diffColors[level.difficulty]}33`,
            background:  `${diffColors[level.difficulty]}0d`,
          } : {
            borderColor: 'rgba(255,255,255,0.06)',
            background:  'rgba(255,255,255,0.03)',
          }"
        >
          <!-- Gesperrt -->
          <template v-if="!prog.isUnlocked(props.mode, level.id)">
            <AppIcon name="lock" :size="20" class="opacity-25" />
            <span class="font-black text-white/20 text-base leading-none">{{ level.id }}</span>
            <span class="text-white/20 text-xs">&ge;50% nötig</span>
            <span v-if="prog.getBest(props.mode, level.id - 1) != null" class="text-white/20 text-xs">
              {{ prog.getBest(props.mode, level.id - 1) }}% erreicht
            </span>
          </template>
          <!-- Freigeschaltet -->
          <template v-else>
            <AppIcon :name="inputLabels[level.inputType].icon" :size="20" />
            <span class="font-black text-white text-base leading-none">{{ level.id }}</span>
            <span class="text-xs" :style="{ color: diffColors[level.difficulty] }">
              {{ inputLabels[level.inputType].label }}
            </span>
            <span class="text-xs" :style="{ color: diffColors[level.difficulty] }">
              {{ prog.getBest(props.mode, level.id) != null ? prog.getBest(props.mode, level.id) + '%' : level.rounds + '×' }}
            </span>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
