/**
 * Implements an authentication transport wrapper for the MCP server.
 *
 * Adds API key validation to the transport layer for secure communication.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'

import { createAuthService } from '../services/auth.js'

export class AuthTransportWrapper implements Transport {
  private baseTransport: StdioServerTransport
  private authService = createAuthService('http://localhost:8096', 300000)
  private apiKey = process.env.VUETIFY_API_KEY!

  constructor (baseTransport: StdioServerTransport) {
    this.baseTransport = baseTransport

    this.baseTransport.onmessage = (message) => this.handleMessage(message)

    if (this.baseTransport.onerror) {
      this.baseTransport.onerror = (error) => this.handleError(error)
    }

    if (this.baseTransport.onclose) {
      this.baseTransport.onclose = () => this.handleClose()
    }
  }

  async start (): Promise<void> {
    return this.baseTransport.start()
  }

  async send (message: JSONRPCMessage): Promise<void> {
    return this.baseTransport.send(message)
  }

  async close (): Promise<void> {
    return this.baseTransport.close()
  }

  onmessage?: (message: JSONRPCMessage) => void
  onerror?: (error: Error) => void
  onclose?: () => void

  private async handleMessage (message: JSONRPCMessage): Promise<void> {
    const isValid = await this.authService.validateApiKey(this.apiKey)

    if (!isValid) {
      this.sendErrorResponse(message, 403, 'Invalid API key')
      return
    }

    if (this.onmessage) {
      this.onmessage(message)
    }
  }

  private handleError (error: Error): void {
    if (this.onerror) {
      this.onerror(error)
    }
  }

  private handleClose (): void {
    if (this.onclose) {
      this.onclose()
    }
  }

  private sendErrorResponse (msg: JSONRPCMessage, code: number, message: string): void {
    if ('id' in msg) {
      this.send({
        jsonrpc: '2.0',
        id: msg.id,
        error: {
          code,
          message,
        },
      })
    }

    if (this.onerror) {
      this.onerror(new Error(message))
    }
  }
}
