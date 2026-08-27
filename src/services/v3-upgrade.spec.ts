import { describe, expect, it } from 'vitest'
import { upgradeGuideRef } from '#services/documentation'
import { getV2ToV3ComponentMap, V3_COMPONENT_MAP } from '#services/v3-upgrade'

describe('upgradeGuideRef', () => {
  it('uses v3-stable for v2.7', () => {
    expect(upgradeGuideRef('v2.7')).toBe('v3-stable')
  })

  it('uses next for v3', () => {
    expect(upgradeGuideRef('v3')).toBe('next')
  })

  it('leaves v1.5 on the default branch', () => {
    expect(upgradeGuideRef('v1.5')).toBeUndefined()
  })
})

const REQUIRED_V2 = [
  'v-list-tile', 'v-list-tile-action', 'v-list-tile-avatar', 'v-list-tile-action-text',
  'v-list-tile-content', 'v-list-tile-title', 'v-list-tile-sub-title', 'v-jumbotron',
  'v-toolbar-side-icon', 'v-expansion-panel-header', 'v-expansion-panel-content',
  'v-list-item-sub-title', 'v-list-tile-subtitle', 'v-content', 'v-data',
  'v-list-item-group', 'v-list-item-avatar', 'v-list-item-content', 'v-list-item-icon',
  'v-overflow-btn', 'v-simple-checkbox', 'v-subheader', 'v-simple-table',
  'v-tabs-slider', 'v-tabs-items', 'v-tab-item',
  'v-data-table', 'v-date-picker', 'v-calendar', 'v-treeview',
]

describe('V3_COMPONENT_MAP', () => {
  it('includes every required v2 name', () => {
    const names = V3_COMPONENT_MAP.map(row => row.v2)
    for (const name of REQUIRED_V2) {
      expect(names).toContain(name)
    }
  })
})

describe('getV2ToV3ComponentMap', () => {
  it('returns a table and a json fence', async () => {
    const { content } = await getV2ToV3ComponentMap()
    expect(content[0].text).toMatch(/\| v2 \|/)
    expect(content[0].text).toContain('```json')
    expect(content[0].text).toContain('v-overflow-btn')
  })
})
