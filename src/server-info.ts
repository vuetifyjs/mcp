import type { Implementation } from '@modelcontextprotocol/sdk/types.js'
import packageJson from '../package.json' with { type: 'json' }

export const SERVER_ICON_PNG = 'https://cdn.vuetifyjs.com/docs/images/one/logos/vmcp.png'

export const SERVER_INFO: Implementation = {
  name: 'Vuetify',
  title: 'Vuetify MCP',
  version: packageJson.version,
  websiteUrl: 'https://mcp.vuetifyjs.com',
  icons: [
    {
      src: SERVER_ICON_PNG,
      mimeType: 'image/png',
    },
  ],
}
