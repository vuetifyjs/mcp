#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { parseArgs } from 'node:util'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { values } = parseArgs({
  options: {
    'api-key': { type: 'string' },
    'github-token': { type: 'string' },
    'help': { type: 'boolean', short: 'h' },
  },
  allowPositionals: false,
})

if (values.help) {
  console.log(`
Vuetify MCP Server

Usage:
  npx -y @vuetify/mcp --api-key=YOUR_API_KEY [options]

Options:
  --api-key=KEY          Your Vuetify API key
  --github-token=TOKEN   GitHub token for accessing documentation
  --help, -h             Show this help message
  `)
  process.exit(0)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverPath = path.resolve(__dirname, '../dist/index.js')

const env = { ...process.env }
if (values['api-key']) {
  env.VUETIFY_API_KEY = values['api-key']
}
if (values['github-token']) {
  env.GITHUB_TOKEN = values['github-token']
}

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})

server.on('error', err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

process.on('SIGINT', () => {
  if (process.platform === 'win32') {
    server.kill()
  } else {
    server.kill('SIGINT')
  }
  process.exit(0)
})
