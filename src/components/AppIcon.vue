<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
})

// Alle Pfade: 24×24 viewBox, stroke-basiert, currentColor
const icons = {
  // ── Modi ────────────────────────────────────────────────────────────────
  palette:
    `<path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 1-2-2 2 2 0 0 1 2-2h1.5c2.76 0 5-2.24 5-5C18.5 6.48 15.64 2 12 2z"/>` +
    `<circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>` +
    `<circle cx="12.5" cy="7" r="1.5" fill="currentColor" stroke="none"/>` +
    `<circle cx="16" cy="10.5" r="1.5" fill="currentColor" stroke="none"/>`,

  bolt:
    `<path d="M13 2 5 13h6l-2 9 10-11h-6l2-9z"/>`,

  heart:
    `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>`,

  calendar:
    `<rect x="3" y="4" width="18" height="18" rx="2"/>` +
    `<path d="M16 2v4M8 2v4M3 10h18"/>`,

  // ── Navigation ──────────────────────────────────────────────────────────
  trophy:
    `<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/>` +
    `<path d="M6 9H3l2 5h2"/>` +
    `<path d="M18 9h3l-2 5h-2"/>` +
    `<path d="M12 17v4M9 21h6"/>`,

  cog:
    `<circle cx="12" cy="12" r="3"/>` +
    `<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,

  book:
    `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>` +
    `<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,

  // ── Spiel ───────────────────────────────────────────────────────────────
  lock:
    `<rect x="3" y="11" width="18" height="11" rx="2"/>` +
    `<path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,

  unlock:
    `<rect x="3" y="11" width="18" height="11" rx="2"/>` +
    `<path d="M7 11V7a5 5 0 0 1 9.9-1"/>`,

  bulb:
    `<line x1="9" y1="18" x2="15" y2="18"/>` +
    `<line x1="10" y1="22" x2="14" y2="22"/>` +
    `<path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14z"/>`,

  volume:
    `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>` +
    `<path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>` +
    `<path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,

  'volume-x':
    `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>` +
    `<line x1="23" y1="9" x2="17" y2="15"/>` +
    `<line x1="17" y1="9" x2="23" y2="15"/>`,

  // ── Input-Typen ─────────────────────────────────────────────────────────
  crosshair:
    `<circle cx="12" cy="12" r="10"/>` +
    `<line x1="22" y1="12" x2="18" y2="12"/>` +
    `<line x1="6" y1="12" x2="2" y2="12"/>` +
    `<line x1="12" y1="6" x2="12" y2="2"/>` +
    `<line x1="12" y1="22" x2="12" y2="18"/>`,

  drop:
    `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`,

  bubbles:
    `<circle cx="8" cy="15" r="4"/>` +
    `<circle cx="16" cy="10" r="4"/>` +
    `<circle cx="17" cy="18" r="2.5"/>`,

  // ── Misc ────────────────────────────────────────────────────────────────
  flame:
    `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3C8.928 6.857 9.776 4.946 12 3c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>`,

  gamepad:
    `<rect x="2" y="6" width="20" height="12" rx="2"/>` +
    `<path d="M6 12h4M8 10v4"/>` +
    `<circle cx="15" cy="11" r="1" fill="currentColor" stroke="none"/>` +
    `<circle cx="18" cy="13" r="1" fill="currentColor" stroke="none"/>`,

  star:
    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,

  target:
    `<circle cx="12" cy="12" r="10"/>` +
    `<circle cx="12" cy="12" r="6"/>` +
    `<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,

  chevron:
    `<polyline points="9 18 15 12 9 6"/>`,

  back:
    `<polyline points="15 18 9 12 15 6"/>`,

  check:
    `<polyline points="20 6 9 17 4 12"/>`,
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-html="icons[name] ?? ''"
    style="display: inline-block; vertical-align: middle; flex-shrink: 0;"
  />
</template>
