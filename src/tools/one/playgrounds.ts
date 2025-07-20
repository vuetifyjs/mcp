import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod"

export interface Playground {
    id: string
    title: string
    content: string
    favorite: boolean
    pinned: boolean
    locked: boolean
    visibility: 'private' | 'public'
    aiGenerated: boolean
    createdAt: Date
    updatedAt: Date
}

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
                const playgroundResponse = await fetch(`${apiServer}/one/playgrounds`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })

                if (!playgroundResponse.ok) {
                    throw new Error(await playgroundResponse.text())
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
            title: z.string().default("My Vuetify Playground").describe('Title of vuetify playground'),
            content: z.string().describe('The content of your playground'),
            favorite: z.boolean().default(false).describe('Favorite playground'),
            pinned: z.boolean().default(false).describe('Playground playground'),
            locked: z.boolean().default(false).describe('Lock playground'),
            visibility: z.enum(['private', 'public']).default('public'),
            aiGenerated: z.boolean().default(true)
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
                const playgroundResponse = await fetch(`${apiServer}/one/playgrounds`, {
                    method: 'POST',
                    body: JSON.stringify({playground}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })

                if (!playgroundResponse.ok) {
                    throw new Error(await playgroundResponse.text())
                }

                const data = await playgroundResponse.json();
                const createdPlayground: Playground = data.playground;

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
