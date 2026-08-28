import { describe, expect, it } from 'vitest'
import { upgradeGuideRef } from '#services/documentation'
import { getV2ToV3ComponentMap, getV3UpgradeBaselineRecipe, getV3UpgradePlaybook, V3_COMPONENT_MAP } from '#services/v3-upgrade'

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
  'v-flex', 'v-edit-dialog', 'v-time-picker', 'v-sparkline', 'v-stepper-step',
]

describe('V3_COMPONENT_MAP', () => {
  it('includes every required v2 name', () => {
    const names = V3_COMPONENT_MAP.map(row => row.v2)
    for (const name of REQUIRED_V2) {
      expect(names).toContain(name)
    }
  })

  it('maps v-stepper-step to v-stepper-item', () => {
    const row = V3_COMPONENT_MAP.find(r => r.v2 === 'v-stepper-step')
    expect(row?.v3).toBe('v-stepper-item')
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

describe('getV3UpgradePlaybook', () => {
  it('is the ordered v2→3 runbook', async () => {
    const { content } = await getV3UpgradePlaybook()
    const text = content[0].text
    expect(text).toContain('get_v3_upgrade_baseline_recipe')
    expect(text.toLowerCase()).toMatch(/not recommended-v4/)
    expect(text).toContain('vuetify@^3.13')
    expect(text.toLowerCase()).toMatch(/do not/)
    expect(text).toMatch(/v4/i)
  })

  it('lists phases 0–11 in order', async () => {
    const { content } = await getV3UpgradePlaybook()
    const text = content[0].text
    const headings = [
      '## 0. Baseline',
      '## 1. Inventory',
      '## 2. Vue 3 prerequisite',
      '## 3. Target',
      '## 4. Bundler / Nuxt',
      '## 5. Bootstrap',
      '## 6. Mechanical remaps',
      '## 7. Status table',
      '## 8. Scan remaining',
      '## 9. Re-baseline',
      '## 10. Tests',
      '## 11. Stop',
    ]
    let last = -1
    for (const heading of headings) {
      const index = text.indexOf(heading)
      expect(index, heading).toBeGreaterThan(last)
      last = index
    }
  })
})

describe('getV3UpgradeBaselineRecipe', () => {
  it('is a playwright journey recipe', async () => {
    const { content } = await getV3UpgradeBaselineRecipe()
    const text = content[0].text
    expect(text).toContain('@playwright/test')
    expect(text).toContain('upgrade-baseline/')
    expect(text).toContain('upgrade-after/')
    expect(text).toContain('storageState')
  })

  it('includes the spec config, scripts, and classification rules', async () => {
    const { content } = await getV3UpgradeBaselineRecipe()
    const text = content[0].text
    expect(text).toContain('PLAYWRIGHT_BASE_URL')
    expect(text).toContain('1280x720')
    expect(text).toContain('v-app')
    expect(text).toContain('v-content')
    expect(text).toContain('v-main')
    expect(text).toContain('getByRole')
    expect(text).toContain('test:upgrade:baseline')
    expect(text).toContain('test:upgrade:after')
    expect(text).toContain('UPGRADE_SHOT_DIR=upgrade-baseline playwright test')
    expect(text).toContain('UPGRADE_SHOT_DIR=upgrade-after playwright test')
    expect(text).toContain("import { defineConfig, devices } from '@playwright/test'")
    expect(text).toContain("import { existsSync } from 'node:fs'")
    expect(text).toContain('storageState: existsSync(auth) ? auth : undefined')
    expect(text).toContain('viewport: { width: 1280, height: 720 }')
    expect(text).toMatch(/functional fail.*blocker/i)
    expect(text).toMatch(/screenshot.*= review/i)
    expect(text).toContain('Cypress')
    expect(text).toContain('Percy')
    expect(text).toContain('toHaveScreenshot')
  })
})
