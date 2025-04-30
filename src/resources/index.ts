/**
 * Registers resources with the MCP server.
 *
 * This function is used to define and attach resource-related capabilities.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerApiResources } from './api.js'

export async function registerResources (server: McpServer) {
  await registerApiResources(server)
}
