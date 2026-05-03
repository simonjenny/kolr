/**
 * Daily Challenge Store
 * Merkt ob der User heute bereits gespielt hat und speichert das Ergebnis.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDailySetup } from '@/composables/useColorMath.js'

const STORAGE_KEY = 'kolr_daily'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export const useDailyStore = defineStore('daily', () => {
  const data  = ref(loadFromStorage())
  const setup = computed(() => getDailySetup())

  /** Wurde heute bereits gespielt? */
  const playedToday = computed(() => data.value.dateKey === setup.value.dateKey)

  /** Heutiges Ergebnis (falls gespielt) */
  const todayResult = computed(() => playedToday.value ? data.value.result : null)

  /** Ergebnis für heute speichern */
  function saveResult(result) {
    data.value = { dateKey: setup.value.dateKey, result }
    saveToStorage(data.value)
  }

  return { setup, playedToday, todayResult, saveResult }
})
