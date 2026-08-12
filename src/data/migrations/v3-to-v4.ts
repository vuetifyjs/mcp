/**
 * Migration rules for Vuetify v3 → v4 upgrade.
 *
 * Rules are aligned with the official upgrade guide at:
 * https://next.vuetifyjs.com/en/getting-started/upgrade-guide/
 *
 * Codemod field references vuetify-codemods plugin names where available.
 */
import type { MigrationRule } from './schema.js'

const DOCS_BASE = 'https://next.vuetifyjs.com/en/getting-started/upgrade-guide'

export const V3_TO_V4_RULES: MigrationRule[] = [
  // Typography
  {
    id: 'v4/typography-classes',
    title: 'MD3 typography class names',
    severity: 'high',
    category: 'typography',
    detect: {
      grep: [
        'text-h1', 'text-h2', 'text-h3', 'text-h4', 'text-h5', 'text-h6',
        'text-subtitle-1', 'text-subtitle-2',
        'text-body-1', 'text-body-2',
        'text-button', 'text-caption', 'text-overline',
      ],
      files: ['**/*.vue', '**/*.ts', '**/*.js', '**/*.scss', '**/*.css'],
    },
    replace: [
      { from: 'text-h1', to: 'text-display-large', note: 'MD3 display scale' },
      { from: 'text-h2', to: 'text-display-medium' },
      { from: 'text-h3', to: 'text-display-small' },
      { from: 'text-h4', to: 'text-headline-large' },
      { from: 'text-h5', to: 'text-headline-medium' },
      { from: 'text-h6', to: 'text-headline-small' },
      { from: 'text-subtitle-1', to: 'text-title-large' },
      { from: 'text-subtitle-2', to: 'text-title-medium' },
      { from: 'text-body-1', to: 'text-body-large' },
      { from: 'text-body-2', to: 'text-body-medium' },
      { from: 'text-button', to: 'text-label-large' },
      { from: 'text-caption', to: 'text-body-small' },
      { from: 'text-overline', to: 'text-label-small' },
    ],
    codemod: 'typography',
    docs: `${DOCS_BASE}#typography`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/22557',
    description: 'Typography now follows Material Design 3 specifications with new class names.',
    migration: 'Replace MD2 typography classes with MD3 equivalents. Run vuetify-codemods typography plugin for automated migration.',
  },

  // Elevation
  {
    id: 'v4/elevation-levels',
    title: 'MD3 elevation levels',
    severity: 'medium',
    category: 'elevation',
    detect: {
      grep: [
        'elevation-', ':elevation=',
        'elevation="[0-9]+"', 'elevation=[0-9]+',
      ],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'elevation > 5', to: 'elevation 0-5', note: 'MD3 uses levels 0-5 only' },
    ],
    docs: `${DOCS_BASE}#elevation`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/14198',
    description: 'Elevation now uses Material Design 3 levels (0-5 instead of 0-24). Shadows may appear different.',
    migration: 'Review components using elevation prop. Map high values (6-24) to MD3 range (0-5).',
  },

  // Grid System
  {
    id: 'v4/grid-overhaul',
    title: 'Grid system overhaul',
    severity: 'high',
    category: 'grid',
    detect: {
      grep: ['v-container', 'v-row', 'v-col', 'v-spacer'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#grid`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/8611',
    description: 'The grid system (v-container, v-row, v-col) has been overhauled for MD3.',
    migration: 'Review grid usage and test layouts. Some class names or behaviors may have changed. The grid is now based on CSS Grid instead of Flexbox.',
  },

  // VSnackbar
  {
    id: 'v4/snackbar-multi-line',
    title: 'VSnackbar multi-line prop removed',
    severity: 'medium',
    category: 'components',
    component: 'VSnackbar',
    detect: {
      grep: ['multi-line', ':multi-line', 'multiLine'],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'multi-line', to: '', note: 'Use CSS styling instead' },
      { from: ':multi-line="true"', to: '' },
    ],
    docs: `${DOCS_BASE}#v-snackbar`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/15996',
    description: 'The multi-line prop has been removed from VSnackbar.',
    migration: 'Remove multi-line prop and use CSS to style multi-line content instead.',
  },

  // VSnackbarQueue (new component)
  {
    id: 'v4/snackbar-queue',
    title: 'VSnackbarQueue component',
    severity: 'low',
    category: 'components',
    component: 'VSnackbarQueue',
    detect: {
      grep: ['VSnackbarQueue', 'v-snackbar-queue'],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-snackbar-queue`,
    description: 'New VSnackbarQueue component for managing multiple snackbars.',
    migration: 'Consider using VSnackbarQueue for managing multiple sequential snackbar notifications.',
  },

  // VCombobox/VSelect/VAutocomplete item slot
  {
    id: 'v4/combobox-item-slot',
    title: 'VSelect/VAutocomplete/VCombobox item slot renamed',
    severity: 'high',
    category: 'components',
    component: 'VSelect',
    detect: {
      grep: [
        '#item="{ item',
        'v-slot:item="{ item',
        'slot="item"',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: '{ item }', to: '{ internalItem }', note: 'Rename slot prop' },
      { from: '{ item,', to: '{ internalItem,', note: 'Rename in destructuring' },
    ],
    docs: `${DOCS_BASE}#v-select`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18354',
    description: 'The "item" slot prop has been renamed to "internalItem" in VSelect, VAutocomplete, and VCombobox.',
    migration: 'Update slot templates: #item="{ item }" becomes #item="{ internalItem }".',
  },

  // VForm slot props
  {
    id: 'v4/form-slot-unreffed',
    title: 'VForm slot props unreffed',
    severity: 'medium',
    category: 'components',
    component: 'VForm',
    detect: {
      grep: [
        String.raw`isValid\.value`,
        String.raw`errors\.value`,
        String.raw`isValidating\.value`,
      ],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'isValid.value', to: 'isValid' },
      { from: 'errors.value', to: 'errors' },
      { from: 'isValidating.value', to: 'isValidating' },
    ],
    docs: `${DOCS_BASE}#v-form`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18355',
    description: 'VForm slot props are now unreffed (raw values instead of refs).',
    migration: 'Remove .value access from form slot props if you were using them as refs.',
  },

  // VBadge
  {
    id: 'v4/badge-changes',
    title: 'VBadge updates',
    severity: 'low',
    category: 'components',
    component: 'VBadge',
    detect: {
      grep: ['v-badge', 'VBadge'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-badge`,
    description: 'VBadge has received styling and behavior updates for MD3 compliance.',
    migration: 'Review badge styling. Default appearance may have changed.',
  },

  // VContainer
  {
    id: 'v4/container-fluid',
    title: 'VContainer fluid behavior',
    severity: 'medium',
    category: 'components',
    component: 'VContainer',
    detect: {
      grep: ['v-container', ':fluid', 'fluid='],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-container`,
    description: 'VContainer fluid prop behavior has been updated.',
    migration: 'Review container width behavior with and without fluid prop.',
  },

  // VCounter
  {
    id: 'v4/counter-updates',
    title: 'VCounter component updates',
    severity: 'low',
    category: 'components',
    component: 'VCounter',
    detect: {
      grep: ['v-counter', 'VCounter'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-counter`,
    description: 'VCounter has received updates for MD3 styling.',
    migration: 'Review counter appearance in text fields and text areas.',
  },

  // VFileInput
  {
    id: 'v4/file-input-updates',
    title: 'VFileInput updates',
    severity: 'medium',
    category: 'components',
    component: 'VFileInput',
    detect: {
      grep: ['v-file-input', 'VFileInput'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-file-input`,
    description: 'VFileInput has received styling and behavior updates.',
    migration: 'Review file input appearance and chip display behavior.',
  },

  // VRadioGroup
  {
    id: 'v4/radio-group-updates',
    title: 'VRadioGroup updates',
    severity: 'medium',
    category: 'components',
    component: 'VRadioGroup',
    detect: {
      grep: ['v-radio-group', 'VRadioGroup'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-radio-group`,
    description: 'VRadioGroup has received updates for better accessibility and MD3 styling.',
    migration: 'Review radio group layout and styling.',
  },

  // VTextField
  {
    id: 'v4/text-field-updates',
    title: 'VTextField updates',
    severity: 'medium',
    category: 'components',
    component: 'VTextField',
    detect: {
      grep: ['v-text-field', 'VTextField'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-text-field`,
    description: 'VTextField has received updates for MD3 styling including label behavior.',
    migration: 'Review text field appearance, especially floating labels and density.',
  },

  // VBtn
  {
    id: 'v4/btn-text-transform',
    title: 'VBtn uppercase removed',
    severity: 'medium',
    category: 'components',
    component: 'VBtn',
    detect: {
      grep: ['v-btn', 'VBtn'],
      files: ['**/*.vue'],
    },
    replace: [],
    revert: {
      snippet: `.v-btn { text-transform: uppercase; }`,
      description: 'Add to global styles to restore v3 button text transform.',
    },
    docs: `${DOCS_BASE}#v-btn`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/21079',
    description: 'Buttons no longer have uppercase text by default. Internal layout changed from CSS grid to flexbox.',
    migration: 'Add text-transform: uppercase in CSS if you want the old behavior. Review any custom CSS targeting button internals.',
  },

  // VImg
  {
    id: 'v4/img-attrs',
    title: 'VImg attribute passthrough',
    severity: 'low',
    category: 'components',
    component: 'VImg',
    detect: {
      grep: ['v-img', 'VImg'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-img`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18860',
    description: 'VImg now passes attributes to the underlying <img> element.',
    migration: 'Review any custom attributes - they will now apply to the img tag.',
  },

  // VDatePicker
  {
    id: 'v4/date-picker-range',
    title: 'VDatePicker range emissions',
    severity: 'medium',
    category: 'components',
    component: 'VDatePicker',
    detect: {
      grep: ['v-date-picker', 'VDatePicker', 'range'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#v-date-picker`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18701',
    description: 'When using range selection, the picker now only emits start and end values, not intermediate states.',
    migration: 'Update range picker handlers if they relied on intermediate value emissions.',
  },

  // CSS Layers
  {
    id: 'v4/css-layers',
    title: 'CSS layers mandatory',
    severity: 'high',
    category: 'styles',
    detect: {
      grep: ['!important', '@layer'],
      files: ['**/*.vue', '**/*.scss', '**/*.css'],
    },
    replace: [],
    docs: `${DOCS_BASE}#css-layers`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/3400',
    description: 'Vuetify 4 always uses CSS layers for all styles. This changes how specificity works.',
    migration: 'Replace !important overrides with layer-aware CSS. Use @layer to control specificity. See docs for layer order.',
  },

  // Layer names flattened
  {
    id: 'v4/layer-names',
    title: 'Flattened CSS layer names',
    severity: 'medium',
    category: 'styles',
    detect: {
      grep: ['@layer vuetify', '@layer components', '@layer utilities'],
      files: ['**/*.scss', '**/*.css'],
    },
    replace: [],
    docs: `${DOCS_BASE}#css-layers`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/22443',
    description: 'CSS layer names have been flattened for simpler organization.',
    migration: 'Update any custom CSS that references Vuetify layer names.',
  },

  // CSS Reset
  {
    id: 'v4/css-reset',
    title: 'Reduced CSS reset',
    severity: 'medium',
    category: 'styles',
    detect: {
      grep: ['vuetify/styles', 'import \'vuetify'],
      files: ['**/*.ts', '**/*.js', '**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#css-reset`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/17633',
    description: 'The CSS reset has been cut down significantly. overflow-y rule removed.',
    migration: 'If you relied on Vuetify\'s reset for certain elements, you may need to add your own reset styles.',
  },

  // Style entry points
  {
    id: 'v4/style-entry-points',
    title: 'Separate style entry points',
    severity: 'low',
    category: 'styles',
    detect: {
      grep: ['vuetify/styles'],
      files: ['**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'import \'vuetify/styles\'', to: 'import \'vuetify/styles\'', note: 'Still works, but new granular options available' },
    ],
    docs: `${DOCS_BASE}#style-entry-points`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/20100',
    description: 'New granular style entry points: vuetify/styles, vuetify/styles/main, vuetify/styles/generic.',
    migration: 'Optionally use specific entry points for smaller bundles.',
  },

  // Theme default
  {
    id: 'v4/theme-default',
    title: 'Default theme is "system"',
    severity: 'medium',
    category: 'theme',
    detect: {
      grep: ['createVuetify', 'defaultTheme'],
      files: ['**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'defaultTheme: undefined', to: 'defaultTheme: \'light\'', note: 'To restore v3 behavior' },
    ],
    revert: {
      snippet: `createVuetify({ theme: { defaultTheme: 'light' } })`,
      description: 'Explicitly set light theme to restore v3 behavior.',
    },
    docs: `${DOCS_BASE}#theme`,
    description: 'The default theme is now \'system\' instead of \'light\', respecting user\'s OS preference.',
    migration: 'If you need explicit light theme, set defaultTheme: \'light\' in createVuetify().',
  },

  // Theme unimportant removed
  {
    id: 'v4/theme-unimportant',
    title: 'Theme unimportant option removed',
    severity: 'low',
    category: 'theme',
    detect: {
      grep: ['unimportant:', 'unimportant:'],
      files: ['**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'unimportant: true', to: '', note: 'No longer needed with CSS layers' },
    ],
    docs: `${DOCS_BASE}#theme`,
    description: 'The theme.unimportant option has been removed (no longer needed with CSS layers).',
    migration: 'Remove any unimportant: true configuration from theme options.',
  },

  // Breakpoints
  {
    id: 'v4/breakpoints',
    title: 'Reduced default breakpoint sizes',
    severity: 'medium',
    category: 'display',
    detect: {
      grep: ['display.', 'useDisplay', 'breakpoints'],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [],
    docs: `${DOCS_BASE}#display`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/19759',
    description: 'Default breakpoint values have been reduced to better match modern device sizes.',
    migration: 'If you have layouts depending on specific breakpoint values, review and adjust accordingly or override the breakpoints in your Vuetify config.',
  },

  // Defaults provider
  {
    id: 'v4/defaults-provider',
    title: 'VDefaultsProvider updates',
    severity: 'medium',
    category: 'components',
    component: 'VDefaultsProvider',
    detect: {
      grep: ['v-defaults-provider', 'VDefaultsProvider', 'defaults:'],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [],
    docs: `${DOCS_BASE}#defaults`,
    description: 'VDefaultsProvider and global defaults have received updates.',
    migration: 'Review defaults configuration and provider usage.',
  },

  // Vite overlay z-index
  {
    id: 'v4/vite-overlay-zindex',
    title: 'Vite overlay z-index conflict',
    severity: 'medium',
    category: 'styles',
    detect: {
      grep: ['vite-plugin-vuetify', '@vitejs/plugin-vue'],
      files: ['vite.config.*', '**/*.config.ts', '**/*.config.js'],
    },
    replace: [],
    revert: {
      snippet: `// vite.config.ts
server: {
  hmr: {
    overlay: false
  }
}`,
      description: 'Disable Vite overlay if z-index conflicts occur with Vuetify dialogs.',
    },
    docs: `${DOCS_BASE}#vite`,
    description: 'Vite error overlay may conflict with Vuetify dialog z-index.',
    migration: 'If Vite overlay appears above Vuetify dialogs, disable it or adjust z-index.',
  },

  // Nested/Tree branch strategy
  {
    id: 'v4/nested-branch-strategy',
    title: 'Nested branch select strategy',
    severity: 'low',
    category: 'components',
    component: 'VTreeview',
    detect: {
      grep: ['v-treeview', 'VTreeview', 'select-strategy'],
      files: ['**/*.vue'],
    },
    replace: [],
    docs: `${DOCS_BASE}#nested`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/22404',
    description: 'New "branch" select strategy for tree/nested components.',
    migration: 'No migration needed - this is a new feature. Consider using branch strategy for hierarchical selection.',
  },
]
