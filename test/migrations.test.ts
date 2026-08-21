/**
 * Unit tests for migration service.
 *
 * Run with: pnpm exec tsx test/migrations.test.ts
 *
 * Tests:
 * - Hop resolution (single and multi-hop)
 * - Version normalization
 * - Rule filtering by IDs, category, and component
 * - Honest catalog mappings (docs host, typography, no invented APIs)
 * - Error handling for invalid versions
 */
import assert from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadMigrationData, normalizeVersion, isKnownVersion } from '../src/data/migrations/index.js'
import { createMigrationService } from '../src/services/migrations.js'

const loader = loadMigrationData()
const service = createMigrationService()

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..')

const OFFICIAL_V4_TYPOGRAPHY: Record<string, string> = {
  'text-h1': 'text-display-large',
  'text-h2': 'text-display-large',
  'text-h3': 'text-display-medium',
  'text-h4': 'text-headline-large',
  'text-h5': 'text-headline-small',
  'text-h6': 'text-title-large',
  'text-subtitle-1': 'text-body-large',
  'text-subtitle-2': 'text-title-small',
  'text-body-1': 'text-body-large',
  'text-body-2': 'text-body-medium',
  'text-button': 'text-label-large',
  'text-caption': 'text-body-small',
  'text-overline': 'text-label-medium',
}

const WRONG_V4_TYPOGRAPHY: Record<string, string> = {
  'text-h2': 'text-display-medium',
  'text-h3': 'text-display-small',
  'text-h5': 'text-headline-medium',
  'text-h6': 'text-headline-small',
  'text-subtitle-1': 'text-title-large',
  'text-subtitle-2': 'text-title-medium',
  'text-overline': 'text-label-small',
}

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

async function testShippedRulesHaveReplacements () {
  console.log('Testing every shipped rule has detect + replace...')

  for (const rule of loader.getAllRules()) {
    assert.ok(rule.detect.grep.length > 0, `${rule.id} is missing detect.grep`)
    assert.ok(rule.detect.files.length > 0, `${rule.id} is missing detect.files`)
    assert.ok(rule.replace.length > 0, `${rule.id} shipped with empty replace[]`)
    for (const mapping of rule.replace) {
      assert.ok(mapping.from.length > 0, `${rule.id} has an empty replace.from`)
      assert.notStrictEqual(mapping.from, mapping.to, `${rule.id} has a no-op replace ${mapping.from}`)
    }
  }

  console.log('  ✓ Every shipped rule has real detect + replace')
}

async function testDocsHosts () {
  console.log('Testing docs hosts and hashes...')

  for (const rule of loader.getRules('v2', 'v3')) {
    assert.ok(
      rule.docs.startsWith('https://v3.vuetifyjs.com'),
      `${rule.id} docs must be on v3.vuetifyjs.com, got ${rule.docs}`,
    )
    assert.ok(!rule.docs.includes('vuetifyjs.com/en/getting-started/upgrade-guide') || rule.docs.includes('v3.vuetifyjs.com'), `${rule.id} leaked onto the v4 host`)
  }

  const v4Hashes = new Set([
    'typography',
    'elevation',
    'grid-system-vrow-and-vcol',
    'vsnackbar',
    'vsnackbarqueue',
    'vselect-vcombobox-vautocomplete',
    'vform',
    'vbadge',
    'vcontainer',
    'vcounter',
    'vfileinput',
    'vradiogroup',
    'vtextfield',
    'vbtn-text-transform',
    'vbtn-display',
    'layers',
    'style-entry-points',
    'themes',
    'breakpoints',
    'defaults',
    'vite3a-overlay-z-index-in-dev-mode',
  ])

  for (const rule of loader.getRules('v3', 'v4')) {
    assert.ok(
      rule.docs.startsWith('https://vuetifyjs.com/en/getting-started/upgrade-guide'),
      `${rule.id} docs must be the live v4 upgrade page, got ${rule.docs}`,
    )
    assert.ok(!rule.docs.includes('next.vuetifyjs.com'), `${rule.id} still points at next.vuetifyjs.com`)
    const hash = rule.docs.split('#')[1]
    assert.ok(hash, `${rule.id} is missing a hash`)
    assert.ok(v4Hashes.has(hash), `${rule.id} hash #${hash} is not on the live v4 upgrade page`)
  }

  console.log('  ✓ Docs hosts and hashes are correct')
}

async function testTypographyMappings () {
  console.log('Testing official v4 typography mappings...')

  const rule = loader.getRules('v3', 'v4').find(r => r.id === 'v4/typography-classes')
  assert.ok(rule, 'Should have typography-classes rule')
  assert.strictEqual(rule.codemod, 'vuetify-4-typography')

  const map = Object.fromEntries(rule.replace.map(r => [r.from, r.to]))
  for (const [from, to] of Object.entries(OFFICIAL_V4_TYPOGRAPHY)) {
    assert.strictEqual(map[from], to, `${from} must map to ${to}, got ${map[from]}`)
  }

  for (const [from, wrong] of Object.entries(WRONG_V4_TYPOGRAPHY)) {
    assert.notStrictEqual(map[from], wrong, `${from} still has the wrong typography-migration quick-reference target ${wrong}`)
  }

  const v2Typography = loader.getRules('v2', 'v3').find(r => r.id === 'v3/typography-classes')
  assert.ok(v2Typography, 'v2→v3 must keep MD2 class remaps on their own hop')
  assert.ok(v2Typography.replace.some(r => r.from === 'display-4' && r.to === 'text-h1'))
  assert.ok(!v2Typography.replace.some(r => r.to.includes('display-large')), 'v2→v3 must not apply MD3 class names')
  assert.ok(!v2Typography.codemod, 'Do not stamp vuetify-codemods on the v2 typography table')

  console.log('  ✓ Typography mappings match the upgrade-guide table')
}

async function testCompositionApiHasNoUseVuetify () {
  console.log('Testing composition-api does not invent useVuetify()...')

  const rule = loader.getRules('v2', 'v3').find(r => r.id === 'v3/composition-api')
  assert.ok(rule, 'Should have composition-api rule')

  const blob = [
    rule.title,
    rule.description,
    rule.migration,
    ...rule.replace.map(r => `${r.from} ${r.to} ${r.note ?? ''}`),
  ].join('\n')

  assert.ok(!blob.includes('useVuetify()'), 'composition-api must not mention useVuetify()')
  assert.ok(!blob.includes('useVuetify'), 'composition-api must not mention useVuetify')
  assert.ok(rule.replace.some(r => r.from === '$vuetify.breakpoint' && r.to === '$vuetify.display'))

  console.log('  ✓ composition-api does not mention useVuetify()')
}

async function testViteFixIsOptimizeDeps () {
  console.log('Testing Vite rule uses optimizeDeps, not hmr overlay...')

  const rule = loader.getRules('v3', 'v4').find(r => r.id === 'v4/vite-overlay-zindex')
  assert.ok(rule, 'Should have vite overlay rule')

  const blob = [
    rule.description,
    rule.migration,
    rule.revert?.snippet ?? '',
    rule.revert?.description ?? '',
    ...rule.replace.map(r => `${r.from} ${r.to} ${r.note ?? ''}`),
  ].join('\n')

  assert.ok(blob.includes('optimizeDeps'), 'Official fix is optimizeDeps.include')
  assert.ok(blob.includes('.vite'), 'Official fix deletes node_modules/.vite')
  assert.ok(!blob.includes('hmr'), 'Must not disable server.hmr.overlay')
  assert.ok(!blob.includes('overlay: false'), 'Must not disable server.hmr.overlay')

  console.log('  ✓ Vite rule matches the official optimizeDeps fix')
}

async function testV1OnlyRenames () {
  console.log('Testing v-content stays on the v1 hop...')

  const v1 = loader.getRules('v1', 'v2')
  const later = [...loader.getRules('v2', 'v3'), ...loader.getRules('v3', 'v4')]

  assert.ok(v1.some(r => r.replace.some(m => m.from === 'v-content' && m.to === 'v-main')))
  assert.ok(!later.some(r => r.replace.some(m => m.from === 'v-content')))
  assert.ok(!later.some(r => r.detect.grep.includes('v-content')))

  console.log('  ✓ v-content is v1-hop only')
}

async function testOfficialV2ToV3Misses () {
  console.log('Testing official v2→v3 misses are present...')

  const rules = loader.getRules('v2', 'v3')
  const ids = new Set(rules.map(r => r.id))

  for (const id of ['v3/v-model', 'v3/variants', 'v3/data-table', 'v3/nuxt', 'v3/color-classes', 'v3/list-table']) {
    assert.ok(ids.has(id), `Missing official miss ${id}`)
  }

  const model = rules.find(r => r.id === 'v3/v-model')!
  assert.ok(model.replace.some(r => r.from === ':value=' && r.to === ':model-value='))
  assert.ok(model.replace.some(r => r.from === '@input=' && r.to === '@update:model-value='))

  const variants = rules.find(r => r.id === 'v3/variants')!
  assert.ok(variants.replace.some(r => r.from === 'depressed' && r.to === 'variant="flat"'))
  assert.ok(variants.replace.some(r => r.from === 'dense' && r.to === 'density="compact"'))

  const table = rules.find(r => r.id === 'v3/data-table')!
  assert.ok(table.replace.some(r => r.from === 'server-items-length' && r.to === 'items-length'))
  assert.ok(table.replace.some(r => r.from === 'text:' && r.to === 'title:'))

  const nuxt = rules.find(r => r.id === 'v3/nuxt')!
  assert.ok(nuxt.docs.includes('v3.vuetifyjs.com'))
  assert.ok(nuxt.replace.some(r => r.from === '@nuxtjs/vuetify'))

  const color = rules.find(r => r.id === 'v3/color-classes')!
  assert.ok(color.replace.some(r => r.from === 'primary--text' && r.to === 'text-primary'))
  assert.ok(color.replace.some(r => r.from === '--v-primary-base' && r.to === '--v-theme-primary'))

  const list = rules.find(r => r.id === 'v3/list-table')!
  assert.ok(list.replace.some(r => r.from === 'v-simple-table' && r.to === 'v-table'))
  assert.ok(list.replace.some(r => r.from === 'v-subheader' && r.to === 'v-list-subheader'))

  console.log('  ✓ Official v2→v3 misses are filled')
}

async function testV4BreakingChangesStillRegistered () {
  console.log('Testing get_v4_breaking_changes stays registered...')

  const tools = readFileSync(join(repoRoot, 'src/tools/documentation.ts'), 'utf8')
  const docs = readFileSync(join(repoRoot, 'src/services/documentation.ts'), 'utf8')
  assert.ok(tools.includes('\'get_v4_breaking_changes\''), 'get_v4_breaking_changes must stay registered')
  assert.ok(tools.includes('[DEPRECATED:'), 'Deprecation belongs in the description only')
  assert.ok(tools.includes('documentation.getV4BreakingChanges'), 'Registered handler must remain')
  assert.ok(docs.includes('getV4BreakingChanges:'), 'Service implementation must remain')

  console.log('  ✓ get_v4_breaking_changes is still registered (deprecated in description)')
}

async function testRuleData () {
  console.log('Testing rule data...')

  const v3v4Rules = loader.getRules('v3', 'v4')
  const typographyRule = v3v4Rules.find(r => r.id === 'v4/typography-classes')
  assert.ok(typographyRule, 'Should have typography-classes rule')
  assert.strictEqual(typographyRule.severity, 'high')
  assert.strictEqual(typographyRule.category, 'typography')
  assert.ok(typographyRule.detect.grep.length > 0, 'Should have grep patterns')
  assert.ok(typographyRule.replace.length > 0, 'Should have replace mappings')
  assert.strictEqual(typographyRule.codemod, 'vuetify-4-typography')

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
  assert.ok(!text.includes('v-content'), 'Multi-hop v2→v4 must not advertise the v1 v-content rename')

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
  assert.ok(text.includes('**Codemod:** `vuetify-4-typography`'), 'Should have official codemod id')
  assert.ok(text.includes('### Detection'), 'Should have detection section')
  assert.ok(text.includes('**Grep patterns:**'), 'Should have grep patterns')
  assert.ok(text.includes('text-h1'), 'Should have grep pattern content')
  assert.ok(text.includes('### Replacements'), 'Should have replacements section')
  assert.ok(text.includes('text-display-large'), 'Should have replacement value')
  assert.ok(text.includes('text-h2'), 'Should list h2')
  assert.ok(text.includes('text-label-medium'), 'overline maps to label-medium')
  assert.ok(!text.includes('text-display-small'), 'Must not use the wrong h3 target')
  assert.ok(text.includes('**Docs:**'), 'Should have docs link')
  assert.ok(text.includes('https://vuetifyjs.com/en/getting-started/upgrade-guide#typography'))

  const composition = await service.getUpgradeRules({
    from: 'v2',
    to: 'v3',
    ids: ['v3/composition-api'],
  })
  assert.ok(!composition.content[0].text.includes('useVuetify()'))
  assert.ok(composition.content[0].text.includes('$vuetify.display'))

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
  await testShippedRulesHaveReplacements()
  await testDocsHosts()
  await testTypographyMappings()
  await testCompositionApiHasNoUseVuetify()
  await testViteFixIsOptimizeDeps()
  await testV1OnlyRenames()
  await testOfficialV2ToV3Misses()
  await testV4BreakingChangesStillRegistered()
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
