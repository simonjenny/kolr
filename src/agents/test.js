// Simple test for the agent system
import { agentManager } from './index.js'

// Test the agent system
async function testAgentSystem() {
  console.log('Testing agent system...')
  
  try {
    // Get the game design agent
    const agent = agentManager.getAgent('game-design')
    console.log('Game Design Agent:', agent.name)
    
    // Test designing a level
    const levelDesign = await agent.designLevel(1, 'classic')
    console.log('Generated Level Design:', levelDesign)
    
    console.log('Agent system test completed successfully!')
  } catch (error) {
    console.error('Agent system test failed:', error)
  }
}

// Run the test
testAgentSystem()