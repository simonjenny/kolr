<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audioStore.js'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useDailyStore } from '@/stores/dailyStore.js'
import { useGameStore } from '@/stores/gameStore.js'
import TutorialModal from '@/components/TutorialModal.vue'
import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const audio  = useAudioStore()
const player = usePlayerStore()
const daily  = useDailyStore()
const game   = useGameStore()

const nameInput    = ref(player.name)
const showTutorial = ref(false)
const editingName = ref(!player.hasName())

const modes = [
  { id: 'classic',    label: 'Classic',        icon: 'palette', desc: 'Rundenbasiert, kein Zeitlimit' },
  { id: 'timeAttack', label: 'Time Attack',     icon: 'bolt',    desc: 'Jede Runde hat ein Zeitlimit' },
  { id: 'survival',   label: 'Survival',        icon: 'heart',   desc: '3 Leben – Fehler kosten ein Leben' },
]

const inputTypeLabels = { paintPour: 'Pour', bubbles: 'Bubbles', orbital: 'Orbital' }
const inputTypeIcons  = { paintPour: 'drop', bubbles: 'bubbles', orbital: 'crosshair' }

// ---- Random Logo Animation ----
const LOGO_ANIMS = [
  'logo-anim-spin', 'logo-anim-bounce', 'logo-anim-shake', 'logo-anim-flip',
  'logo-anim-stretch', 'logo-anim-wobble', 'logo-anim-zoom', 'logo-anim-jelly',
  'logo-anim-levitate', 'logo-anim-glitch',
]
const letterAnim = reactive(['', '', '', ''])
let _logoTimer = null

function _pickLogoAnim() {
  const prev = letterAnim.findIndex(a => a !== '')
  let letter
  do { letter = Math.floor(Math.random() * 4) } while (letter === prev)
  const anim = LOGO_ANIMS[Math.floor(Math.random() * LOGO_ANIMS.length)]
  letterAnim.fill('')
  letterAnim[letter] = anim
  // Nach 2–3s Effekt wieder entfernen, danach nächsten planen
  _logoTimer = setTimeout(() => {
    letterAnim.fill('')
    _logoTimer = setTimeout(_pickLogoAnim, 10000 + Math.random() * 5000)
  }, 2000 + Math.random() * 1000)
}

onMounted(() => {
  _logoTimer = setTimeout(_pickLogoAnim, 3000 + Math.random() * 3000)
})
onUnmounted(() => clearTimeout(_logoTimer))

function saveName() {
  if (nameInput.value.trim()) {
    player.setName(nameInput.value)
    editingName.value = false
  }
}

function selectMode(modeId) {
  if (!player.hasName()) return
  audio.init()
  router.push(`/levels/${modeId}`)
}

function startDaily() {
  if (!player.hasName()) return
  audio.init()
  game.startGame('daily', 1)
  router.push('/game')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 pb-10 safe-top gap-8">
    <!-- Logo -->
    <div class="text-center flex flex-col items-center gap-3">
      <div class="flex gap-4">
        <span :class="['kolr-k', 'text-8xl', 'font-black', letterAnim[0]]" style="color:#ff5555; display:inline-block;">K</span>
        <span :class="['kolr-o', 'text-8xl', 'font-black', letterAnim[1]]" style="color:#55ff55; display:inline-block;">O</span>
        <span :class="['kolr-l', 'text-8xl', 'font-black', letterAnim[2]]" style="color:#7777ff; display:inline-block;">L</span>
        <span :class="['kolr-r', 'text-8xl', 'font-black', letterAnim[3]]" style="color:#ffffff; display:inline-block;">R</span>
      </div>
      <p class="text-white/40 text-xs tracking-[0.3em] uppercase font-semibold">Farbmisch · Spiel</p>
    </div>

    <!-- Spielername – nur beim ersten Mal -->
    <div v-if="editingName" class="w-full max-w-sm flex gap-2">
      <input
        v-model="nameInput"
        @keyup.enter="saveName"
        type="text"
        maxlength="20"
        placeholder="Dein Name..."
        autofocus
        class="flex-1 px-4 py-3 rounded-2xl font-bold text-white text-center placeholder-white/20 outline-none border-2 focus:border-[#e94560]"
        style="background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15);"
      />
      <button
        @click="saveName"
        :disabled="!nameInput.trim()"
        class="px-4 py-3 rounded-2xl font-bold text-white transition-all disabled:opacity-30"
        style="background: #e94560;"
      >✓</button>
    </div>
    <div v-else class="text-white font-bold text-lg">
      Hey, <span style="color: #e94560;">{{ player.name }}</span>! 👋
    </div>

    <!-- Mode Selection -->
    <div class="w-full max-w-sm flex flex-col gap-3">
      <button
        v-for="mode in modes"
        :key="mode.id"
        @click="selectMode(mode.id)"
        :disabled="!player.hasName()"
        class="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style="border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);"
      >
        <AppIcon :name="mode.icon" :size="22" class="text-white/70 shrink-0" />
        <div>
          <div class="font-bold text-white text-base">{{ mode.label }}</div>
          <div class="text-white/50 text-xs">{{ mode.desc }}</div>
        </div>
        <div class="ml-auto text-white/20 text-lg">›</div>
      </button>

      <!-- Daily Challenge – separater Button -->
      <button
        @click="startDaily()"
        :disabled="!player.hasName()"
        class="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        :style="daily.playedToday
          ? 'border-color: rgba(255,215,0,0.25); background: rgba(255,215,0,0.06);'
          : 'border-color: rgba(100,200,255,0.25); background: rgba(100,200,255,0.06);'"
      >
        <AppIcon name="calendar" :size="22" class="text-white/70 shrink-0" />
        <div class="flex-1">
          <div class="font-bold text-white text-base">Daily Challenge</div>
          <div class="text-white/50 text-xs flex items-center gap-1" v-if="!daily.playedToday">
            <AppIcon :name="inputTypeIcons[daily.setup.inputType]" :size="11" />
            {{ inputTypeLabels[daily.setup.inputType] }} · {{ daily.setup.rounds }} Runden · täglich neu
          </div>
          <div class="text-xs font-bold" v-else style="color: #ffd700;">
            ✓ Heute gespielt · Ø {{ daily.todayResult?.accuracy }}% · {{ daily.todayResult?.score }} Pkt
          </div>
        </div>
        <div class="ml-auto text-white/20 text-lg">›</div>
      </button>
    </div>

    <!-- Sekundäre Navigation -->
    <div class="w-full max-w-sm flex flex-col gap-3">
      <div class="flex gap-3">
        <button
          @click="router.push('/highscores')"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
          style="border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);"
        >
          <AppIcon name="trophy" :size="17" class="text-white/70" />
          <span class="font-bold text-white text-sm">Highscores</span>
        </button>
        <button
          @click="router.push('/settings')"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
          style="border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);"
        >
          <AppIcon name="cog" :size="17" class="text-white/70" />
          <span class="font-bold text-white text-sm">Einstellungen</span>
        </button>
      </div>
      <button
        @click="showTutorial = true"
        class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95"
        style="border-color: rgba(100,180,255,0.2); background: rgba(100,180,255,0.06);"
      >
        <AppIcon name="book" :size="17" class="text-white/70" />
        <span class="font-bold text-white text-sm">Wie spiele ich Kolr?</span>
      </button>
    </div>

    <!-- Tutorial Modal -->
    <TutorialModal v-if="showTutorial" @close="showTutorial = false" />
  </div>
</template>

