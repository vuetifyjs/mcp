/**
 * Registers tools for documentation-related features.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { AVAILABLE_FEATURES, createDocumentationService, INSTALLATION_PLATFORMS } from '../services/documentation.js'
import type { InstallationPlatform, AvailableFeature } from '../services/documentation.js'

const documentation = createDocumentationService()

export async function registerDocumentationTools (server: McpServer) {
  const platforms = Object.keys(INSTALLATION_PLATFORMS) as InstallationPlatform[]
  const features = Object.keys(AVAILABLE_FEATURES) as AvailableFeature[]

  server.tool(
    'get_installation_guide',
    'Get detailed information about how to install Vuetify in a variety of environments.',
    {
      platform: z.enum(platforms as [InstallationPlatform, ...InstallationPlatform[]]).describe(`The platform for which to get the installation guide. Available platforms: ${platforms.join(', ')}`),
      ssr: z.boolean().default(false).describe('Whether to return the SSR version of the installation guide.'),
    },
    async ({ platform, ssr }) => documentation.getInstallationGuide(platform, ssr),
  )

  server.tool(
    'get_available_features',
    'Get a list of available features in the documentation.',
    {
      feature: z.enum(features as [AvailableFeature, ...AvailableFeature[]]).describe(`The feature for which to get the documentation. Available features: ${features.join(', ')}`),
    },
    async ({ feature }) => documentation.getFeatureGuide(feature),
  )
}
