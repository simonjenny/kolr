import { defineStore } from 'pinia'
import { ref } from 'vue'
import cheerUrl    from '@/assets/audio/effects/cheer.mp3?url'
import goldUrl     from '@/assets/audio/effects/gold.mp3?url'
import silberUrl   from '@/assets/audio/effects/silber.mp3?url'
import bronzeUrl   from '@/assets/audio/effects/bronze.mp3?url'
import badUrl      from '@/assets/audio/effects/bad.mp3?url'
import gameoverUrl from '@/assets/audio/effects/gameover.mp3?url'
import bg1 from '@/assets/audio/background/1.mp3?url'
import bg2 from '@/assets/audio/background/2.mp3?url'
import bg3 from '@/assets/audio/background/3.mp3?url'
import bg4 from '@/assets/audio/background/4.mp3?url'
import bg5 from '@/assets/audio/background/5.mp3?url'
import bg6 from '@/assets/audio/background/6.mp3?url'

const BG_TRACKS = [bg1, bg2, bg3, bg4, bg5, bg6]

// ── Hintergrundmusik als plain Modul-Singleton (ausserhalb Vue-Reaktivität) ──
let _bgEl      = null   // das aktive Audio-Element
let _bgIndex   = 0
let _bgEnabled = true   // Spiegel von enabled.value für den onended-Callback

function _bgNext() {
  _bgIndex = (_bgIndex + 1) % BG_TRACKS.length
  _bgEl = new Audio(BG_TRACKS[_bgIndex])
  _bgEl.volume = 0.15
  _bgEl.onended = _bgNext
  if (_bgEnabled) _bgEl.play().catch(() => {})
}

/** Erstellt das erste Audio-Element (noch kein play!) */
export function prepareBgMusic() {
  if (_bgEl) return
  _bgIndex = 0
  _bgEl = new Audio(BG_TRACKS[0])
  _bgEl.volume = 0.15
  _bgEl.onended = _bgNext
}

/** Startet die Wiedergabe – muss direkt in einem User-Gesture-Handler aufgerufen werden */
export function startBgMusic() {
  if (_bgEl) _bgEl.play().catch(() => {})
}

export function pauseBgMusic()  { if (_bgEl) _bgEl.pause() }
export function resumeBgMusic() { if (_bgEl) _bgEl.play().catch(() => {}) }

// ─────────────────────────────────────────────────────────────────────────────

// ── Effekte als plain Modul-Funktionen (ausserhalb Pinia-Wrapper) ──
let _sfxEnabled = true  // Spiegel von enabled

function _play(url) {
  if (!_sfxEnabled) return
  const el = new Audio(url)
  el.play().catch(() => {})
}

export function sfxCheer()    { _play(cheerUrl) }
export function sfxGold()     { _play(goldUrl) }
export function sfxSilber()   { _play(silberUrl) }
export function sfxBronze()   { _play(bronzeUrl) }
export function sfxBad()      { _play(badUrl) }
export function sfxGameOver() { _play(gameoverUrl) }

// ─────────────────────────────────────────────────────────────────────────────

export const useAudioStore = defineStore('audio', () => {
  const enabled = ref(true)

  function playCheer()    { sfxCheer() }
  function playGameOver() { sfxGameOver() }

  function toggle() {
    enabled.value = !enabled.value
    _bgEnabled  = enabled.value
    _sfxEnabled = enabled.value
    if (enabled.value) resumeBgMusic()
    else pauseBgMusic()
  }

  function init() {}

  return { enabled, init, playCheer, playGameOver, toggle }
})
