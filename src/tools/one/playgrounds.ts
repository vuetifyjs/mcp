import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod"
import {Bin} from "./bin.js";

export const PlaygroundSchema = z.object({
    id: z.string(),
    content: z.string(),
    favorite: z.boolean(),
    pinned: z.boolean(),
    locked: z.boolean().optional(),
    title: z.string(),
    visibility: z.enum(['private', 'public']),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

export type Playground = z.infer<typeof PlaygroundSchema>

export async function registerPlaygroundTools(server: McpServer) {
    server.tool(
        'get_all_playgrounds',
        'get all users playgrounds',
        {
            openWorldHint: true
        },
        async () => {
            try {
                const apiKey = process.env.VUETIFY_API_KEY || ''
                if (!apiKey) {
                    throw new Error('Invalid or No Api Key provided')

                }
                const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetify.js'
                const playgroundResponse = await fetch(`${apiServer}/mcp/playgrounds`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })

                if (!playgroundResponse.ok) {
                    throw new Error('Invalid Playground response')
                }

                const data = await playgroundResponse.json();
                const playgroundList: Playground[] = data.playgrounds

                const responseText = playgroundList
                    .map(playground => {
                        return [
                            `id: ${playground.id}`,
                            `title: ${playground.title}`,
                            `Visibility: ${playground.visibility}`,
                            `Favorite: ${playground.favorite}`,
                            `Pinned: ${playground.pinned}`,
                            `Locked: ${playground.locked}`,
                            `Created: ${new Date(playground.createdAt).toLocaleDateString()}`,
                            `Updated: ${new Date(playground.updatedAt).toLocaleDateString()}`,
                            '---'
                        ].join('\n')
                    })
                    .join('\n\n');


                return {
                    content: [{
                        type: 'text',
                        text: responseText,
                    }]
                }
            }catch(e: any) {
                return {
                    content:[{
                        isError: true,
                        type: 'text',
                        text: e.message
                    }]
                }
            }
        })

    server.tool(
        'create_playground',
        'Create a new playground',
        {
            PlaygroundSchema
        },
        {
            openWorldHint: true
        },
        async (playground) => {
            try {
                const apiKey = process.env.VUETIFY_API_KEY || ''
                if (!apiKey) {
                    throw new Error('Invalid API Key provided')
                }
                const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'
                const playgroundResponse = await fetch(`${apiServer}/mcp/bins`, {
                    method: 'POST',
                    body: JSON.stringify({playground: {...playground, aiGenerated: true}}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })

                if (!playgroundResponse.ok) {
                    throw new Error('Invalid Playground')
                }

                const data = await playgroundResponse.json();
                const createdPlayground: Playground = data.Playground;

                return {
                    content: [{
                        type: 'text',
                        text: `Successfully created bin ${createdPlayground.title}, you can view it at https://play.vuetifyjs.com/${createdPlayground.id}`,
                    }],
                }
            }catch(e: any) {
                return {
                    isError: true,
                    content: [{
                        type: 'text',
                        text: e.message
                    }]
                }
            }
        }
    )
}
