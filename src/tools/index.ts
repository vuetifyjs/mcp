/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from './api'
import { registerComponentTools } from './component'
import { registerDocumentationTools } from './documentation'

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerComponentTools(server)
  await registerDocumentationTools(server)
}
