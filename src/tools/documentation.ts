/**
 * Registers tools for documentation-related features.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { AVAILABLE_FEATURES, createDocumentationService, INSTALLATION_PLATFORMS } from '#services/documentation'
import type { InstallationPlatform, AvailableFeature } from '#services/documentation'
import { createVuetify0Service, VUETIFY0_COMPOSABLES, VUETIFY0_COMPONENTS } from '#services/vuetify0'
import type { Vuetify0Category, Vuetify0Component } from '#services/vuetify0'

export async function registerDocumentationTools (server: McpServer) {
  const platforms = Object.keys(INSTALLATION_PLATFORMS) as [InstallationPlatform, ...InstallationPlatform[]]
  const features = Object.keys(AVAILABLE_FEATURES) as [AvailableFeature, ...AvailableFeature[]]

  const documentation = createDocumentationService()
  const vuetify0 = createVuetify0Service()

  // Vuetify 3 (vuetify) Tools
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
    'get_feature_guides',
    'Get a list of available features in the documentation.',
    documentation.getFeatureGuides,
  )

  server.tool(
    'get_feature_guide',
    'Get the information about a specific feature in the documentation.',
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

  server.tool(
    'get_vuetify_one_installation_guide',
    'Get the README contents for @vuetify/one package from GitHub, including installation and usage instructions.',
    documentation.getVuetifyOneInstallationGuide,
  )

  // Vuetify0 (@vuetify/v0) Tools
  server.tool(
    'get_vuetify0_installation_guide',
    'Get the README contents for @vuetify/v0 (Vuetify0) package from GitHub, including installation and usage instructions for this headless meta-framework.',
    vuetify0.getInstallationGuide,
  )

  server.tool(
    'get_vuetify0_package_guide',
    'Get the package-specific documentation for @vuetify/v0 from GitHub.',
    vuetify0.getPackageGuide,
  )

  server.tool(
    'get_vuetify0_composable_list',
    'Get a comprehensive list of all composables available in @vuetify/v0, organized by category (foundation, registration, selection, forms, system, plugins, transformers).',
    vuetify0.getComposableList,
  )

  server.tool(
    'get_vuetify0_component_list',
    'Get a list of all headless components available in @vuetify/v0.',
    vuetify0.getComponentList,
  )

  const categories = Object.keys(VUETIFY0_COMPOSABLES) as [Vuetify0Category, ...Vuetify0Category[]]
  const components = Object.keys(VUETIFY0_COMPONENTS) as [Vuetify0Component, ...Vuetify0Component[]]

  server.tool(
    'get_vuetify0_composable_guide',
    'Get detailed documentation and source code for a specific @vuetify/v0 composable.',
    {
      category: z.enum(categories).describe(`The category of the composable. Available categories: ${categories.join(', ')}`),
      name: z.string().describe('The name of the composable (e.g., "createContext", "useSelection", "useTheme")'),
    },
    vuetify0.getComposableGuide,
  )

  server.tool(
    'get_vuetify0_component_guide',
    'Get detailed documentation and source code for a specific @vuetify/v0 component.',
    {
      name: z.enum(components).describe(`The name of the component. Available components: ${components.join(', ')}`),
    },
    vuetify0.getComponentGuide,
  )

  server.tool(
    'get_vuetify0_exports_list',
    'Get a list of all subpath exports available in @vuetify/v0 (utilities, types, constants, date adapter).',
    vuetify0.getExportsList,
  )
}
