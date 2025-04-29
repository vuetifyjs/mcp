import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { cacheApi } from '../utils/cache-api.js'

export async function registerApiTools (server: McpServer) {
  server.tool(
    'get_vuetify_api_by_version',
    'Download and cache Vuetify API types by version',
    {
      version: z.string().describe('The version of Vuetify to retrieve API types for, e.g., "latest" or "3.0.0"'),
    },
    async ({ version }) => {
      await cacheApi(version)

      server.sendResourceListChanged()

      return {
        content: [{
          type: 'text',
          text: `Downloaded and cached Vuetify ${version}`,
        }],
      }
    },
  )
}
