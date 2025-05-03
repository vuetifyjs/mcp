import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

import { cacheApi, getApiCacheDir } from '../utils/api.js'

export async function registerApiResources (server: McpServer) {
  const template = new ResourceTemplate('vuetify://api@{version}.json', {
    list: async () => {
      const cacheRoot = dirname(getApiCacheDir())
      const versions = readdirSync(cacheRoot, { withFileTypes: true })
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
  })

  server.resource(
    'vuetify-api',
    template,
    async (uri, { version = 'latest' }) => {
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
