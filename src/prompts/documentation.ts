import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export async function registerDocumentationPrompts (server: McpServer) {
  server.prompt(
    'install-vuetify',
    async () => {
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text',
              text: 'Use the get_installation_guide tool to install Vuetify in my project. Determine the best available platform based on the context of this conversation. Determine the best package manager to use based on the context of this conversation. If you are not certain, ask the user for clarification.',
            },
          },
        ],
      }
    },
  )
}
