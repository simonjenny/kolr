import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',              name: 'home',       component: () => import('@/views/HomeView.vue') },
    { path: '/highscores',    name: 'highscores', component: () => import('@/views/HighscoreView.vue') },
    { path: '/settings',      name: 'settings',   component: () => import('@/views/SettingsView.vue') },
    { path: '/levels/:mode',  name: 'levels',     component: () => import('@/views/LevelSelectView.vue'), props: true },
    { path: '/game',          name: 'game',       component: () => import('@/views/GameView.vue') },
    { path: '/result',        name: 'result',     component: () => import('@/views/ResultView.vue') },
    { path: '/agents',        name: 'agents',     component: () => import('@/views/AgentPlayground.vue') },
  ],
})

export default router
