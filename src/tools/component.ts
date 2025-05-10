import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { VuetifyWebTypes } from './api'

import { getApi } from '@/utils/api'


export async function registerComponentTools (server: McpServer) {
  server.tool(
    'get_component_api',
    'Return the API list for a Vuetify component',
    {
      componentName: z.string().describe('The name of a Vuetify component, available options here: https://vuetifyjs.com/components/all/'),
      version: z.string().default('latest').describe('The version of Vuetify to retrieve API types for, e.g., "latest" or "3.0.0"'),
    },
    async ({ componentName, version }) => {
      const api: VuetifyWebTypes = JSON.parse(await getApi(version))
      const target = componentName.replace('-', '').toLowerCase()
      const tag = api.contributions.html.tags.find(tag => tag.name.toLowerCase() === target)

      if (!tag) {
        return {
          content: [{
            type: 'text',
            text: `Component "${target}" not found in Vuetify version ${version}.`,
          }],
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(tag),
        }],
      }
    },
  )
}
