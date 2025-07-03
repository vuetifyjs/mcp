/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiTools } from '#tools/api'
import { registerDocumentationTools } from '#tools/documentation'
import { registerOneTools } from "./one.js";

export async function registerTools (server: McpServer) {
  await registerApiTools(server)
  await registerDocumentationTools(server)
  const apiKey = process.env.VUETIFY_API_KEY || ''
  if(apiKey.length) {
    await registerOneTools(server)
  }
}
