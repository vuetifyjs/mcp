/**
 * Registers prompts with the MCP server.
 *
 * This function is used to register various prompts that can be used.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerDocumentationPrompts } from '#prompts/documentation'

export async function registerPrompts (server: McpServer) {
  await registerDocumentationPrompts(server)
}
