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
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
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

    // Only handle requests to the MCP path
    if (req.url !== this.options.path) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
      return
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
