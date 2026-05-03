import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import './assets/main.css'
import App from './App.vue'

// Initialize agent system
import { agentManager } from './agents/index.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
