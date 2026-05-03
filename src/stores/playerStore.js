import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'kolr_player'

function load() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export const usePlayerStore = defineStore('player', () => {
  const name = ref(load())

  function setName(newName) {
    name.value = newName.trim().slice(0, 20)  // max 20 Zeichen
    try {
      localStorage.setItem(STORAGE_KEY, name.value)
    } catch {}
  }

  const hasName = () => name.value.length > 0

  return { name, setName, hasName }
})
