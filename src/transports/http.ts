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
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js'

type AuthenticatedRequest = IncomingMessage & { auth?: AuthInfo }

export interface HttpTransportOptions {
  port?: number
  host?: string
  path?: string
  stateless?: boolean
}

export class HttpTransport implements Transport {
  onclose?: () => void
  onerror?: (error: Error) => void
  onmessage?: (message: JSONRPCMessage) => void

  private streamableTransport: StreamableHTTPServerTransport
  private httpServer: ReturnType<typeof createServer> | null = null
  private options: Required<Omit<HttpTransportOptions, 'stateless'>> & { stateless: boolean }

  constructor (options: HttpTransportOptions = {}) {
    this.options = {
      port: options.port ?? 3000,
      host: options.host ?? 'localhost',
      path: options.path ?? '/mcp',
      stateless: options.stateless ?? false,
    }

    // Create streamable transport with session management
    this.streamableTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: this.options.stateless ? undefined : () => randomUUID(),
    })
  }

  async close (): Promise<void> {
    await this.streamableTransport.close()

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

  private async handleRequest (
    req: AuthenticatedRequest,
    res: ServerResponse,
  ): Promise<void> {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`)

    // Extract auth info from headers for tool handlers
    this.extractAuthInfo(req)

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

  private extractAuthInfo (req: AuthenticatedRequest): void {
    // Support both X-Vuetify-Api-Key and standard Authorization: Bearer
    const customHeader = req.headers['x-vuetify-api-key']
    const authHeader = req.headers.authorization
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    const token = (typeof customHeader === 'string' ? customHeader : undefined) || bearer

    if (token) {
      req.auth = {
        token,
        clientId: '',
        scopes: [],
      }
    }
  }
}
