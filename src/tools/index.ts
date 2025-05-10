/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from './api.js'
import { registerComponentTools } from './component.js'
import { registerDocumentationTools } from './documentation.js'

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerComponentTools(server)
  await registerDocumentationTools(server)
}
