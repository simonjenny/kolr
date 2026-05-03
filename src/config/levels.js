/**
 * Level-Konfiguration für Kolr
 * Jedes Level definiert: Input-Typ, Schwierigkeit, Zielfarb-Generator, Toleranzen
 */

export const INPUT_TYPES = {
  PAINT_POUR: 'paintPour',   // Level 1-5:  Press & Hold
  BUBBLES: 'bubbles',         // Level 6-12: Tap to Fill
  ORBITAL: 'orbital',         // Level 13+:  Drag Rings
}

export const GRADE = {
  GOLD:   { label: 'Gold',   minAccuracy: 90, color: '#ffd700' },
  SILVER: { label: 'Silber', minAccuracy: 75, color: '#c0c0c0' },
  BRONZE: { label: 'Bronze', minAccuracy: 55, color: '#cd7f32' },
  MISS:   { label: 'Daneben', minAccuracy: 0, color: '#555' },
}

// ---- Interne Helfer ----

/** HSL (h: 0-360, s: 0-1, l: 0-1) → RGB */
function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if      (h < 60)  { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else              { r = c; g = 0; b = x }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

function _rgbDist(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

/**
 * Generiert eine Zielfarbe basierend auf Schwierigkeit und Level.
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} levelId - 1-20, steuert den Anstieg innerhalb eines Tiers
 */
export function generateTargetColor(difficulty, levelId = 1) {
  const rand = (min, max) => Math.random() * (max - min) + min
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  if (difficulty === 'easy') {
    // Level 1-2: Hue in 60°-Schritten (6 Farbtöne) → reine Primär-/Sekundärfarben, S=1, L=0.5
    // Level 3:   Hue in 30°-Schritten (12 Farbtöne), Helligkeit variiert leicht
    // Level 4:   Hue in 20°-Schritten (18 Farbtöne), S/L etwas breiter
    // Level 5:   Hue in 15°-Schritten (24 Farbtöne), weicher Übergang zu medium
    const hueStep  = levelId <= 2 ? 60 : levelId === 3 ? 30 : levelId === 4 ? 20 : 15
    const hueCount = Math.round(360 / hueStep)
    const h = Math.floor(Math.random() * hueCount) * hueStep
    let s, l
    if      (levelId <= 2) { s = 1.0;             l = 0.5 }
    else if (levelId === 3) { s = 1.0;             l = pick([0.35, 0.5, 0.65]) }
    else if (levelId === 4) { s = pick([0.8, 0.9, 1.0]); l = rand(0.35, 0.60) }
    else                   { s = rand(0.70, 1.0); l = rand(0.30, 0.65) }
    return hslToRgb(h, s, l)
  }

  if (difficulty === 'medium') {
    // Level 6-7:  64er-Raster  (0, 64, 128, 192, 255) → 5^3 = 125 Kombis, gut erkennbar
    // Level 8-9:  48er-Raster  → feiner
    // Level 10-11: 32er-Raster → noch feiner
    // Level 12:  16er-Raster  → nahe Hard
    const step  = levelId <= 7 ? 64 : levelId <= 9 ? 48 : levelId <= 11 ? 32 : 16
    const count = Math.floor(256 / step)
    const pickStep = () => Math.min(255, Math.floor(Math.random() * (count + 1)) * step)
    let r, g, b
    // Sicherstellen: nicht zu dunkel (fast schwarz)
    do { r = pickStep(); g = pickStep(); b = pickStep() } while (r + g + b < step * 2)
    return { r, g, b }
  }

  // hard: volle RGB-Auflösung
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

/**
 * Generiert eine Sequenz von `rounds` Farben ohne störende Wiederholungen.
 * Jede Farbe hat einen Mindestabstand zu allen vorherigen.
 */
export function generateColorSequence(difficulty, levelId, rounds) {
  const minDist = difficulty === 'easy' ? 75 : difficulty === 'medium' ? 50 : 35
  const colors = []
  for (let i = 0; i < rounds; i++) {
    let color, attempts = 0
    do {
      color = generateTargetColor(difficulty, levelId)
      attempts++
    } while (attempts < 80 && colors.some(c => _rgbDist(color, c) < minDist))
    colors.push(color)
  }
  return colors
}

/** Gibt die Note für einen Genauigkeitswert zurück */
export function getGrade(accuracy) {
  if (accuracy >= GRADE.GOLD.minAccuracy)   return GRADE.GOLD
  if (accuracy >= GRADE.SILVER.minAccuracy) return GRADE.SILVER
  if (accuracy >= GRADE.BRONZE.minAccuracy) return GRADE.BRONZE
  return GRADE.MISS
}

/**
 * Hilf-mir-Token Kosten pro Level (erste 3 Level jeder Stufe), modus-spezifisch.
 * survival: kein Token (Button wird nicht gezeigt)
 * classic/daily: nur Punkte-Strafen
 * timeAttack: nur Zeit-Strafen
 */
const HELP_TOKENS = {
  // Einsteiger
  1:  { classic: { type: 'minusPoints', value: 50,  label: '−50 Punkte'       }, timeAttack: { type: 'minusTime', value: 5,  label: '−5 Sekunden'  }, daily: { type: 'minusPoints', value: 50,  label: '−50 Punkte'   } },
  2:  { classic: { type: 'minusPoints', value: 100, label: '−100 Punkte'      }, timeAttack: { type: 'minusTime', value: 8,  label: '−8 Sekunden'  }, daily: { type: 'minusPoints', value: 100, label: '−100 Punkte'  } },
  3:  { classic: { type: 'halfScore',   value: 0,   label: 'Punkte halbiert'  }, timeAttack: { type: 'minusTime', value: 12, label: '−12 Sekunden' }, daily: { type: 'halfScore',   value: 0,   label: 'Punkte ½'     } },
  // Fortgeschritten
  6:  { classic: { type: 'minusPoints', value: 150, label: '−150 Punkte'      }, timeAttack: { type: 'minusTime', value: 10, label: '−10 Sekunden' }, daily: { type: 'minusPoints', value: 150, label: '−150 Punkte'  } },
  7:  { classic: { type: 'halfScore',   value: 0,   label: 'Punkte halbiert'  }, timeAttack: { type: 'minusTime', value: 15, label: '−15 Sekunden' }, daily: { type: 'halfScore',   value: 0,   label: 'Punkte ½'     } },
  8:  { classic: { type: 'minusPoints', value: 200, label: '−200 Punkte'      }, timeAttack: { type: 'minusTime', value: 20, label: '−20 Sekunden' }, daily: { type: 'minusPoints', value: 200, label: '−200 Punkte'  } },
  // Experte
  13: { classic: { type: 'minusPoints', value: 200, label: '−200 Punkte'      }, timeAttack: { type: 'minusTime', value: 12, label: '−12 Sekunden' }, daily: { type: 'minusPoints', value: 200, label: '−200 Punkte'  } },
  14: { classic: { type: 'halfScore',   value: 0,   label: 'Punkte halbiert'  }, timeAttack: { type: 'minusTime', value: 18, label: '−18 Sekunden' }, daily: { type: 'halfScore',   value: 0,   label: 'Punkte ½'     } },
  15: { classic: { type: 'halfScore',   value: 0,   label: 'Punkte halbiert'  }, timeAttack: { type: 'minusTime', value: 25, label: '−25 Sekunden' }, daily: { type: 'halfScore',   value: 0,   label: 'Punkte ½'     } },
}

export const LEVELS = Array.from({ length: 20 }, (_, i) => {
  const lvl = i + 1
  let inputType, difficulty, goldThreshold

  if (lvl <= 5) {
    inputType = INPUT_TYPES.ORBITAL
    difficulty = 'easy'
    goldThreshold = 80
  } else if (lvl <= 12) {
    inputType = INPUT_TYPES.PAINT_POUR
    difficulty = 'medium'
    goldThreshold = 85
  } else {
    inputType = INPUT_TYPES.BUBBLES
    difficulty = 'hard'
    goldThreshold = 90
  }

  const rounds = lvl <= 5 ? 5 : lvl <= 12 ? 7 : 10

  return {
    id: lvl,
    name: `Level ${lvl}`,
    inputType,
    difficulty,
    goldThreshold,
    rounds,
    helpToken: HELP_TOKENS[lvl] ?? null,
    timeLimit: Math.max(rounds * 8, rounds * 15 - (lvl - 1) * 2),
  }
})
