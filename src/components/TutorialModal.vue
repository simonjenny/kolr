<script setup>
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const emit = defineEmits(['close'])

const step = ref(0)

const steps = [
  {
    icon: 'target',
    title: 'Deine Aufgabe',
    text: 'Du siehst eine Zielfarbe. Mische Rot, Grün und Blau so, dass deine Farbe möglichst ähnlich aussieht.',
    visual: 'colors',
  },
  {
    icon: 'palette',
    title: 'So mischst du',
    text: 'Je nach Spielmodus steuerst du die Farbe mit Schiebereglern, schwebenden Blasen oder einem Orbital-Rad.',
    visual: 'inputs',
  },
  {
    icon: 'trophy',
    title: 'Punkte sammeln',
    text: 'Je näher deine Farbe an der Zielfarbe ist, desto mehr Punkte bekommst du. Treffe mehrere Runden hintereinander gut – das gibt Streak-Bonus!',
    visual: 'score',
  },
  {
    icon: 'gamepad',
    title: 'Spielmodi',
    text: 'Classic: Kein Zeitlimit.\nTime Attack: Jede Runde hat ein Zeitlimit.\nSurvival: 3 Leben – Fehler kosten eins.\nDaily Challenge: Täglich eine neue Farbe für alle.',
    visual: 'modes',
  },
]

function next() {
  if (step.value < steps.length - 1) {
    step.value++
  } else {
    emit('close')
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center px-6"
      style="background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);"
    >
      <div
        class="w-full max-w-sm rounded-3xl p-7 flex flex-col gap-6 relative"
        style="background: #16213e; border: 1px solid rgba(255,255,255,0.1);"
      >
        <!-- Skip-Button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-5 text-white/30 text-sm hover:text-white/60 transition-colors"
        >
          Überspringen
        </button>

        <!-- Schritt-Dots -->
        <div class="flex gap-2 justify-center">
          <div
            v-for="(s, i) in steps"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-300"
            :style="i === step
              ? 'width: 24px; background: #e94560;'
              : 'width: 8px; background: rgba(255,255,255,0.2);'"
          />
        </div>

        <!-- Icon -->
        <div class="flex justify-center text-white/80">
          <AppIcon :name="steps[step].icon" :size="52" />
        </div>

        <!-- Visual -->
        <div v-if="steps[step].visual === 'colors'" class="flex justify-center gap-3">
          <div class="w-20 h-20 rounded-2xl shadow-xl flex items-end p-2" style="background: #d45a2a;">
            <span class="text-white/70 text-xs font-bold">Ziel</span>
          </div>
          <div class="flex items-center text-white/30 text-xl">≈</div>
          <div class="w-20 h-20 rounded-2xl shadow-xl flex items-end p-2 border-2" style="background: #c86030; border-color: #ffd700;">
            <span class="text-white/70 text-xs font-bold">Mix</span>
          </div>
        </div>

        <div v-else-if="steps[step].visual === 'inputs'" class="flex flex-col gap-2 px-2">
          <div v-for="(label, color) in { R: '#ff4444', G: '#44dd44', B: '#4466ff' }" :key="color" class="flex items-center gap-2">
            <span class="text-xs font-bold w-3" :style="{ color }">{{ color }}</span>
            <div class="flex-1 h-2 rounded-full" style="background: rgba(255,255,255,0.1);">
              <div class="h-full rounded-full" :style="{ width: '55%', background: color }" />
            </div>
          </div>
          <div class="flex justify-center gap-6 mt-2">
            <AppIcon name="drop" :size="20" class="text-white/60" />
            <AppIcon name="bubbles" :size="20" class="text-white/60" />
            <AppIcon name="crosshair" :size="20" class="text-white/60" />
          </div>
        </div>

        <div v-else-if="steps[step].visual === 'score'" class="flex flex-col items-center gap-3">
          <div class="text-4xl font-black" style="color: #ffd700;">92%</div>
          <div class="flex gap-2">
            <span class="px-2 py-1 rounded-lg text-xs font-bold" style="background: rgba(255,215,0,0.15); color: #ffd700;"><AppIcon name="star" :size="11" class="inline-block mr-0.5" /> Gold</span>
            <span class="px-2 py-1 rounded-lg text-xs font-bold" style="background: rgba(255,140,0,0.15); color: #ffa500;"><AppIcon name="flame" :size="11" class="inline-block mr-0.5" /> Streak ×2</span>
          </div>
        </div>

        <div v-else-if="steps[step].visual === 'modes'" class="grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.05);">
            <AppIcon name="palette" :size="15" class="text-white/60" /><span class="text-white/70 text-xs">Classic</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.05);">
            <AppIcon name="bolt" :size="15" class="text-white/60" /><span class="text-white/70 text-xs">Time Attack</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.05);">
            <AppIcon name="heart" :size="15" class="text-white/60" /><span class="text-white/70 text-xs">Survival</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl" style="background: rgba(255,255,255,0.05);">
            <AppIcon name="calendar" :size="15" class="text-white/60" /><span class="text-white/70 text-xs">Daily</span>
          </div>
        </div>

        <!-- Text -->
        <div class="text-center">
          <h2 class="text-white font-black text-xl mb-2">{{ steps[step].title }}</h2>
          <p class="text-white/60 text-sm leading-relaxed whitespace-pre-line">{{ steps[step].text }}</p>
        </div>

        <!-- Weiter / Los geht's -->
        <button
          @click="next"
          class="w-full py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
          style="background: linear-gradient(135deg, #e94560, #c62a47);"
        >
          {{ step < steps.length - 1 ? 'Weiter →' : 'Los geht\'s! 🎮' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
