/**
 * Migration metadata for Vuetify v1.5 → v2 upgrade.
 *
 * Source of truth: v2-stable
 * packages/docs/src/pages/en/getting-started/upgrade-guide.md
 *
 * v-content lives on this hop only. $vuetify.breakpoint is unchanged
 * in v2; the official rename to $vuetify.display is the v2→v3 hop.
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
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'v-layout', to: 'v-row', note: 'Complete grid rewrite' },
      { from: 'v-flex', to: 'v-col' },
      { from: 'xs12', to: 'cols="12"' },
    ],
    docs: `${DOCS_BASE}#grid`,
    description: 'The grid system was rewritten. v-layout becomes v-row, v-flex becomes v-col.',
    migration: 'Use eslint-plugin-vuetify@1 with deprecated rules to identify and migrate grid usage.',
  },
  {
    id: 'v2/component-names',
    title: 'Component naming changes',
    severity: 'high',
    category: 'components',
    detect: {
      grep: [
        'v-jumbotron', 'v-content',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'v-jumbotron', to: 'v-responsive', note: 'Removed. Compose v-responsive + v-sheet if you need the old surface.' },
      { from: 'v-content', to: 'v-main', note: 'v1 hop only. Do not apply this on v2→v3 or v3→v4.' },
    ],
    docs: `${DOCS_BASE}#v-jumbotron`,
    description: 'v-content was renamed to v-main. v-jumbotron was removed.',
    migration: 'Rename v-content to v-main. Replace v-jumbotron with v-responsive (plus v-sheet if needed).',
  },
  {
    id: 'v2/theme-api',
    title: 'Theme configuration changes',
    severity: 'medium',
    category: 'theme',
    detect: {
      grep: ['theme: false', 'dark: true', 'theme: {'],
      files: ['**/*.js', '**/*.ts'],
    },
    replace: [
      { from: 'theme: false', to: 'theme: { disable: true }' },
      {
        from: 'dark: true',
        to: 'theme: { dark: true }',
        note: 'Root dark moved under theme. Color tokens move into theme.themes.light / theme.themes.dark',
      },
    ],
    docs: `${DOCS_BASE}#theme`,
    description: 'dark moved under theme. Theme colors live in theme.themes.{light,dark}. theme: false became theme: { disable: true }.',
    migration: 'Update the Vuetify constructor options to the v2 theme object shown in the upgrade guide.',
  },
]
