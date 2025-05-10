/**
 * Implements an authentication transport wrapper for the MCP server.
 *
 * Adds API key validation to the transport layer for secure communication.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js'

import { createAuthService } from '@/services/auth'

export class AuthTransportWrapper implements Transport {
  private stdioTransport = new StdioServerTransport()
  private authService = createAuthService()
  private apiKey = process.env.VUETIFY_API_KEY!

  onmessage?: (message: JSONRPCMessage) => void
  onerror?: (error: Error) => void
  onclose?: () => void

  constructor () {
    this.stdioTransport.onmessage = this.handleMessage.bind(this)
    this.stdioTransport.onerror = this.handleError.bind(this)
    this.stdioTransport.onclose = this.handleClose.bind(this)
  }

  async start () {
    return this.stdioTransport.start()
  }

  async send (message: JSONRPCMessage) {
    return this.stdioTransport.send(message)
  }

  async close () {
    return this.stdioTransport.close()
  }

  private async handleMessage (message: JSONRPCMessage) {
    const isValid = await this.authService.validateApiKey(this.apiKey)

    if (!isValid) {
      this.sendErrorResponse(message, 403, 'Invalid API key')
      return
    }

    this.onmessage?.(message)
  }

  private handleError (error: Error) {
    this.onerror?.(error)
  }

  private handleClose () {
    this.onclose?.()
  }

  private sendErrorResponse (msg: JSONRPCMessage, code: number, message: string) {
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

    this.onerror?.(new Error(message))
  }
}
