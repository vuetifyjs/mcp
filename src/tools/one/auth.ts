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

export async function assertOk (response: Response): Promise<void> {
  if (response.ok) {
    return
  }

  const text = await response.text()
  if (response.status === 403 && text.trim() === 'Invalid Access') {
    throw new Error('This tool requires a Vuetify One subscription.')
  }
  throw new Error(text)
}
