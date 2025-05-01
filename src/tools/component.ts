/**
 * Registers tools for managing Vuetify component properties.
 *
 * Provides functionality to retrieve detailed information about components.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { getApi } from '../utils/cache-api.js'

import type { VuetifyWebTypes } from './api.js'

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
