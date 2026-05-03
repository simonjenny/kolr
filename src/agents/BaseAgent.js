// Base agent class for all game agents
export class BaseAgent {
  constructor(config) {
    this.name = config.name
    this.role = config.role
    this.capabilities = config.capabilities
    this.tools = []
  }
  
  // Add a tool to the agent's toolkit
  addTool(tool) {
    this.tools.push(tool)
  }
  
  // Execute a task using available tools
  async executeTask(task, context) {
    // This would be implemented by specific agents
    throw new Error('executeTask must be implemented by subclass')
  }
  
  // Log agent activities
  logActivity(activity) {
    console.log(`[${this.name}] ${activity}`)
  }
}