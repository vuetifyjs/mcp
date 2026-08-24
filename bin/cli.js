#!/usr/bin/env node
import { spawn } from 'node:child_process'
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
    // The server is spawned as `process.execPath`. With the shell enabled on
    // Windows the command is re-parsed by `cmd.exe`, which splits the
    // executable path on spaces (e.g. `C:\Program Files\nodejs\node.exe`) and
    // fails with `'C:\Program' is not recognized`. Only Windows `.cmd` shims
    // (npx) actually require a shell.
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

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main()
}
