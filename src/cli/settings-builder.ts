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

export const httpConfig = {
  command: 'npx',
  args: [
    '-y',
    '@vuetify/mcp',
    '--transport',
    'http',
  ],
  env,
}

const wslHttpConfig = {
  command: 'wsl.exe',
  args: [
    'sh',
    '-c',
    `${npx?.path} -y @vuetify/mcp --transport http`,
  ],
  env,
}

export const getSettingsPath = (ide: IDEId): string => {
  switch (ide) {
    case 'code':
    case 'code-insiders': {
      return `servers.${SERVER_NAME}`
    }
    default: {
      return `mcpServers.${SERVER_NAME}`
    }
  }
}

// The hosted server authenticates over OAuth2 — the client obtains its own
// token, so no key is baked into the config.
export function getRemoteConfig () {
  return {
    url: 'https://mcp.vuetifyjs.com/mcp',
  }
}

export function getServerConfig (transport?: 'stdio' | 'http', remote?: boolean) {
  // Remote always takes precedence
  if (remote) {
    return getRemoteConfig()
  }
  if (transport === 'http') {
    return npx?.wsl ? wslHttpConfig : httpConfig
  }
  return npx?.wsl ? wslConfig : defaultConfig
}

export function getClaudeCodeArgs (): string[] {
  return [
    'mcp',
    'add',
    '--transport',
    'http',
    '--scope',
    'user',
    SERVER_NAME,
    'https://mcp.vuetifyjs.com/mcp',
  ]
}

export function getClaudeCodeCommand (): string {
  const args = getClaudeCodeArgs()
  return `claude ${args.map(a => a.includes(':') ? `"${a}"` : a).join(' ')}`
}

export const getSettingsBuilder = (ide: IDEId, transport?: 'stdio' | 'http', remote?: boolean): string => {
  if (ide === 'claude-code') {
    return getClaudeCodeCommand()
  }
  const config = getServerConfig(transport, remote)
  switch (ide) {
    case 'code':
    case 'code-insiders': {
      return JSON.stringify({ servers: { [SERVER_NAME]: config } }, null, 2)
    }
    default: {
      return JSON.stringify({ mcpServers: { [SERVER_NAME]: config } }, null, 2)
    }
  }
}
