/**
 * Level-Fortschritt für Kolr
 * Speichert die beste Durchschnitts-Genauigkeit pro Modus + Level.
 * Ein Level gilt als bestanden wenn avgAccuracy >= 50%.
 * Persistiert in localStorage unter 'kolr_progress'.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY      = 'kolr_progress'
const UNLOCK_THRESHOLD = 50  // % Durchschnittsgenauigkeit zum Freischalten

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

function key(mode, levelId) {
  return `${mode}:${levelId}`
}

export const useProgressStore = defineStore('progress', () => {
  // { ['mode:levelId']: bestAvgAccuracy }
  const progress = ref(loadFromStorage())

  /** Bestes Ergebnis für ein Level in einem Modus */
  function getBest(mode, levelId) {
    return progress.value[key(mode, levelId)] ?? null
  }

  /** Ist Level freigeschaltet? Level 1 immer, sonst Vorgänger ≥ 50% */
  function isUnlocked(mode, levelId) {
    if (levelId <= 1) return true
    const prev = progress.value[key(mode, levelId - 1)]
    return prev != null && prev >= UNLOCK_THRESHOLD
  }

  /** Fortschritt eines Levels speichern (nur wenn besser) */
  function saveLevel(mode, levelId, avgAccuracy) {
    const k       = key(mode, levelId)
    const current = progress.value[k] ?? -1
    if (avgAccuracy > current) {
      progress.value = { ...progress.value, [k]: avgAccuracy }
      saveToStorage(progress.value)
    }
  }

  return { progress, getBest, isUnlocked, saveLevel, UNLOCK_THRESHOLD }
})
