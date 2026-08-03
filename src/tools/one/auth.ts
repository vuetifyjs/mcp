import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { ServerRequest, ServerNotification } from '@modelcontextprotocol/sdk/types.js'

type Extra = RequestHandlerExtra<ServerRequest, ServerNotification>

export function getApiKey (extra: Extra): string {
  const key = extra.authInfo?.token || process.env.VUETIFY_API_KEY || ''
  if (!key) {
    throw new Error('Please re-authenticate with Vuetify One to use this tool.')
  }
  return key
}