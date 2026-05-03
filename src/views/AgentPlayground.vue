<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Agent Playground</h1>
    
    <div class="mb-4">
      <label class="block mb-2">Level Number:</label>
      <input 
        v-model="levelNumber" 
        type="number" 
        class="border p-2 rounded"
        min="1"
        max="100"
      />
    </div>
    
    <div class="mb-4">
      <label class="block mb-2">Game Mode:</label>
      <select v-model="gameMode" class="border p-2 rounded">
        <option value="classic">Classic</option>
        <option value="challenge">Challenge</option>
        <option value="zen">Zen</option>
      </select>
    </div>
    
    <button 
      @click="generateLevelDesign" 
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      :disabled="loading"
    >
      {{ loading ? 'Generating...' : 'Generate Level Design' }}
    </button>
    
    <div v-if="levelDesign" class="mt-4 p-4 bg-gray-100 rounded">
      <h2 class="text-xl font-semibold mb-2">Generated Level Design</h2>
      <pre>{{ JSON.stringify(levelDesign, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { agentManager } from '@/agents'

const levelNumber = ref(1)
const gameMode = ref('classic')
const levelDesign = ref(null)
const loading = ref(false)

const generateLevelDesign = async () => {
  loading.value = true
  try {
    const agent = agentManager.getAgent('game-design')
    levelDesign.value = await agent.designLevel(
      levelNumber.value, 
      gameMode.value
    )
  } catch (error) {
    console.error('Error generating level design:', error)
  } finally {
    loading.value = false
  }
}
</script>