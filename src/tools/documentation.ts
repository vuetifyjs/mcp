/**
 * Registers tools for documentation-related features.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { AVAILABLE_FEATURES, createDocumentationService, INSTALLATION_PLATFORMS } from '#services/documentation'
import type { InstallationPlatform, AvailableFeature } from '#services/documentation'

export async function registerDocumentationTools (server: McpServer) {
  const platforms = Object.keys(INSTALLATION_PLATFORMS) as [InstallationPlatform, ...InstallationPlatform[]]
  const features = Object.keys(AVAILABLE_FEATURES) as [AvailableFeature, ...AvailableFeature[]]

  const documentation = createDocumentationService()

  server.tool(
    'get_installation_guide',
    'Get detailed information about how to install Vuetify in a variety of environments.',
    {
      platform: z.enum(platforms).default('vite').describe(`The platform for which to get the installation guide. Available platforms: ${platforms.join(', ')}`),
      ssr: z.boolean().default(false).describe('Whether to return the SSR version of the installation guide.'),
      fresh: z.boolean().default(false).describe('Whether the user has an existing project or is starting fresh.'),
    },
    documentation.getInstallationGuide,
  )

  server.tool(
    'get_available_features',
    'Get a list of available features in the documentation.',
    {
      feature: z.enum(features).describe(`The feature for which to get the documentation. Available features: ${features.join(', ')}`),
    },
    documentation.getFeatureGuide,
  )

  server.tool(
    'get_exposed_exports',
    'Get a list of exports from the Vuetify npm package',
    documentation.getExposedExports,
  )

  server.tool(
    'get_frequently_asked_questions',
    'Get a list of frequently asked questions about Vuetify.',
    documentation.getFrequentlyAskedQuestions,
  )

  server.tool(
    'get_release_notes_by_version',
    'Get release notes for one or more versions of Vuetify.',
    {
      version: z.string().describe('One or more Vuetify versions for which to get the release notes.').default('latest'),
    },
    documentation.getReleaseNotesByVersion,
  )
}
