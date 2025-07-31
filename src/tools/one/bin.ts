import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {z} from "zod";

export interface Bin {
    id: string
    slug: string
    title: string
    language: string
    content: string
    favorite: boolean
    pinned: boolean
    locked: boolean
    visibility: 'private' | 'public'
    createdAt: Date
    updatedAt: Date
}


export async function registerBinTools (server: McpServer) {
    server.tool(
        'create_vuetify_bin',
        'Create vuetify bin',
        {
            title: z.string().default('My vuetify bin').describe('Title of your bin'),
            language: z.string().default('markdown').describe('Language of your vuetify bin'),
            content: z.string().describe('The content of you bin'),
            favorite: z.boolean().default(false).describe('If you want to favorite this bin or not'),
            pinned: z.boolean().default(false).describe('Pin bin'),
            locked: z.boolean().default(false).describe('Lock bin'),
            visibility: z.string().default('public').describe('Visibility of bin'),
            aiGenerated: z.boolean().default(true)
        },
        {
            openWorldHint:true
        },
        async (bin) => {
            try {
                const apiKey = process.env.VUETIFY_API_KEY || ''
                if (!apiKey) {
                   throw new Error('Invalid or No Api Key provided')

                }
                const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetify.js'
                const binResponse = await fetch(`${apiServer}/mcp/bins`, {
                    method: 'POST',
                    body: JSON.stringify({
                      ...bin,
                      aiGenerated: true,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })
                if (!binResponse.ok) {
                    throw new Error(await binResponse.text())
                }

                const data = await binResponse.json();
                const createdBin: Bin = data.bin;

                return {
                    content: [{
                        type: 'text',
                        text: `Successfully created bin ${createdBin.title}, you can view it at https://bin.vuetifyjs.com/${createdBin.id}`,
                    }],
                }
            }catch(error: any){
                return {
                    isError: true,
                    content: [{
                        type: 'text',
                        text: error.message,
                    }]
                }
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
            const binResponse = await fetch(`${apiServer}/one/bins`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
            })

            if (!binResponse.ok) {
                throw new Error(await binResponse.text())
            }

            const data = await binResponse.json();
            const binList: Bin[] = data.bins

            const binText = binList
                .map(bin => {
                    return [
                        `id: ${bin.id}`,
                        `Title: ${bin.title}`,
                        `Language: ${bin.language}`,
                        `Visibility: ${bin.visibility}`,
                        `Favorite: ${bin.favorite}`,
                        `Pinned: ${bin.pinned}`,
                        `Locked: ${bin.locked}`,
                        `Created: ${new Date(bin.createdAt).toLocaleDateString()}`,
                        `Updated: ${new Date(bin.updatedAt).toLocaleDateString()}`,
                        '---'
                    ].join('\n')
                })
                .join('\n\n');

            return {
                content:[{
                    type: 'text',
                    text: binText
                }]}
            }
            catch(error: any){
                return {
                    isError: true,
                    content: [{
                        type: 'text',
                        text: error.message
                    }]
                }
            }
        })


    server.tool(
        'get_bin',
        'Get bin',
        {
            id: z.string()
        },
        {
            openWorldHint: true
        },
        async ({id}) => {

            try{
                const apiKey = process.env.VUETIFY_API_KEY || ''

                if (!apiKey) {
                    throw new Error('Invalid API key')
                }

                const apiServer = process.env.VUETIFY_API_SERVER || 'https://api.vuetify.js'
                const binResponse = await fetch(`${apiServer}/one/bins/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                })

                if (!binResponse.ok) {
                    throw new Error(await binResponse.text())
                }

                const data = await binResponse.json();
                const { bin } : {bin: Bin} = data

                return {
                    content: [{
                        type: 'text',
                        text: bin.content
                    }],
                }}
            catch(error: any){
                return {
                    isError: true,
                    content: [{
                        type: 'text',
                        text: error.message
                    }]
                }
            }
        })


}



