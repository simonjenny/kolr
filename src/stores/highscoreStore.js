/**
 * Highscore-Store für Kolr
 * Persistiert in localStorage, pro Spielmodus getrennt.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'kolr_highscores'
const MAX_ENTRIES = 10  // Pro Modus max 10 Einträge

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
  } catch {
    // localStorage voll oder nicht verfügbar – kein Absturz
  }
}

export const useHighscoreStore = defineStore('highscores', () => {
  const scores = ref(loadFromStorage())

  /** Gibt die Highscore-Liste für einen Modus zurück (sortiert, beste zuerst) */
  function getScores(mode) {
    return (scores.value[mode] ?? []).slice().sort((a, b) => b.score - a.score)
  }

  /** Gibt den besten Score für einen Modus zurück */
  function getBest(mode) {
    const list = getScores(mode)
    return list.length > 0 ? list[0].score : 0
  }

  /**
   * Speichert einen neuen Score-Eintrag.
   * Gibt zurück ob es ein neuer Highscore (Platz 1) ist.
   */
  function addScore({ mode, score, accuracy, levelId, rounds, playerName = '' }) {
    if (!scores.value[mode]) scores.value[mode] = []

    const entry = {
      score,
      accuracy,
      levelId,
      rounds,
      playerName,
      date: new Date().toISOString(),
    }

    scores.value[mode].push(entry)
    // Nur die besten MAX_ENTRIES behalten
    scores.value[mode] = scores.value[mode]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES)

    saveToStorage(scores.value)

    const isNewRecord = scores.value[mode][0].date === entry.date && scores.value[mode][0].score === score
    return isNewRecord
  }

  function clearAll() {
    scores.value = {}
    saveToStorage({})
  }

  return { scores, getScores, getBest, addScore, clearAll }
})
