/**
 * useAnimations – zentrales GSAP-Animations-Composable für Kolr
 */
import { gsap } from 'gsap'

/**
 * Eintritts-Animation für den Spielbildschirm
 */
export function animateGameIn(containerEl) {
  if (!containerEl) return
  gsap.fromTo(containerEl,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
  )
}

/**
 * Animiert das Aufdecken des Rundenresultats
 */
export function animateResultReveal(scoreEl, gradeEl) {
  const tl = gsap.timeline()
  if (scoreEl) {
    tl.fromTo(scoreEl,
      { scale: 0.4, opacity: 0 },
      { scale: 1,   opacity: 1, duration: 0.5, ease: 'back.out(2)' }
    )
  }
  if (gradeEl) {
    tl.fromTo(gradeEl,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.3, ease: 'power2.out' },
      '-=0.15'
    )
  }
  return tl
}

/**
 * Farbwechsel-Animation auf einem DOM-Element
 */
export function animateColorChange(el, fromColor, toColor, duration = 0.25) {
  if (!el) return
  gsap.fromTo(el,
    { backgroundColor: fromColor },
    { backgroundColor: toColor, duration, ease: 'power1.inOut' }
  )
}

/**
 * "Pulse" wenn ein Wert 255 erreicht (maxed out)
 */
export function animateMaxOut(el) {
  if (!el) return
  gsap.timeline()
    .to(el, { scale: 1.15, duration: 0.1, ease: 'power2.out' })
    .to(el, { scale: 1,    duration: 0.3, ease: 'elastic.out(1, 0.4)' })
}

/**
 * Schütteln bei sehr schlechter Genauigkeit (< 30%)
 */
export function animateShake(el) {
  if (!el) return
  gsap.timeline()
    .to(el, { x: -10, duration: 0.07, ease: 'power1.inOut' })
    .to(el, { x:  10, duration: 0.07, ease: 'power1.inOut' })
    .to(el, { x:  -6, duration: 0.06 })
    .to(el, { x:   6, duration: 0.06 })
    .to(el, { x:   0, duration: 0.05 })
}

/**
 * Goldener Konfetti-Burst (CSS-basiert, kein Canvas nötig)
 * Erstellt temporäre DOM-Partikel
 */
export function animateConfetti(containerEl, count = 24) {
  if (!containerEl) return
  const colors = ['#ffd700', '#ff4444', '#44ff44', '#4444ff', '#ffffff']

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div')
    dot.style.cssText = `
      position: absolute;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      left: 50%; top: 50%;
      pointer-events: none;
      z-index: 100;
    `
    containerEl.appendChild(dot)

    const angle  = (i / count) * 360
    const dist   = 80 + Math.random() * 80
    const rad    = (angle * Math.PI) / 180
    const tx     = Math.cos(rad) * dist
    const ty     = Math.sin(rad) * dist

    gsap.fromTo(dot,
      { x: 0, y: 0, opacity: 1, scale: 1 },
      {
        x: tx, y: ty, opacity: 0, scale: 0,
        duration: 0.7 + Math.random() * 0.4,
        ease: 'power2.out',
        delay: Math.random() * 0.1,
        onComplete: () => dot.remove(),
      }
    )
  }
}

/**
 * Zähler-Animation (Punkte hochzählen)
 */
export function animateCounter(el, from, to, duration = 0.8) {
  if (!el) return
  const obj = { val: from }
  gsap.to(obj, {
    val: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toString()
    },
  })
}
