import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { cacheApi } from '#utils/api'

export interface VuetifyWebTypes {
  $schema: string
  framework: 'vue' | string
  name: string
  version: string
  contributions: {
    [key: string]: unknown
    html: {
      'types-syntax': string
      'description-markup': string
      'tags': VuetifyHtmlTag[]
    }
  }
}

export interface VuetifyHtmlTag {
  [key: string]: unknown
  'name': string
  'source'?: {
    module: string
    symbol: string
  }
  'description'?: string
  'doc-url'?: string
  'attributes'?: VuetifyAttr[]
  'events'?: VuetifyEvent[]
  'slots'?: VuetifySlot[]
  'vue-model'?: {
    prop: string
    event: string
  }
}

export interface VuetifyAttr {
  'name': string
  'description'?: string
  'doc-url'?: string
  'default'?: unknown
  'value'?: {
    kind: string
    type?: string
  }
}

export interface VuetifyEvent {
  'name': string
  'description'?: string
  'doc-url'?: string
  'arguments'?: {
    name?: string
    type?: string
  }[]
}

export interface VuetifySlot {
  'name': string
  'description'?: string
  'doc-url'?: string
  'vue-properties'?: {
    name: string
    type?: string
  }[]
}

export async function registerApiTools (server: McpServer) {
  server.tool(
    'get_vuetify_api_by_version',
    'Download and cache Vuetify API types by version',
    {
      version: z.string().default('latest').describe('The version of Vuetify to retrieve API types for, e.g., "latest" or "3.0.0"'),
    },
    async ({ version }) => {
      await cacheApi(version)

      server.sendResourceListChanged()

      return {
        content: [{
          type: 'text',
          text: `Downloaded and cached vuetify@${version}`,
        }],
      }
    },
  )

  server.tool(
    'get_component_api_by_version',
    'Return the API list for a Vuetify component',
    {
      componentName: z.string().describe('The name of a Vuetify component, available options here: https://vuetifyjs.com/components/all/'),
      version: z.string().default('latest').describe('The version of Vuetify to retrieve API types for, e.g., "latest" or "3.0.0"'),
    },
    async ({ componentName, version }) => {
      const api: VuetifyWebTypes = JSON.parse(await cacheApi(version))
      let target = componentName.replace('-', '').toLowerCase()

      if (!target.startsWith('v')) {
        target = `v${target}`
      }

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
