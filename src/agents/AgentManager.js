import { agentConfig } from './config/agentConfig.js'
import { GameDesignAgent } from './GameDesignAgent.js'
import { FileSystemTool } from './tools/FileSystemTool.js'
import { PromptManager } from './prompts/PromptManager.js'

// Agent manager to coordinate all agents
export class AgentManager {
  constructor() {
    this.agents = new Map()
    this.tools = new Map()
    this.promptManager = new PromptManager()
    this.initializeAgents()
    this.initializeTools()
  }
  
  // Initialize all agents
  initializeAgents() {
    // Create game design agent
    const gameDesignAgent = new GameDesignAgent(agentConfig.gameDesign)
    this.agents.set('game-design', gameDesignAgent)
    
    // Additional agents would be initialized here
  }
  
  // Initialize all tools
  initializeTools() {
    // Create file system tool
    const fileSystemTool = new FileSystemTool()
    this.tools.set('file-system', fileSystemTool)
    
    // Add tools to agents
    for (const agent of this.agents.values()) {
      agent.addTool(fileSystemTool)
    }
  }
  
  // Get an agent by name
  getAgent(name) {
    return this.agents.get(name)
  }
  
  // Execute a task with a specific agent
  async executeTask(agentName, task, context = {}) {
    const agent = this.getAgent(agentName)
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`)
    }
    
    return await agent.executeTask(task, context)
  }
}

// Create singleton instance
export const agentManager = new AgentManager()