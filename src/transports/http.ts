/**
 * Streamable HTTP Server
 *
 * Implements stateless HTTP transport for MCP server.
 * Creates a new transport and server connection per request.
 */
import process from 'node:process'
import { createServer } from 'node:http'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import type { IncomingMessage, ServerResponse, Server } from 'node:http'

import { registerPrompts } from '#prompts/index'
import { registerResources } from '#resources/index'
import { registerTools } from '#tools/index'
import { setApiKey, withToolLogging } from '#services/logger'
import packageJson from '../../package.json' with { type: 'json' }
import { RateLimiter } from '../utils/rate-limiter.js'
import type { RateLimiterOptions } from '../utils/rate-limiter.js'

export interface HttpServerOptions {
  port?: number
  host?: string
  path?: string
  rateLimit?: RateLimiterOptions
}

async function createMcpServer () {
  const server = new McpServer({
    name: 'Vuetify',
    version: packageJson.version,
    capabilities: {
      resources: {
        description: 'No resources required for Vuetify assistance.',
      },
      tools: {
        description: 'Tools to help with Vuetify component properties, layouts, and documentation.',
      },
      prompts: {
        description: 'Prompts to assist with Vuetify component usage and best practices.',
      },
    },
  })

  withToolLogging(server)

  await registerResources(server)
  await registerPrompts(server)
  await registerTools(server)

  return server
}

export async function startHttpServer (options: HttpServerOptions = {}): Promise<Server> {
  const port = options.port ?? 3000
  const host = options.host ?? 'localhost'
  const path = options.path ?? '/mcp'

  const rateLimiter = options.rateLimit ? new RateLimiter(options.rateLimit) : null

  return new Promise((resolve, reject) => {
    const httpServer = createServer(async (req, res) => {
      try {
        await handleRequest(req, res, path, rateLimiter, options.rateLimit)
      } catch (error) {
        console.error('Error handling request:', error)
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Internal Server Error')
        }
      }
    })

    httpServer.on('error', reject)

    httpServer.listen(port, host, () => {
      console.error(`MCP Server listening on http://${host}:${port}${path}`)
      resolve(httpServer)
    })
  })
}

function getClientIdentifier (req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.socket.remoteAddress
  return `ip:${ip ?? 'unknown'}`
}

async function handleRequest (
  req: IncomingMessage,
  res: ServerResponse,
  mcpPath: string,
  rateLimiter: RateLimiter | null,
  rateLimitOptions?: RateLimiterOptions,
): Promise<void> {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Vuetify-Api-Key',
    })
    res.end()
    return
  }

  if (rateLimiter && req.url !== '/health' && req.url !== '/') {
    const clientId = getClientIdentifier(req)
    const rateLimitResult = rateLimiter.check(clientId)

    if (rateLimitOptions) {
      res.setHeader('X-RateLimit-Limit', rateLimitOptions.maxRequests.toString())
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
    }

    if (!rateLimitResult.allowed) {
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': rateLimitResult.retryAfter?.toString() ?? '60',
      })
      res.end(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimitResult.retryAfter,
        resetTime: new Date(rateLimitResult.resetTime).toISOString(),
      }))
      return
    }
  }

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  // Root endpoint - info page
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      name: 'Vuetify MCP Server',
      version: packageJson.version,
      mcp_endpoint: mcpPath,
      health_endpoint: '/health',
    }))
    return
  }

  // RFC 9728 — OAuth 2.0 Protected Resource Metadata
  if (req.url?.startsWith('/.well-known/oauth-protected-resource') && req.method === 'GET') {
    const serverUrl = process.env.MCP_SERVER_URL ?? 'https://mcp.vuetifyjs.com'
    const apiUrl = process.env.VUETIFY_API_SERVER ?? 'https://api.vuetifyjs.com'
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    })
    res.end(JSON.stringify({
      resource: serverUrl,
      authorization_servers: [apiUrl],
      scopes_supported: ['mcp'],
      bearer_methods_supported: ['header'],
    }))
    return
  }

  // RFC 8414 — Authorization Server Metadata (proxy to API)
  // Some MCP SDK versions fetch this from the resource server directly
  if (
    (req.url === '/.well-known/oauth-authorization-server' ||
     req.url === '/.well-known/openid-configuration') &&
    req.method === 'GET'
  ) {
    const apiUrl = process.env.VUETIFY_API_SERVER ?? 'https://api.vuetifyjs.com'
    const serverUrl = process.env.MCP_SERVER_URL ?? 'https://mcp.vuetifyjs.com'
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=3600',
    })
    res.end(JSON.stringify({
      issuer: apiUrl,
      authorization_endpoint: `${apiUrl}/oauth/authorize`,
      token_endpoint: `${apiUrl}/oauth/token`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      authorization_response_iss_parameter_supported: true,
      client_id_metadata_document_supported: true,
      protected_resources: [serverUrl],
    }))
    return
  }

  // Redirect /authorize and /mcp/authorize to the API's OAuth endpoint
  if (req.url?.match(/^(\/mcp)?\/authorize(\?.*)?$/) && req.method === 'GET') {
    const apiUrl = process.env.VUETIFY_API_SERVER ?? 'https://api.vuetifyjs.com'
    const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
    res.writeHead(302, { Location: `${apiUrl}/oauth/authorize${qs}` })
    res.end()
    return
  }

  // Only handle requests to the MCP path
  if (req.url !== mcpPath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end(`Not Found. Try ${mcpPath} for MCP endpoint or /health for health check.`)
    return
  }

  // Require auth on all MCP requests — triggers OAuth2 flow in supporting clients
  if (req.method === 'POST' && !extractAuthToken(req)) {
    const serverUrl = process.env.MCP_SERVER_URL ?? 'https://mcp.vuetifyjs.com'
    res.writeHead(401, {
      'Content-Type': 'application/json',
      'WWW-Authenticate': `Bearer resource_metadata="${serverUrl}/.well-known/oauth-protected-resource"`,
    })
    res.end(JSON.stringify({ error: 'unauthorized' }))
    return
  }

  // MCP endpoint - stateless mode: create new server + transport per request
  if (req.method === 'POST') {
    await handleMcpPost(req, res)
    return
  }

  // GET and DELETE not supported in stateless mode
  if (req.method === 'GET' || req.method === 'DELETE') {
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method Not Allowed - stateless mode only supports POST')
    return
  }

  res.writeHead(405, { 'Content-Type': 'text/plain' })
  res.end('Method Not Allowed')
}

async function handleMcpPost (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  // Parse request body
  const body = await parseBody(req)
  if (!body) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Bad Request - Invalid JSON')
    return
  }

  // Workaround: Ensure Accept header includes text/event-stream for SSE
  // Some clients (e.g., Claude Code) may not send the correct Accept header
  if (!req.headers.accept?.includes('text/event-stream')) {
    req.headers.accept = 'application/json, text/event-stream'
  }

  // Extract auth from headers and set on request for transport
  const token = extractAuthToken(req)
  if (token) {
    ;(req as any).auth = {
      token,
      clientId: '',
      scopes: [],
    }
  }

  // Set API key for logging
  setApiKey(token)

  // Create fresh transport for this request (stateless mode)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  })

  // Create fresh MCP server
  const server = await createMcpServer()

  // Connect server to transport
  await server.connect(transport)

  // Set up cleanup on close
  transport.onclose = () => {
    server.close().catch(error => console.error('Error closing server:', error))
  }

  // Handle the request
  await transport.handleRequest(req, res, body)
}

function parseBody (req: IncomingMessage): Promise<unknown> {
  return new Promise(resolve => {
    let data = ''
    req.on('data', chunk => {
      data += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(null)
      }
    })
    req.on('error', () => resolve(null))
  })
}

function extractAuthToken (req: IncomingMessage): string | undefined {
  const customHeader = req.headers['x-vuetify-api-key']
  const authHeader = req.headers.authorization
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  return (typeof customHeader === 'string' ? customHeader : undefined) || bearer
}
