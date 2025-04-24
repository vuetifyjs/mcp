/**
 * Provides documentation-related services for the Vuetify MCP server.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import { CallToolService } from './shared.js'

function getInstallationGuide () {
  return 'Installation guide...'
}

export function createDocumentationService (): CallToolService {
  return {
    getInstallationGuide: async () => {
      return {
        content: [{
          type: 'text',
          text: getInstallationGuide(),
        }],
      }
    },
  }
}
