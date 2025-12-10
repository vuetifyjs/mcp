/**
 * Streamable HTTP Server
 *
 * Implements stateless HTTP transport for MCP server.
 * Creates a new transport and server connection per request.
 */
import { createServer } from 'node:http'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import type { IncomingMessage, ServerResponse, Server } from 'node:http'

import { registerPrompts } from '#prompts/index'
import { registerResources } from '#resources/index'
import { registerTools } from '#tools/index'
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

  await registerResources(server)
  await registerPrompts(server)
  await registerTools(server)

  return server
}

export async function startHttpServer (options: HttpServerOptions = {}): Promise<Server> {
  const port = options.port ?? 3000
  const host = options.host ?? 'localhost'
  const path = options.path ?? '/mcp'

  // Initialize rate limiter if options provided
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
      console.error(`MCP Server listening on http://${host}:${path}`)
      resolve(httpServer)
    })
  })
}

function getClientIdentifier (req: IncomingMessage): string {
  // Use session ID if available (for stateful mode)
  const sessionId = req.headers['mcp-session-id']
  if (sessionId && typeof sessionId === 'string') {
    return `session:${sessionId}`
  }

  // Fall back to IP address
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id, X-Vuetify-Api-Key',
    })
    res.end()
    return
  }

  // Check rate limit (skip for health check and root endpoints)
  if (rateLimiter && req.url !== '/health' && req.url !== '/') {
    const clientId = getClientIdentifier(req)
    const rateLimitResult = rateLimiter.check(clientId)

    // Always add rate limit headers
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

  // Only handle requests to the MCP path
  if (req.url !== mcpPath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end(`Not Found. Try ${mcpPath} for MCP endpoint or /health for health check.`)
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
