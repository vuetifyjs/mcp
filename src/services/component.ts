import { CallToolService } from './shared.js'

function getComponentApi (componentName: string) {
  return `Props for ${componentName} component...`
}

export function useComponentService (): CallToolService {
  return {
    getComponentApi: async (componentName) => {
      return {
        content: [{
          type: 'text',
          text: getComponentApi(componentName!),
        }],
      }
    },
  }
}
