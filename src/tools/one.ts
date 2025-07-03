import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {z} from "zod";

export async function registerOneTools (server: McpServer) {
    server.tool(
        'create_vuetify_bin',
        'Create vuetify bin',
        {
            title: z.string().default('My vuetify bin').describe('Title of your bin'),
            language: z.string().default('markdown').describe('Language of your vuetify bin'),
            content: z.string().describe('The content of you bin'),
            favorite: z.boolean().default(false).describe('If you want to favorite this bin or not'),
            pinned: z.boolean().default(false).describe('Pin bin'),
            visibility:z.string().default('public').describe('Visibility of bin')

        },
        async (bin) => {
            const apiKey = process.env.VUETIFY_API_KEY || ''

            if (!apiKey) {
                return {
                    isError: true,
                    content: [{
                        isError: true,
                        type: 'text',
                        text: 'Invalid or No Api Key provided'
                    }]
                }
            }
            const apiServer = process.env.VUETIFY_API_SERVER || 'api.vuetify.js'
            const binResponse = await fetch(`${apiServer}/one/mcp/bins`, {
                method: 'POST',
                body: JSON.stringify({bin, apiKey}),
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!binResponse.ok) {
                return {
                    content: [{
                        isError: true,
                        type: 'text',
                        text: 'Invalid bin',
                    }]
                }
            }

            return {
                content: [{
                    type: 'text',
                    text: `Successfully created bin ${bin.title}`,
                }],
            }
        })
}



