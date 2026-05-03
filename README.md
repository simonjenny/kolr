# KOLR

A color mixing game where players blend RGB colors to match target colors as closely as possible.

**Play now:** https://kolr.b65.ch

## About

KOLR is a modern PWA remake of the original iOS game "iKolr". Test your color perception by mixing red, green, and blue to recreate target colors. The closer your mix, the higher your score!

## Features

- Multiple game modes (Classic, Challenge, Zen)
- Progressive difficulty levels
- Background music and sound effects
- PWA support (installable, works offline)
- Highscore tracking
- Daily challenges

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** Pinia
- **Animations:** GSAP
- **Audio:** Tone.js
- **PWA:** vite-plugin-pwa

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deployment is handled automatically via GitHub Actions. Push to `main` or trigger manually from the Actions tab.

## License

MIT
