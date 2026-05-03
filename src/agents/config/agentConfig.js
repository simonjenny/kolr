// Agent configuration for the KOLR game
export const agentConfig = {
  // Game design agent
  gameDesign: {
    name: "Game Design Agent",
    role: "Handles game design decisions and balance",
    capabilities: [
      "Level design",
      "Game mechanics",
      "Scoring systems",
      "Difficulty progression"
    ]
  },
  
  // UI/UX agent
  uiUx: {
    name: "UI/UX Agent",
    role: "Handles user interface and experience decisions",
    capabilities: [
      "Component design",
      "User flows",
      "Accessibility",
      "Visual design with TailwindCSS"
    ]
  },
  
  // Code generation agent
  codeGen: {
    name: "Code Generation Agent",
    role: "Handles code generation and refactoring",
    capabilities: [
      "Vue component generation",
      "Pinia store creation",
      "Utility function generation",
      "Code optimization"
    ]
  },
  
  // Testing agent
  testing: {
    name: "Testing Agent",
    role: "Handles testing strategies and implementation",
    capabilities: [
      "Unit test generation",
      "Integration test creation",
      "Test coverage analysis",
      "Performance testing"
    ]
  }
}