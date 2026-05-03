import { ref } from 'vue'

const STORAGE_KEY = 'kolr_tutorial_done'

// Tooltip-Steps: 1 = Zielfarbe, 2 = Input, 3 = Abschicken
export function useTutorialTooltips() {
  const isFirstGame = !localStorage.getItem(STORAGE_KEY)
  const tooltipStep = ref(0)

  function startTooltips() {
    if (!isFirstGame) return
    tooltipStep.value = 1
  }

  function nextTooltip() {
    tooltipStep.value++
    if (tooltipStep.value > 3) {
      tooltipStep.value = 0
      localStorage.setItem(STORAGE_KEY, '1')
    }
  }

  function skipTooltips() {
    tooltipStep.value = 0
    localStorage.setItem(STORAGE_KEY, '1')
  }

  return { isFirstGame, tooltipStep, startTooltips, nextTooltip, skipTooltips }
}
