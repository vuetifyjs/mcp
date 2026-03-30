import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { ServerRequest, ServerNotification } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

export interface Playground {
  id: string
  slug: string
  title: string
  content: string
  favorite: boolean
  pinned: boolean
  locked: boolean
  visibility: 'private' | 'public'
  createdAt: Date
  updatedAt: Date
}

type Extra = RequestHandlerExtra<ServerRequest, ServerNotification>

function getApiKey (extra: Extra): string {
  const key = extra.authInfo?.token || process.env.VUETIFY_API_KEY || ''
  if (!key) {
    throw new Error('No API key provided. Set VUETIFY_API_KEY env var or pass Authorization: Bearer header.')
  }
  return key
}

export async function registerPlaygroundTools (server: McpServer) {
  server.tool(
    'create_vuetify_playground',
    'Create a Vuetify playground. Content should be a Vue SFC. Requires VUETIFY_API_KEY.',
    {
      title: z.string().default('My playground').describe('Title of your playground'),
      content: z.string().describe('Vue SFC content for the playground'),
      visibility: z.enum(['private', 'public']).default('public').describe('Visibility of playground'),
      favorite: z.boolean().default(false),
      pinned: z.boolean().default(false),
      locked: z.boolean().default(false),
    },
    {
      openWorldHint: true,
    },
    async (playground, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
        const response = await fetch(`${apiServer}/one/playgrounds`, {
          method: 'POST',
          body: JSON.stringify({
            playground: {
              ...playground,
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
        const created: Playground = data.playground

        return {
          content: [{
            type: 'text',
            text: `Successfully created playground ${created.title}, you can view it at https://play.vuetifyjs.com/#/${created.id}`,
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
    'get_all_playgrounds',
    'Get all user playgrounds. Requires VUETIFY_API_KEY.',
    {},
    {
      openWorldHint: true,
    },
    async (_args, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
        const response = await fetch(`${apiServer}/one/playgrounds`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        const playgrounds: Playground[] = data.playgrounds

        const text = playgrounds
          .map(p => {
            return [
              `id: ${p.id}`,
              `Title: ${p.title}`,
              `Visibility: ${p.visibility}`,
              `Favorite: ${p.favorite}`,
              `Pinned: ${p.pinned}`,
              `Locked: ${p.locked}`,
              `Created: ${new Date(p.createdAt).toLocaleDateString()}`,
              `Updated: ${new Date(p.updatedAt).toLocaleDateString()}`,
              '---',
            ].join('\n')
          })
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

  server.tool(
    'update_vuetify_playground',
    'Update an existing Vuetify playground. Requires VUETIFY_API_KEY.',
    {
      id: z.string().describe('The playground ID to update'),
      content: z.string().optional().describe('Vue SFC content for the playground'),
      title: z.string().optional().describe('Title of your playground'),
      visibility: z.enum(['private', 'public']).optional().describe('Visibility of playground'),
      favorite: z.boolean().optional(),
      pinned: z.boolean().optional(),
      locked: z.boolean().optional(),
    },
    {
      openWorldHint: true,
    },
    async ({ id, ...playground }, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'

        const updates = Object.fromEntries(
          Object.entries(playground).filter(([_, v]) => v !== undefined),
        )

        const response = await fetch(`${apiServer}/one/playgrounds/${id}`, {
          method: 'POST',
          body: JSON.stringify({
            playground: updates,
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
        const updated: Playground = data.playground

        return {
          content: [{
            type: 'text',
            text: `Successfully updated playground ${updated.title}, you can view it at https://play.vuetifyjs.com/#/${updated.id}`,
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
    'get_playground',
    'Get a playground by ID. Requires VUETIFY_API_KEY.',
    {
      id: z.string().describe('The playground ID'),
    },
    {
      openWorldHint: true,
    },
    async ({ id }, extra) => {
      try {
        const apiKey = getApiKey(extra)
        const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
        const response = await fetch(`${apiServer}/one/playgrounds/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(await response.text())
        }

        const data = await response.json()
        const { playground }: { playground: Playground } = data

        return {
          content: [{
            type: 'text',
            text: playground.content,
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
