/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from '#tools/api'
import { registerDocumentationTools } from '#tools/documentation'
import { registerIssuesTools } from '#tools/issues'
import { registerBinTools } from './one/bin.js'
import { registerPlaygroundTools } from './one/playground.js'

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerDocumentationTools(server)
  await registerIssuesTools(server)
  await registerBinTools(server)
  await registerPlaygroundTools(server)
}
