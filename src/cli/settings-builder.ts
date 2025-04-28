import { resolve } from 'node:path'

import type { IDEType } from './detect-ide.js'

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

export const settingsBuilder = (ide: IDEType) => {
  if (ide === 'code' || ide === 'code-insiders') {
    return JSON.stringify({ servers: server }, null, 2)
  }
  if (ide === 'trae' || ide === 'cursor') {
    return JSON.stringify({ mcpServers: server }, null, 2)
  }
}
