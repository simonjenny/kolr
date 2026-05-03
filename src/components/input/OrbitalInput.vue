<script setup>
/**
 * OrbitalInput – Level 13+
 * Drei konzentrische Ringe (R, G, B) – Drag auf dem Ring setzt den Wert 0-255.
 * Touch & Mouse-Drag auf Canvas (SVG-basiert für Klarheit).
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { clamp255 } from '@/composables/useColorMath.js'
import { gsap } from 'gsap'

const game  = useGameStore()

const SVG_SIZE  = 280
const CENTER    = SVG_SIZE / 2
const RADII     = [55, 85, 110]  // R, G, B Ringradius
const STROKE    = 18

const channels = [
  { key: 'r', color: '#ff4444', radius: RADII[0] },
  { key: 'g', color: '#44ff44', radius: RADII[1] },
  { key: 'b', color: '#4444ff', radius: RADII[2] },
]

const svgRef   = ref(null)
const dragging = ref(null)  // aktuell gezogener Kanal-Key

/** Winkel (0-360°) → RGB-Wert (0-255) */
function angleToVal(angle) {
  return clamp255(Math.round((angle / 360) * 255))
}

/** RGB-Wert → Winkel (in Radiant für SVG) */
function valToAngle(val) {
  return (val / 255) * 2 * Math.PI - Math.PI / 2  // Start oben
}

/** Position des Drag-Handles */
function handlePos(ch) {
  const angle = valToAngle(game.mixedColor[ch.key])
  return {
    x: CENTER + ch.radius * Math.cos(angle),
    y: CENTER + ch.radius * Math.sin(angle),
  }
}

/** Arc-Path für den gefüllten Ringanteil */
function arcPath(ch) {
  const val = game.mixedColor[ch.key]
  if (val <= 0) return ''
  const startAngle = -Math.PI / 2
  const endAngle   = startAngle + (val / 255) * 2 * Math.PI
  const sx = CENTER + ch.radius * Math.cos(startAngle)
  const sy = CENTER + ch.radius * Math.sin(startAngle)
  const ex = CENTER + ch.radius * Math.cos(endAngle)
  const ey = CENTER + ch.radius * Math.sin(endAngle)
  const largeArc = val > 127 ? 1 : 0
  return `M ${sx} ${sy} A ${ch.radius} ${ch.radius} 0 ${largeArc} 1 ${ex} ${ey}`
}

function getSVGPoint(e) {
  const svg  = svgRef.value
  const rect = svg.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const scaleX = SVG_SIZE / rect.width
  const scaleY = SVG_SIZE / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top)  * scaleY,
  }
}

function getAngle(x, y) {
  const dx = x - CENTER
  const dy = y - CENTER
  let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90  // 0° = oben
  return (angle + 360) % 360
}

function findNearestChannel(x, y) {
  const dx = x - CENTER
  const dy = y - CENTER
  const dist = Math.sqrt(dx * dx + dy * dy)
  let nearest = null
  let minDiff = Infinity
  channels.forEach(ch => {
    const diff = Math.abs(dist - ch.radius)
    if (diff < STROKE * 1.5 && diff < minDiff) {
      minDiff = diff
      nearest = ch.key
    }
  })
  return nearest
}

function onStart(e) {
  e.preventDefault()
  const pt = getSVGPoint(e)
  dragging.value = findNearestChannel(pt.x, pt.y)
}

function onMove(e) {
  if (!dragging.value) return
  e.preventDefault()
  const pt    = getSVGPoint(e)
  const angle = getAngle(pt.x, pt.y)
  const val   = angleToVal(angle)
  game.updateChannel(dragging.value, val)
}

function onEnd() {
  dragging.value = null
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: false })
  window.addEventListener('mouseup',   onEnd)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend',  onEnd)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup',   onEnd)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend',  onEnd)
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 pb-6">
    <p class="text-white/40 text-xs">Ziehe die Ringe um Farbanteile zu setzen</p>

    <!-- SVG Orbital Rings -->
    <svg
      ref="svgRef"
      :width="SVG_SIZE" :height="SVG_SIZE"
      :viewBox="`0 0 ${SVG_SIZE} ${SVG_SIZE}`"
      class="touch-none select-none"
      style="max-width: 280px;"
      @mousedown="onStart"
      @touchstart.prevent="onStart"
    >
      <!-- Hintergrundkreise -->
      <circle
        v-for="ch in channels" :key="'bg-' + ch.key"
        :cx="CENTER" :cy="CENTER" :r="ch.radius"
        fill="none"
        :stroke="ch.color" stroke-opacity="0.15"
        :stroke-width="STROKE"
      />

      <!-- Gefüllte Bögen -->
      <path
        v-for="ch in channels" :key="'arc-' + ch.key"
        :d="arcPath(ch)"
        fill="none"
        :stroke="ch.color"
        :stroke-width="STROKE"
        stroke-linecap="round"
      />

      <!-- Drag-Handles -->
      <circle
        v-for="ch in channels" :key="'handle-' + ch.key"
        :cx="handlePos(ch).x" :cy="handlePos(ch).y"
        r="12"
        :fill="ch.color"
        stroke="white" stroke-width="2"
        class="cursor-grab"
      />

      <!-- Mittelkreis: aktuelle Mischfarbe -->
      <circle
        :cx="CENTER" :cy="CENTER" r="32"
        :fill="`rgb(${game.mixedColor.r},${game.mixedColor.g},${game.mixedColor.b})`"
        stroke="rgba(255,255,255,0.2)" stroke-width="2"
      />
    </svg>

    <!-- Werte -->
    <div class="flex gap-6 font-mono text-sm">
      <span v-for="ch in channels" :key="ch.key" :style="{ color: ch.color }">
        {{ ch.key.toUpperCase() }}: {{ game.mixedColor[ch.key] }}
      </span>
    </div>

  </div>
</template>
