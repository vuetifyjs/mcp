#!/usr/bin/env node
/**
 * Vuetify MCP - Main Entry Point
 *
 * This file initializes the MCP server and registers all the available tools.
 */
import 'dotenv/config'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { intro } from './cli/intro.js'
import packageJson from '../package.json' with { type: 'json' }

import { registerPrompts } from '#prompts/index'
import { registerResources } from '#resources/index'
import { registerTools } from '#tools/index'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { HttpTransport } from '#transports/http'
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'

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

function parseArgs () {
  const args = process.argv.slice(2)
  let transport = 'stdio'
  let port = 3000
  let host = 'localhost'
  let path = '/mcp'
  let stateless = false

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--transport' && i + 1 < args.length) {
      transport = args[++i]
    }
    else if (arg === '--port' && i + 1 < args.length) {
      port = parseInt(args[++i], 10)
    }
    else if (arg === '--host' && i + 1 < args.length) {
      host = args[++i]
    }
    else if (arg === '--path' && i + 1 < args.length) {
      path = args[++i]
    }
    else if (arg === '--stateless') {
      stateless = true
    }
  }

  return { transport, port, host, path, stateless }
}

function createTransport (options: ReturnType<typeof parseArgs>): Transport {
  if (options.transport === 'http') {
    return new HttpTransport({
      port: options.port,
      host: options.host,
      path: options.path,
      stateless: options.stateless,
    })
  }
  return new StdioServerTransport()
}

async function main () {
  const options = parseArgs()

  if (options.transport === 'stdio') {
    intro()
  }

  const transport = createTransport(options)
  await server.connect(transport)
}

main().catch(error => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
