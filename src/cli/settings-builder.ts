import { resolve } from 'pathe'
import type { IDEId } from './ide/types.js'

const dirname = new URL('.', import.meta.url).pathname
const mcpPath = resolve(dirname, '../index.js')

const server = {
  'vuetify-mcp': {
    command: 'node',
    args: [
      mcpPath,
    ],
    env: {
      VUETIFY_API_KEY: 'your_api_key_here',
    },
  },
}

export const settingsBuilder = (ide: IDEId): string => {
  switch (ide) {
    case 'code':
    case 'code-insiders': {
      return JSON.stringify({ mcp: { servers: server } }, null, 2)
    }
    default: {
      return JSON.stringify({ mcpServers: server }, null, 2)
    }
  }
}
