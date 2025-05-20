import { readdirSync } from 'node:fs'

import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { cacheApi, getApiCacheDirRoot } from '#utils/api'
import type { VuetifyWebTypes } from '#tools/api'

export async function registerApiResources (server: McpServer) {
  server.resource(
    'get_api',
    new ResourceTemplate('vuetify://api@{version}.json', {
      list: async () => {
        const versions = readdirSync(getApiCacheDirRoot(), { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        return {
          resources: versions.map(version => ({
            uri: `vuetify://api@${version}.json`,
            name: `Vuetify API Types (${version})`,
            mimeType: 'application/json',
          })),
        }
      },
    }),
    async (uri, { version: _version }) => {
      const version = Array.isArray(_version) ? _version[0] : _version

      const webtypes: VuetifyWebTypes = JSON.parse(await cacheApi(version))

      const components = webtypes.contributions.html.tags.filter(tag => tag.name.startsWith('V'))

      return {
        contents: components.map(component => ({
          uri: `vuetify://api@${version}/${component.name}`,
          mimeType: 'text/plain',
          text: `For a detailed list of features call the <get_component_api_by_version> tool with *componentName* ${component.name} and *version* ${version}`,
        })),
      }
    },
  )
}
