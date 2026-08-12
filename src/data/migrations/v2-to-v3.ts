/**
 * Migration metadata for Vuetify v2.7 → v3 upgrade.
 *
 * This is a major migration that involves moving from Vue 2 to Vue 3.
 * Uses eslint-plugin-vuetify@2 deprecated rules as primary tooling.
 */
import type { MigrationRule } from './schema.js'

const DOCS_BASE = 'https://vuetifyjs.com/en/getting-started/upgrade-guide'

export const V2_TO_V3_RULES: MigrationRule[] = [
  {
    id: 'v3/vue3-migration',
    title: 'Vue 3 migration required',
    severity: 'high',
    category: 'utilities',
    detect: {
      grep: ['vue@2', '"vue": "^2', '"vue": "~2'],
      files: ['package.json'],
    },
    replace: [
      { from: '"vue": "^2', to: '"vue": "^3', note: 'Vue 3 required' },
    ],
    docs: `${DOCS_BASE}#vue-3`,
    description: 'Vuetify 3 requires Vue 3. This is a prerequisite for all other migration steps.',
    migration: 'First migrate your application from Vue 2 to Vue 3 using the official Vue migration guide.',
  },
  {
    id: 'v3/composition-api',
    title: 'Composition API adoption',
    severity: 'high',
    category: 'composables',
    detect: {
      grep: ['this.$vuetify', 'this.$refs', 'this.$'],
      files: ['**/*.vue', '**/*.js', '**/*.ts'],
    },
    replace: [
      { from: 'this.$vuetify', to: 'useVuetify()', note: 'Use composables instead' },
      { from: 'this.$vuetify.theme', to: 'useTheme()' },
      { from: 'this.$vuetify.display', to: 'useDisplay()' },
    ],
    docs: `${DOCS_BASE}#composables`,
    description: 'Vuetify 3 uses Composition API composables instead of instance properties.',
    migration: 'Replace this.$vuetify.* with corresponding composables: useTheme(), useDisplay(), useLocale(), etc.',
  },
  {
    id: 'v3/createVuetify',
    title: 'Plugin installation changes',
    severity: 'high',
    category: 'utilities',
    detect: {
      grep: ['new Vuetify', 'Vue.use(Vuetify)'],
      files: ['**/*.js', '**/*.ts'],
    },
    replace: [
      { from: 'new Vuetify({', to: 'createVuetify({' },
      { from: 'Vue.use(Vuetify)', to: 'app.use(vuetify)' },
    ],
    docs: `${DOCS_BASE}#installation`,
    description: 'Vuetify 3 uses createVuetify() factory instead of new Vuetify().',
    migration: 'Replace new Vuetify() with createVuetify() and update plugin registration.',
  },
  {
    id: 'v3/removed-components',
    title: 'Removed components',
    severity: 'high',
    category: 'components',
    detect: {
      grep: [
        'v-calendar',
        'v-treeview',
        'v-time-picker',
        'v-data-iterator',
        'v-skeleton-loader',
      ],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#removed-components`,
    description: 'Several components were removed or replaced in v3. Some returned in later v3.x releases.',
    migration: 'Check if the component has been re-added in latest v3.x or use alternatives.',
  },
  {
    id: 'v3/slot-changes',
    title: 'Slot name changes',
    severity: 'high',
    category: 'components',
    detect: {
      grep: [
        'v-slot:activator',
        '#activator',
        'slot="activator"',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'slot="activator"', to: '#activator', note: 'Vue 3 slot syntax' },
    ],
    docs: `${DOCS_BASE}#slots`,
    description: 'Slot names and scoped slot syntax changed to align with Vue 3.',
    migration: 'Update slot syntax to Vue 3 v-slot or # shorthand.',
  },
  {
    id: 'v3/sass-variables',
    title: 'SASS variable changes',
    severity: 'medium',
    category: 'styles',
    detect: {
      grep: ['$border-radius-root', '$headings-', '$body-font-family'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [],
    docs: `${DOCS_BASE}#sass`,
    description: 'Many SASS variables were renamed or restructured in v3.',
    migration: 'Review and update SASS variable overrides. See upgrade guide for mapping.',
  },
  {
    id: 'v3/vite-required',
    title: 'Build tool migration',
    severity: 'high',
    category: 'utilities',
    detect: {
      grep: ['vue-cli-service', '@vue/cli', 'webpack'],
      files: ['package.json', '**/*.config.js'],
    },
    replace: [],
    docs: `${DOCS_BASE}#build-tools`,
    description: 'Vuetify 3 works best with Vite. Vue CLI / Webpack still supported but Vite recommended.',
    migration: 'Consider migrating from Vue CLI to Vite for best developer experience.',
  },
  {
    id: 'v3/a-la-carte',
    title: 'Automatic tree-shaking',
    severity: 'medium',
    category: 'utilities',
    detect: {
      grep: ['vuetify/lib', 'VuetifyLoaderPlugin', 'a-la-carte'],
      files: ['**/*.js', '**/*.ts', '**/*.config.*'],
    },
    replace: [
      { from: 'VuetifyLoaderPlugin', to: 'vite-plugin-vuetify', note: 'Use Vite plugin' },
    ],
    docs: `${DOCS_BASE}#tree-shaking`,
    description: 'Vuetify 3 has automatic tree-shaking via vite-plugin-vuetify or webpack-plugin-vuetify.',
    migration: 'Remove manual a-la-carte imports and use vite-plugin-vuetify with autoImport: true.',
  },
  {
    id: 'v3/icons',
    title: 'Icon configuration changes',
    severity: 'medium',
    category: 'utilities',
    detect: {
      grep: ['iconfont:', 'icons:', '@mdi/font'],
      files: ['**/*.js', '**/*.ts'],
    },
    replace: [],
    docs: `${DOCS_BASE}#icons`,
    description: 'Icon configuration moved under icons.defaultSet in createVuetify().',
    migration: 'Update icon configuration to use the new icons option structure.',
  },
  {
    id: 'v3/global-config',
    title: 'Global configuration changes',
    severity: 'medium',
    category: 'utilities',
    detect: {
      grep: ['options:', 'customProperties:', 'minifyTheme:'],
      files: ['**/*.js', '**/*.ts'],
    },
    replace: [],
    docs: `${DOCS_BASE}#configuration`,
    description: 'Vuetify configuration options structure changed significantly.',
    migration: 'Review createVuetify() options and update to v3 structure.',
  },
]
