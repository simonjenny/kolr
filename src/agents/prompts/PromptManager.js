// Prompt manager for agent prompts
export class PromptManager {
  constructor() {
    this.prompts = new Map()
    this.initializePrompts()
  }
  
  // Initialize all prompts
  initializePrompts() {
    this.prompts.set('game-design-brief', `
      You are a game design expert working on a color mixing game called KOLR.
      The game involves mixing RGB colors to match target colors.
      Consider gameplay balance, difficulty progression, and player engagement.
    `)
    
    this.prompts.set('ui-ux-brief', `
      You are a UI/UX designer expert in creating intuitive interfaces with TailwindCSS.
      The game should be visually appealing and easy to navigate on both desktop and mobile.
      Focus on accessibility and responsive design.
    `)
    
    this.prompts.set('code-generation-brief', `
      You are a Vue.js and JavaScript expert.
      Generate clean, efficient, and well-documented code.
      Follow Vue 3 Composition API patterns and Pinia store conventions.
      Use TailwindCSS for styling.
    `)
  }
  
  // Get a prompt by key
  getPrompt(key) {
    return this.prompts.get(key) || ''
  }
  
  // Add or update a prompt
  setPrompt(key, prompt) {
    this.prompts.set(key, prompt)
  }
}