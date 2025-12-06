/**
 * Streamable HTTP Transport Implementation
 *
 * Provides Streamable HTTP transport for MCP server
 * Supports both stateful and stateless modes
 */
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'
import { RateLimiter } from '../utils/rate-limiter.js'
import type { RateLimiterOptions } from '../utils/rate-limiter.js'

export interface HttpTransportOptions {
  port?: number
  host?: string
  path?: string
  stateless?: boolean
  rateLimit: RateLimiterOptions
}

export class HttpTransport implements Transport {
  onclose?: () => void
  onerror?: (error: Error) => void
  onmessage?: (message: JSONRPCMessage) => void

  private streamableTransport: StreamableHTTPServerTransport
  private httpServer: ReturnType<typeof createServer> | null = null
  private options: Required<Omit<HttpTransportOptions, 'stateless'>> & { stateless: boolean }
  private rateLimiter: RateLimiter

  constructor (options: Partial<HttpTransportOptions> & { rateLimit: RateLimiterOptions }) {
    this.options = {
      port: options.port ?? 3000,
      host: options.host ?? 'localhost',
      path: options.path ?? '/mcp',
      stateless: options.stateless ?? false,
      rateLimit: options.rateLimit,
    }

    // Create streamable transport with session management
    this.streamableTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: this.options.stateless ? undefined : () => randomUUID(),
    })

    // Initialize rate limiter
    this.rateLimiter = new RateLimiter(this.options.rateLimit)
  }

  async close (): Promise<void> {
    await this.streamableTransport.close()

    // Clean up rate limiter
    this.rateLimiter.destroy()

    if (this.httpServer) {
      return new Promise((resolve, reject) => {
        this.httpServer!.close(error => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }
  }

  async send (message: JSONRPCMessage): Promise<void> {
    return this.streamableTransport.send(message)
  }

  async start (): Promise<void> {
    // Set up message handlers
    this.streamableTransport.onmessage = this.onmessage
    this.streamableTransport.onerror = this.onerror
    this.streamableTransport.onclose = this.onclose

    await this.streamableTransport.start()

    return new Promise((resolve, reject) => {
      this.httpServer = createServer((req, res) => {
        this.handleRequest(req, res).catch(error => {
          console.error('Error handling request:', error)
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end('Internal Server Error')
          }
        })
      })

      this.httpServer.on('error', error => {
        reject(error)
        this.onerror?.(error)
      })

      this.httpServer.listen(this.options.port, this.options.host, () => {
        console.error(
          `MCP Server listening on http://${this.options.host}:${this.options.port}${this.options.path}`,
        )
        resolve()
      })
    })
  }

  private getClientIdentifier (req: IncomingMessage): string {
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

  private async handleRequest (
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id',
      })
      res.end()
      return
    }

    // Check rate limit (skip if VUETIFY_API_KEY is defined, or for health check and root endpoints)
    const hasApiKey = !!process.env.VUETIFY_API_KEY
    if (!hasApiKey && req.url !== '/health' && req.url !== '/') {
      const clientId = this.getClientIdentifier(req)
      const rateLimitResult = this.rateLimiter.check(clientId)

      // Always add rate limit headers
      res.setHeader('X-RateLimit-Limit', this.options.rateLimit.maxRequests.toString())
      res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())

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
        version: '0.1.1',
        mcp_endpoint: this.options.path,
        health_endpoint: '/health',
      }))
      return
    }

    // Only handle requests to the MCP path
    if (req.url !== this.options.path) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end(`Not Found. Try ${this.options.path} for MCP endpoint or /health for health check.`)
      return
    }

    // Workaround: Ensure Accept header includes text/event-stream for SSE
    // Some clients (e.g., Claude Code) may not send the correct Accept header
    if (!req.headers.accept?.includes('text/event-stream')) {
      req.headers.accept = 'application/json, text/event-stream'
    }

    // For POST requests, parse the body first
    if (req.method === 'POST') {
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString()
      })

      req.on('end', async () => {
        try {
          const parsedBody = JSON.parse(body)
          await this.streamableTransport.handleRequest(req, res, parsedBody)
        } catch (error) {
          console.error('Error handling POST request:', error)
          if (!res.headersSent) {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Bad Request')
          }
        }
      })
      return
    }

    // For GET and DELETE, pass directly to streamable transport
    if (req.method === 'GET' || req.method === 'DELETE') {
      await this.streamableTransport.handleRequest(req, res)
      return
    }

    // Method not allowed
    res.writeHead(405, { 'Content-Type': 'text/plain' })
    res.end('Method Not Allowed')
  }
}
