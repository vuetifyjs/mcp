export type V2ToV3Status = 'core' | 'renamed' | 'removed' | 'replaced'

export type V2ToV3ComponentRow = {
  v2: string
  v3: string | null
  status: V2ToV3Status
  notes: string
  issue: string | null
}

export const V3_COMPONENT_MAP: readonly V2ToV3ComponentRow[] = [
  {
    v2: 'v-list-tile',
    v3: 'v-list-item',
    status: 'renamed',
    notes: 'Rename to v-list-item.',
    issue: null,
  },
  {
    v2: 'v-list-tile-action',
    v3: 'v-list-item-action',
    status: 'renamed',
    notes: 'Rename to v-list-item-action.',
    issue: null,
  },
  {
    v2: 'v-list-tile-avatar',
    v3: null,
    status: 'removed',
    notes: 'Use prepend-avatar / append-avatar or v-avatar in the prepend/append slot.',
    issue: null,
  },
  {
    v2: 'v-list-tile-action-text',
    v3: null,
    status: 'removed',
    notes: 'eslint-plugin-vuetify remaps this to v-list-item-action-text, which does not exist in 3.13. Use prepend/append slots or custom markup.',
    issue: null,
  },
  {
    v2: 'v-list-tile-content',
    v3: null,
    status: 'removed',
    notes: 'Delete the wrapper; lists use CSS grid.',
    issue: null,
  },
  {
    v2: 'v-list-tile-title',
    v3: 'v-list-item-title',
    status: 'renamed',
    notes: 'Rename to v-list-item-title.',
    issue: null,
  },
  {
    v2: 'v-list-tile-sub-title',
    v3: 'v-list-item-subtitle',
    status: 'renamed',
    notes: 'Rename to v-list-item-subtitle.',
    issue: null,
  },
  {
    v2: 'v-jumbotron',
    v3: null,
    status: 'removed',
    notes: 'Replace with v-img / v-sheet layout.',
    issue: null,
  },
  {
    v2: 'v-toolbar-side-icon',
    v3: 'v-app-bar-nav-icon',
    status: 'renamed',
    notes: 'Rename to v-app-bar-nav-icon.',
    issue: null,
  },
  {
    v2: 'v-expansion-panel-header',
    v3: 'v-expansion-panel-title',
    status: 'renamed',
    notes: 'Rename to v-expansion-panel-title.',
    issue: null,
  },
  {
    v2: 'v-expansion-panel-content',
    v3: 'v-expansion-panel-text',
    status: 'renamed',
    notes: 'Rename to v-expansion-panel-text.',
    issue: null,
  },
  {
    v2: 'v-list-item-sub-title',
    v3: 'v-list-item-subtitle',
    status: 'renamed',
    notes: 'Typo alias; rename to v-list-item-subtitle.',
    issue: null,
  },
  {
    v2: 'v-list-tile-subtitle',
    v3: 'v-list-item-subtitle',
    status: 'renamed',
    notes: 'Typo alias; rename to v-list-item-subtitle.',
    issue: null,
  },
  {
    v2: 'v-content',
    v3: 'v-main',
    status: 'renamed',
    notes: 'Rename to v-main.',
    issue: null,
  },
  {
    v2: 'v-data',
    v3: null,
    status: 'removed',
    notes: 'Removed. Use data-table internals or your own data layer.',
    issue: null,
  },
  {
    v2: 'v-list-item-group',
    v3: null,
    status: 'removed',
    notes: 'Bind v-model:selected on v-list; set value on each v-list-item.',
    issue: null,
  },
  {
    v2: 'v-list-item-avatar',
    v3: null,
    status: 'replaced',
    notes: 'Use prepend-avatar / append-avatar, or v-avatar in the append/prepend slot.',
    issue: null,
  },
  {
    v2: 'v-list-item-content',
    v3: null,
    status: 'removed',
    notes: 'Delete wrappers; lists use CSS grid.',
    issue: null,
  },
  {
    v2: 'v-list-item-icon',
    v3: null,
    status: 'replaced',
    notes: 'Use prepend-icon / append-icon, or v-icon in the append/prepend slot.',
    issue: null,
  },
  {
    v2: 'v-overflow-btn',
    v3: null,
    status: 'removed',
    notes: 'Never ported. Split-button discussion #22076 is not in 3.13.',
    issue: 'https://github.com/vuetifyjs/vuetify/issues/13493',
  },
  {
    v2: 'v-simple-checkbox',
    v3: 'v-checkbox-btn',
    status: 'renamed',
    notes: 'Rename to v-checkbox-btn.',
    issue: null,
  },
  {
    v2: 'v-subheader',
    v3: 'v-list-subheader',
    status: 'replaced',
    notes: 'Use v-list-subheader or class="text-subtitle-2".',
    issue: null,
  },
  {
    v2: 'v-simple-table',
    v3: 'v-table',
    status: 'renamed',
    notes: 'Rename to v-table.',
    issue: null,
  },
  {
    v2: 'v-tabs-slider',
    v3: null,
    status: 'removed',
    notes: 'Remove; the slider is part of v-tabs.',
    issue: null,
  },
  {
    v2: 'v-tabs-items',
    v3: null,
    status: 'removed',
    notes: 'Use v-window / v-tabs-window.',
    issue: null,
  },
  {
    v2: 'v-tab-item',
    v3: 'v-window-item',
    status: 'replaced',
    notes: 'Replace with v-window-item.',
    issue: null,
  },
  {
    v2: 'v-data-table',
    v3: 'v-data-table',
    status: 'core',
    notes: 'Rewrite on 3.13; use v-data-table-server for server pagination (was server-items-length). Older 3.x: import { VDataTable } from \'vuetify/labs/VDataTable\'.',
    issue: null,
  },
  {
    v2: 'v-date-picker',
    v3: 'v-date-picker',
    status: 'core',
    notes: 'Date objects, not strings; multiple="range" ≠ v2 range. Older 3.x: import { VDatePicker } from \'vuetify/labs/VDatePicker\'.',
    issue: null,
  },
  {
    v2: 'v-calendar',
    v3: 'v-calendar',
    status: 'core',
    notes: 'API rewrite. Re-test slots/events; emit arg order is (nativeEvent, data). Older 3.x: import { VCalendar } from \'vuetify/labs/VCalendar\'.',
    issue: null,
  },
  {
    v2: 'v-treeview',
    v3: 'v-treeview',
    status: 'core',
    notes: 'Core after years (#13518). Expand perf still open (#19919). Older 3.x: import { VTreeview } from \'vuetify/labs/VTreeview\'.',
    issue: 'https://github.com/vuetifyjs/vuetify/issues/13518',
  },
  {
    v2: 'v-time-picker',
    v3: 'v-time-picker',
    status: 'core',
    notes: 'Core on 3.13. Older 3.x: import { VTimePicker } from \'vuetify/labs/VTimePicker\'.',
    issue: null,
  },
  {
    v2: 'v-sparkline',
    v3: 'v-sparkline',
    status: 'core',
    notes: 'Uses model-value. Older 3.x: import { VSparkline } from \'vuetify/labs/VSparkline\'.',
    issue: null,
  },
  {
    v2: 'v-stepper-step',
    v3: 'v-stepper-item',
    status: 'replaced',
    notes: 'Horizontal (core): v-stepper-item + v-stepper-window / v-stepper-window-item. Vertical: v-stepper-vertical / v-stepper-vertical-item are labs.',
    issue: null,
  },
  {
    v2: 'v-stepper-content',
    v3: 'v-stepper-window-item',
    status: 'removed',
    notes: 'Removed. Horizontal: v-stepper-window-item. Vertical labs: default slot of v-stepper-vertical-item.',
    issue: null,
  },
  {
    v2: 'v-flex',
    v3: 'v-col',
    status: 'removed',
    notes: 'Removed. Use v-col inside v-row.',
    issue: null,
  },
  {
    v2: 'v-layout',
    v3: 'v-row',
    status: 'replaced',
    notes: 'v3 v-layout is a different layout-system component; v2 grid usage maps to v-row.',
    issue: null,
  },
  {
    v2: 'v-edit-dialog',
    v3: null,
    status: 'removed',
    notes: 'Removed. No 3.13 equivalent; inline-edit with a dialog or menu.',
    issue: null,
  },
]

export async function getV2ToV3ComponentMap () {
  const header = '| v2 | v3 | status | notes | issue |\n|---|---|---|---|---|\n'
  const rows = V3_COMPONENT_MAP.map(row =>
    `| \`${row.v2}\` | ${row.v3 ? `\`${row.v3}\`` : '—'} | ${row.status} | ${row.notes} | ${row.issue ?? ''} |`,
  ).join('\n')

  const text = `# Vuetify 2 → 3.13 component map\n\n${header}${rows}\n\n\`\`\`json\n${JSON.stringify(V3_COMPONENT_MAP, null, 2)}\n\`\`\`\n`

  return { content: [{ type: 'text' as const, text }] }
}

export async function getV3UpgradePlaybook () {
  const text = `# Vuetify 2 → 3.13 upgrade playbook

Start here. Target **vuetify@^3.13**. Do not upgrade to v4.

Follow phases 0–11 in order. Do not skip phase 0.

## 0. Baseline

Call \`get_v3_upgrade_baseline_recipe\`. Scaffold Playwright if missing. Capture \`upgrade-baseline/\` **before any dependency bump**. Inventory vue-router / Nuxt pages; cover app-bar/drawer shells, data tables, date pickers, lists, forms, dialogs. Do not skip because the app is large.

## 1. Inventory

Read \`package.json\`: \`vue\`, \`vuetify\`, \`vue-router\`, \`vuex\`/\`pinia\`, \`vee-validate\`, \`nuxt\`, bundler (\`vue-cli-service\` / webpack / vite). vee-validate 3 is a blocker. Vue CLI is not; use \`webpack-plugin-vuetify\`.

## 2. Vue 3 prerequisite

https://v3-migration.vuejs.org/. \`@vue/compat\` is **not** a Vuetify 3 path unless \`configureCompat({ MODE: 3 })\` globally and \`MODE: 2\` only on leftover Vue 2 SFCs (FAQ). Filters, \`$listeners\`, \`$children\`, \`$on\`/\`$off\` are Vue's problem.

## 3. Target

Install **vuetify@^3.13.0**. Do not install 4.

## 4. Bundler / Nuxt

\`vuetify-loader\` → \`vite-plugin-vuetify\` or \`webpack-plugin-vuetify\`. Nuxt 2 \`@nuxtjs/vuetify\` → Nuxt 3 + \`vuetify-nuxt-module\`.

## 5. Bootstrap

\`createApp\` + \`createVuetify\`. Drop \`vuetify/lib\`. \`import 'vuetify/styles'\`. Optional defaults to keep v2 look:

\`\`\`ts
defaults: {
  VTextField: { variant: 'underlined' },
  VSelect: { variant: 'underlined' },
  VTextarea: { variant: 'underlined' },
  VAutocomplete: { variant: 'underlined' },
  VCombobox: { variant: 'underlined' },
  VFileInput: { variant: 'underlined' },
}
\`\`\`

## 6. Mechanical remaps

\`eslint-plugin-vuetify\` config \`recommended\` (flat: \`flat/recommended\`), **not recommended-v4**. \`--fix\`.

## 7. Status table

Call \`get_v2_to_v3_component_map\`. Fail closed on \`v-overflow-btn\`.

## 8. Scan remaining

Call \`get_v3_breaking_changes\` in order: \`layout\`, \`v-list\`, \`v-data-table\`, \`v-date-picker\`, \`theme\`, \`general\`, \`gotchas\`, then the rest. Report file, line, recommended fix.

## 9. Re-baseline

\`test:upgrade:after\` into \`upgrade-after/\`. Functional failures are blockers. Screenshot diffs are classified (layout-break vs intended v3 look), never a hard CI fail on first v3 run.

## 10. Tests

DOM structure changed (\`v-switch\` is a real checkbox). #17684: no official v3 testing docs.

## 11. Stop.

Do not apply \`get_v4_breaking_changes\`.
`

  return { content: [{ type: 'text' as const, text }] }
}

export async function getV3UpgradeBaselineRecipe () {
  const text = `# Vuetify 2 → 3 upgrade baseline recipe

Playwright (not Cypress) functional e2e plus tagged screenshots. Functional tests are the source of truth. Do not add Percy, Chromatic billing, or \`toHaveScreenshot\` as a CI gate.

Capture \`upgrade-baseline/\` on the current Vuetify 2 app **before any dependency bump**. Re-run into \`upgrade-after/\` after the v3 upgrade.

## Dev dependency

\`\`\`bash
pnpm add -D @playwright/test
\`\`\`

## playwright.config.ts

Desktop viewport \`1280x720\`. \`baseURL\` from \`PLAYWRIGHT_BASE_URL\` (default \`http://localhost:3000\`). \`storageState\` is loaded only when the auth file exists.

\`\`\`ts
import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

const auth = 'playwright/.auth/user.json'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
    screenshot: 'off',
    storageState: existsSync(auth) ? auth : undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
\`\`\`

## npm scripts

\`\`\`json
{
  "test:upgrade:baseline": "UPGRADE_SHOT_DIR=upgrade-baseline playwright test",
  "test:upgrade:after": "UPGRADE_SHOT_DIR=upgrade-after playwright test"
}
\`\`\`

## Auth

Document \`storageState\`. If \`playwright/.auth/user.json\` exists, Playwright loads it. Do not invent login flows for arbitrary IdPs.

## Inventory

Rank routes by layout risk. One spec per high-risk route plus a **shell spec**. Phase 0 runs on **v2**: assert \`.v-application\` and \`.v-content\`. After upgrade, \`.v-content\` becomes \`.v-main\`.

\`\`\`ts
import { test, expect } from '@playwright/test'

test('shell: v-app and v-content remain', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.v-application, .v-app, [class*="v-app"]').first()).toBeVisible()
  await expect(page.locator('.v-content, [class*="v-content"]').first()).toBeVisible()
})
\`\`\`

After upgrade, change the content locator to \`.v-main\`.

## Assertions

Use \`getByRole\`, visible headings, and URL — not CSS class names.

\`\`\`ts
await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
await expect(page).toHaveURL(/\\/dashboard/)
\`\`\`

## Screenshots

\`page.screenshot({ path, fullPage: true })\` into the tagged folder (\`upgrade-baseline/\` then \`upgrade-after/\`). Drive the folder with \`UPGRADE_SHOT_DIR\`.

\`\`\`ts
const dir = process.env.UPGRADE_SHOT_DIR ?? 'upgrade-baseline'
await page.screenshot({ path: \`\${dir}/shell.png\`, fullPage: true })
\`\`\`

## Classification rules

- Functional fail = blocker
- Screenshot = review (layout-break vs intended v3 look)
- v3 defaults (no uppercase buttons, \`density\`, elevation) are expected
- Never a hard CI fail on first v3 screenshots

## Out of recipe

No Cypress. No Percy. No pixel-threshold \`toHaveScreenshot\` as CI gate. If Storybook/Chromatic already exists, use it too — do not add a second visual stack. Out of scope: screenshot hosting, Percy/Chromatic billing, auth-fixture generation.
`

  return { content: [{ type: 'text' as const, text }] }
}

export function createV3UpgradeService () {
  return {
    getV2ToV3ComponentMap,
    getV3UpgradePlaybook,
    getV3UpgradeBaselineRecipe,
  }
}
