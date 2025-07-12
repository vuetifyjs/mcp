import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {z} from "zod";

interface bin  {
    id: String,
    slug: String,
    title: String,
    language: String,
    content: String,
    favorite: Boolean,
    pinned: Boolean,
    locked: Boolean,
    visibility: 'private' | 'public',
    createdAt: Date,
    updatedAt: Date,
}


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
        {
            openWorldHint:true
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
            const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetify.js'
            const binResponse = await fetch(`${apiServer}/one/mcp/bins`, {
                method: 'POST',
                body: JSON.stringify({bin: {...bin, aiGenerated: true}}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
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

            const data = await binResponse.json();
            const createdBin: bin = data.bin;

            return {
                content: [{
                    type: 'text',
                    text: `Successfully created bin ${createdBin.title}, you can view it at https://bin.vuetifyjs.com/${createdBin.id}`,
                }],
            }
        })

    server.tool(
        'get_all_bins',
        'Get all a users bins',
        {
            openWorldHint: true
        },
        async () => {

            try{
            const apiKey = process.env.VUETIFY_API_KEY || ''

            if (!apiKey) {
                throw new Error('Invalid API key')
            }

            const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetify.js'
            const binResponse = await fetch(`${apiServer}/one/mcp/bins`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
            })

            if (!binResponse.ok) {
                throw new Error('Error retrieving bins')
            }

            const data = await binResponse.json();
            const binList: bin[] = data.bins

            return {
                content: [{
                    type: 'text',
                    text: binList.map(bin => bin.title).join('\n'),
                }],
            }}
            catch(error: any){
                return {
                    isError: true,
                    content: [{
                        isError: true,
                        type: 'text',
                        text: error.message
                    }]
                }
            }
        })


}



