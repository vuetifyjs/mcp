import { CallToolService } from './shared.js'

function getInstallationGuide () {
  return 'Installation guide...'
}

export function useDocumentationService (): CallToolService {
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
