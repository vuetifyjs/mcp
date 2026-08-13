import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startHttpServer } from './http.js'

const headers = {
  Accept: 'application/json, text/event-stream',
  'Content-Type': 'application/json',
}

function mcpUrl (server: Server): string {
  const address = server.address() as AddressInfo
  return `http://127.0.0.1:${address.port}/mcp`
}

function originUrl (server: Server): string {
  const address = server.address() as AddressInfo
  return `http://127.0.0.1:${address.port}`
}

describe('http oauth gate', () => {
  let server: Server

  beforeAll(async () => {
    server = await startHttpServer({ host: '127.0.0.1', port: 0 })
  })

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
    })
  })

  it('does not 401 unauthenticated initialize or tools/list', async () => {
    const url = mcpUrl(server)

    const initialize = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '0.0.0' },
        },
      }),
    })

    const list = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      }),
    })

    expect(initialize.status).not.toBe(401)
    expect(list.status).not.toBe(401)
  })

  it('returns 401 with WWW-Authenticate for unauthenticated One tools/call', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'create_vuetify_bin', arguments: {} },
      }),
    })

    expect(response.status).toBe(401)
    expect(response.headers.get('www-authenticate')).toContain('resource_metadata')
    expect(await response.json()).toEqual({ error: 'unauthorized' })
  })

  it('does not 401 unauthenticated public docs tools/call', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'get_vuetify0_composable_list', arguments: {} },
      }),
    })

    expect(response.status).not.toBe(401)
  })

  it('advertises RFC9728 resource with /mcp', async () => {
    const prev = process.env.MCP_SERVER_URL
    delete process.env.MCP_SERVER_URL
    try {
      const response = await fetch(`${originUrl(server)}/.well-known/oauth-protected-resource`)
      const body = await response.json()

      expect(body.resource).toBe('https://mcp.vuetifyjs.com/mcp')
    } finally {
      if (prev === undefined) delete process.env.MCP_SERVER_URL
      else process.env.MCP_SERVER_URL = prev
    }
  })

  it('uses MCP_SERVER_URL verbatim when set', async () => {
    const prev = process.env.MCP_SERVER_URL
    try {
      process.env.MCP_SERVER_URL = 'https://custom.example.com/foo'
      const custom = await fetch(`${originUrl(server)}/.well-known/oauth-protected-resource`)
      expect((await custom.json()).resource).toBe('https://custom.example.com/foo')

      process.env.MCP_SERVER_URL = 'http://localhost:3001'
      const local = await fetch(`${originUrl(server)}/.well-known/oauth-protected-resource`)
      expect((await local.json()).resource).toBe('http://localhost:3001')
    } finally {
      if (prev === undefined) delete process.env.MCP_SERVER_URL
      else process.env.MCP_SERVER_URL = prev
    }
  })
})
