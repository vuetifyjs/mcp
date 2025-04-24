import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { registerComponentTools } from './component.js'
import { registerDocumentationTools } from './documentation.js'

export function registerTools (server: McpServer) {
  registerComponentTools(server)
  registerDocumentationTools(server)
}
