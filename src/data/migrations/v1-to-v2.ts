/**
 * Migration metadata for Vuetify v1.5 → v2 upgrade.
 *
 * This hop relies primarily on eslint-plugin-vuetify deprecated rules.
 * Full rule catalog is not provided as the v2-stable branch is frozen
 * and the primary migration path is via linting.
 */
import type { MigrationRule } from './schema.js'

const DOCS_BASE = 'https://v2.vuetifyjs.com/en/getting-started/upgrade-guide'

export const V1_TO_V2_RULES: MigrationRule[] = [
  {
    id: 'v2/grid-system',
    title: 'Grid system rewrite',
    severity: 'high',
    category: 'grid',
    detect: {
      grep: [
        'v-layout', 'v-flex',
        'xs12', 'sm6', 'md4', 'lg3', 'xl2',
        'row', 'column', 'wrap',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'v-layout', to: 'v-row', note: 'Complete grid rewrite' },
      { from: 'v-flex', to: 'v-col' },
      { from: 'xs12', to: 'cols="12"' },
    ],
    docs: `${DOCS_BASE}#grid`,
    description: 'The grid system was completely rewritten. v-layout becomes v-row, v-flex becomes v-col.',
    migration: 'Use eslint-plugin-vuetify@1 with deprecated rules to identify and migrate grid usage.',
  },
  {
    id: 'v2/component-names',
    title: 'Component naming changes',
    severity: 'high',
    category: 'components',
    detect: {
      grep: [
        'v-jumbotron', 'v-content', 'v-app-bar',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'v-jumbotron', to: 'v-responsive + v-sheet', note: 'Component removed' },
      { from: 'v-content', to: 'v-main' },
    ],
    docs: `${DOCS_BASE}#components`,
    description: 'Several components were renamed or removed in v2.',
    migration: 'Run eslint-plugin-vuetify@1 to identify deprecated components.',
  },
  {
    id: 'v2/breakpoints',
    title: 'Breakpoint service changes',
    severity: 'medium',
    category: 'display',
    detect: {
      grep: ['$vuetify.breakpoint', 'this.breakpoint'],
      files: ['**/*.vue', '**/*.js', '**/*.ts'],
    },
    replace: [
      { from: '$vuetify.breakpoint', to: '$vuetify.breakpoint', note: 'API largely unchanged, review edge cases' },
    ],
    docs: `${DOCS_BASE}#breakpoints`,
    description: 'Breakpoint service received minor API changes.',
    migration: 'Review breakpoint usage for edge cases.',
  },
  {
    id: 'v2/theme-api',
    title: 'Theme configuration changes',
    severity: 'medium',
    category: 'theme',
    detect: {
      grep: ['theme:', 'primary:', 'secondary:', 'dark:'],
      files: ['**/*.js', '**/*.ts'],
    },
    replace: [],
    docs: `${DOCS_BASE}#theme`,
    description: 'Theme configuration structure changed in v2.',
    migration: 'Update theme configuration to v2 format. See upgrade guide for structure.',
  },
]
