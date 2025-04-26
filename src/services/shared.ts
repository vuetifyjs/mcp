import { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export interface CallToolService {
  [name: string]: (name?: string) => Promise<CallToolResult>
}
