/**
 * Provides documentation-related services for the Vuetify MCP server.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import octokit from '#plugins/octokit'

const VUETIFY_DEPENDENCIES = 'vue vuetify @mdi/font'
const VITE_DEPENDENCIES = 'vite @vitejs/plugin-vue vite-plugin-vuetify unplugin-fonts'

export const SSR_NOTE = `
  > **SSR Configuration**: When using Server-Side Rendering use *ssr: true*: \`createVuetify({ ssr: true })\`
`

export const FRESH_INSTALLATION_PLATFORMS = {
  vite: `
    \`\`\`bash
    npm create vite@latest <project-name> -- --template vue
    [pnpm|yarn|bun] create vite@latest <project-name> --template vue
    \`\`\`
  `,
  nuxt: `
    \`\`\`bash
    [npm|pnpm|yarn|bun] create nuxt <project-name>
    \`\`\`
  `,
  vitepress: `
    \`\`\`bash
    [npm|pnpm|yarn|bun] vitepress
    # OR
    [npx|pnpm|yarn|bun] vitepress init
    \`\`\`
  `,
  vuetify: `
    \`\`\`bash
    [npm|pnpm|yarn|bun] create vuetify <project-name>
    \`\`\`
  `,
} as const

export const INSTALLATION_PLATFORMS = {
  'vite': {
    name: 'Vite',
    description: 'Installation guide for Vite projects.',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install ${VUETIFY_DEPENDENCIES} ${VITE_DEPENDENCIES}
      \`\`\`
      # Files
      \`\`\`ts [src/plugins/vuetify.ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'

      export default createVuetify()
      \`\`\`
      \`\`\`ts [src/main.ts]
      import { createApp } from 'vue'
      import App from './App.vue'
      import vuetify from './plugins/vuetify'

      const app = createApp(App)
      app.use(vuetify).mount('#app')
      \`\`\`
      \`\`\`ts [vite.config.ts]
      import { defineConfig } from 'vite'
      import Vue from '@vitejs/plugin-vue'
      import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
      import { fileURLToPath, URL } from 'node:url'

      export default defineConfig({
        plugins: [
          Vue({ template: { transformAssetUrls } }),
          Vuetify({ autoImport: true }),
          Fonts({
            google: {
              families: [{
                name: 'Roboto',
                styles: 'wght@100;300;400;500;700;900',
              }],
            },
          })
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('src', import.meta.url)),
          },
          extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
          ],
        },
      })
      \`\`\`
    `,
  },
  'nuxt': {
    name: 'Nuxt',
    description: 'Installation guide for Nuxt projects.',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install ${VUETIFY_DEPENDENCIES} ${VITE_DEPENDENCIES}
      \`\`\`
      # Files
      \`\`\`ts [nuxt.config.ts]
      import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

      export default defineNuxtConfig({
        build: {
          transpile: ['vuetify'],
        },
        modules: [
          (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
              // @ts-expect-error
              config.plugins.push(vuetify({ autoImport: true }))
            })
          },
        ],
        vite: {
          vue: {
            template: {
              transformAssetUrls,
            },
          },
        },
      })
      \`\`\`
      \`\`\`ts [plugins/vuetify.ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'

      export default defineNuxtPlugin((app) => {
        const vuetify = createVuetify()
        app.vueApp.use(vuetify)
      })
      \`\`\`
      \`\`\`vue [App.vue]
      <template>
        <NuxtLayout>
          <v-app>
            <NuxtPage />
          </v-app>
        </NuxtLayout>
      </template>
      \`\`\`
    `,
  },
  'nuxt-module': {
    name: 'Nuxt Module',
    description: 'Installation guide for Vuetify Nuxt Module.',
    markdown: `
      # Nuxt Module Installation
      \`\`\`bash
      [npx|pnpm|yarn|bun] nuxi@latest module add vuetify-nuxt-module
      \`\`\`
      # Files
      \`\`\`ts [nuxt.config.ts]
      import { defineNuxtConfig } from 'nuxt/config'

      export default defineNuxtConfig({
        modules: ['vuetify-nuxt-module'],
        vuetify: {
          moduleOptions: {},
          vuetifyOptions: {}
        }
      })
      \`\`\`
    `,
  },
  'laravel': {
    name: 'Laravel Vite',
    description: 'Installation guide for Laravel Vite projects.',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install ${VUETIFY_DEPENDENCIES} ${VITE_DEPENDENCIES}
      \`\`\`
      # Files
      \`\`\`ts [resources/js/plugins/vuetify.ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'

      export default createVuetify()
      \`\`\`
      \`\`\`ts [resources/js/app.ts]
      import { createApp } from 'vue'
      import App from './App.vue'
      import vuetify from './plugins/vuetify'

      const app = createApp(App)
      app.use(vuetify).mount('#app')
      \`\`\`
      \`\`\`ts [vite.config.ts]
      import { defineConfig } from 'vite'
      import laravel from 'laravel-vite-plugin'
      import vue from '@vitejs/plugin-vue'
      import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
      import fonts from 'unplugin-fonts/vite'
      import { fileURLToPath, URL } from 'node:url'

      export default defineConfig({
        plugins: [
          laravel({
            input: ['resources/js/app.ts', 'resources/css/app.css'],
            refresh: true,
          }),
          vue({ template: { transformAssetUrls } }),
          vuetify({ autoImport: true }),
          fonts({
            google: {
              families: [{
                name: 'Roboto',
                styles: 'wght@100;300;400;500;700;900',
              }],
            },
          }),
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('src', import.meta.url)),
          },
          extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
          ],
        },
      })
      \`\`\`
    `,
  },
  'cdn': {
    name: 'CDN',
    description: 'Installation guide for using Vuetify via CDN.',
    markdown: `
      # CDN Installation
      To use Vuetify via CDN, include the following links in your HTML file:
      \`\`\`html
      <link href="https://cdn.jsdelivr.net/npm/vuetify@3.0.0/dist/vuetify.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css" rel="stylesheet">
      <link href="https://fonts.bunny.net/css?family=roboto:100,300,400,500,700,900" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/vue@3.0.0/dist/vue.global.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vuetify@3.0.0/dist/vuetify.js"></script>
      \`\`\`
      Then, initialize Vuetify in your JavaScript:
      \`\`\`js
      const { createApp } = Vue
      const { createVuetify } = Vuetify

      const vuetify = createVuetify()
      const app = createApp()
      app.use(vuetify).mount('#app')
      \`\`\`
`,
  },
  'cdn-esm': {
    name: 'CDN ES Module',
    description: 'Installation guide for using Vuetify via CDN with ES Modules.',
    markdown: `
      # CDN ES Module Installation
      To use Vuetify via CDN with ES Modules, include the following links in your HTML file:
      \`\`\`html
      <link href="https://cdn.jsdelivr.net/npm/vuetify@3.0.0/dist/vuetify.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css" rel="stylesheet">
      <link href="https://fonts.bunny.net/css?family=roboto:100,300,400,500,700,900" rel="stylesheet" />

      <script type="importmap">
      {
        "imports": {
          "vue": "https://cdn.jsdelivr.net/npm/vue@3.0.0/dist/vue.esm-browser.js",
          "vuetify": "https://cdn.jsdelivr.net/npm/vuetify@3.0.0/dist/vuetify.esm.js"
        }
      }
      </script>
      <script type="module">
      import { createApp } from 'vue'
      import { createVuetify } from 'vuetify'

      const vuetify = createVuetify()
      const app = createApp()

      app.use(vuetify).mount('#app')
      </script>
      \`\`\`
`,
  },
  'vitepress': {
    name: 'VitePress',
    description: 'Installation guide for VitePress projects.',
    markdown: `
      # VitePress Installation
      The following dependencies are required to use Vuetify with VitePress:
      - vue, vitepress, vuetify, @mdi/font
      # Files
      \`\`\`ts [.vitepress/theme/index.ts]
      import DefaultTheme from 'vitepress/theme'
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import * as components from 'vuetify/components'
      import * as directives from 'vuetify/directives'
      import { createVuetify } from 'vuetify'

      const vuetify = createVuetify({
        components,
        directives,
      })

      export default {
        ...DefaultTheme,
        enhanceApp({ app }) {
          app.use(vuetify)
        },
      }
      \`\`\`
`,
  },
  'vuetify0': {
    name: 'Vuetify0 (@vuetify/v0)',
    description: 'Installation guide for @vuetify/v0 - a headless meta-framework for building UI libraries.',
    markdown: `
      # @vuetify/v0 Installation

      @vuetify/v0 is a headless meta-framework providing unstyled components and composables for building design systems.

      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install vue @vuetify/v0
      \`\`\`

      # Basic Setup
      \`\`\`ts [src/main.ts]
      import { createApp } from 'vue'
      import App from './App.vue'

      const app = createApp(App)
      app.mount('#app')
      \`\`\`

      # Usage Example
      \`\`\`vue [src/components/Example.vue]
      <script setup lang="ts">
      import { createSelection } from '@vuetify/v0'

      const selection = createSelection({
        mandatory: true,
        multiple: true
      })

      // Register items with the selection
      selection.onboard([
        { id: 'item-1', value: 'Item 1' },
        { id: 'item-2', value: 'Item 2', disabled: true },
        { id: 'item-3', value: 'Item 3' },
      ])

      // Select items
      selection.select('item-1')
      selection.select('item-3')
      </script>

      <template>
        <div>
          <p>Selected: {{ selection.selectedIds.size }}</p>
          <button
            v-for="ticket in selection.tickets.value"
            :key="ticket.id"
            @click="ticket.toggle()"
            :class="{ selected: ticket.isSelected }"
            :disabled="ticket.disabled"
          >
            {{ ticket.value }}
          </button>
        </div>
      </template>
      \`\`\`

      # Available Composables
      - Foundation: createContext, createTrinity, createPlugin
      - Registration: useRegistry, useProxyRegistry, useQueue, useTimeline, useTokens
      - Selection: createSelection, useSelection, createGroup, useGroup, createSingle, useSingle, createStep, useStep, useFilter
      - Forms: useForm, useProxyModel
      - System: useEventListener, useIntersectionObserver, useKeydown, useMutationObserver, useResizeObserver
      - Plugins: useBreakpoints, useFeatures, useHydration, useLocale, useLogger, usePermissions, useStorage, useTheme
      - Transformers: toArray, toReactive

      # Documentation
      - Website: https://0.vuetifyjs.com/
      - GitHub: https://github.com/vuetifyjs/0
`,
  },
} as const

export const UPGRADE_FROM_VERSIONS = {
  'v1.5': {
    name: 'Vuetify v1.5 Upgrade',
    description: 'Upgrade from Vuetify v1.5 to v2.0',
    path: 'blob/v2-stable/packages/docs/src/pages/en/getting-started/upgrade-guide.md',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install vuetify@v2.0.0 eslint-plugin-vuetify@1.1.0
      \`\`\`
      # Files
      \`\`\`js [.eslintrc.js]
      module.exports = {
        extends: [
          'plugin:vue/base',
          'plugin:vuetify/base',
        ],
      }
      \`\`\`
    `,
  },
  'v2.7': {
    name: 'Vuetify v2.7 Upgrade',
    description: 'Upgrade from Vuetify v2.7 to v3.0',
    path: 'packages/docs/src/pages/en/getting-started/upgrade-guide.md',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install vuetify@v3.0.0 eslint-plugin-vuetify@2.0.0
      \`\`\`
    `,
  },
  'v3': {
    name: 'Vuetify v3 Upgrade',
    description: 'Upgrade from Vuetify v3.x to v4.0',
    path: 'packages/docs/src/pages/en/getting-started/upgrade-guide.md',
    markdown: `
      # Dependencies
      \`\`\`bash
      [npm|pnpm|yarn|bun] install vuetify@^4.0.0
      \`\`\`
    `,
  },
} as const

export const V4_BREAKING_CHANGES = {
  'styles': {
    name: 'CSS & Styles',
    description: 'CSS architecture changes including layers, reset, and entry points',
    changes: [
      {
        title: 'CSS Layers are now mandatory',
        description: 'Vuetify 4 always uses CSS layers for all styles. This changes how specificity works - you may need to adjust custom overrides that relied on !important or specificity hacks.',
        migration: 'Replace !important overrides with layer-aware CSS. Use @layer to control specificity.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/3400',
      },
      {
        title: 'Flattened layer names',
        description: 'CSS layer names have been flattened for simpler organization.',
        migration: 'Update any custom CSS that references Vuetify layer names.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/22443',
      },
      {
        title: 'Reduced CSS reset',
        description: 'The CSS reset has been cut down significantly.',
        migration: 'If you relied on Vuetify\'s reset for certain elements, you may need to add your own reset styles.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/17633',
      },
      {
        title: 'Removed overflow-y from reset',
        description: 'The overflow-y rule has been removed from the CSS reset.',
        migration: 'Add your own overflow-y styles if needed.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/1197',
      },
      {
        title: 'Separate style entry points',
        description: 'New granular style entry points: vuetify/styles, vuetify/styles/main, vuetify/styles/generic.',
        migration: 'Optionally use specific entry points for smaller bundles.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/20100',
      },
      {
        title: 'Opt-out from misc styles',
        description: 'You can now opt-out from miscellaneous utility styles.',
        migration: 'Use createVuetify({ styles: { misc: false } }) if desired.',
        issue: null,
      },
    ],
  },
  'theme': {
    name: 'Theme',
    description: 'Theme system changes',
    changes: [
      {
        title: 'Default theme changed to "system"',
        description: 'The default theme is now "system" instead of "light", respecting user\'s OS preference.',
        migration: 'If you need explicit light theme, set defaultTheme: "light" in createVuetify().',
        issue: null,
      },
      {
        title: 'Removed "unimportant" option',
        description: 'The theme.unimportant option has been removed (no longer needed with CSS layers).',
        migration: 'Remove any unimportant: true configuration.',
        issue: null,
      },
      {
        title: 'Transparent color support',
        description: 'Theme colors now support transparency.',
        migration: 'No migration needed - this is a new feature.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/10299',
      },
    ],
  },
  'display': {
    name: 'Display & Breakpoints',
    description: 'Breakpoint and display changes',
    changes: [
      {
        title: 'Reduced default breakpoint sizes',
        description: 'Default breakpoint values have been reduced to better match modern device sizes.',
        migration: 'If you have layouts depending on specific breakpoint values, review and adjust accordingly or override the breakpoints in your Vuetify config.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/19759',
      },
    ],
  },
  'grid': {
    name: 'Grid System',
    description: 'Grid system overhaul',
    changes: [
      {
        title: 'Grid system overhaul',
        description: 'The grid system (v-container, v-row, v-col) has been overhauled.',
        migration: 'Review grid usage and test layouts. Some class names or behaviors may have changed.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/8611',
      },
    ],
  },
  'typography': {
    name: 'Typography',
    description: 'Typography system changes',
    changes: [
      {
        title: 'MD3 typography',
        description: 'Typography now follows Material Design 3 specifications.',
        migration: 'Review text styling - font sizes, weights, and line heights may differ.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/22557',
      },
    ],
  },
  'elevation': {
    name: 'Elevation',
    description: 'Elevation system changes',
    changes: [
      {
        title: 'MD3 elevation levels',
        description: 'Elevation now uses Material Design 3 levels.',
        migration: 'Shadows may appear different. Review components using elevation prop.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/14198',
      },
    ],
  },
  'v-btn': {
    name: 'VBtn',
    description: 'Button component changes',
    changes: [
      {
        title: 'Removed default text transform',
        description: 'Buttons no longer have uppercase text by default.',
        migration: 'Add text-transform: uppercase in CSS if you want the old behavior.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/21079',
      },
      {
        title: 'Display changed from grid to flex',
        description: 'VBtn internal layout changed from CSS grid to flexbox.',
        migration: 'If you had custom CSS targeting button internals, review and adjust.',
        issue: null,
      },
    ],
  },
  'v-snackbar': {
    name: 'VSnackbar',
    description: 'Snackbar component changes',
    changes: [
      {
        title: 'Removed multi-line prop',
        description: 'The multi-line prop has been removed.',
        migration: 'Use CSS to style multi-line content instead.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/15996',
      },
    ],
  },
  'v-select': {
    name: 'VSelect / VAutocomplete / VCombobox',
    description: 'Select component changes',
    changes: [
      {
        title: 'Renamed item to internalItem in slots',
        description: 'The "item" slot prop has been renamed to "internalItem" for clarity.',
        migration: 'Update slot templates: #item="{ item }" becomes #item="{ internalItem }".',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/18354',
      },
    ],
  },
  'v-date-picker': {
    name: 'VDatePicker',
    description: 'Date picker component changes',
    changes: [
      {
        title: 'Range picker only emits start and end values',
        description: 'When using range selection, the picker now only emits start and end values, not intermediate states.',
        migration: 'Update range picker handlers if they relied on intermediate value emissions.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/18701',
      },
    ],
  },
  'v-form': {
    name: 'VForm',
    description: 'Form component changes',
    changes: [
      {
        title: 'Slot props are unreffed',
        description: 'VForm slot props are now unreffed (raw values instead of refs).',
        migration: 'Remove .value access from form slot props if you were using them as refs.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/18355',
      },
    ],
  },
  'v-img': {
    name: 'VImg',
    description: 'Image component changes',
    changes: [
      {
        title: 'Attributes pass through to img element',
        description: 'VImg now passes attributes to the underlying <img> element.',
        migration: 'Review any custom attributes - they will now apply to the img tag.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/18860',
      },
    ],
  },
  'nested': {
    name: 'Nested / Tree',
    description: 'Nested component changes',
    changes: [
      {
        title: 'Added branch select strategy',
        description: 'New "branch" select strategy for tree/nested components.',
        migration: 'No migration needed - this is a new feature.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/22404',
      },
    ],
  },
} as const

export type V4BreakingChangeCategory = keyof typeof V4_BREAKING_CHANGES

export const AVAILABLE_FEATURES = {
  'accessibility': 'Web accessibility (a11y for short), is the inclusive practice of ensuring there are no barriers that prevent the interaction with, or access to, websites on the World Wide Web by people with disabilities.',
  'aliasing': 'Create virtual components that extend built-in Vuetify components using custom aliases.',
  'application-layout': 'Vuetify features an application layout system that allows you to easily create complex website designs.',
  'blueprints': 'Vuetify blueprints are a new way to pre-configure your entire application with a completely unique design system.',
  'dates': 'Easily hook up date libraries that are used for components such as Date Picker and Calendar that require date functionality.',
  'display-and-platform': 'The display composable provides a multitude of information about the current device.',
  'global-configuration': 'Vuetify allows you to set default prop values globally or per component when setting up your application. Using this functionality you can for example disable ripple on all components, or set the default elevation for all sheets or buttons.',
  'icon-fonts': 'Out of the box, Vuetify supports 4 popular icon font libraries: Material Design Icons, Material Icons, Font Awesome 4 and Font Awesome 5.',
  'internationalization': 'Vuetify supports language Internationalization (i18n) of its components.',
  'programmatic-scrolling': 'Handle scrolling within your application by using the goTo function.',
  'sass-variables': 'Vuetify uses SASS/SCSS to craft the style and appearance of all aspects of the framework.',
  'theme': 'Customize your application’s default text colors, surfaces, and more. Easily modify your theme programmatically in real time. Vuetify comes with standard support for light and dark variants.',
} as const

export type InstallationPlatform = keyof typeof INSTALLATION_PLATFORMS
export type FreshInstallationPlatform = keyof typeof FRESH_INSTALLATION_PLATFORMS
export type AvailableFeature = keyof typeof AVAILABLE_FEATURES
export type UpgradeFromVersion = keyof typeof UPGRADE_FROM_VERSIONS

export function createDocumentationService () {
  return {
    getInstallationGuide: async ({ fresh, platform, ssr }: {
      platform: InstallationPlatform
      ssr: boolean
      fresh: boolean
    }) => {
      if (!INSTALLATION_PLATFORMS[platform]) {
        throw new Error(`Installation guide for platform "${platform}" not found.`)
      }

      if (ssr && !['vite', 'nuxt'].includes(platform)) {
        throw new Error('SSR installation guide is only available for Vite and Nuxt platforms.')
      }

      if (fresh && !(platform in FRESH_INSTALLATION_PLATFORMS)) {
        throw new Error(`Fresh installation guide for platform "${platform}" not found.`)
      }

      let text: string = INSTALLATION_PLATFORMS[platform].markdown

      if (fresh) {
        const freshText = FRESH_INSTALLATION_PLATFORMS[platform as FreshInstallationPlatform]

        text = `Setup a baseline project using "${platform}": ${freshText}\n${text}`
      }

      if (ssr) {
        text = `${SSR_NOTE}\n${text}`
      }

      return {
        content: [
          {
            type: 'text',
            text,
          } as const,
        ],
      }
    },
    getFeatureGuide: async ({ feature }: { feature: AvailableFeature }) => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: 'vuetify',
        path: `packages/docs/src/pages/en/features/${feature}.md`,
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: data as unknown as string,
          } as const,
        ],
      }
    },
    getFeatureGuides: async () => {
      return {
        content: [
          {
            type: 'text',
            text: 'Available Vuetify 3 features:\n\n' + Object.entries(AVAILABLE_FEATURES)
              .map(([feature, description]) => `${feature}: ${description}`)
              .join('\n'),
          } as const,
        ],
      }
    },
    getUpgradeGuide: async ({ version }: { version: UpgradeFromVersion }) => {
      const guide = UPGRADE_FROM_VERSIONS[version]

      // For v3 upgrade, fetch from next.vuetifyjs.com docs (v4 branch)
      const ref = version === 'v3' ? 'next' : undefined

      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: 'vuetify',
        path: guide.path,
        ref,
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `${guide.name}\n${guide.markdown}\n${data}`,
          } as const,
        ],
      }
    },
    getV4BreakingChanges: async ({ category }: { category?: V4BreakingChangeCategory }) => {
      if (category) {
        const cat = V4_BREAKING_CHANGES[category]
        if (!cat) {
          throw new Error(`Breaking change category "${category}" not found.`)
        }

        const text = `# ${cat.name}\n\n${cat.description}\n\n` + cat.changes.map(change => (
          `## ${change.title}\n\n${change.description}\n\n**Migration:** ${change.migration}`
          + (change.issue ? `\n\n**Related issue:** ${change.issue}` : '')
        )).join('\n\n---\n\n')

        return {
          content: [{ type: 'text', text } as const],
        }
      }

      // Return all categories summary
      const text = `# Vuetify 4 Breaking Changes\n\n`
        + `Upgrade guide: https://next.vuetifyjs.com/en/getting-started/upgrade-guide/\n\n`
        + Object.entries(V4_BREAKING_CHANGES).map(([key, cat]) => (
          `## ${cat.name} (${key})\n\n${cat.description}\n\n`
          + cat.changes.map(c => `- **${c.title}**: ${c.description}`).join('\n')
        )).join('\n\n---\n\n')

      return {
        content: [{ type: 'text', text } as const],
      }
    },
    getExposedExports: async () => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: 'vuetify',
        path: 'packages/docs/src/pages/en/getting-started/installation.md',
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `Review the Exposed exports section of the installation guide:\n\n${data}`,
          } as const,
        ],
      }
    },
    getFrequentlyAskedQuestions: async () => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: 'vuetify',
        path: 'packages/docs/src/pages/en/getting-started/frequently-asked-questions.md',
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `Review the Frequently Asked Questions section of the installation guide:\n\n${data}`,
          } as const,
        ],
      }
    },
    getReleaseNotesByVersion: async ({ version }: { version: string }) => {
      const isLatest = version === 'latest'
      const method = isLatest ? 'getLatestRelease' : 'getReleaseByTag'

      const { data } = await octokit.rest.repos[method]({
        owner: 'vuetifyjs',
        repo: 'vuetify',
        tag: isLatest ? '' : (version.startsWith('v') ? version : `v${version}`),
      })

      return {
        content: [
          {
            type: 'text',
            text: `Release notes for version ${version}:\n\n${data.body} (published ${data.published_at})`,
          } as const,
        ],
      }
    },
    getVuetifyOneInstallationGuide: async () => {
      const { data } = await octokit.rest.repos.getContent({
        owner: 'vuetifyjs',
        repo: 'one',
        path: 'README.md',
        mediaType: {
          format: 'raw',
        },
      })

      return {
        content: [
          {
            type: 'text',
            text: `# @vuetify/one Documentation\n\nSource: https://github.com/vuetifyjs/one\n\n${data}`,
          } as const,
        ],
      }
    },
  }
}
