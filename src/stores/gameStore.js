import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calcAccuracy, calcScore, getDailyColor, getDailySetup } from '@/composables/useColorMath.js'
import { generateTargetColor, generateColorSequence, getGrade, LEVELS, INPUT_TYPES } from '@/config/levels.js'

export const useGameStore = defineStore('game', () => {
  // --- Spielkonfiguration ---
  const currentMode = ref('classic')   // 'classic' | 'timeAttack' | 'survival' | 'daily'
  const currentLevelId = ref(1)

  const currentLevel = computed(() => LEVELS[currentLevelId.value - 1])
  const inputType = computed(() => _dailyInputType.value ?? (currentLevel.value?.inputType ?? INPUT_TYPES.PAINT_POUR))

  // --- Rundenstatus ---
  const targetColor = ref({ r: 0, g: 0, b: 0 })
  const mixedColor  = ref({ r: 0, g: 0, b: 0 })
  const currentRound = ref(0)
  const totalRounds  = computed(() => _dailyRounds.value ?? (currentLevel.value?.rounds ?? 5))

  // Daily-spezifisch (überschreiben Level-Config)
  const _dailyInputType = ref(null)
  const _dailyRounds    = ref(null)

  // --- Punktestand ---
  const totalScore  = ref(0)
  const roundScores = ref([])   // Array von { accuracy, score, grade }
  const streak      = ref(0)

  // --- Modus-spezifisch ---
  const lives    = ref(3)           // Survival
  const timeLeft = ref(60)          // Time Attack (Sekunden)
  const isGameOver = ref(false)

  // --- Farbsequenz (vorab generiert, verhindert Wiederholungen) ---
  const _colorSequence = ref([])

  // --- Hilf-mir-Token ---
  const helpTokenUsed    = ref(false)
  const helpTokenVisible = ref(false)
  let   _helpTimer       = null

  /** Aktiver Token für den aktuellen Modus (null = kein Button) */
  const activeHelpToken = computed(() => {
    if (currentMode.value === 'survival') return null
    const tokenMap = currentLevel.value?.helpToken
    if (!tokenMap) return null
    return tokenMap[currentMode.value] ?? null
  })

  // --- Aktionen ---
  function startGame(mode, levelId = 1) {
    currentMode.value = mode
    currentLevelId.value = levelId
    totalScore.value = 0
    roundScores.value = []
    streak.value = 0
    lives.value = 3
    isGameOver.value = false
    currentRound.value = 0
    _dailyInputType.value = null
    _dailyRounds.value    = null

    if (mode === 'daily') {
      const setup = getDailySetup()
      _dailyInputType.value = setup.inputType
      _dailyRounds.value    = setup.rounds
    }
    // Time Attack: Gesamtzeit einmalig setzen (gilt für alle Runden)
    if (mode === 'timeAttack') {
      timeLeft.value = currentLevel.value?.timeLimit ?? 75
    }
    // Farbsequenz vorab generieren (nur für nicht-Daily-Modi)
    if (mode !== 'daily') {
      const lvl = currentLevel.value
      _colorSequence.value = generateColorSequence(lvl.difficulty, lvl.id, lvl.rounds)
    }
    startNewRound()
  }

  function useHelpToken() {
    if (helpTokenUsed.value || !activeHelpToken.value) return
    const token = activeHelpToken.value
    helpTokenUsed.value = true

    if (token.type === 'minusPoints') {
      totalScore.value = Math.max(0, totalScore.value - token.value)
    } else if (token.type === 'halfScore') {
      totalScore.value = Math.floor(totalScore.value / 2)
    } else if (token.type === 'minusTime') {
      timeLeft.value = Math.max(0, timeLeft.value - token.value)
    }

    // R/G/B-Hinweis 5 Sekunden anzeigen
    clearTimeout(_helpTimer)
    helpTokenVisible.value = true
    _helpTimer = setTimeout(() => { helpTokenVisible.value = false }, 5000)
  }

  function startNewRound() {
    currentRound.value++
    mixedColor.value    = { r: 0, g: 0, b: 0 }
    helpTokenUsed.value = false
    helpTokenVisible.value = false
    clearTimeout(_helpTimer)

    if (currentMode.value === 'daily') {
      targetColor.value = getDailyColor(new Date(), currentRound.value - 1)
    } else {
      // Vorab generierte Sequenz verwenden (kein Repeat)
      const idx = currentRound.value - 1
      targetColor.value = _colorSequence.value[idx]
        ?? generateTargetColor(currentLevel.value.difficulty, currentLevel.value.id)
    }
  }

  function submitMix() {
    const accuracy = calcAccuracy(targetColor.value, mixedColor.value)
    const grade    = getGrade(accuracy)
    const bonus = currentMode.value === 'timeAttack'
      ? Math.floor((timeLeft.value / (currentLevel.value?.timeLimit ?? 75)) * 50)
      : 0
    const score    = calcScore(accuracy, bonus, streak.value)

    // Streak berechnen
    if (accuracy >= 70) {
      streak.value++
    } else {
      streak.value = 0
    }

    // Leben abziehen (Survival)
    if (currentMode.value === 'survival' && accuracy < 50) {
      lives.value--
      if (lives.value <= 0) {
        isGameOver.value = true
      }
    }

    roundScores.value.push({ accuracy, score, grade, target: { ...targetColor.value }, mixed: { ...mixedColor.value } })
    totalScore.value += score

    return { accuracy, score, grade }
  }

  function setMixedColor(color) {
    mixedColor.value = { ...color }
  }

  function updateChannel(channel, value) {
    mixedColor.value = { ...mixedColor.value, [channel]: Math.max(0, Math.min(255, Math.round(value))) }
  }

  const isLastRound = computed(() => {
    if (currentMode.value === 'timeAttack') return isGameOver.value || currentRound.value >= totalRounds.value
    if (currentMode.value === 'survival')   return isGameOver.value || currentRound.value >= totalRounds.value
    return currentRound.value >= totalRounds.value
  })

  const accuracy = computed(() => calcAccuracy(targetColor.value, mixedColor.value))

  return {
    currentMode, currentLevelId, currentLevel, inputType,
    targetColor, mixedColor, mixedColorVal: mixedColor,
    currentRound, totalRounds,
    totalScore, roundScores, streak,
    lives, timeLeft, isGameOver, isLastRound,
    accuracy,
    helpTokenUsed, helpTokenVisible, activeHelpToken, useHelpToken,
    startGame, startNewRound, submitMix, setMixedColor, updateChannel,
  }
})
