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

function buildServerArgs (args) {
  const serverArgs = []
  if (args.transport) {
    serverArgs.push('--transport', args.transport)
  }
  if (args.port) {
    serverArgs.push('--port', args.port)
  }
  if (args.host) {
    serverArgs.push('--host', args.host)
  }
  if (args.path) {
    serverArgs.push('--path', args.path)
  }
  if (args.stateless) {
    serverArgs.push('--stateless')
  }
  return serverArgs
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
  'transport': {
    type: 'string',
    description: 'Transport type (stdio or http)',
    valueHint: 'TYPE',
  },
  'port': {
    type: 'string',
    description: 'Port for HTTP transport',
    valueHint: 'PORT',
  },
  'host': {
    type: 'string',
    description: 'Host for HTTP transport',
    valueHint: 'HOST',
  },
  'path': {
    type: 'string',
    description: 'Path for HTTP transport',
    valueHint: 'PATH',
  },
  'stateless': {
    type: 'boolean',
    description: 'Run HTTP transport in stateless mode',
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
    const serverArgs = buildServerArgs(args)

    const server = spawn('node', [serverPath, ...serverArgs], {
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
    const serverArgs = buildServerArgs(args)

    const server = spawn('node', [serverPath, ...serverArgs], {
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
