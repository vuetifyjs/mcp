import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { useDocumentationService } from '../services/documentation.js'

const documentation = useDocumentationService()

export function registerDocumentationTools (server: McpServer) {
  server.tool(
    'get_installation_guide',
    'Get detailed information about how to install Vuetify in a variety of environments.',
    {},
    async () => documentation.getInstallationGuide(),
  )
}
