/**
 * Registers tools for reporting issues via the Vuetify issues site.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const ISSUES_URL = 'https://issues.vuetifyjs.com'

const REPO_SLUGS = [
  'vuetify',
  'vuetify/docs',
  'vuetify0',
  'mcp',
  'play',
  'bin',
  'studio',
  'snips',
  'link',
  'issues',
] as const

export function registerIssuesTools (server: McpServer) {
  server.tool(
    'create_bug_report',
    'Generate a link to the Vuetify issues site with the repository and bug report type pre-selected.',
    {
      repo: z.enum(REPO_SLUGS).describe(`The repository to report a bug against. Available: ${REPO_SLUGS.join(', ')}`),
      label: z.string().optional().describe('Optional label to pre-fill on the bug report.'),
    },
    ({ repo, label }) => {
      const params = new URLSearchParams({ repo, type: 'bug' })

      if (label) {
        params.set('label', label)
      }

      const url = `${ISSUES_URL}/?${params}`

      return {
        content: [{
          type: 'text',
          text: `Open the following link to file a bug report: ${url}`,
        }],
      }
    },
  )
}
