import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { startHttpServer } from './http.js'
import { ONE_TOOL_NAMES } from '#tools/one/names'

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

async function mcpJson (response: Response): Promise<any> {
  const text = await response.text()
  const ctype = response.headers.get('content-type') ?? ''
  if (ctype.includes('text/event-stream')) {
    const line = text.split('\n').find(l => l.startsWith('data: '))
    if (!line) throw new Error(`no SSE data: ${text}`)
    return JSON.parse(line.slice(6))
  }
  return JSON.parse(text)
}

const MUTATING_ONE_TOOLS = [
  'create_vuetify_bin',
  'update_vuetify_bin',
  'create_vuetify_link',
  'create_vuetify_playground',
  'update_vuetify_playground',
] as const

const READ_ONE_TOOLS = [
  'get_all_bins',
  'get_bin',
  'get_all_links',
  'get_all_playgrounds',
  'get_playground',
] as const

const EXPECTED_TOOLS = [
  'get_vuetify_api_by_version',
  'get_component_api_by_version',
  'get_directive_api_by_version',
  'get_installation_guide',
  'get_feature_guides',
  'get_feature_guide',
  'get_exposed_exports',
  'get_frequently_asked_questions',
  'get_release_notes_by_version',
  'get_vuetify_one_installation_guide',
  'get_upgrade_guide',
  'get_v4_breaking_changes',
  'get_vuetify0_installation_guide',
  'get_vuetify0_package_guide',
  'get_vuetify0_composable_list',
  'get_vuetify0_component_list',
  'get_vuetify0_composable_guide',
  'get_vuetify0_component_guide',
  'get_vuetify0_exports_list',
  'get_vuetify0_skill',
  'create_bug_report',
  ...MUTATING_ONE_TOOLS,
  ...READ_ONE_TOOLS,
] as const

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
    for (const name of ONE_TOOL_NAMES) {
      const response = await fetch(mcpUrl(server), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: { name, arguments: {} },
        }),
      })

      expect(response.status, name).toBe(401)
      expect(response.headers.get('www-authenticate')).toContain('resource_metadata')
      expect(await response.json()).toEqual({ error: 'unauthorized' })
    }
  })

  it('does not 401 unauthenticated public docs tools/call', async () => {
    for (const name of ['get_vuetify0_composable_list', 'get_installation_guide', 'create_bug_report'] as const) {
      const response = await fetch(mcpUrl(server), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: { name, arguments: {} },
        }),
      })

      expect(response.status, name).not.toBe(401)
      expect(response.status, name).not.toBe(403)
    }
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

describe('http origin validation', () => {
  let server: Server

  beforeAll(async () => {
    server = await startHttpServer({ host: '127.0.0.1', port: 0 })
  })

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
    })
  })

  function listBody () {
    return JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    })
  }

  it('does not 403 initialize or tools/list when Origin is missing', async () => {
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
      body: listBody(),
    })

    expect(initialize.status).not.toBe(403)
    expect(list.status).not.toBe(403)
    expect(initialize.headers.get('access-control-allow-origin')).toBeNull()
    expect(list.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('returns 403 for an invalid Origin', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: 'https://evil.example.com' },
      body: listBody(),
    })

    expect(response.status).toBe(403)
  })

  it('returns 403 for an empty Origin', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: '' },
      body: listBody(),
    })

    expect(response.status).toBe(403)
  })

  it('allows https://claude.ai', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: 'https://claude.ai' },
      body: listBody(),
    })

    expect(response.status).not.toBe(403)
  })

  it('allows http://127.0.0.1 with the listen port', async () => {
    const local = originUrl(server)
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: local },
      body: listBody(),
    })

    expect(response.status).not.toBe(403)
  })

  it('allows the default resource origin', async () => {
    const prev = process.env.MCP_SERVER_URL
    delete process.env.MCP_SERVER_URL
    try {
      const response = await fetch(mcpUrl(server), {
        method: 'POST',
        headers: { ...headers, Origin: 'https://mcp.vuetifyjs.com' },
        body: listBody(),
      })

      expect(response.status).not.toBe(403)
    } finally {
      if (prev === undefined) delete process.env.MCP_SERVER_URL
      else process.env.MCP_SERVER_URL = prev
    }
  })

  it('reflects an allowed Origin on MCP POST and does not use *', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: 'https://claude.ai' },
      body: listBody(),
    })

    expect(response.headers.get('access-control-allow-origin')).toBe('https://claude.ai')
    expect(response.headers.get('access-control-allow-origin')).not.toBe('*')
  })

  it('returns 403 for an invalid Origin on One tools/call before 401', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: 'https://evil.example.com' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'create_vuetify_bin', arguments: {} },
      }),
    })

    expect(response.status).toBe(403)
    expect(response.headers.get('www-authenticate')).toBeNull()
  })

  it('reflects an allowed Origin on OPTIONS and 403s an invalid one', async () => {
    const allowed = await fetch(mcpUrl(server), {
      method: 'OPTIONS',
      headers: { Origin: 'https://claude.ai' },
    })
    expect(allowed.status).toBe(204)
    expect(allowed.headers.get('access-control-allow-origin')).toBe('https://claude.ai')
    expect(allowed.headers.get('access-control-allow-origin')).not.toBe('*')

    const denied = await fetch(mcpUrl(server), {
      method: 'OPTIONS',
      headers: { Origin: 'https://evil.example.com' },
    })
    expect(denied.status).toBe(403)
  })

  it('reflects an allowed Origin on 401 One tools/call', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers: { ...headers, Origin: 'https://claude.ai' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'create_vuetify_bin', arguments: {} },
      }),
    })

    expect(response.status).toBe(401)
    expect(response.headers.get('access-control-allow-origin')).toBe('https://claude.ai')
  })
})

describe('http tool annotations', () => {
  let server: Server

  beforeAll(async () => {
    server = await startHttpServer({ host: '127.0.0.1', port: 0 })
  })

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
    })
  })

  it('lists every tool with title and exactly one of readOnly/destructive', async () => {
    const response = await fetch(mcpUrl(server), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      }),
    })

    expect(response.status).not.toBe(401)
    expect(response.status).not.toBe(403)

    const body = await mcpJson(response)
    const tools = body.result?.tools as Array<{
      name: string
      annotations?: {
        title?: string
        readOnlyHint?: boolean
        destructiveHint?: boolean
      }
    }>

    expect(Array.isArray(tools)).toBe(true)
    expect(tools.length).toBeGreaterThan(0)

    const names = tools.map(tool => tool.name)
    expect([...names].sort()).toEqual([...EXPECTED_TOOLS].sort())
    expect([...MUTATING_ONE_TOOLS, ...READ_ONE_TOOLS].sort()).toEqual([...ONE_TOOL_NAMES].sort())

    for (const tool of tools) {
      expect(tool.name.length).toBeLessThanOrEqual(64)
      expect(typeof tool.annotations?.title).toBe('string')
      expect(tool.annotations?.title?.length).toBeGreaterThan(0)

      const readOnly = tool.annotations?.readOnlyHint === true
      const destructive = tool.annotations?.destructiveHint === true
      expect(readOnly !== destructive).toBe(true)

      if ((MUTATING_ONE_TOOLS as readonly string[]).includes(tool.name)) {
        expect(tool.annotations?.destructiveHint).toBe(true)
        expect(tool.annotations?.readOnlyHint).not.toBe(true)
      } else {
        expect(tool.annotations?.readOnlyHint).toBe(true)
        expect(tool.annotations?.destructiveHint).not.toBe(true)
      }
    }

    for (const name of READ_ONE_TOOLS) {
      const tool = tools.find(item => item.name === name)
      expect(tool?.annotations?.readOnlyHint).toBe(true)
    }
  })
})
