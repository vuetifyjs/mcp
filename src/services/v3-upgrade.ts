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
    notes: 'Use v-list-item avatar props or v-avatar in the prepend/append slot.',
    issue: null,
  },
  {
    v2: 'v-list-tile-action-text',
    v3: 'v-list-item-action-text',
    status: 'renamed',
    notes: 'Rename to v-list-item-action-text.',
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
    notes: 'Use v-list-item avatar props, or v-avatar in the append/prepend slot.',
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
    notes: 'Use v-list-item icon props, or v-icon in the append/prepend slot.',
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
    issue: 'https://github.com/vuetifyjs/vuetify/issues/16191',
  },
  {
    v2: 'v-calendar',
    v3: 'v-calendar',
    status: 'core',
    notes: 'API rewrite; slots/events still reported broken vs v2. Older 3.x: import { VCalendar } from \'vuetify/labs/VCalendar\'.',
    issue: 'https://github.com/vuetifyjs/vuetify/issues/21783',
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
    v3: 'v-stepper-vertical-item',
    status: 'renamed',
    notes: 'Rename to v-stepper-vertical-item; move the label into the title slot.',
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
