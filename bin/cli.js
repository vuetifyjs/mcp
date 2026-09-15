#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const CLI_PACKAGE = '@vuetify/mcp-cli'
const CLI_VERSION_RANGE = '^1'

export function resolveSpawnConfig (argv = process.argv.slice(2), platform = process.platform) {
  const env = { ...process.env }
  const passthrough = []
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
    command = platform === 'win32' ? 'npx.cmd' : 'npx'
    args = ['--yes', `${CLI_PACKAGE}@${CLI_VERSION_RANGE}`, ...passthrough]
  } else {
    command = process.execPath
    args = [path.resolve(__dirname, '../dist/index.js'), ...passthrough]
  }

  return {
    command,
    args,
    env,
    isSubcommand,
    // .cmd shims need a shell; do not let cmd.exe re-parse execPath
    shell: platform === 'win32' && isSubcommand,
  }
}

function main () {
  const { command, args, env, isSubcommand, shell } = resolveSpawnConfig()

  const child = spawn(command, args, {
    stdio: 'inherit',
    env,
    shell,
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
}

export function isMainModule (importMetaUrl, argv1) {
  if (!argv1) {
    return false
  }
  try {
    return fileURLToPath(importMetaUrl) === fs.realpathSync(argv1)
  } catch {
    return importMetaUrl === pathToFileURL(path.resolve(argv1)).href
  }
}

if (isMainModule(import.meta.url, process.argv[1])) {
  main()
}
