import { resolve } from 'pathe'
import type { IDEId } from './ide/types.js'

const dirname = new URL('.', import.meta.url).pathname
const mcpPath = resolve(dirname, '../index.js')

export const SERVER_NAME = 'vuetify-mcp'

export const serverConfig = {
  command: 'node',
  args: [
    mcpPath,
  ],
  env: {
    VUETIFY_API_KEY: 'your_api_key_here',
  },
}

export const getSettingsPath = (ide: IDEId): string => {
  switch (ide) {
    case 'code':
    case 'code-insiders': {
      return `mcp.servers.${SERVER_NAME}`
    }
    default: {
      return `mcpServers.${SERVER_NAME}`
    }
  }
}

export const getSettingsBuilder = (ide: IDEId): string => {
  switch (ide) {
    case 'code':
    case 'code-insiders': {
      return JSON.stringify({ mcp: { servers: { [SERVER_NAME]: serverConfig } } }, null, 2)
    }
    default: {
      return JSON.stringify({ mcpServers: { [SERVER_NAME]: serverConfig } }, null, 2)
    }
  }
}
