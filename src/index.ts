#!/usr/bin/env node
/**
 * Vuetify MCP - Main Entry Point
 *
 * This file initializes the MCP server and registers all the available tools.
 */
import 'dotenv/config'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import packageJson from '../package.json' with { type: 'json' }

import { registerPrompts } from './prompts/index.js'
import { registerResources } from './resources/index.js'
import { registerTools } from './tools/index.js'
import { AuthTransportWrapper } from './transports/auth.js'

const server = new McpServer({
  name: 'Vuetify',
  version: packageJson.version,
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
}

main().catch(error => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
