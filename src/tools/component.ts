/**
 * Registers tools for managing Vuetify component properties.
 *
 * Provides functionality to retrieve detailed information about components.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { createComponentService } from '../services/component.js'

const components = createComponentService()

export function registerComponentTools (server: McpServer) {
  server.tool(
    'get_component_props',
    'Get detailed information about Vuetify component properties',
    {
      componentName: z.string().describe('The name of the Vuetify component to retrieve properties for'),
    },
    async ({ componentName }) => components.getComponentApi(componentName),
  )
}
