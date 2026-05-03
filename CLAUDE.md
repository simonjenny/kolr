# Claude Integration Guide

This document provides guidance on how to effectively use Claude AI with the KOLR project.

## Project Overview

KOLR is a color mixing game built with Vue 3, where players mix RGB colors to match target colors. The game features multiple modes, levels, and scoring systems.

## Key Project Files and Structure

### Main Technologies
- Vue 3 with Composition API
- Pinia for state management
- TailwindCSS for styling
- Vite as build tool
- GSAP for animations
- Tone.js for audio

### Core Directories
- `src/` - Main source code
  - `views/` - Page components
  - `components/` - Reusable UI components
  - `stores/` - Pinia stores for state management
  - `composables/` - Vue composables for logic reuse
  - `assets/` - Static assets (images, audio)
  - `router/` - Vue Router configuration
  - `agents/` - Agentic coding system (new)

### Important Files
- `src/main.js` - Application entry point
- `src/App.vue` - Root component
- `src/router/index.js` - Route definitions
- `package.json` - Dependencies and scripts
- `DECISIONS.md` - Key architectural decisions
- `AGENTS.md` - Agentic coding system documentation

## Agentic Coding System

The project includes a custom agentic coding system that can assist with development:

### Available Agents
1. **Game Design Agent** - Handles game mechanics, level design, and balance
2. **UI/UX Agent** - Assists with interface design and user experience
3. **Code Generation Agent** - Helps generate and refactor code
4. **Testing Agent** - Assists with creating tests and quality assurance

### Using Agents
Agents can be accessed through the agent manager:
```javascript
import { agentManager } from '@/agents'

// Example: Generate a level design
const agent = agentManager.getAgent('game-design')
const levelDesign = await agent.designLevel(5, 'classic')
```

## Development Guidelines

### Vue Component Structure
- Use `<script setup>` syntax
- Follow Composition API patterns
- Implement proper component lifecycle management

### State Management
- Use Pinia stores for global state
- Follow the existing store patterns in `src/stores/`

### Styling
- Use TailwindCSS classes exclusively
- Avoid custom CSS unless absolutely necessary
- Follow responsive design principles

### Game Logic
- Color mixing algorithms in `src/composables/useColorMath.js`
- Game state management in `src/stores/gameStore.js`
- Level configurations in `src/config/levels.js`

## Common Development Tasks

### Adding a New Game Mode
1. Update router in `src/router/index.js`
2. Create new view component in `src/views/`
3. Add mode to level selection in `src/views/LevelSelectView.vue`
4. Implement mode-specific logic in game store

### Creating New Components
1. Place in appropriate directory under `src/components/`
2. Follow existing component patterns
3. Use TailwindCSS for styling
4. Implement proper props and emits

### Adding New Levels
1. Update `src/config/levels.js`
2. Ensure proper difficulty progression
3. Test with different game modes

## Testing
Run the agent system test with:
```bash
npm run test:agents
```

## Claude-Specific Prompts

When asking for help with this project, consider using these prompt patterns:

1. **Code Generation**: "Create a Vue 3 component for [feature] using the Composition API and TailwindCSS"
2. **Refactoring**: "Refactor this [component/function] to improve [specific aspect]"
3. **Debugging**: "Identify potential issues in this code that might cause [specific problem]"
4. **Architecture**: "How would you integrate [feature] into the existing KOLR architecture?"

## Best Practices

1. Always check existing code patterns before implementing new features
2. Maintain consistency with the agentic coding system
3. Document significant decisions in DECISIONS.md
4. Follow the existing file structure and naming conventions
5. Use the agent system for complex development tasks