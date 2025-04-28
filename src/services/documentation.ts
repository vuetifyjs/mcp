/**
 * Provides documentation-related services for the Vuetify MCP server.
 *
 * Includes functionality to fetch installation guides and other documentation.
 */
import octokit from '../plugins/octokit.js'

export const INSTALLATION_PLATFORMS = {
  vite: {
    name: 'Vite',
    description: 'Installation guide for Vite projects.',
    markdown: `
      # Dependencies
      The following dependencies are required to use Vuetify with Vite:
      - vue, vite, vuetify, vite-plugin-vuetify, @mdi/font
      # Files
      - src/plugins/vuetify.[js|ts]
      \`\`\`[js|ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'

      export default createVuetify()
      \`\`\`
      - src/main.[js|ts]
      \`\`\`[js|ts]
      import { createApp } from 'vue'
      import App from './App.vue'
      import vuetify from './plugins/vuetify'

      const app = createApp(App)
      app.use(vuetify).mount('#app')
      \`\`\`
      - vite.config.[mjs|js|mts|ts]
      \`\`\`[mjs|js|mts|ts]
      import { defineConfig } from 'vite'
      import vue from '@vitejs/plugin-vue'
      import vuetify from 'vite-plugin-vuetify'

      export default defineConfig({
        plugins: [
          vue(),
          vuetify({
            autoImport: true,
          }),
        ],
      })
      \`\`\`
`,
  },
  nuxt: {
    name: 'Nuxt',
    description: 'Installation guide for Nuxt projects.',
    markdown: `
      # Nuxt Installation
      The following dependencies are required to use Vuetify with Nuxt:
      - vue, nuxt, vuetify, vite-plugin-vuetify, @mdi/font

      # Files
      - nuxt.config.[js|ts]
      \`\`\`[js|ts]
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

      - plugins/vuetify.[js|ts]
      \`\`\`[js|ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'

      export default defineNuxtPlugin((app) => {
        const vuetify = createVuetify()
        app.vueApp.use(vuetify)
      })
      \`\`\`

      - app.vue
      \`\`\`vue
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
      The following dependencies are required to use Vuetify with Nuxt Module:
      - vue, nuxt, vuetify, vite-plugin-vuetify, @mdi/font, vuetify-nuxt-module

      # Installation
      \`\`\`bash
      pnpx nuxi@latest module add vuetify-nuxt-module
      \`\`\`

      # Files
      - nuxt.config.[js|ts]
      \`\`\`[js|ts]
      import { defineNuxtConfig } from 'nuxt/config'

      export default defineNuxtConfig({
        modules: [
          'vuetify-nuxt-module'
        ],
        vuetify: {
          moduleOptions: {},
          vuetifyOptions: {}
        }
      })
      \`\`\`
`,
  },
  laravel: {
    name: 'Laravel Vite',
    description: 'Installation guide for Laravel Vite projects.',
    markdown: `
      # Laravel Vite Installation
      The following dependencies are required to use Vuetify with Laravel Vite:
      TODO
`,
  },
  'laravel-mix': {
    name: 'Laravel Mix',
    description: 'Installation guide for Laravel Mix projects.',
    markdown: `
      # Laravel Mix Installation
      The following dependencies are required to use Vuetify with Laravel Mix:
      - vue, vuetify, @mdi/font
      # Files
      - resources/[js|ts]/plugins/vuetify.[js|ts]
      \`\`\`[js|ts]
      import '@mdi/font/css/materialdesignicons.css'
      import 'vuetify/styles'
      import { createVuetify } from 'vuetify'
      import * as components from 'vuetify/components'
      import * as directives from 'vuetify/directives'

      export default createVuetify({
        components,
        directives,
      })
      \`\`\`
      - resources/[js|ts]/app.[js|ts]
      \`\`\`[js|ts]
      import { createApp } from 'vue'
      import App from './App.vue'
      import vuetify from './plugins/vuetify'

      const app = createApp(App)
      app.use(vuetify).mount('#app')
      \`\`\`
      - webpack.mix.[js|ts]
      \`\`\`[js|ts]
      const mix = require('laravel-mix')

      mix.copy('node_modules/@mdi/font/fonts/', 'dist/fonts/')
      \`\`\`
`,
  },
  cdn: {
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
          "vue": "https://cdn.jsdelivr.net/npm/vue@latest/dist/vue.esm-browser.js",
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
  vitepress: {
    name: 'VitePress',
    description: 'Installation guide for VitePress projects.',
    markdown: `
      # VitePress Installation
      The following dependencies are required to use Vuetify with VitePress:
      - vue, vitepress, vuetify, @mdi/font
      # Files
      - .vitepress/theme/index.[js|ts]
      \`\`\`[js|ts]
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
} as const

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
export type AvailableFeature = keyof typeof AVAILABLE_FEATURES

export function createDocumentationService () {
  return {
    getInstallationGuide: async (platform: InstallationPlatform, ssr: boolean) => {
      if (!INSTALLATION_PLATFORMS[platform]) {
        throw new Error(`Installation guide for platform "${platform}" not found.`)
      }

      let text: string = INSTALLATION_PLATFORMS[platform].markdown

      if (ssr && !['vite', 'nuxt'].includes(platform)) {
        throw new Error('SSR installation guide is only available for Vite and Nuxt platforms.')
      }

      if (ssr) {
        const ssrNote = `
      > **SSR Configuration**: When using Server-Side Rendering, you must pass the \`ssr: true\` option to all \`createVuetify()\` instances in your code.
      > For example: \`createVuetify({ ssr: true })\` or \`createVuetify({ ssr: true, components, directives })\`
`
        text = `${ssrNote}\n${text}`
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
    getFeatureGuide: async (feature: AvailableFeature) => {
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
  }
}
