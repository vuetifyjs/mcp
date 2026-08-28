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

  it('size values are 3.13 named sizes, not medium', () => {
    const change = V3_BREAKING_CHANGES.general.changes.find(c => c.title === 'Size props combined into size')
    expect(change?.description).toContain('x-small')
    expect(change?.description).toContain('default')
    expect(change?.description).toContain('x-large')
    expect(change?.description).toMatch(/not `medium`/)
    expect(change?.migration).toContain('size="default"')
    expect(change?.migration).not.toContain('size="medium"')
  })

  it('background-color → bg-color except VRating', () => {
    const change = V3_BREAKING_CHANGES.general.changes.find(c => c.title === 'background-color renamed to bg-color')
    expect(change?.description).toMatch(/VRating/)
    expect(change?.description).toContain('bgColor')
    expect(change?.description).toContain('active-color')
    expect(change?.migration).toMatch(/v-rating/)
    expect(change?.migration).toContain('active-color')
  })

  it('alert border left/right becomes border="start"/"end"', async () => {
    const { content } = await getV3BreakingChanges({ category: 'v-alert' })
    expect(content[0].text).toContain('border="start"')
    expect(content[0].text).toContain('border="end"')
    expect(content[0].text).toMatch(/not boolean/)
  })

  it('alert v2 prop is dismissible, not dismissable', () => {
    const change = V3_BREAKING_CHANGES['v-alert'].changes.find(c => c.title.includes('closable'))
    expect(change?.description).toContain('dismissible')
    expect(change?.migration).toContain('dismissible')
    expect(JSON.stringify(V3_BREAKING_CHANGES['v-alert'])).not.toContain('dismissable')
  })

  it('select header/divider items use type, not item-props', () => {
    const header = V3_BREAKING_CHANGES['v-select'].changes.find(c => c.title.includes('header'))
    expect(header?.description).toContain("type: 'subheader'")
    expect(header?.description).toContain("type: 'divider'")
    expect(header?.description).toContain('itemType')
    expect(header?.migration).toMatch(/not use `item-props`/)
    const flags = V3_BREAKING_CHANGES['v-select'].changes.find(c => c.title.includes('item-props'))
    expect(flags?.description).toMatch(/disabled\/avatar/)
    expect(flags?.migration).not.toMatch(/instead of `item-disabled` \/ header \/ divider/)
  })

  it('absolute/fixed → position is not global', () => {
    const change = V3_BREAKING_CHANGES.general.changes.find(c => c.title.includes('position'))
    expect(change?.description).toContain('v-btn')
    expect(change?.description).toContain('v-app-bar')
    expect(change?.description).toContain('v-navigation-drawer')
    expect(change?.description).toContain('v-img')
    expect(change?.migration).toMatch(/Do not rewrite drawer or app-bar/)
    expect(change?.migration).toContain('<v-app-bar absolute />')
  })

  it('theme colors nest without double-wrapping myTheme', () => {
    const change = V3_BREAKING_CHANGES.theme.changes.find(c => c.title.includes('nested'))
    expect(change?.migration).toContain('new Vuetify({ theme: myTheme })')
    expect(change?.migration).toContain('createVuetify({ theme: { themes: { light: { colors: { primary: \'#ccc\' } } } } })')
    expect(change?.migration).not.toMatch(/const myTheme = \{ theme:/)
  })

  it('bare v-img needs cover in 3.x', () => {
    const change = V3_BREAKING_CHANGES['v-img'].changes[0]
    expect(change.description).toMatch(/v2 default was cover/)
    expect(change.migration).toContain('bare `<v-img>`')
    expect(change.migration).not.toMatch(/if the v2 image filled the box/)
  })

  it('list-group subgroup is not stripped', () => {
    const change = V3_BREAKING_CHANGES['v-list'].changes.find(c => c.title.includes('subgroup'))
    expect(change?.description).toContain('v-list-group--subgroup')
    expect(change?.migration).toMatch(/Do not strip/)
    expect(change?.migration).not.toMatch(/^Remove `sub-group`/)
  })

  it('date format props are not 1:1 adapter keys', () => {
    const change = V3_BREAKING_CHANGES['v-date-picker'].changes.find(c => c.title.includes('Locale'))
    expect(change?.description).toContain('dayOfMonth')
    expect(change?.description).toContain('createVuetify({ locale })')
    expect(change?.migration).toContain("formats['day-format']")
    expect(change?.migration).toContain("date.locale: 'fr'")
    expect(change?.migration).toMatch(/not `date\.locale/)
  })
})
