/**
 * Farbmathematik-Utilities für Kolr
 */

/** Maximale mögliche RGB-Distanz (von Schwarz zu Weiss) */
export const MAX_RGB_DIST = Math.sqrt(3 * 255 * 255) // ≈ 441.67

/**
 * Berechnet die euklidische Distanz zwischen zwei RGB-Farben
 */
export function rgbDistance(a, b) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  )
}

/**
 * Berechnet die Genauigkeit (0-100%) des Farbmixes
 */
export function calcAccuracy(target, mixed) {
  const dist = rgbDistance(target, mixed)
  return Math.round((1 - dist / MAX_RGB_DIST) * 100)
}

/**
 * Berechnet die Gesamtpunktzahl
 * @param {number} accuracy - 0-100
 * @param {number} timeLeft - Sekunden (0 = kein Zeitbonus)
 * @param {number} streak - konsekutive gute Runden
 */
export function calcScore(accuracy, timeLeft = 0, streak = 0) {
  const base = Math.round(accuracy * 10)           // max 1000
  const timeBonus = Math.max(0, Math.round(timeLeft * 2))
  const streakBonus = streak > 1 ? (streak - 1) * 50 : 0
  return base + timeBonus + streakBonus
}

/**
 * Konvertiert RGB-Objekt zu CSS-String
 */
export function rgbToCss({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Konvertiert RGB zu Hex-String
 */
export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/**
 * Klemmt einen Wert auf 0-255
 */
export function clamp255(val) {
  return Math.max(0, Math.min(255, Math.round(val)))
}

/**
 * Generiert eine deterministische Tagesfarbe basierend auf dem Datum
 * Für den Daily-Challenge-Modus
 */
export function getDailyColor(date = new Date(), roundIndex = 0) {
  const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const lcg = (s) => (s * 1664525 + 1013904223) & 0xffffffff
  // Jede Runde bekommt einen eigenen deterministischen Seed
  let seed = dateSeed + roundIndex * 999983
  for (let i = 0; i <= roundIndex; i++) seed = lcg(seed)
  const s1 = lcg(seed)
  const s2 = lcg(s1)
  const s3 = lcg(s2)
  return {
    r: Math.abs(s1) % 256,
    g: Math.abs(s2) % 256,
    b: Math.abs(s3) % 256,
  }
}

/**
 * Gibt das tägliche Setup zurück: Farbe + deterministischer Input-Typ
 * Alle Spieler weltweit sehen am gleichen Tag dasselbe.
 */
export function getDailySetup(date = new Date()) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const lcg  = (s) => (s * 1664525 + 1013904223) & 0xffffffff
  const s1 = lcg(seed);  const s2 = lcg(s1)
  const s3 = lcg(s2);    const s4 = lcg(s3)
  const inputTypes   = ['paintPour', 'bubbles', 'orbital']
  const difficulties = ['easy', 'medium', 'hard']
  return {
    color:      { r: Math.abs(s1) % 256, g: Math.abs(s2) % 256, b: Math.abs(s3) % 256 },
    inputType:  inputTypes[Math.abs(s4) % 3],
    difficulty: difficulties[Math.abs(lcg(s4)) % 3],
    rounds:     3 + (Math.abs(lcg(lcg(s4))) % 3),  // 3–5 Runden
    dateKey:    `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,
  }
}
