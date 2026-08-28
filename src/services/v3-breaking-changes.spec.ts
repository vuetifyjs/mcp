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

const HIGH_PAIN = ['layout', 'v-list', 'v-data-table', 'v-date-picker', 'general', 'theme'] as const

describe('catalog content', () => {
  it.each(HIGH_PAIN)('%s includes 2.x and 3.x snippets', async key => {
    const { content } = await getV3BreakingChanges({ category: key })
    expect(content[0].text).toContain('2.x')
    expect(content[0].text).toContain('3.x')
    expect(content[0].text).toMatch(/```/)
  })

  it('gotchas cover compat, overflow-btn, and data-table-server', async () => {
    const { content } = await getV3BreakingChanges({ category: 'gotchas' })
    expect(content[0].text).toContain('@vue/compat')
    expect(content[0].text).toContain('v-overflow-btn')
    expect(content[0].text).toContain('v-data-table-server')
  })

  it('data-table category uses internalItem, not item.raw', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-data-table' })
    expect(content[0].text).toContain('internalItem')
    expect(content[0].text).not.toContain('item.raw')
  })

  it('select category may still mention item.raw', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-select' })
    expect(content[0].text).toContain('item.raw')
  })

  it('gotchas data-table rewrite does not say slot rows use item.raw', async () => {
    const rewrite = V3_BREAKING_CHANGES.gotchas.changes.find(c => c.title === 'Data-table rewrite')
    expect(rewrite?.description).not.toMatch(/item\.raw/)
  })

  it('date-picker keeps first-day-of-week as a picker prop', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-date-picker' })
    expect(content[0].text).toContain('first-day-of-week')
    expect(content[0].text).toMatch(/Still picker props/)
    expect(content[0].text).not.toMatch(/`first-day-of-week`[\s\S]{0,120}part of the date adapter/)
  })

  it('date-picker maps DATE to month view-mode', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-date-picker' })
    expect(content[0].text).toMatch(/DATE → `month`/)
  })

  it('menu coordinate target is a bound array', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-menu' })
    expect(content[0].text).toContain(':target=')
  })

  it('inputs prepend and prepend-inner are distinct', async () => {
    const { content } = await getV3BreakingChanges({ category: 'inputs' })
    expect(content[0].text).not.toMatch(/prepend-inner.*are the same/)
  })
})
