/**
 * Vuetify MCP - Main Entry Point
 *
 * This file initializes the MCP server and registers all the available tools.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import dotenv from 'dotenv'

import { registerPrompts } from './prompts/index.js'
import { registerResources } from './resources/index.js'
import { registerTools } from './tools/index.js'
import { AuthTransportWrapper } from './transports/auth.js'

dotenv.config()

const server = new McpServer({
  name: 'vuetify',
  version: '1.0.0',
  capabilities: {
    resources: {
      description: 'No resources required for Vuetify assistance.',
    },
    tools: {
      description: 'Tools to help with Vuetify component properties, layouts, and documentation.',
    },
  },
})

registerResources(server)
registerPrompts(server)
registerTools(server)

async function main () {
  const auth = new AuthTransportWrapper()
  await server.connect(auth)
  console.error('Vuetify MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
