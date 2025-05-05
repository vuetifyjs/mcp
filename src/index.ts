/**
 * Vuetify MCP - Main Entry Point
 *
 * This file initializes the MCP server and registers all the available tools.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import dotenv from 'dotenv'

dotenv.config()

import { registerPrompts } from './prompts/index.js'
import { registerResources } from './resources/index.js'
import { registerTools } from './tools/index.js'
import { AuthTransportWrapper } from './transports/auth.js'

const server = new McpServer({
  name: 'Vuetify',
  version: '1.0.0',
  capabilities: {
    resources: {
      description: 'No resources required for Vuetify assistance.',
    },
    tools: {
      description: 'Tools to help with Vuetify component properties, layouts, and documentation.',
    },
    prompts: {
      description: 'Prompts to assist with Vuetify component usage and best practices.',
    },
  },
})

await registerResources(server)
await registerPrompts(server)
await registerTools(server)

async function main () {
  const auth = new AuthTransportWrapper()
  await server.connect(auth)
  console.log('Vuetify MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
