import { describe, expect, it } from 'vitest'
import { getV3BreakingChanges, V3_BREAKING_CHANGES } from '#services/v3-breaking-changes'

const KEYS = [
  'setup', 'layout', 'theme', 'sass', 'styles', 'general', 'inputs',
  'v-alert', 'v-badge', 'v-banner', 'v-btn', 'v-calendar', 'v-checkbox',
  'v-date-picker', 'v-form', 'v-list', 'v-menu', 'v-navigation-drawer',
  'v-rating', 'v-select', 'v-table', 'v-stepper', 'v-data-table', 'v-slider',
  'v-tabs', 'v-img', 'v-snackbar', 'v-expansion-panel', 'v-card', 'v-sparkline',
  'v-intersect', 'renames', 'missing', 'gotchas',
] as const

describe('V3_BREAKING_CHANGES', () => {
  it('has exactly the spec keys', () => {
    expect(Object.keys(V3_BREAKING_CHANGES).sort()).toEqual([...KEYS].sort())
  })
})

describe('getV3BreakingChanges', () => {
  it('throws listing valid keys for an unknown category', async () => {
    await expect(getV3BreakingChanges({ category: 'nope' as any }))
      .rejects.toThrow(/setup/)
  })

  it('unfiltered result links the v3 upgrade guide', async () => {
    const { content } = await getV3BreakingChanges({})
    expect(content[0].text).toContain('https://v3.vuetifyjs.com/en/getting-started/upgrade-guide/')
  })
})
