/**
 * Provides documentation-related services for the Vuetify MCP server.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import { Octokit } from 'octokit'

import { CallToolService } from './shared.js'

async function getInstallationGuide () {
  const octokit = new Octokit()

  const { data } = await octokit.rest.repos.getContent({
    owner: 'vuetifyjs',
    repo: 'vuetify',
    path: 'packages/docs/src/pages/en/getting-started/installation.md',
    mediaType: {
      format: 'raw',
    },
  })

  return data as unknown as string
}

export function createDocumentationService (): CallToolService {
  return {
    getInstallationGuide: async () => {
      return {
        content: [{
          type: 'text',
          text: await getInstallationGuide(),
        }],
      }
    },
  }
}
