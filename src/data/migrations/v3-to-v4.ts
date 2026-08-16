/**
 * Migration rules for Vuetify v3 → v4 upgrade.
 *
 * Source of truth: vuetify master
 * packages/docs/src/pages/en/getting-started/upgrade-guide.md
 *
 * Hashes are produced with the docs slugify in packages/docs/src/utils/markdown-it.ts.
 * Codemod names are the published vuetify-codemods plugin ids, stamped only
 * on the official upgrade-guide tables those plugins implement.
 */
import type { MigrationRule } from './schema.js'

const DOCS_BASE = 'https://vuetifyjs.com/en/getting-started/upgrade-guide'

export const V3_TO_V4_RULES: MigrationRule[] = [
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
      { from: 'text-h1', to: 'text-display-large', note: '96px → 60px' },
      { from: 'text-h2', to: 'text-display-large' },
      { from: 'text-h3', to: 'text-display-medium' },
      { from: 'text-h4', to: 'text-headline-large' },
      { from: 'text-h5', to: 'text-headline-small' },
      { from: 'text-h6', to: 'text-title-large' },
      { from: 'text-subtitle-1', to: 'text-body-large' },
      { from: 'text-subtitle-2', to: 'text-title-small' },
      { from: 'text-body-1', to: 'text-body-large' },
      { from: 'text-body-2', to: 'text-body-medium' },
      { from: 'text-button', to: 'text-label-large', note: 'No uppercase' },
      { from: 'text-caption', to: 'text-body-small' },
      { from: 'text-overline', to: 'text-label-medium', note: 'No uppercase' },
    ],
    codemod: 'vuetify-4-typography',
    docs: `${DOCS_BASE}#typography`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/22557',
    description: 'Typography follows the Material Design 3 type scale. This table is the upgrade-guide mapping (and the vuetify-4-typography codemod), not the typography-migration "quick reference" grouping.',
    migration: 'Replace MD2 classes with the upgrade-guide MD3 names. Run vuetify-codemods and select vuetify-4-typography.',
  },

  {
    id: 'v4/elevation-levels',
    title: 'MD3 elevation levels',
    severity: 'medium',
    category: 'elevation',
    detect: {
      grep: [
        'elevation-6', 'elevation-7', 'elevation-8', 'elevation-9',
        'elevation-10', 'elevation-11', 'elevation-12', 'elevation-13',
        'elevation-14', 'elevation-15', 'elevation-16', 'elevation-17',
        'elevation-18', 'elevation-19', 'elevation-20', 'elevation-21',
        'elevation-22', 'elevation-23', 'elevation-24',
        'elevation="6"', 'elevation="12"', 'elevation="24"',
      ],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'elevation-2', to: 'elevation-1', note: 'MD2 1–3 → MD3 1 (elevation-1 unchanged)' },
      { from: 'elevation-3', to: 'elevation-1' },
      { from: 'elevation-4', to: 'elevation-2', note: 'MD2 4–6 → MD3 2' },
      { from: 'elevation-5', to: 'elevation-2' },
      { from: 'elevation-6', to: 'elevation-2' },
      { from: 'elevation-7', to: 'elevation-3', note: 'MD2 7–11 → MD3 3' },
      { from: 'elevation-8', to: 'elevation-3' },
      { from: 'elevation-9', to: 'elevation-3' },
      { from: 'elevation-10', to: 'elevation-3' },
      { from: 'elevation-11', to: 'elevation-3' },
      { from: 'elevation-12', to: 'elevation-4', note: 'MD2 12–16 → MD3 4' },
      { from: 'elevation-13', to: 'elevation-4' },
      { from: 'elevation-14', to: 'elevation-4' },
      { from: 'elevation-15', to: 'elevation-4' },
      { from: 'elevation-16', to: 'elevation-4' },
      { from: 'elevation-17', to: 'elevation-5', note: 'MD2 17–24 → MD3 5' },
      { from: 'elevation-18', to: 'elevation-5' },
      { from: 'elevation-19', to: 'elevation-5' },
      { from: 'elevation-20', to: 'elevation-5' },
      { from: 'elevation-21', to: 'elevation-5' },
      { from: 'elevation-22', to: 'elevation-5' },
      { from: 'elevation-23', to: 'elevation-5' },
      { from: 'elevation-24', to: 'elevation-5' },
    ],
    codemod: 'vuetify-4-elevation',
    docs: `${DOCS_BASE}#elevation`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/14198',
    description: 'Elevation uses MD3 levels 0–5 instead of 0–24. Ranges come from the elevation-migration page.',
    migration: 'Map elevation-* classes and elevation props with the official ranges. Run vuetify-4-elevation. Legacy MD2 shadows can be restored from the elevation-migration page.',
  },

  {
    id: 'v4/grid-overhaul',
    title: 'Grid system overhaul',
    severity: 'high',
    category: 'grid',
    detect: {
      grep: [
        '<v-row dense',
        '<v-row\n  dense',
        ' dense',
        'align="',
        'justify="',
        'align-content="',
        'order="',
        'align-self="',
        'offset-',
        'class="offset-',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: '<v-row dense', to: '<v-row density="compact"', note: 'Or gap="8"' },
      { from: 'align="center"', to: 'class="align-center"' },
      { from: 'justify="space-between"', to: 'class="justify-space-between"' },
      { from: 'align-content="center"', to: 'class="align-content-center"' },
      { from: 'order="2"', to: 'class="order-2"' },
      { from: 'align-self="center"', to: 'class="align-self-center"' },
      { from: 'class="offset-6"', to: 'class="v-col-offset-6"', note: 'CSS class rename. offset / offset-md props are unchanged.' },
      { from: 'class="offset-', to: 'class="v-col-offset-' },
    ],
    codemod: 'vuetify-4-grid',
    docs: `${DOCS_BASE}#grid-system-vrow-and-vcol`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/8611',
    description: 'Grid spacing uses CSS gap instead of negative row margins and column padding. Several VRow/VCol props moved to utility classes.',
    migration: 'Apply the official VRow/VCol prop table. Run vuetify-4-grid. Legacy negative-margin grid can be restored via the grid-legacy-mode guide.',
  },

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
      { from: 'multi-line', to: 'min-height="68"' },
      { from: ':multi-line="true"', to: 'min-height="68"' },
      { from: 'multiLine', to: 'minHeight="68"' },
    ],
    codemod: 'vuetify-4-snackbar-multiline',
    docs: `${DOCS_BASE}#vsnackbar`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/15996',
    description: 'multi-line and $snackbar-multi-line-wrapper-min-height were removed. The documented stand-in is min-height="68".',
    migration: 'Replace multi-line with min-height="68". Run vuetify-4-snackbar-multiline.',
  },

  {
    id: 'v4/snackbar-queue',
    title: 'VSnackbarQueue default slot renamed',
    severity: 'medium',
    category: 'components',
    component: 'VSnackbarQueue',
    detect: {
      grep: [
        'v-snackbar-queue',
        'VSnackbarQueue',
        'v-slot:default="{ item }"',
        '#default="{ item }"',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'v-slot:default="{ item }"', to: 'v-slot:item="{ item }"' },
      { from: '#default="{ item }"', to: '#item="{ item }"' },
    ],
    codemod: 'vuetify-4-snackbar-queue-slot',
    docs: `${DOCS_BASE}#vsnackbarqueue`,
    description: 'The default slot on VSnackbarQueue was renamed to item. Slot props are unchanged. The component can now show multiple snackbars at once.',
    migration: 'Rename the default slot to item. Run vuetify-4-snackbar-queue-slot.',
  },

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
        'item.raw',
      ],
      files: ['**/*.vue'],
    },
    replace: [
      { from: '#item="{ item, props }"', to: '#item="{ internalItem, props }"', note: 'item is now an alias for internalItem.raw' },
      { from: '#item="{ item }"', to: '#item="{ internalItem }"' },
      { from: 'v-slot:item="{ item, props }"', to: 'v-slot:item="{ internalItem, props }"' },
      { from: 'item.raw.', to: 'item.', note: 'If you keep the item alias, drop .raw — item is already the raw object' },
    ],
    codemod: 'vuetify-4-combobox-item-slot',
    docs: `${DOCS_BASE}#vselect-vcombobox-vautocomplete`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18354',
    description: 'Slot prop item was renamed to internalItem. item remains as an alias for internalItem.raw.',
    migration: 'Rename the destructure to internalItem, or alias internalItem: item and drop .raw. Run vuetify-4-combobox-item-slot.',
  },

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
        String.raw`isDisabled\.value`,
        String.raw`isReadonly\.value`,
        String.raw`items\.value`,
      ],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'isValid.value', to: 'isValid' },
      { from: 'errors.value', to: 'errors' },
      { from: 'isValidating.value', to: 'isValidating' },
      { from: 'isDisabled.value', to: 'isDisabled' },
      { from: 'isReadonly.value', to: 'isReadonly' },
      { from: 'items.value', to: 'items' },
    ],
    codemod: 'vuetify-4-form-slot-refs',
    docs: `${DOCS_BASE}#vform`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/18355',
    description: 'VForm default-slot values are unwrapped: errors, isDisabled, isReadonly, isValidating, isValid, items.',
    migration: 'Stop reading .value on those slot props. Run vuetify-4-form-slot-refs.',
  },

  {
    id: 'v4/badge-dot-radius',
    title: 'VBadge dot border-radius',
    severity: 'low',
    category: 'components',
    component: 'VBadge',
    detect: {
      grep: ['$badge-dot-border-radius'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$badge-dot-border-radius: 4.5px', to: '$badge-dot-border-radius: 50%', note: 'Default changed 4.5px → 50%. Same look at default size; keep 4.5px if you enlarge the dot and want it square-ish.' },
    ],
    docs: `${DOCS_BASE}#vbadge`,
    description: 'Default $badge-dot-border-radius changed from 4.5px to 50%.',
    migration: 'Update the Sass override only if you depended on the 4.5px corner on a non-default dot size.',
  },

  {
    id: 'v4/container-fill-height',
    title: 'VContainer fill-height no longer centers',
    severity: 'medium',
    category: 'components',
    component: 'VContainer',
    detect: {
      grep: ['v-container', 'fill-height'],
      files: ['**/*.vue'],
    },
    replace: [
      { from: 'class="fill-height"', to: 'class="fill-height d-flex align-center flex-wrap"', note: 'Only when you relied on vertical centering' },
    ],
    docs: `${DOCS_BASE}#vcontainer`,
    description: 'fill-height on VContainer no longer centers content vertically. Max widths also rounded down to the nearest 100px.',
    migration: 'Add d-flex align-center flex-wrap when you need the old centering. Review container widths at md/lg/xl/xxl.',
  },

  {
    id: 'v4/counter-color',
    title: 'VCounter color → opacity',
    severity: 'low',
    category: 'components',
    component: 'VCounter',
    detect: {
      grep: ['$counter-color'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$counter-color', to: '.v-counter { opacity: 1; color: /* previous $counter-color */; }', note: 'color was replaced by opacity' },
    ],
    docs: `${DOCS_BASE}#vcounter`,
    description: '$counter-color and the color prop were replaced with opacity.',
    migration: 'Move the old color onto .v-counter and set opacity: 1 if you need full-strength color.',
  },

  {
    id: 'v4/file-input-details',
    title: 'VFileInput details padding variable',
    severity: 'low',
    category: 'components',
    component: 'VFileInput',
    detect: {
      grep: ['$file-input-details-padding-inline'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$file-input-details-padding-inline', to: '$input-details-padding-inline' },
    ],
    docs: `${DOCS_BASE}#vfileinput`,
    description: '$file-input-details-padding-inline was removed in favor of $input-details-padding-inline.',
    migration: 'Rename the Sass variable.',
  },

  {
    id: 'v4/radio-group-details',
    title: 'VRadioGroup details padding variable',
    severity: 'low',
    category: 'components',
    component: 'VRadioGroup',
    detect: {
      grep: ['$radio-group-details-padding-inline'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$radio-group-details-padding-inline', to: '$input-details-padding-inline' },
    ],
    docs: `${DOCS_BASE}#vradiogroup`,
    description: '$radio-group-details-padding-inline was removed in favor of $input-details-padding-inline.',
    migration: 'Rename the Sass variable.',
  },

  {
    id: 'v4/text-field-details',
    title: 'VTextField details padding variable',
    severity: 'low',
    category: 'components',
    component: 'VTextField',
    detect: {
      grep: ['$text-field-details-padding-inline'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$text-field-details-padding-inline', to: '$input-details-padding-inline' },
    ],
    docs: `${DOCS_BASE}#vtextfield`,
    description: '$text-field-details-padding-inline was removed in favor of $input-details-padding-inline.',
    migration: 'Rename the Sass variable.',
  },

  {
    id: 'v4/btn-text-transform',
    title: 'VBtn uppercase removed',
    severity: 'medium',
    category: 'components',
    component: 'VBtn',
    detect: {
      grep: ['v-btn', 'VBtn', '$button-text-transform'],
      files: ['**/*.vue', '**/*.scss', '**/*.sass', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'VBtn: {', to: 'VBtn: {\n      class: \'text-uppercase\',', note: 'Global defaults restore. Sass alternative: $button-text-transform: uppercase' },
    ],
    revert: {
      snippet: `@use 'vuetify/settings' with (
  $button-text-transform: 'uppercase',
)`,
      description: 'Restore v3 uppercase via Sass, or set defaults.VBtn.class to text-uppercase.',
    },
    docs: `${DOCS_BASE}#vbtn-text-transform`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/21079',
    description: 'Buttons no longer default to uppercase.',
    migration: 'Set $button-text-transform: uppercase, or defaults.VBtn.class = text-uppercase, or type the label in uppercase.',
  },

  {
    id: 'v4/btn-display',
    title: 'VBtn stacked gap variable',
    severity: 'low',
    category: 'components',
    component: 'VBtn',
    detect: {
      grep: ['$button-stacked-icon-margin'],
      files: ['**/*.scss', '**/*.sass'],
    },
    replace: [
      { from: '$button-stacked-icon-margin', to: '$button-stacked-gap' },
    ],
    docs: `${DOCS_BASE}#vbtn-display`,
    description: 'VBtn layout is flex again. $button-stacked-icon-margin was replaced by $button-stacked-gap.',
    migration: 'Rename the Sass variable.',
  },

  {
    id: 'v4/css-layers',
    title: 'CSS layers mandatory',
    severity: 'high',
    category: 'styles',
    detect: {
      grep: [
        '@layer vuetify',
        '@layer base, vuetify, overrides',
        '!important',
      ],
      files: ['**/*.vue', '**/*.scss', '**/*.css'],
    },
    replace: [
      {
        from: '@layer base, vuetify, overrides;',
        to: '@layer base, vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final, overrides;',
        note: 'Only if you already used $layers: true in v3',
      },
      { from: '@layer vuetify.', to: '@layer vuetify-core.', note: 'Or move overrides into your own layer declared after vuetify-core' },
      { from: '@layer vuetify {', to: '@layer vuetify-core {' },
    ],
    docs: `${DOCS_BASE}#layers`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/3400',
    description: 'Vuetify 4 always uses CSS layers. Unlayered CSS now beats Vuetify. $layers: true apps go from one vuetify layer to five named layers.',
    migration: 'Import your @layer order file before vuetify/styles. Replace @layer vuetify.* with the new names or your own layer.',
  },

  {
    id: 'v4/style-entry-points',
    title: 'Precompiled style entry points',
    severity: 'low',
    category: 'styles',
    detect: {
      grep: ['$color-pack: false', '$utilities: false'],
      files: ['**/*.scss', '**/*.sass', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: '$color-pack: false', to: 'import \'vuetify/styles/core\'', note: 'When that was the only Sass override' },
      { from: '$utilities: false', to: 'import \'vuetify/styles/core\'', note: 'When that was the only Sass override' },
    ],
    docs: `${DOCS_BASE}#style-entry-points`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/20100',
    description: 'If a Sass file only disabled $color-pack or $utilities, it can be replaced with import \'vuetify/styles/core\'.',
    migration: 'Use vuetify/styles/core when that was the only override. Otherwise keep the Sass settings file.',
  },

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
      { from: 'createVuetify({', to: 'createVuetify({\n  theme: {\n    defaultTheme: \'light\',\n  },', note: 'Only if you want the v3 light default. Omit this to keep system.' },
    ],
    revert: {
      snippet: `createVuetify({ theme: { defaultTheme: 'light' } })`,
      description: 'Explicit light theme restores v3 behavior.',
    },
    docs: `${DOCS_BASE}#themes`,
    description: 'Default theme is system (OS preference) instead of light.',
    migration: 'Set theme.defaultTheme to light if the app must stay light.',
  },

  {
    id: 'v4/theme-unimportant',
    title: 'Theme unimportant option removed',
    severity: 'low',
    category: 'theme',
    detect: {
      grep: ['unimportant:'],
      files: ['**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'unimportant: true', to: '', note: 'Unused with CSS layers' },
      { from: 'unimportant: false', to: '' },
    ],
    docs: `${DOCS_BASE}#themes`,
    description: 'theme.unimportant was removed.',
    migration: 'Delete unimportant from theme options.',
  },

  {
    id: 'v4/breakpoints',
    title: 'Reduced default breakpoint sizes',
    severity: 'medium',
    category: 'display',
    detect: {
      grep: ['useDisplay', 'display.thresholds', 'md: 960', 'lg: 1280', 'xl: 1920', 'xxl: 2560'],
      files: ['**/*.vue', '**/*.ts', '**/*.js', '**/*.scss'],
    },
    replace: [
      { from: 'md: 960', to: 'md: 840', note: 'New default. Restore 960 in display.thresholds to keep v3.' },
      { from: 'lg: 1280', to: 'lg: 1145' },
      { from: 'xl: 1920', to: 'xl: 1545' },
      { from: 'xxl: 2560', to: 'xxl: 2138' },
    ],
    revert: {
      snippet: `createVuetify({
  display: {
    thresholds: { md: 960, lg: 1280, xl: 1920, xxl: 2560 },
  },
})`,
      description: 'Restore v3 breakpoint pixel values.',
    },
    docs: `${DOCS_BASE}#breakpoints`,
    issue: 'https://github.com/vuetifyjs/vuetify/issues/19759',
    description: 'Default thresholds: md 960→840, lg 1280→1145, xl 1920→1545, xxl 2560→2138. xs/sm unchanged.',
    migration: 'Retest layouts at the new widths, or restore v3 thresholds in createVuetify() and $grid-breakpoints.',
  },

  {
    id: 'v4/defaults-provider',
    title: 'Undefined defaults are skipped',
    severity: 'medium',
    category: 'components',
    component: 'VDefaultsProvider',
    detect: {
      grep: ['VDefaultsProvider', 'v-defaults-provider', 'color: undefined'],
      files: ['**/*.vue', '**/*.ts', '**/*.js'],
    },
    replace: [
      { from: 'color: undefined', to: 'color: null', note: 'undefined is skipped when merging defaults; null still overrides' },
      { from: 'undefined', to: 'null', note: 'Only inside defaults objects that must clear a global default' },
    ],
    docs: `${DOCS_BASE}#defaults`,
    description: 'undefined is skipped when merging prop defaults. A nested VDefaultsProvider that set color: undefined no longer clears the global default.',
    migration: 'Use null when you intend to override a global default.',
  },

  {
    id: 'v4/vite-overlay-zindex',
    title: 'Vite overlay z-index in dev mode',
    severity: 'medium',
    category: 'styles',
    detect: {
      grep: ['vite-plugin-vuetify', '@vitejs/plugin-vue', 'optimizeDeps'],
      files: ['vite.config.*', '**/*.config.ts', '**/*.config.js'],
    },
    replace: [
      {
        from: 'export default defineConfig({',
        to: `export default defineConfig({
  optimizeDeps: {
    include: [
      'vuetify/components/VOverlay',
      'vuetify/components/VDialog',
      'vuetify/components/VMenu',
      'vuetify/components/VSelect',
      'vuetify/components/VTooltip',
    ],
  },`,
        note: 'Then delete node_modules/.vite and restart the dev server.',
      },
    ],
    revert: {
      snippet: `// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'vuetify/components/VOverlay',
      'vuetify/components/VDialog',
      'vuetify/components/VMenu',
      'vuetify/components/VSelect',
      'vuetify/components/VTooltip',
    ],
  },
})

// then: rm -rf node_modules/.vite`,
      description: 'Force a single useStack module graph in Vite dev. Production builds are unaffected.',
    },
    docs: `${DOCS_BASE}#vite3a-overlay-z-index-in-dev-mode`,
    description: 'Vite pre-bundling can split useStack so menus and selects inside dialogs sit at z-index 2000. Official fix is optimizeDeps.include plus deleting .vite.',
    migration: 'Add the official optimizeDeps.include list, run rm -rf node_modules/.vite, restart the dev server.',
  },
]
