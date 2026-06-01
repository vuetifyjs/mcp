#!/usr/bin/env node
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CLI_PACKAGE = '@vuetify/mcp-cli'
const CLI_VERSION_RANGE = '^1'

const env = { ...process.env }
const passthrough = []
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i]
  if (arg === '--api-key' && i + 1 < argv.length) {
    env.VUETIFY_API_KEY = argv[++i]
  } else if (arg === '--github-token' && i + 1 < argv.length) {
    env.GITHUB_TOKEN = argv[++i]
  } else {
    passthrough.push(arg)
  }
}

const first = passthrough[0]
const isSubcommand = Boolean(first) && !first.startsWith('-')

let command
let args
if (isSubcommand) {
  command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  args = ['--yes', `${CLI_PACKAGE}@${CLI_VERSION_RANGE}`, ...passthrough]
} else {
  command = process.execPath
  args = [path.resolve(__dirname, '../dist/index.js'), ...passthrough]
}

const child = spawn(command, args, {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})

child.on('error', err => {
  console.error(`Failed to start ${isSubcommand ? CLI_PACKAGE : 'server'}:`, err)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 0)
  }
})

const forward = signal => () => {
  if (process.platform === 'win32') {
    child.kill()
  } else {
    child.kill(signal)
  }
}
process.on('SIGINT', forward('SIGINT'))
process.on('SIGTERM', forward('SIGTERM'))
