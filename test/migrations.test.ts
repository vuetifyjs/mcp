/**
 * Unit tests for migration service.
 *
 * Run with: npx tsx test/migrations.test.ts
 *
 * Tests:
 * - Hop resolution (single and multi-hop)
 * - Version normalization
 * - Rule filtering by IDs, category, and component
 * - Error handling for invalid versions
 */
import assert from 'node:assert'
import { loadMigrationData, normalizeVersion, isKnownVersion } from '../src/data/migrations/index.js'
import { createMigrationService } from '../src/services/migrations.js'

const loader = loadMigrationData()
const service = createMigrationService()

async function testVersionNormalization () {
  console.log('Testing version normalization...')

  assert.strictEqual(normalizeVersion('1'), 'v1')
  assert.strictEqual(normalizeVersion('v1'), 'v1')
  assert.strictEqual(normalizeVersion('1.5'), 'v1')
  assert.strictEqual(normalizeVersion('v1.5'), 'v1')
  assert.strictEqual(normalizeVersion('2'), 'v2')
  assert.strictEqual(normalizeVersion('2.7'), 'v2')
  assert.strictEqual(normalizeVersion('v2.7'), 'v2')
  assert.strictEqual(normalizeVersion('3'), 'v3')
  assert.strictEqual(normalizeVersion('v3'), 'v3')
  assert.strictEqual(normalizeVersion('v3.x'), 'v3')
  assert.strictEqual(normalizeVersion('4'), 'v4')
  assert.strictEqual(normalizeVersion('v4'), 'v4')
  assert.strictEqual(normalizeVersion('latest'), 'v4')
  assert.strictEqual(normalizeVersion('next'), 'v4')
  assert.strictEqual(normalizeVersion('unknown'), 'unknown')

  console.log('  ✓ Version normalization works correctly')
}

async function testIsKnownVersion () {
  console.log('Testing isKnownVersion...')

  assert.strictEqual(isKnownVersion('v1'), true)
  assert.strictEqual(isKnownVersion('v2'), true)
  assert.strictEqual(isKnownVersion('v3'), true)
  assert.strictEqual(isKnownVersion('v4'), true)
  assert.strictEqual(isKnownVersion('v5'), false)
  assert.strictEqual(isKnownVersion('unknown'), false)

  console.log('  ✓ isKnownVersion works correctly')
}

async function testHopData () {
  console.log('Testing hop data...')

  const hops = loader.getHops()
  assert.strictEqual(hops.length, 3, 'Should have 3 migration hops')

  const v1v2 = hops.find(h => h.from === 'v1' && h.to === 'v2')
  assert.ok(v1v2, 'Should have v1→v2 hop')
  assert.ok(v1v2.tooling.eslintPlugin, 'v1→v2 should have eslint plugin')

  const v2v3 = hops.find(h => h.from === 'v2' && h.to === 'v3')
  assert.ok(v2v3, 'Should have v2→v3 hop')
  assert.strictEqual(v2v3.effort, 'very-high', 'v2→v3 should be very-high effort')

  const v3v4 = hops.find(h => h.from === 'v3' && h.to === 'v4')
  assert.ok(v3v4, 'Should have v3→v4 hop')
  assert.ok(v3v4.tooling.codemods, 'v3→v4 should have codemods')

  console.log('  ✓ Hop data is correct')
}

async function testRuleData () {
  console.log('Testing rule data...')

  const v3v4Rules = loader.getRules('v3', 'v4')
  assert.ok(v3v4Rules.length > 10, 'Should have at least 10 v3→v4 rules')

  const typographyRule = v3v4Rules.find(r => r.id === 'v4/typography-classes')
  assert.ok(typographyRule, 'Should have typography-classes rule')
  assert.strictEqual(typographyRule.severity, 'high')
  assert.strictEqual(typographyRule.category, 'typography')
  assert.ok(typographyRule.detect.grep.length > 0, 'Should have grep patterns')
  assert.ok(typographyRule.replace.length > 0, 'Should have replace mappings')
  assert.strictEqual(typographyRule.codemod, 'typography')

  const cssLayersRule = v3v4Rules.find(r => r.id === 'v4/css-layers')
  assert.ok(cssLayersRule, 'Should have css-layers rule')
  assert.strictEqual(cssLayersRule.severity, 'high')
  assert.strictEqual(cssLayersRule.category, 'styles')

  console.log('  ✓ Rule data is correct')
}

async function testSingleHopPlan () {
  console.log('Testing single-hop upgrade plan...')

  const result = await service.getUpgradePlan({ from: 'v3', to: 'v4' })
  const text = result.content[0].text

  assert.ok(text.includes('Vuetify Upgrade Plan: v3 → v4'), 'Should have correct title')
  assert.ok(text.includes('Total migration hops: 1'), 'Should have 1 hop')
  assert.ok(text.includes('## Hop 1: v3 → v4'), 'Should have hop section')
  assert.ok(text.includes('vuetify-codemods'), 'Should mention codemods')
  assert.ok(text.includes('v4/typography-classes'), 'Should list typography rule')

  console.log('  ✓ Single-hop upgrade plan works')
}

async function testMultiHopPlan () {
  console.log('Testing multi-hop upgrade plan...')

  const result = await service.getUpgradePlan({ from: 'v2', to: 'v4' })
  const text = result.content[0].text

  assert.ok(text.includes('Vuetify Upgrade Plan: v2 → v4'), 'Should have correct title')
  assert.ok(text.includes('Total migration hops: 2'), 'Should have 2 hops')
  assert.ok(text.includes('## Hop 1: v2 → v3'), 'Should have v2→v3 hop')
  assert.ok(text.includes('## Hop 2: v3 → v4'), 'Should have v3→v4 hop')

  console.log('  ✓ Multi-hop upgrade plan works')
}

async function testFullHopPlan () {
  console.log('Testing full v1→v4 upgrade plan...')

  const result = await service.getUpgradePlan({ from: 'v1', to: 'v4' })
  const text = result.content[0].text

  assert.ok(text.includes('Total migration hops: 3'), 'Should have 3 hops')
  assert.ok(text.includes('## Hop 1: v1 → v2'), 'Should have v1→v2 hop')
  assert.ok(text.includes('## Hop 2: v2 → v3'), 'Should have v2→v3 hop')
  assert.ok(text.includes('## Hop 3: v3 → v4'), 'Should have v3→v4 hop')

  console.log('  ✓ Full v1→v4 upgrade plan works')
}

async function testVersionAliases () {
  console.log('Testing version aliases in upgrade plan...')

  const result = await service.getUpgradePlan({ from: '2.7', to: 'latest' })
  const text = result.content[0].text

  assert.ok(text.includes('Vuetify Upgrade Plan: v2 → v4'), 'Should normalize versions')

  console.log('  ✓ Version aliases work correctly')
}

async function testRulesFiltering () {
  console.log('Testing rules filtering...')

  const allRules = await service.getUpgradeRules({ from: 'v3', to: 'v4' })
  assert.ok(allRules.content[0].text.includes('v4/typography-classes'))

  const byIds = await service.getUpgradeRules({
    from: 'v3',
    to: 'v4',
    ids: ['v4/typography-classes', 'v4/css-layers'],
  })
  const byIdsText = byIds.content[0].text
  assert.ok(byIdsText.includes('Found 2 rule(s)'), 'Should find 2 rules')
  assert.ok(byIdsText.includes('v4/typography-classes'))
  assert.ok(byIdsText.includes('v4/css-layers'))

  const byCategory = await service.getUpgradeRules({
    from: 'v3',
    to: 'v4',
    category: 'components',
  })
  const byCatText = byCategory.content[0].text
  assert.ok(byCatText.includes('**Category:** components'))
  assert.ok(!byCatText.includes('**Category:** typography'))

  const byComponent = await service.getUpgradeRules({
    from: 'v3',
    to: 'v4',
    component: 'VSnackbar',
  })
  const byCompText = byComponent.content[0].text
  assert.ok(byCompText.includes('VSnackbar'))
  assert.ok(byCompText.includes('v4/snackbar-multi-line'))

  console.log('  ✓ Rules filtering works correctly')
}

async function testRuleStructure () {
  console.log('Testing rule structure in output...')

  const result = await service.getUpgradeRules({
    from: 'v3',
    to: 'v4',
    ids: ['v4/typography-classes'],
  })
  const text = result.content[0].text

  assert.ok(text.includes('**ID:** `v4/typography-classes`'), 'Should have ID')
  assert.ok(text.includes('**Severity:** high'), 'Should have severity')
  assert.ok(text.includes('**Category:** typography'), 'Should have category')
  assert.ok(text.includes('**Codemod:** `typography`'), 'Should have codemod')
  assert.ok(text.includes('### Detection'), 'Should have detection section')
  assert.ok(text.includes('**Grep patterns:**'), 'Should have grep patterns')
  assert.ok(text.includes('text-h1'), 'Should have grep pattern content')
  assert.ok(text.includes('### Replacements'), 'Should have replacements section')
  assert.ok(text.includes('text-display-large'), 'Should have replacement value')
  assert.ok(text.includes('**Docs:**'), 'Should have docs link')

  console.log('  ✓ Rule structure is correct')
}

async function testInvalidVersionErrors () {
  console.log('Testing invalid version errors...')

  try {
    await service.getUpgradePlan({ from: 'v5', to: 'v6' })
    assert.fail('Should have thrown for unknown version')
  } catch (error) {
    assert.ok(error instanceof Error)
    assert.ok(error.message.includes('Unknown source version'))
  }

  try {
    await service.getUpgradePlan({ from: 'v4', to: 'v3' })
    assert.fail('Should have thrown for downgrade')
  } catch (error) {
    assert.ok(error instanceof Error)
    assert.ok(error.message.includes('Target version must be higher'))
  }

  try {
    await service.getUpgradePlan({ from: 'v3', to: 'v3' })
    assert.fail('Should have thrown for same version')
  } catch (error) {
    assert.ok(error instanceof Error)
    assert.ok(error.message.includes('Target version must be higher'))
  }

  console.log('  ✓ Invalid version errors work correctly')
}

async function testNoMatchingRules () {
  console.log('Testing no matching rules response...')

  const result = await service.getUpgradeRules({
    from: 'v3',
    to: 'v4',
    ids: ['nonexistent-rule'],
  })
  const text = result.content[0].text

  assert.ok(text.includes('No migration rules found'), 'Should indicate no rules found')
  assert.ok(text.includes('ids: nonexistent-rule'), 'Should show applied filters')

  console.log('  ✓ No matching rules handled correctly')
}

async function runAllTests () {
  console.log('Running migration service tests...\n')

  await testVersionNormalization()
  await testIsKnownVersion()
  await testHopData()
  await testRuleData()
  await testSingleHopPlan()
  await testMultiHopPlan()
  await testFullHopPlan()
  await testVersionAliases()
  await testRulesFiltering()
  await testRuleStructure()
  await testInvalidVersionErrors()
  await testNoMatchingRules()

  console.log('\n✅ All tests passed!')
}

runAllTests().catch(error => {
  console.error('\n❌ Test failed:', error)
  throw error
})
