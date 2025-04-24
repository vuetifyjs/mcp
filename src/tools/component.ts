
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { useComponentService } from '../services/component.js'

const components = useComponentService()

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
