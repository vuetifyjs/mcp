export type V3BreakingChange = {
  title: string
  description: string
  migration: string
  issue: string | null
}

export const V3_BREAKING_CHANGES = {
  'setup': {
    name: 'Setup',
    description: 'Bootstrap, imports, styles, and bundler plugins when moving from Vuetify 2 to 3.',
    changes: [
      {
        title: 'Vuetify class replaced by createVuetify',
        description: 'The Vuetify class is removed. Use the createVuetify function and app.use(vuetify).',
        migration: `Replace Vue.use(Vuetify) / new Vuetify() with createApp + createVuetify.

\`\`\`js
// 2.x
Vue.use(Vuetify)

const vuetify = new Vuetify({ ... })

const app = new Vue({
  vuetify,
  ...
})
\`\`\`

\`\`\`js
// 3.x
const app = createApp()

const vuetify = createVuetify({ ... })

app.use(vuetify)
\`\`\`
`,
        issue: null,
      },
      {
        title: 'Default vuetify import is a-la-carte',
        description: '`import ... from \'vuetify\'` is now a-la-carte. Import `vuetify/dist/vuetify.js` instead to get the complete bundle (not recommended).',
        migration: 'Prefer treeshaken imports via vite-plugin-vuetify or webpack-plugin-vuetify. Only use the full bundle if you cannot tree-shake.',
        issue: null,
      },
      {
        title: 'vuetify/lib is gone',
        description: '\'vuetify/lib\' should no longer be used. Change to `vuetify` / `vuetify/components` / `vuetify/directives` as appropriate.',
        migration: 'Replace `vuetify/lib` imports with `vuetify`, `vuetify/components`, or `vuetify/directives`.',
        issue: null,
      },
      {
        title: 'Global styles must be imported separately',
        description: 'Only component styles are included. Global styles must be imported separately from `vuetify/styles`.',
        migration: 'Add `import \'vuetify/styles\'` (or the plugin equivalent) in your Vuetify setup.',
        issue: null,
      },
      {
        title: 'vuetify-loader renamed',
        description: 'vuetify-loader has been renamed to webpack-plugin-vuetify, and there is a new plugin for Vite: vite-plugin-vuetify.',
        migration: 'Replace vuetify-loader with vite-plugin-vuetify (Vite) or webpack-plugin-vuetify (webpack).',
        issue: null,
      },
    ],
  },
  'layout': {
    name: 'Layout',
    description: 'Application layout chrome, markup order, and display/breakpoints.',
    changes: [
      {
        title: 'Application element styles no longer included',
        description: 'Global styles previously included as `.v-application p` or `.v-application ul` are no longer included. If you need margin for `p`, or padding-left for `ul` and `ol`, set it manually in your root component\'s `<style>` tag.',
        migration: 'Add the missing `p` / `ul` / `ol` spacing in the root component styles if the v2 look depended on it.',
        issue: null,
      },
      {
        title: 'app, clipped, and stateless props removed',
        description: '`stateless`, `clipped`, `clipped-right` and `app` props have been removed from v-navigation-drawer, v-app-bar and v-system-bar. The position in the markup determines the appearance. Use the `order="number"` prop to influence it manually. `v-content` is replaced by `v-main`.',
        migration: `Drop \`app\` / \`clipped\` / \`clipped-right\` / \`stateless\`. Order the layout components in markup; use \`order\` if needed. Rename \`v-content\` to \`v-main\`.

\`\`\`vue
<!-- 2.x -->
<v-navigation-drawer app clipped></v-navigation-drawer>
<v-content></v-content>
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-navigation-drawer></v-navigation-drawer>
<v-main></v-main>
\`\`\`
`,
        issue: null,
      },
      {
        title: '$vuetify.breakpoint renamed to $vuetify.display',
        description: '`$vuetify.breakpoint` has been renamed to `$vuetify.display` and extended with new properties. `*Only` properties have been removed; use `xs` instead of `xsOnly` etc.',
        migration: `Replace \`$vuetify.breakpoint\` with \`$vuetify.display\`. Drop \`*Only\` suffixes.

\`\`\`js
// 2.x
$vuetify.breakpoint.xsOnly

// 3.x
$vuetify.display.xs
\`\`\`
`,
        issue: null,
      },
    ],
  },
  'theme': {
    name: 'Theme',
    description: 'Multi-theme support, class names, CSS variables, and theme config shape.',
    changes: [
      {
        title: 'light/dark props removed',
        description: 'Multiple themes are now supported, so `light` / `dark` props have been removed from components. Use `v-theme-provider` to set the theme for a specific component tree. Components that previously had a `dark` prop, such as v-app-bar, now accept `theme="dark"`.',
        migration: 'Replace `dark`/`light` props with `theme="dark"` / `theme="light"` or wrap a tree in `v-theme-provider`.',
        issue: null,
      },
      {
        title: 'Theme colors set foreground automatically',
        description: 'Theme colors set their foreground text color automatically. If you were using `light` / `dark` to get a different text color you probably don\'t need it anymore.',
        migration: 'Remove `light`/`dark` used only to force contrast; keep an explicit `theme` only when you still need a different palette.',
        issue: null,
      },
      {
        title: 'Variant naming is a single word',
        description: 'The variant naming scheme has changed slightly, it is now a single word instead of two. For example, `primary darken-1` is now `primary-darken-1`. To use variant namings as value for `color` props, the variant you intend to use needs to be enabled in the theme under `theme.variations.colors`, e.g. `colors: [\'primary\']`.',
        migration: 'Rename `primary darken-1` to `primary-darken-1` and enable the color under `theme.variations.colors`.',
        issue: null,
      },
      {
        title: 'Color classes renamed',
        description: 'Backgrounds have a `bg-` prefix (`.primary` is now `.bg-primary`). Text colors have a `text-` prefix (`.primary--text` is now `.text-primary`). Variants are no longer a separate class (`.primary--text.text--darken-1` is now `.text-primary-darken-1`).',
        migration: `Update utility classes. eslint-plugin-vuetify remaps these in templates; SCSS/CSS files must be done by hand.

\`\`\`html
<!-- 2.x -->
<div class="primary primary--text text--darken-1"></div>
\`\`\`

\`\`\`html
<!-- 3.x -->
<div class="bg-primary text-primary-darken-1"></div>
\`\`\`
`,
        issue: null,
      },
      {
        title: 'customProperties replaced by CSS variables',
        description: 'The theme system now uses CSS variables internally, so `customProperties` is no longer required. If you were using `customProperties` in v2, the naming scheme has changed from `--v-primary-base` to `--v-theme-primary`. Custom properties are now also an rgb list instead of hex, so `rgb()` or `rgba()` must be used to access them.',
        migration: `Remove \`customProperties\`. Read theme tokens as rgb lists.

\`\`\`css
/* 2.x */
color: var(--v-primary-base);

/* 3.x */
color: rgb(var(--v-theme-primary));
\`\`\`
`,
        issue: null,
      },
      {
        title: 'Theme colors nested under colors',
        description: 'Theme colors in the theme config are now nested inside a `colors` property.',
        migration: `Nest palette values under \`colors\`.

\`\`\`js
// 2.x
const myTheme = { themes: { light: { primary: '#ccc' } } }

// 3.x
const myTheme = { theme: { themes: { light: { colors: { primary: '#ccc' } } } } }
\`\`\`
`,
        issue: null,
      },
    ],
  },
  'sass': {
    name: 'Sass',
    description: 'SASS variable files, maps, and renamed component variables.',
    changes: [
      {
        title: '$headings merged with $typography',
        description: '`$headings` was merged with `$typography`. Access font-size of subtitle-2 with `map.get($typography, \'subtitle-2\', \'size\')`.',
        migration: 'Replace `$headings` lookups with `map.get($typography, \'<name>\', \'size\')`.',
        issue: null,
      },
      {
        title: 'SASS import path changed',
        description: 'If you imported variables from `~vuetify/src/styles/settings/_variables` in v2, you have to replace it with `vuetify/settings`.',
        migration: 'Replace `~vuetify/src/styles/settings/_variables` (and similar) with `vuetify/settings`.',
        issue: null,
      },
      {
        title: 'Component variables import from vuetify/settings',
        description: 'Component variables that previously lived in e.g. `~/vuetify/src/components/VIcon/VIcon.sass` can now be imported from `vuetify/settings` directly too.',
        migration: 'Import component SASS variables from `vuetify/settings` instead of per-component sass files.',
        issue: null,
      },
      {
        title: '$display-breakpoints no longer includes -only',
        description: '`$display-breakpoints` no longer includes `{breakpoint}-only` variables (e.g. xs-only). Use `@media #{map.get(v.$display-breakpoints, \'xs\')}` instead.',
        migration: 'Replace `xs-only` (and siblings) with `map.get(v.$display-breakpoints, \'xs\')` inside `@media`.',
        issue: null,
      },
      {
        title: '$transition map removed',
        description: 'The `$transition` map has been removed, replaced with individual `$standard-easing`, `$decelerated-easing`, `$accelerated-easing` variables.',
        migration: 'Replace `$transition` map lookups with `$standard-easing`, `$decelerated-easing`, or `$accelerated-easing`.',
        issue: null,
      },
      {
        title: '$container-padding-x is 16px',
        description: '`$container-padding-x` is now 16px instead of 12px as in v2. You can replace it with `$spacer * 3` to get to the previous look.',
        migration: 'Override `$container-padding-x` or use `$spacer * 3` if you need the v2 12px padding.',
        issue: null,
      },
      {
        title: 'Many component variables renamed or removed',
        description: 'Too many component variables to list have been renamed or removed. There is no automated way to update these as the element structure has changed significantly, you will need to manually update these along with any custom styles.',
        migration: 'Diff custom SASS against 3.x component markup. Do not expect 1:1 variable names.',
        issue: null,
      },
    ],
  },
  'styles': {
    name: 'Styles',
    description: 'Utility class renames. Use eslint-plugin-vuetify to apply most class changes.',
    changes: [
      {
        title: '.hidden-{breakpoint}-only renamed',
        description: '`.hidden-{breakpoint}-only` has been renamed to `.hidden-{breakpoint}`.',
        migration: 'Rename `.hidden-xs-only` to `.hidden-xs` (and the other breakpoints).',
        issue: null,
      },
      {
        title: '.text-xs-{alignment} renamed',
        description: '`.text-xs-{alignment}` has been renamed to `.text-{alignment}` to reflect the fact that it applies to all breakpoints.',
        migration: 'Rename `.text-xs-left` / `.text-xs-center` / `.text-xs-right` to `.text-left` / `.text-center` / `.text-right`.',
        issue: null,
      },
      {
        title: 'Typography classes prefixed with text-',
        description: 'Typography classes have been renamed for consistency and are all prefixed with `text-`, for example `.display-4` is now `.text-h1`.',
        migration: 'Map `.display-4` → `.text-h1` (and the rest of the type scale) via eslint-plugin-vuetify.',
        issue: null,
      },
      {
        title: 'Transition easing classes removed',
        description: 'Transition easing classes have been removed.',
        migration: 'Replace removed easing utility classes with CSS transitions using the SASS easing variables.',
        issue: null,
      },
    ],
  },
  'general': {
    name: 'General',
    description: 'Cross-component v-model, location, density, activators, and test DOM changes.',
    changes: [
      {
        title: 'value replaced by model-value',
        description: '`value` prop has been replaced by `model-value` on components that support `v-model` usage (Vue 3 requires this change). This does not apply to `value` used as a selection value, for example `v-btn` within `v-btn-toggle`.',
        migration: `Rename \`value\` to \`model-value\` on v-model components. Leave selection \`value\` on toggles/lists alone.

\`\`\`vue
<!-- 2.x -->
<v-text-field :value="name" @input="name = $event" />
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-text-field :model-value="name" @update:model-value="name = $event" />
\`\`\`
`,
        issue: null,
      },
      {
        title: '@input replaced by @update:model-value',
        description: '`@input` event has been replaced by `@update:model-value` on components that support `v-model` usage (Vue 3 requires this change).',
        migration: 'Replace `@input` with `@update:model-value` (or just use `v-model`). See the `value` / `model-value` snippet.',
        issue: null,
      },
      {
        title: 'left/right replaced by start/end',
        description: '`left` and `right` have been replaced by `start` and `end` respectively. This applies to utility classes too, for example `.rounded-r` is now `.rounded-e`.',
        migration: 'Rename `left`/`right` props and `.rounded-l` / `.rounded-r` classes to `start`/`end` and `.rounded-s` / `.rounded-e`.',
        issue: null,
      },
      {
        title: 'Size props combined into size',
        description: 'Size props `small` / `medium` / `large` etc. have been combined into a single `size` prop.',
        migration: 'Replace `small` with `size="small"`, `large` with `size="large"`, and so on.',
        issue: null,
      },
      {
        title: 'absolute and fixed combined into position',
        description: '`absolute` and `fixed` props have been combined into a single `position` prop.',
        migration: 'Replace `absolute` with `position="absolute"` and `fixed` with `position="fixed"`.',
        issue: null,
      },
      {
        title: 'top/bottom/left/right combined into location',
        description: '`top` / `bottom` / `left` / `right` props have been combined into a single `location` prop.',
        migration: 'Replace boolean `top`/`bottom`/`left`/`right` with `location="top"` (or `start`/`end`).',
        issue: null,
      },
      {
        title: 'background-color renamed to bg-color',
        description: '`background-color` prop has been renamed to `bg-color`.',
        migration: 'Rename `background-color` to `bg-color`.',
        issue: null,
      },
      {
        title: 'dense replaced by density',
        description: '`dense` prop on components such as v-select, v-btn-toggle, v-alert, v-text-field, v-list and v-list-item has been changed to `density` prop with the variants `default`, `comfortable`, `compact`.',
        migration: 'Replace `dense` with `density="compact"` (or `comfortable`).',
        issue: null,
      },
      {
        title: 'Activator slots use props',
        description: 'Activator slots work slightly different. Replace `#activator={ attrs, on }` with `#activator={ props }`, then remove `v-on="on"` and replace `v-bind="attrs"` with `v-bind="props"`.',
        migration: `Bind the activator \`props\` object instead of \`attrs\` + \`on\`.

\`\`\`vue
<!-- 2.x -->
<template #activator="{ attrs, on }">
  <v-btn v-bind="attrs" v-on="on">Open</v-btn>
</template>
\`\`\`

\`\`\`vue
<!-- 3.x -->
<template #activator="{ props }">
  <v-btn v-bind="props">Open</v-btn>
</template>
\`\`\`
`,
        issue: null,
      },
      {
        title: 'Markup structure changed for tests',
        description: 'Some components have structural changes in their markup. Which means you may have to change how you query and assert them in tests. `v-switch` for example now uses an `<input type="checkbox" />` under the hood, which is why the `aria-checked` and `aria-role="switch"` attributes were removed.',
        migration: 'Query `v-switch` as a checkbox input. Do not assert removed ARIA switch attributes.',
        issue: null,
      },
    ],
  },
  'inputs': {
    name: 'Inputs',
    description: 'Shared input affix slots, variants, and validation props.',
    changes: [
      {
        title: 'Affix slots remapped',
        description: 'Affix slots are consistent now: `prepend` and `prepend-inner` are the same; `append` has been renamed to `append-inner`; `append-outer` has been renamed to `append`.',
        migration: 'Keep inner prepend as `prepend-inner`. Rename `append` → `append-inner` and `append-outer` → `append`.',
        issue: null,
      },
      {
        title: 'filled/outlined/solo combined into variant',
        description: 'Variant props `filled`/`outlined`/`solo` have been combined into a single `variant` prop. Allowed values are `underlined`, `outlined`, `filled`, `solo`, or `plain`.',
        migration: 'Replace `outlined` with `variant="outlined"` (and the other booleans with the matching `variant` value).',
        issue: null,
      },
      {
        title: 'success and success-messages removed',
        description: '`success` and `success-messages` props have been removed.',
        migration: 'Remove `success` / `success-messages`. Use messages / validation state instead.',
        issue: null,
      },
      {
        title: 'validate-on-blur renamed',
        description: '`validate-on-blur` prop has been renamed to `validate-on="blur"`.',
        migration: 'Replace `validate-on-blur` with `validate-on="blur"`.',
        issue: null,
      },
    ],
  },
  'v-alert': {
    name: 'VAlert',
    description: 'Alert border, closable, variants, and text content.',
    changes: [
      {
        title: 'border left/right renamed to start/end',
        description: '`border` prop values `left` and `right` have been renamed to `start` and `end`.',
        migration: 'Replace `border="left"` / `border="right"` with `start` / `end`.',
        issue: null,
      },
      {
        title: 'colored-border renamed to border-color',
        description: '`colored-border` prop has been renamed to `border-color`.',
        migration: 'Rename `colored-border` to `border-color`.',
        issue: null,
      },
      {
        title: 'dismissable renamed to closable',
        description: '`dismissable` prop has been renamed to `closable`.',
        migration: 'Rename `dismissable` to `closable`.',
        issue: null,
      },
      {
        title: 'outlined and text combined into variant',
        description: '`outlined` and `text` props have been combined into a single `variant` prop. Allowed values are `elevated`, `flat`, `tonal`, `outlined`, `text`, or `plain`.',
        migration: 'Replace `outlined` / `text` with `variant="outlined"` / `variant="text"`.',
        issue: null,
      },
      {
        title: 'text prop is content',
        description: '`text` prop has new purpose. It represents the text content of the alert, if default slot is not used.',
        migration: 'Do not pass `text` as a variant boolean. Use `text="..."` for content or `variant="text"` for the style.',
        issue: null,
      },
    ],
  },
  'v-badge': {
    name: 'VBadge',
    description: 'Badge overlap default and removed props.',
    changes: [
      {
        title: 'overlap is now the default',
        description: '`overlap` has been removed and is now the default style, use `floating` to restore the v2 default.',
        migration: 'Remove `overlap`. Add `floating` if you want the old non-overlapping look.',
        issue: null,
      },
      {
        title: 'Transition mode and origin removed',
        description: 'Transition props `mode` and `origin` have been removed.',
        migration: 'Remove `mode` and `origin` from v-badge.',
        issue: null,
      },
      {
        title: 'avatar prop removed',
        description: '`avatar` prop is no longer needed and has been removed.',
        migration: 'Remove the `avatar` prop from v-badge.',
        issue: null,
      },
    ],
  },
  'v-banner': {
    name: 'VBanner',
    description: 'Banner actions, lines, and color targeting.',
    changes: [
      {
        title: 'actions slot no longer provides dismiss',
        description: 'The `actions` slot no longer provides a dismiss function.',
        migration: 'Close the banner from your own handler instead of the slot dismiss function.',
        issue: null,
      },
      {
        title: 'shaped prop removed',
        description: '`shaped` prop has been removed.',
        migration: 'Remove `shaped` from v-banner.',
        issue: null,
      },
      {
        title: 'icon-color removed',
        description: '`icon-color` has been removed.',
        migration: 'Remove `icon-color`. Color the icon explicitly in the icon slot if needed.',
        issue: null,
      },
      {
        title: 'single-line replaced by lines="one"',
        description: '`single-line` has been replaced with `lines="one"`.',
        migration: 'Replace `single-line` with `lines="one"`.',
        issue: null,
      },
      {
        title: 'color applies to icon and action text',
        description: '`color` now applies to the icon and action text. Use `bg-color` to change the background color.',
        migration: 'Move background coloring from `color` to `bg-color`.',
        issue: null,
      },
    ],
  },
  'v-btn': {
    name: 'VBtn / VBtnToggle',
    description: 'Button variants, fab, focus, toggle mandatory, and disabled color.',
    changes: [
      {
        title: 'active-class renamed to selected-class',
        description: '`active-class` prop has been renamed to `selected-class`.',
        migration: 'Rename `active-class` to `selected-class`.',
        issue: null,
      },
      {
        title: 'fab is no longer supported',
        description: '`fab` is no longer supported. If you just need a round button, use `icon` prop or apply a `.rounded-circle` class.',
        migration: 'Replace `fab` with `icon` or `class="rounded-circle"`.',
        issue: null,
      },
      {
        title: 'flat/outlined/text/plain combined into variant',
        description: '`flat` / `outlined` / `text` / `plain` props have been combined into a single `variant` prop.',
        migration: 'Replace boolean style props with `variant="text"` (or `flat` / `outlined` / `plain`).',
        issue: null,
      },
      {
        title: 'depressed renamed to variant="flat"',
        description: '`depressed` has been renamed to `variant="flat"`.',
        migration: 'Replace `depressed` with `variant="flat"`.',
        issue: null,
      },
      {
        title: 'retain-focus-on-click removed',
        description: '`retain-focus-on-click` has been removed, buttons use `:focus-visible` instead.',
        migration: 'Remove `retain-focus-on-click`. Rely on `:focus-visible`.',
        issue: null,
      },
      {
        title: 'v-btn-toggle mandatory needs force',
        description: '`v-btn-toggle` needs `mandatory="force"` prop to achieve the same behaviour as `mandatory` prop in v2.',
        migration: 'Replace `mandatory` on v-btn-toggle with `mandatory="force"` if one button must always stay selected.',
        issue: null,
      },
      {
        title: 'Disabled buttons use faded color',
        description: 'Disabled buttons use a faded variant of the specified `color` instead of grey. The `$button-colored-disabled` sass variable can be set to false to use grey instead.',
        migration: 'Set `$button-colored-disabled: false` if you need grey disabled buttons.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/15147',
      },
    ],
  },
  'v-calendar': {
    name: 'VCalendar',
    description: 'Calendar event argument order. Core on 3.13.',
    changes: [
      {
        title: 'First emit argument is the native event',
        description: 'The first emit argument is now the native event, custom data has been moved to the second argument. `onClickEvent ({ nativeEvent, event, day })` should be changed to `onClickEvent (nativeEvent, { event, day })`. 3.13 still has both `click:event` and `click:date`.',
        migration: 'Change handlers from a single destructured object to `(nativeEvent, data)`. Do not rename `onClickEvent` to `onClickDate`.',
        issue: null,
      },
    ],
  },
  'v-checkbox': {
    name: 'VCheckbox / VRadio / VSwitch',
    description: 'Selection input model, icons, values, and label markup.',
    changes: [
      {
        title: 'input-value renamed to model-value',
        description: '`input-value` prop has been renamed to `model-value` (Vue 3 requires this change).',
        migration: 'Rename `input-value` to `model-value` (or use `v-model`).',
        issue: null,
      },
      {
        title: 'on-icon/off-icon renamed',
        description: '`on-icon` and `off-icon` props have been renamed to `true-icon` and `false-icon`.',
        migration: 'Rename `on-icon` → `true-icon` and `off-icon` → `false-icon`.',
        issue: null,
      },
      {
        title: 'on-value/off-value renamed',
        description: '`on-value` and `off-value` props have been renamed to `true-value` and `false-value`.',
        migration: 'Rename `on-value` → `true-value` and `off-value` → `false-value`.',
        issue: null,
      },
      {
        title: 'v-checkbox label slot already wraps <label>',
        description: '`v-checkbox`\'s label slot should no longer contain a `<label>` as it is already wrapped with one.',
        migration: 'Remove nested `<label>` from the checkbox label slot.',
        issue: null,
      },
    ],
  },
  'v-date-picker': {
    name: 'VDatePicker',
    description: 'Date objects, locale/adapter, view-mode, and range caveat. Core on 3.13.',
    changes: [
      {
        title: 'Model is Date not string',
        description: 'Uses `Date` objects instead of strings. Some utility functions are included to help convert between the two, see dates.',
        migration: `Store and bind \`Date\` values. Convert strings at the boundary.

\`\`\`vue
<!-- 2.x -->
<v-date-picker v-model="date" />
<!-- date is a string -->
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-date-picker v-model="date" />
<!-- date is a Date -->
\`\`\`
`,
        issue: null,
      },
      {
        title: 'Locale and format props moved to the date adapter',
        description: '`locale`, `locale-first-day-of-year`, `first-day-of-week`, `day-format`, `weekday-format`, `month-format`, `year-format`, `header-date-format`, and `title-date-format` are now part of the date adapter and use the globally configured locale instead of being passed as props.',
        migration: 'Configure locale and formats on the date adapter / i18n, not as picker props.',
        issue: null,
      },
      {
        title: 'active-picker renamed to view-mode',
        description: '`active-picker` has been renamed to `view-mode`.',
        migration: 'Rename `active-picker` to `view-mode`.',
        issue: null,
      },
      {
        title: 'picker-date replaced by month and year',
        description: '`picker-date` has been replaced with separate `month` and `year` props.',
        migration: 'Split `picker-date` into `month` and `year`.',
        issue: null,
      },
      {
        title: 'v2 range is not v3 multiple="range"',
        description: 'v2 `range` is not currently the same as v3 `multiple="range"`. The upgrade guide marked range as not implemented; on 3.13 `multiple="range"` exists but emits every day in the range, not a `[start, end]` pair.',
        migration: `Do not treat \`multiple="range"\` as a drop-in for v2 \`range\`. Keep a \`[start, end]\` pair yourself if that is the app contract.

\`\`\`vue
<!-- 2.x -->
<v-date-picker v-model="range" range />
<!-- range is [start, end] strings -->
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-date-picker v-model="dates" multiple="range" />
<!-- 3.13 emits every Date in the range, not [start, end] -->
\`\`\`
`,
        issue: null,
      },
    ],
  },
  'v-form': {
    name: 'VForm',
    description: 'Async validate() result.',
    changes: [
      {
        title: 'validate() returns a Promise',
        description: '`validate()` now returns a `Promise<FormValidationResult>` instead of a boolean. Await the promise then check `result.valid` to determine form state.',
        migration: 'Replace `if (form.validate())` with `const { valid } = await form.validate()`.',
        issue: null,
      },
    ],
  },
  'v-list': {
    name: 'VList',
    description: 'List groups, item structure, selection, and subheader.',
    changes: [
      {
        title: 'two-line and three-line combined into lines',
        description: '`two-line` and `three-line` props have been combined into a single `lines` prop with allowed values `two` or `three`.',
        migration: 'Replace `two-line` with `lines="two"` and `three-line` with `lines="three"`.',
        issue: null,
      },
      {
        title: 'v-list-item-group removed',
        description: '`v-list-item-group` has been removed, assign the item\'s key to the `value` prop of each `v-list-item` and bind `v-model:selected` on the `v-list` to get the selected value.',
        migration: `Move selection to the list. Put a \`value\` on each item.

\`\`\`vue
<!-- 2.x -->
<v-list>
  <v-list-item-group v-model="selected">
    <v-list-item>
      <v-list-item-avatar></v-list-item-avatar>
      <v-list-item-icon></v-list-item-icon>
      <v-list-item-content>Item</v-list-item-content>
    </v-list-item>
  </v-list-item-group>
</v-list>
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-list v-model:selected="selected">
  <v-list-item value="a" prepend-avatar="..." prepend-icon="...">
    Item
  </v-list-item>
</v-list>
\`\`\`
`,
        issue: null,
      },
      {
        title: 'v-list-item-icon and v-list-item-avatar removed',
        description: '`v-list-item-icon` and `v-list-item-avatar` have been removed. Use `prepend-icon` / `prepend-avatar` (or `append-icon` / `append-avatar`, or the append/prepend slots). There are no `icon` or `avatar` props.',
        migration: 'Replace nested icon/avatar components with `prepend-icon` / `prepend-avatar` (or append/prepend slots).',
        issue: null,
      },
      {
        title: 'v-list-item-content removed',
        description: '`v-list-item-content` has been removed, lists use CSS grid for layout now instead.',
        migration: 'Delete `v-list-item-content` wrappers; put title/subtitle directly in the item.',
        issue: null,
      },
      {
        title: 'v-list-group can nest without sub-group',
        description: '`v-list-group` can now be nested arbitrarily deep, `sub-group` prop should be removed.',
        migration: 'Remove `sub-group` from nested `v-list-group`.',
        issue: null,
      },
      {
        title: 'v-list-item input-value replaced with active',
        description: '`v-list-item` `input-value` prop has been replaced with `active`.',
        migration: 'Rename `input-value` to `active` on v-list-item.',
        issue: null,
      },
      {
        title: 'inactive replaced with active and link false',
        description: '`v-list-item` `inactive` prop has been replaced with `:active="false" :link="false"`.',
        migration: 'Replace `inactive` with `:active="false" :link="false"`.',
        issue: null,
      },
      {
        title: 'v-subheader renamed to v-list-subheader',
        description: '`v-subheader` has been renamed to `v-list-subheader`.',
        migration: 'Rename `v-subheader` to `v-list-subheader` (or use `class="text-subtitle-2"`).',
        issue: null,
      },
      {
        title: 'active scoped slot prop renamed to isActive',
        description: '`v-list-item`\'s `active` scoped slot prop has been renamed to `isActive`.',
        migration: 'Rename the slot prop `active` to `isActive`.',
        issue: null,
      },
    ],
  },
  'v-menu': {
    name: 'VMenu / VTooltip',
    description: 'Menu/tooltip positioning, activator, and eager content.',
    changes: [
      {
        title: 'rounded prop removed',
        description: '`rounded` prop has been removed. Apply a rounded css class to the menu content element instead, e.g. `.rounded-te`.',
        migration: 'Replace `rounded` with a rounded utility class on the menu content.',
        issue: null,
      },
      {
        title: 'internal-activator removed',
        description: '`internal-activator` prop has been removed, use `activator` with a ref or unique selector instead.',
        migration: 'Pass `activator` as a ref or selector instead of `internal-activator`.',
        issue: null,
      },
      {
        title: 'absolute, offset-y, and offset-x removed',
        description: '`absolute`, `offset-y` and `offset-x` props have been removed. Manual positioning is now done by passing a `[x, y]` array to the `target` prop.',
        migration: 'Replace `absolute` / `offset-x` / `offset-y` with `target="[x, y]"` (or the activator API).',
        issue: null,
      },
      {
        title: 'nudge-* props removed',
        description: '`nudge-*` props have been removed. There is no direct replacement but `offset` can be used to achieve similar results.',
        migration: 'Replace `nudge-*` with `offset`.',
        issue: null,
      },
      {
        title: 'Content is destroyed after closing',
        description: 'Content is now destroyed after closing, use `eager` to keep it.',
        migration: 'Add `eager` if you need menu/tooltip content to stay mounted.',
        issue: null,
      },
    ],
  },
  'v-navigation-drawer': {
    name: 'VNavigationDrawer',
    description: 'Drawer state is fully controlled via v-model.',
    changes: [
      {
        title: 'stateless prop removed',
        description: '`stateless` prop has been removed, manually control state using `model-value` or `v-model` instead.',
        migration: 'Remove `stateless` and bind `v-model` / `model-value`.',
        issue: null,
      },
    ],
  },
  'v-rating': {
    name: 'VRating',
    description: 'Active vs empty color props.',
    changes: [
      {
        title: 'color renamed to active-color',
        description: '`color` has been renamed to `active-color`.',
        migration: 'Rename `color` to `active-color`.',
        issue: null,
      },
      {
        title: 'background-color renamed to color',
        description: '`background-color` has been renamed to `color`.',
        migration: 'Rename `background-color` to `color`.',
        issue: null,
      },
    ],
  },
  'v-select': {
    name: 'VSelect / VCombobox / VAutocomplete',
    description: 'Items, return-object, slots, and combobox typing.',
    changes: [
      {
        title: 'v-model values not in items are rendered',
        description: 'v-model values not present in `items` will now be rendered instead of being ignored.',
        migration: 'Filter the model yourself if you still need the v2 "ignore unknown values" behavior.',
        issue: null,
      },
      {
        title: 'return-object requires matching object shape',
        description: '`return-object` no longer matches primitive values in v-model, the initial value must have the same structure as `items` objects.',
        migration: 'Initialize `v-model` with objects, not primitive ids, when `return-object` is set.',
        issue: null,
      },
      {
        title: 'cache-items removed',
        description: '`cache-items` prop has been removed, caching should be handled externally.',
        migration: 'Cache items in the parent (computed / store), not via `cache-items`.',
        issue: null,
      },
      {
        title: 'item-text renamed to item-title',
        description: '`item-text` has been renamed to `item-title`, and now looks up the `title` property on item objects by default. `value` is unchanged.',
        migration: 'Rename `item-text` to `item-title`. Prefer `title` on item objects.',
        issue: null,
      },
      {
        title: 'item-disabled and item object flags removed',
        description: '`item-disabled` has been removed, and `disabled`, `header`, `divider`, and `avatar` properties are ignored on item objects. Additional props to pass to `v-list-item` can be specified with the `item-props` prop. `item-props` can be a function that takes the item object and returns an object of props, or set to boolean `true` to spread item objects directly as props.',
        migration: 'Use `item-props` (function or `true`) instead of `item-disabled` / header / divider / avatar flags on items.',
        issue: null,
      },
      {
        title: 'Slot item is a ListItem; original is item.raw',
        description: 'The `item` object in slots is now a ListItem object, the original item object is available as `item.raw`.',
        migration: 'Read display fields from the ListItem; use `item.raw` for the original row.',
        issue: null,
      },
      {
        title: '#item no longer wraps v-list-item',
        description: 'The `item` slot will no longer generate a `v-list-item` component automatically, instead a `props` object is supplied with the required event listeners and props.',
        migration: `Render \`v-list-item\` yourself and bind \`props\`.

\`\`\`html
<template #item="{ props }">
  <v-list-item v-bind="props"></v-list-item>
</template>
\`\`\`
`,
        issue: null,
      },
      {
        title: 'chip slot replaces selection when chips is set',
        description: 'The `chip` slot should be used instead of `selection` if the `chips` prop is set, this will provide some default values to the chips automatically.',
        migration: 'When `chips` is set, customize via `#chip` instead of `#selection`.',
        issue: null,
      },
      {
        title: 'Non-multiple combobox updates as you type',
        description: 'Non-`multiple` combobox will now update its model as you type (like a text field) instead of only on blur.',
        migration: 'Handle intermediate model updates, or debounce, if you previously relied on blur-only commits.',
        issue: null,
      },
    ],
  },
  'v-table': {
    name: 'VTable',
    description: 'v-simple-table rename.',
    changes: [
      {
        title: 'v-simple-table renamed to v-table',
        description: '`v-simple-table` has been renamed to `v-table`.',
        migration: 'Rename `v-simple-table` to `v-table`.',
        issue: null,
      },
    ],
  },
  'v-stepper': {
    name: 'VStepper',
    description: 'Horizontal core vs vertical labs structure.',
    changes: [
      {
        title: 'v-stepper-step is v-stepper-item, not vertical-item',
        description: '`v-stepper-step` is not a core rename to `v-stepper-vertical-item`. Horizontal (core): `v-stepper-item` plus `v-stepper-window` / `v-stepper-window-item`. Vertical: `v-stepper-vertical` / `v-stepper-vertical-item` are labs.',
        migration: 'Replace horizontal `v-stepper-step` with `v-stepper-item`. For vertical steppers, import labs `v-stepper-vertical` / `v-stepper-vertical-item` and put the label in the title slot.',
        issue: null,
      },
      {
        title: 'v-stepper-content removed',
        description: '`v-stepper-content` has been removed. Horizontal: move the body into `v-stepper-window-item`. Vertical labs: move content to the default slot of `v-stepper-vertical-item`.',
        migration: 'Delete `v-stepper-content`. Horizontal → `v-stepper-window-item`. Vertical labs → default slot of `v-stepper-vertical-item`.',
        issue: null,
      },
    ],
  },
  'v-data-table': {
    name: 'VDataTable',
    description: 'Headers, server tables, events, sort/group. Core on 3.13.',
    changes: [
      {
        title: 'Header object keys renamed',
        description: 'Headers objects: `text` has been renamed to `title`; `data-table-select` and `data-table-expand` must be defined as `key` instead of `value`; `class` has been replaced with `headerProps`; `cellClass` has been replaced with `cellProps` and now accepts either a function or an object; `filter` function requires `search` to be used in order for it to be triggered.',
        migration: `Rename header fields. Keep \`value\` on normal columns; use \`key\` only for \`data-table-select\` / \`data-table-expand\`.

\`\`\`vue
<!-- 2.x -->
<v-data-table
  :headers="[{ text: 'Name', value: 'name' }]"
/>
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-data-table
  :headers="[{ title: 'Name', value: 'name' }]"
/>
<!-- key required only for data-table-select / data-table-expand -->
\`\`\`
`,
        issue: null,
      },
      {
        title: '#item slot item is the original row',
        description: 'The `#item` slot `item` is the original row. The wrapped object is `internalItem`.',
        migration: 'Use `item` for the original row. Use `internalItem` when you need the wrapped table item (columns, select, expand).',
        issue: null,
      },
      {
        title: 'search prop required to trigger filtering',
        description: 'Tables requires `search` prop to trigger filtering. `items` array can be pre-filter with a computed.',
        migration: 'Pass `search` to filter in the table, or pre-filter `items` with a computed.',
        issue: null,
      },
      {
        title: 'server-items-length replaced by v-data-table-server',
        description: 'Server side tables using `server-items-length` must be replaced with `<v-data-table-server items-length />`.',
        migration: `Use the server table component.

\`\`\`vue
<!-- 2.x -->
<v-data-table :server-items-length="total" />
\`\`\`

\`\`\`vue
<!-- 3.x -->
<v-data-table-server :items-length="total" />
\`\`\`
`,
        issue: null,
      },
      {
        title: '@click:* argument order is (event, data)',
        description: 'Argument order for `@click:*` events is now consistently `(event, data)`. `onRowClick (item, data, event)` should be changed to `onRowClick (event, { item })`.',
        migration: 'Change row click handlers to `(event, { item })`.',
        issue: null,
      },
      {
        title: 'item-class and item-style combined into row-props',
        description: '`item-class` and `item-style` have been combined into `row-props`, and `cell-props` has been added.',
        migration: 'Replace `item-class` / `item-style` with `row-props`. Use `cell-props` for cells.',
        issue: null,
      },
      {
        title: 'sort-desc and group-desc combined into sort-by / group-by',
        description: '`sort-desc` and `group-desc` have been combined into `sort-by` and `group-by`. These properties now take an array of `{ key: string, order: \'asc\' | \'desc\' }` objects instead of strings.',
        migration: 'Replace string `sort-by` + `sort-desc` with `:sort-by="[{ key: \'name\', order: \'asc\' }]"`. Same for group.',
        issue: null,
      },
      {
        title: 'current-items renamed to update:current-items',
        description: '`current-items` event has been renamed to `update:current-items`.',
        migration: 'Replace `@current-items` with `@update:current-items`.',
        issue: null,
      },
      {
        title: 'custom-sort moved to header sort or custom-key-sort',
        description: '`custom-sort` can now be done using the sort key in the headers object or by using the `custom-key-sort` prop.',
        migration: 'Move `custom-sort` to header `sort` functions or `custom-key-sort`.',
        issue: null,
      },
    ],
  },
  'v-slider': {
    name: 'VSlider / VRangeSlider',
    description: 'Ticks, direction, and default step.',
    changes: [
      {
        title: 'ticks renamed to show-ticks',
        description: '`ticks` has been renamed to `show-ticks`.',
        migration: 'Rename `ticks` to `show-ticks`.',
        issue: null,
      },
      {
        title: 'tick-labels renamed to ticks',
        description: '`tick-labels` has been renamed to `ticks`.',
        migration: 'Rename `tick-labels` to `ticks`.',
        issue: null,
      },
      {
        title: 'vertical renamed to direction="vertical"',
        description: '`vertical` has been renamed to `direction="vertical"`.',
        migration: 'Replace `vertical` with `direction="vertical"`.',
        issue: null,
      },
      {
        title: 'step default is now 0',
        description: '`step` default value is now 0 instead of 1.',
        migration: 'Set `step="1"` explicitly if you need the v2 stepping.',
        issue: null,
      },
    ],
  },
  'v-tabs': {
    name: 'VTabs',
    description: 'Tab items, mandatory, and value vs href.',
    changes: [
      {
        title: 'v-tab-item removed',
        description: '`v-tab-item` has been removed, use `v-window-item`.',
        migration: 'Replace `v-tab-item` with `v-window-item` (usually inside `v-window` / `v-tabs-window`).',
        issue: null,
      },
      {
        title: 'optional replaced by :mandatory="false"',
        description: '`optional` has been replaced with `:mandatory="false"`.',
        migration: 'Replace `optional` with `:mandatory="false"`.',
        issue: null,
      },
      {
        title: 'href no longer sets the tabs model',
        description: '`<v-tab href="#foo">` no longer sets the v-tabs model to "foo" when selected, use `value="foo"` instead.',
        migration: 'Use `value="foo"` for selection; keep `href` only for actual navigation.',
        issue: null,
      },
    ],
  },
  'v-img': {
    name: 'VImg',
    description: 'Contain is the default; cover fills the container.',
    changes: [
      {
        title: 'contain is the default; use cover to fill',
        description: '`contain` has been removed and is now the default behaviour. Use `cover` to fill the entire container.',
        migration: 'Remove `contain`. Add `cover` if the v2 image filled the box.',
        issue: null,
      },
    ],
  },
  'v-snackbar': {
    name: 'VSnackbar',
    description: 'Actions slot rename.',
    changes: [
      {
        title: 'action slot renamed to actions',
        description: '`action` slot was renamed to `actions`.',
        migration: 'Rename `#action` to `#actions`.',
        issue: null,
      },
    ],
  },
  'v-expansion-panel': {
    name: 'VExpansionPanel',
    description: 'Header/content renamed to title/text, plus title/text props.',
    changes: [
      {
        title: 'v-expansion-panel-header renamed to v-expansion-panel-title',
        description: '`v-expansion-panel-header` has been renamed to `v-expansion-panel-title`.',
        migration: 'Rename `v-expansion-panel-header` to `v-expansion-panel-title`.',
        issue: null,
      },
      {
        title: 'v-expansion-panel-content renamed to v-expansion-panel-text',
        description: '`v-expansion-panel-content` has been renamed to `v-expansion-panel-text`.',
        migration: 'Rename `v-expansion-panel-content` to `v-expansion-panel-text`.',
        issue: null,
      },
      {
        title: 'title and text props available',
        description: '`v-expansion-panel` now has `text` and `title` props that can be used instead of subcomponents.',
        migration: 'Optionally replace nested title/text components with `title` and `text` props.',
        issue: null,
      },
    ],
  },
  'v-card': {
    name: 'VCard',
    description: 'Overflow and z-index clipping.',
    changes: [
      {
        title: 'v-card clips overflow and z-index',
        description: '`v-card` does not allow content to overflow or use higher `z-index` values to display on top of elements outside it. To disable this behavior, use `<v-card style="overflow: initial; z-index: initial">`. (#17593, #17628)',
        migration: 'Set `overflow: initial; z-index: initial` on cards that must leak overlays/menus.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/17593, https://github.com/vuetifyjs/vuetify/issues/17628',
      },
    ],
  },
  'v-sparkline': {
    name: 'VSparkline',
    description: 'value → model-value. Core on 3.13.',
    changes: [
      {
        title: 'value is now model-value',
        description: '`value` is now `model-value`.',
        migration: 'Rename `value` to `model-value` (or use `v-model`).',
        issue: null,
      },
    ],
  },
  'v-intersect': {
    name: 'VIntersect',
    description: 'Directive handler argument order.',
    changes: [
      {
        title: 'Handler argument order changed',
        description: 'Handler argument order has changed from `entries, observer, isIntersecting` to `isIntersecting, entries, observer`.',
        migration: 'Update v-intersect handlers to `(isIntersecting, entries, observer)`.',
        issue: null,
      },
    ],
  },
  'renames': {
    name: 'Renames',
    description: 'eslint-plugin-vuetify no-deprecated-components replacements (hyphenated). One entry per replacements key.',
    changes: [
      {
        title: 'v-list-tile → v-list-item',
        description: 'VListTile has been replaced with v-list-item.',
        migration: 'Rename `v-list-tile` to `v-list-item`.',
        issue: null,
      },
      {
        title: 'v-list-tile-action → v-list-item-action',
        description: 'VListTileAction has been replaced with v-list-item-action.',
        migration: 'Rename `v-list-tile-action` to `v-list-item-action`.',
        issue: null,
      },
      {
        title: 'v-list-tile-avatar removed',
        description: 'VListTileAvatar has been removed.',
        migration: 'Use `prepend-avatar` / `append-avatar` or `v-avatar` in the prepend/append slot.',
        issue: null,
      },
      {
        title: 'v-list-tile-action-text is gone',
        description: 'eslint-plugin-vuetify remaps `v-list-tile-action-text` to `v-list-item-action-text`, which does not exist in 3.13.',
        migration: 'Do not trust the eslint remap. Use prepend/append slots or custom markup.',
        issue: null,
      },
      {
        title: 'v-list-tile-content removed',
        description: 'VListTileContent has been removed.',
        migration: 'Delete the wrapper; lists use CSS grid.',
        issue: null,
      },
      {
        title: 'v-list-tile-title → v-list-item-title',
        description: 'VListTileTitle has been replaced with v-list-item-title.',
        migration: 'Rename `v-list-tile-title` to `v-list-item-title`.',
        issue: null,
      },
      {
        title: 'v-list-tile-sub-title → v-list-item-subtitle',
        description: 'VListTileSubTitle has been replaced with v-list-item-subtitle.',
        migration: 'Rename `v-list-tile-sub-title` to `v-list-item-subtitle`.',
        issue: null,
      },
      {
        title: 'v-jumbotron removed',
        description: 'VJumbotron has been removed.',
        migration: 'Replace with `v-img` / `v-sheet` layout.',
        issue: null,
      },
      {
        title: 'v-toolbar-side-icon → v-app-bar-nav-icon',
        description: 'VToolbarSideIcon has been replaced with v-app-bar-nav-icon.',
        migration: 'Rename `v-toolbar-side-icon` to `v-app-bar-nav-icon`.',
        issue: null,
      },
      {
        title: 'v-expansion-panel-header → v-expansion-panel-title',
        description: 'VExpansionPanelHeader has been replaced with v-expansion-panel-title.',
        migration: 'Rename `v-expansion-panel-header` to `v-expansion-panel-title`.',
        issue: null,
      },
      {
        title: 'v-expansion-panel-content → v-expansion-panel-text',
        description: 'VExpansionPanelContent has been replaced with v-expansion-panel-text.',
        migration: 'Rename `v-expansion-panel-content` to `v-expansion-panel-text`.',
        issue: null,
      },
      {
        title: 'v-list-item-sub-title → v-list-item-subtitle',
        description: 'VListItemSubTitle (typo alias) has been replaced with v-list-item-subtitle.',
        migration: 'Rename `v-list-item-sub-title` to `v-list-item-subtitle`.',
        issue: null,
      },
      {
        title: 'v-list-tile-subtitle → v-list-item-subtitle',
        description: 'VListTileSubtitle (typo alias) has been replaced with v-list-item-subtitle.',
        migration: 'Rename `v-list-tile-subtitle` to `v-list-item-subtitle`.',
        issue: null,
      },
      {
        title: 'v-content → v-main',
        description: 'VContent has been replaced with v-main.',
        migration: 'Rename `v-content` to `v-main`.',
        issue: null,
      },
      {
        title: 'v-data removed',
        description: 'VData has been removed.',
        migration: 'Remove `v-data`. Use the data-table internals or your own data layer.',
        issue: null,
      },
      {
        title: 'v-list-item-group removed',
        description: 'VListItemGroup has been removed.',
        migration: 'Bind `v-model:selected` on `v-list` and set `value` on each `v-list-item`.',
        issue: null,
      },
      {
        title: 'v-list-item-avatar replaced',
        description: 'VListItemAvatar has been replaced with `prepend-avatar` / `append-avatar`, or `v-avatar` in the list item append or prepend slot. There is no `avatar` prop.',
        migration: 'Use `prepend-avatar` / `append-avatar` or an avatar in the prepend/append slot.',
        issue: null,
      },
      {
        title: 'v-list-item-content removed',
        description: 'VListItemContent has been removed.',
        migration: 'Delete `v-list-item-content` wrappers.',
        issue: null,
      },
      {
        title: 'v-list-item-icon replaced',
        description: 'VListItemIcon has been replaced with `prepend-icon` / `append-icon`, or `v-icon` in the list item append or prepend slot. There is no `icon` prop.',
        migration: 'Use `prepend-icon` / `append-icon` or an icon in the prepend/append slot.',
        issue: null,
      },
      {
        title: 'v-overflow-btn removed',
        description: 'VOverflowBtn has been removed. It was never ported to Vuetify 3.',
        migration: 'Replace with `v-select`, `v-menu` + `v-btn`, or a custom split control. Not in 3.13.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/13493',
      },
      {
        title: 'v-simple-checkbox → v-checkbox-btn',
        description: 'VSimpleCheckbox has been replaced with v-checkbox-btn.',
        migration: 'Rename `v-simple-checkbox` to `v-checkbox-btn`.',
        issue: null,
      },
      {
        title: 'v-subheader replaced',
        description: 'VSubheader has been replaced with v-list-subheader or class="text-subtitle-2".',
        migration: 'Rename `v-subheader` to `v-list-subheader`, or use `class="text-subtitle-2"`.',
        issue: null,
      },
      {
        title: 'v-simple-table → v-table',
        description: 'VSimpleTable has been replaced with v-table.',
        migration: 'Rename `v-simple-table` to `v-table`.',
        issue: null,
      },
      {
        title: 'v-tabs-slider removed',
        description: 'VTabsSlider has been removed.',
        migration: 'Remove `v-tabs-slider`; the slider is part of `v-tabs`.',
        issue: null,
      },
      {
        title: 'v-tabs-items removed',
        description: 'VTabsItems has been removed.',
        migration: 'Replace `v-tabs-items` with `v-window` / `v-tabs-window`.',
        issue: null,
      },
      {
        title: 'v-tab-item removed',
        description: 'VTabItem has been removed. Use `v-window-item`.',
        migration: 'Replace `v-tab-item` with `v-window-item`.',
        issue: null,
      },
    ],
  },
  'missing': {
    name: 'Missing',
    description: 'Components that never shipped, and Labs imports that became core on 3.13.',
    changes: [
      {
        title: 'v-overflow-btn is gone',
        description: '`v-overflow-btn` was not ported to Vuetify 3. Split-button discussion (#22076) is not a 3.13 API.',
        migration: 'Fail closed if the app depends on overflow-btn. Rebuild with v-select or v-menu + v-btn.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/13493',
      },
      {
        title: 'data-table, date-picker, treeview, time-picker, calendar, and sparkline are core on 3.13',
        description: 'On vuetify@^3.13 these components are core. Older 3.x required Labs imports such as `import { VDataTable } from \'vuetify/labs/VDataTable\'`.',
        migration: 'Target 3.13 and import from vuetify/components. On older 3.x use `vuetify/labs/...` and register via `createVuetify({ components })`.',
        issue: null,
      },
    ],
  },
  'gotchas': {
    name: 'Gotchas',
    description: 'High-frequency landmines during a Vuetify 2 → 3.13 upgrade. Scan these after layout, list, data-table, date-picker, theme, and general.',
    changes: [
      {
        title: 'Layout chrome vanishes',
        description: '`app` / `clipped` / `stateless` are gone; markup order owns the shell. `v-content` must become `v-main` or the app-bar/drawer/main layout collapses.',
        migration: 'Rebuild the shell without `app`/`clipped`. Use `v-main`. See the layout category snippets.',
        issue: null,
      },
      {
        title: 'Data-table rewrite',
        description: 'Headers `text` → `title`; `#item` `item` is the original row (`internalItem` is the wrapped object); `@update:options` replaces ad-hoc server events; server pagination is `<v-data-table-server items-length />`, not `server-items-length` on `v-data-table`.',
        migration: 'Treat data-table as a rewrite. Switch server tables to `v-data-table-server`. Use `item` for the original row, `internalItem` for the wrapped table item.',
        issue: null,
      },
      {
        title: 'Date picker model is Date, range is not v2',
        description: 'v-date-picker binds `Date` objects, not strings. v2 `range` is not v3 `multiple="range"` — 3.13 emits every day in the range.',
        migration: 'Convert strings at the boundary. Do not assume `[start, end]` from `multiple="range"`.',
        issue: null,
      },
      {
        title: 'Theme classes in SCSS miss eslint',
        description: '`.primary` / `.primary--text` in SCSS/CSS survive eslint-plugin-vuetify, which only remaps templates.',
        migration: 'Grep stylesheets for `.primary`, `.primary--text`, and `--v-*-base`.',
        issue: null,
      },
      {
        title: 'Activator slots',
        description: '`#activator="{ attrs, on }"` is now `#activator="{ props }"`. `v-bind="attrs"` + `v-on="on"` must become `v-bind="props"`.',
        migration: 'Update every menu/dialog/tooltip activator slot. See the general category snippet.',
        issue: null,
      },
      {
        title: 'Select #item no longer wraps v-list-item',
        description: 'The select/combobox/autocomplete `#item` slot no longer auto-wraps `v-list-item`. You must render one and bind `props`.',
        migration: 'Use `<template #item="{ props }"><v-list-item v-bind="props" /></template>`.',
        issue: null,
      },
      {
        title: 'v-form.validate() is async',
        description: '`validate()` returns `Promise<FormValidationResult>` instead of a boolean.',
        migration: '`const { valid } = await form.validate()`.',
        issue: null,
      },
      {
        title: 'SASS import path',
        description: '`~vuetify/src/styles/settings/_variables` is now `vuetify/settings`.',
        migration: 'Rewrite SASS imports to `vuetify/settings`.',
        issue: null,
      },
      {
        title: '@vue/compat is not a Vuetify 3 path',
        description: '`@vue/compat` is not a Vuetify 3 path unless `configureCompat({ MODE: 3 })` is set globally (and `MODE: 2` only on leftover Vue 2 SFCs). Filters, `$listeners`, `$children`, `$on`/`$off` are Vue\'s problem, not Vuetify\'s.',
        migration: 'Migrate the app to Vue 3 first. Do not treat `@vue/compat` as the Vuetify upgrade.',
        issue: null,
      },
      {
        title: 'vee-validate 3 is Vue 2 only',
        description: 'vee-validate 3 does not run on Vue 3. It is a blocker, not a later chore.',
        migration: 'Upgrade vee-validate (or replace it) as part of the Vue 3 prerequisite.',
        issue: null,
      },
      {
        title: 'Labs import on older 3.x',
        description: '`createVuetify({ components })` does not include Labs. Older 3.x needed `import { X } from \'vuetify/labs/X\'` for data-table, date-picker, treeview, time-picker, calendar, and sparkline. Those are core on 3.13. Historical: date-picker was missing in 3.0.3.',
        migration: 'Target vuetify@^3.13. On older 3.x, import from `vuetify/labs/...` and register the components.',
        issue: null,
      },
      {
        title: 'v-overflow-btn never ported',
        description: '`v-overflow-btn` was never ported. Issue #13493 closed in favor of a v4-era split-button discussion (#22076), which is not in 3.13.',
        migration: 'Replace overflow-btn UX before bumping Vuetify. There is no 3.13 component of that name.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/13493',
      },
      {
        title: 'v-calendar is core; re-test slots and events',
        description: 'v-calendar is core on 3.13. Re-test slots and events. Emit argument order is `(nativeEvent, data)` instead of a single object.',
        migration: 'Re-test every calendar view. Update click handlers to `(nativeEvent, data)`. Do not assume v2 slot names or event payloads.',
        issue: null,
      },
      {
        title: 'v-treeview expand performance',
        description: 'Treeview expand jank is still reported on large trees.',
        migration: 'Profile expand on real data. Open issue remains for expand performance.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/19919',
      },
      {
        title: 'v-card overflow / z-index',
        description: 'v-card clips overflowing content and traps z-index, which breaks menus, dialogs, and absolute children. (#17593, #17628)',
        migration: 'Use `style="overflow: initial; z-index: initial"` on cards that must leak overlays.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/17593, https://github.com/vuetifyjs/vuetify/issues/17628',
      },
      {
        title: 'Testing DOM changed',
        description: '`v-switch` is a real checkbox; ARIA switch attributes are gone. There are no official v3 testing docs.',
        migration: 'Update queries to the new markup. Do not copy v2 testing recipes blindly.',
        issue: 'https://github.com/vuetifyjs/vuetify/issues/17684',
      },
    ],
  },
} as const satisfies Record<string, {
  name: string
  description: string
  changes: readonly V3BreakingChange[]
}>

export type V3BreakingChangeCategory = keyof typeof V3_BREAKING_CHANGES

export async function getV3BreakingChanges (
  { category }: { category?: V3BreakingChangeCategory } = {},
) {
  if (category) {
    const cat = V3_BREAKING_CHANGES[category]
    if (!cat) {
      throw new Error(
        `Breaking change category "${category}" not found. Available: ${Object.keys(V3_BREAKING_CHANGES).join(', ')}`,
      )
    }

    const text = `# ${cat.name}\n\n${cat.description}\n\n` + cat.changes.map(change => (
      `## ${change.title}\n\n${change.description}\n\n**Migration:** ${change.migration}`
      + (change.issue ? `\n\n**Related issue:** ${change.issue}` : '')
    )).join('\n\n---\n\n')

    return { content: [{ type: 'text' as const, text }] }
  }

  const text = `# Vuetify 3 Breaking Changes (upgrade from v2)\n\n`
    + `Upgrade guide: https://v3.vuetifyjs.com/en/getting-started/upgrade-guide/\n\n`
    + `Target: vuetify@^3.13.0. Do not upgrade to v4 in this pass.\n\n`
    + Object.entries(V3_BREAKING_CHANGES).map(([key, cat]) => (
      `## ${cat.name} (${key})\n\n${cat.description}\n\n`
      + cat.changes.map(c => `- **${c.title}**: ${c.description}`).join('\n')
    )).join('\n\n---\n\n')

  return { content: [{ type: 'text' as const, text }] }
}
