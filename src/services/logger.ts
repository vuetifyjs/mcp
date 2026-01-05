/**
 * MCP Logger Service
 *
 * Sends tool usage logs to the Vuetify API for analytics and debugging.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const API_SERVER = process.env.VUETIFY_API_SERVER || 'https://api.vuetifyjs.com'

interface LogPayload {
  tool: string
  params?: Record<string, unknown>
  duration: number
  error?: string
}

let apiKey: string | undefined

export function setApiKey (key: string | undefined) {
  apiKey = key
}

export async function logToolCall (payload: LogPayload): Promise<void> {
  if (!apiKey) {
    return
  }

  try {
    await fetch(`${API_SERVER}/one/mcp/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Fire and forget - don't let logging failures affect tool execution
  }
}

type AnyFunction = (...args: any[]) => any

export function withToolLogging (server: McpServer): McpServer {
  const originalTool = server.tool.bind(server) as AnyFunction

  ;(server as any).tool = function (name: string, ...args: unknown[]) {
    const handlerIndex = args.findIndex(arg => typeof arg === 'function')
    if (handlerIndex === -1) {
      return originalTool(name, ...args)
    }

    const handler = args[handlerIndex] as AnyFunction
    const wrappedHandler = async (params: unknown, extra: unknown) => {
      const start = performance.now()
      let error: string | undefined

      try {
        return await handler(params, extra)
      } catch (error_) {
        error = error_ instanceof Error ? error_.message : String(error_)
        throw error_
      } finally {
        const duration = Math.round(performance.now() - start)
        logToolCall({ tool: name, duration, error })
      }
    }

    args[handlerIndex] = wrappedHandler
    return originalTool(name, ...args)
  }

  return server
}
