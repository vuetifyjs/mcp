/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from './api.js'
import { registerDocumentationTools } from './documentation.js'

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerDocumentationTools(server)
}
