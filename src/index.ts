#!/usr/bin/env node
/**
 * Vuetify MCP - Main Entry Point
 *
 * This file initializes the MCP server and registers all the available tools.
 */
import 'dotenv/config'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { intro } from './cli/intro.js'
import packageJson from '../package.json' with { type: 'json' }
import { startHttpServer } from './transports/http.js'

import { registerPrompts } from '#prompts/index'
import { registerResources } from '#resources/index'
import { registerTools } from '#tools/index'

function parseArgs () {
  const args = process.argv.slice(2)
  let transport = 'stdio'
  let port = 3000
  let host = 'localhost'
  let path = '/mcp'

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--transport' && i + 1 < args.length) {
      transport = args[++i]
    } else if (arg === '--port' && i + 1 < args.length) {
      port = Number.parseInt(args[++i], 10)
    } else if (arg === '--host' && i + 1 < args.length) {
      host = args[++i]
    } else if (arg === '--path' && i + 1 < args.length) {
      path = args[++i]
    }
  }

  return { transport, port, host, path }
}

async function main () {
  const options = parseArgs()

  if (options.transport === 'http') {
    // HTTP transport handles its own server creation per-request
    await startHttpServer({
      port: options.port,
      host: options.host,
      path: options.path,
    })
  } else {
    // Stdio transport - single server instance
    intro()

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

    const transport = new StdioServerTransport()
    await server.connect(transport)
  }
}

main().catch(error => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
