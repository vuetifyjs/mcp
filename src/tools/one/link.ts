import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { ServerRequest, ServerNotification } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

export interface Link {
  id: string
  slug: string
  title: string
  url: string
  favorite: boolean
  pinned: boolean
  scoped: boolean
  passwordProtection: boolean
  visits?: number
  totalVisits?: number
  expiresAt?: string | null
  createdAt: string
  updatedAt: string
}

type Extra = RequestHandlerExtra<ServerRequest, ServerNotification>

function getApiKey (extra: Extra): string {
  const key = extra.authInfo?.token || process.env.VUETIFY_API_KEY || ''
  if (!key) {
    throw new Error('No API key provided. Set VUETIFY_API_KEY env var or pass Authorization: Bearer header.')
  }
  return key
}

export async function registerLinkTools (server: McpServer) {
  server.tool(
    'create_vuetify_link',
    'Create a Vuetify short link (vtfy.link). Requires VUETIFY_API_KEY.',
    {
      title: z.string().describe('Title of the link'),
      url: z.string().url().describe('Destination URL'),
      slug: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/).optional()
        .describe('Custom slug (alphanumeric, dots, dashes, underscores). Omit for an auto-generated short id.'),
      favorite: z.boolean().default(false),
      pinned: z.boolean().default(false),
      scoped: z.boolean().default(false).describe('When true, the slug is unique to your account; when false, the slug is reserved globally.'),
    },
    {
      openWorldHint: true,
    },
    async (link, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
        const response = await fetch(`${apiServer}/one/links`, {
          method: 'POST',
          body: JSON.stringify({
            link: {
              ...link,
              passwordProtection: false,
              aiGenerated: true,
            },
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })
        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        const created: Link = data.link

        return {
          content: [{
            type: 'text',
            text: `Successfully created link "${created.title}" at https://vtfy.link/${created.slug}`,
          }],
        }
      } catch (error: any) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: error.message,
          }],
        }
      }
    })

  server.tool(
    'get_all_links',
    'Get all user links. Requires VUETIFY_API_KEY.',
    {},
    {
      openWorldHint: true,
    },
    async (_args, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
        const response = await fetch(`${apiServer}/one/links`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        const list: Link[] = data.links

        const text = list
          .map(l => [
            `id: ${l.id}`,
            `Slug: ${l.slug}`,
            `Title: ${l.title}`,
            `URL: ${l.url}`,
            `Short: https://vtfy.link/${l.slug}`,
            `Favorite: ${l.favorite}`,
            `Pinned: ${l.pinned}`,
            `Scoped: ${l.scoped}`,
            `Visits: ${l.visits ?? 0} (total ${l.totalVisits ?? 0})`,
            `Created: ${new Date(l.createdAt).toLocaleDateString()}`,
            '---',
          ].join('\n'))
          .join('\n\n')

        return {
          content: [{
            type: 'text',
            text,
          }],
        }
      } catch (error: any) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: error.message,
          }],
        }
      }
    })
}
