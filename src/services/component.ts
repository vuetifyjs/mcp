/**
 * Provides services for managing Vuetify components.
 *
 * Includes functionality to retrieve component properties and details.
 */
import type { CallToolService } from './shared.js'

function getComponentApi (componentName: string) {
  return `Props for ${componentName} component...`
}

export function createComponentService (): CallToolService {
  return {
    getComponentApi: async componentName => {
      return {
        content: [{
          type: 'text',
          text: getComponentApi(componentName!),
        }],
      }
    },
  }
}
