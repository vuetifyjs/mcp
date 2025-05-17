#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { spawn } from 'node:child_process'
import pkg from '../package.json' with { type: 'json' }
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function setupEnvironment (args) {
  const env = { ...process.env }
  if (args['api-key']) {
    env.VUETIFY_API_KEY = args['api-key']
  }
  if (args['github-token']) {
    env.GITHUB_TOKEN = args['github-token']
  }
  return env
}

const defaultArgs = {
  'api-key': {
    type: 'string',
    description: 'Your Vuetify API key',
    valueHint: 'KEY',
  },
  'github-token': {
    type: 'string',
    description: 'GitHub token for accessing documentation',
    valueHint: 'TOKEN',
  },
}

const config = defineCommand({
  meta: {
    name: 'config',
    description: 'Configure Vuetify MCP Server for your IDE',
  },
  args: defaultArgs,
  run ({ args }) {
    const serverPath = path.resolve(__dirname, '../dist/cli/index.js')

    const env = setupEnvironment(args)

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
  },
})

const main = defineCommand({
  meta: {
    version: pkg.version,
    description: 'Vuetify MCP Server',
  },
  args: defaultArgs,
  subCommands: {
    config,
  },
  run ({ args }) {
    const command = args._[0]
    if (command === 'config') {
      return
    }
    const serverPath = path.resolve(__dirname, '../dist/index.js')

    const env = setupEnvironment(args)

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
  },
})

runMain(main)
