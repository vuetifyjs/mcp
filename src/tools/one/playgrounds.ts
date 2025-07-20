import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod"

interface playground {
    id: string;
    content: string;
    favorite: boolean;
    pinned: boolean;
    locked?: boolean;
    title: string;
    visibility: 'private' | 'public';
    createdAt: Date,
    updatedAt: Date,
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
                const playgroundList: playground[] = data.playgrounds

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
}
