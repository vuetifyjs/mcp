/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from '#tools/api'
import { registerDocumentationTools } from '#tools/documentation'
import { registerBinTools } from './one/bin.js'

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerDocumentationTools(server)
  await registerBinTools(server)
}
