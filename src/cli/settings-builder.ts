import type { IDEId } from './ide/types.js'
import { detectProgram } from './detect/npx.js'

export const SERVER_NAME = 'vuetify-mcp'

export const npx = await detectProgram('npx')

const env = {
  VUETIFY_API_KEY: process.env.VUETIFY_API_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
}

const wslConfig = {
  command: 'wsl.exe',
  args: [
    'sh',
    '-c',
    `${npx?.path} -y @vuetify/mcp`,
  ],
  env,
}

export const defaultConfig = {
  command: 'npx',
  args: [
    '-y',
    '@vuetify/mcp',
  ],
  env,
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

export const serverConfig = npx?.wsl ? wslConfig : defaultConfig

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
