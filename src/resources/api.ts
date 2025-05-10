import { readdirSync } from 'node:fs'

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

import { cacheApi, getApiCacheDirRoot } from '@/utils/api'

export async function registerApiResources (server: McpServer) {
  server.resource(
    'get_api',
    new ResourceTemplate('vuetify://api@{version}.json', {
      list: async () => {
        const versions = readdirSync(getApiCacheDirRoot(), { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        return {
          resources: versions.map(v => ({
            uri: `vuetify://api@${v}.json`,
            name: `Vuetify API Types (${v})`,
            mimeType: 'application/json',
          })),
        }
      },
    }),
    async (uri, { version }) => {
      const api = await cacheApi(Array.isArray(version) ? version[0] : version)

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: api,
          },
        ],
      }
    },
  )
}
