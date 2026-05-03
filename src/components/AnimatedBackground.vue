<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref(null)
let raf = null

const blobs = [
  { x: 0.15, y: 0.12, r: 220, hue: 350, ox: 0, oy: 0, sx: 0.0007, sy: 0.0009, pr: 0.35 },
  { x: 0.82, y: 0.80, r: 200, hue: 220, ox: 1, oy: 1, sx: 0.0006, sy: 0.0007, pr: 0.35 },
  { x: 0.50, y: 0.48, r: 180, hue: 140, ox: 2, oy: 2, sx: 0.0009, sy: 0.0005, pr: 0.32 },
  { x: 0.85, y: 0.22, r: 150, hue: 290, ox: 3, oy: 3, sx: 0.0005, sy: 0.0011, pr: 0.30 },
  { x: 0.10, y: 0.70, r: 170, hue:  30, ox: 4, oy: 4, sx: 0.0008, sy: 0.0006, pr: 0.30 },
]

// Zeit-Offsets damit alle asynchron starten
blobs.forEach((b, i) => { b.ox = i * 1200; b.oy = i * 800 })

function draw(ts) {
  const cv = canvas.value
  if (!cv) return
  const W = cv.width
  const H = cv.height
  const ctx = cv.getContext('2d')
  ctx.clearRect(0, 0, W, H)

  for (const b of blobs) {
    const cx = (b.x + Math.sin((ts + b.ox) * b.sx) * 0.18) * W
    const cy = (b.y + Math.cos((ts + b.oy) * b.sy) * 0.18) * H
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r)
    grad.addColorStop(0,   `hsla(${b.hue},80%,55%,${b.pr})`)
    grad.addColorStop(0.5, `hsla(${b.hue},70%,45%,${b.pr * 0.4})`)
    grad.addColorStop(1,   `hsla(${b.hue},60%,40%,0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, b.r, 0, Math.PI * 2)
    ctx.fill()
  }

  raf = requestAnimationFrame(draw)
}

function resize() {
  const cv = canvas.value
  if (!cv) return
  cv.width  = cv.offsetWidth
  cv.height = cv.offsetHeight
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="fixed inset-0 w-full h-full pointer-events-none"
    style="z-index: 0;"
  />
</template>
