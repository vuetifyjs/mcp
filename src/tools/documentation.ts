/**
 * Registers tools for documentation-related features.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { createDocumentationService } from '../services/documentation.js'

const documentation = createDocumentationService()

export function registerDocumentationTools (server: McpServer) {
  server.tool(
    'get-installation-guide',
    'Get detailed information about how to install Vuetify in a variety of environments.',
    {},
    async () => documentation.getInstallationGuide(),
  )
}
