/**
 * Migration service for Vuetify version upgrades.
 *
 * Provides hop resolution (e.g., v2.6 → v4 becomes v2→v3→v4)
 * and rule filtering by various criteria.
 */
import type {
  MigrationCategory,
  MigrationRule,
  MigrationSeverity,
  UpgradePlan,
  UpgradePlanHop,
} from '../data/migrations/schema.js'

import {
  KNOWN_VERSIONS,
  loadMigrationData,
  normalizeVersion,
  isKnownVersion,
} from '../data/migrations/index.js'

export interface GetUpgradePlanParams {
  from: string
  to: string
}

export interface GetUpgradeRulesParams {
  from: string
  to: string
  ids?: string[]
  category?: string
  component?: string
}

export function createMigrationService () {
  const loader = loadMigrationData()

  function resolveHops (from: string, to: string): string[] {
    const fromNorm = normalizeVersion(from)
    const toNorm = normalizeVersion(to)

    if (!isKnownVersion(fromNorm)) {
      throw new Error(`Unknown source version: "${from}". Known versions: ${KNOWN_VERSIONS.join(', ')}`)
    }
    if (!isKnownVersion(toNorm)) {
      throw new Error(`Unknown target version: "${to}". Known versions: ${KNOWN_VERSIONS.join(', ')}`)
    }

    const fromIdx = KNOWN_VERSIONS.indexOf(fromNorm)
    const toIdx = KNOWN_VERSIONS.indexOf(toNorm)

    if (fromIdx >= toIdx) {
      throw new Error(`Cannot upgrade from ${from} to ${to}. Target version must be higher than source.`)
    }

    return KNOWN_VERSIONS.slice(fromIdx, toIdx + 1)
  }

  return {
    getUpgradePlan: async ({ from, to }: GetUpgradePlanParams) => {
      const versions = resolveHops(from, to)
      const hops = loader.getHops()
      const planHops: UpgradePlanHop[] = []

      for (let i = 0; i < versions.length - 1; i++) {
        const hopFrom = versions[i]
        const hopTo = versions[i + 1]

        const hop = hops.find(h => h.from === hopFrom && h.to === hopTo)
        if (!hop) {
          throw new Error(`No migration path found from ${hopFrom} to ${hopTo}`)
        }

        const rules = loader.getRules(hopFrom, hopTo)
        const ruleIndex = rules.map(r => ({
          id: r.id,
          title: r.title,
          severity: r.severity,
          codemod: r.codemod,
        }))

        planHops.push({
          from: hopFrom,
          to: hopTo,
          tooling: hop.tooling,
          effort: hop.effort,
          summary: hop.summary,
          rules: ruleIndex,
        })
      }

      const plan: UpgradePlan = {
        from: normalizeVersion(from),
        to: normalizeVersion(to),
        hops: planHops,
        totalRules: planHops.reduce((sum, h) => sum + h.rules.length, 0),
      }

      const text = formatUpgradePlan(plan)

      return {
        content: [{ type: 'text' as const, text }],
      }
    },

    getUpgradeRules: async ({ from, to, ids, category, component }: GetUpgradeRulesParams) => {
      const versions = resolveHops(from, to)
      let allRules: MigrationRule[] = []

      for (let i = 0; i < versions.length - 1; i++) {
        const rules = loader.getRules(versions[i], versions[i + 1])
        allRules = allRules.concat(rules)
      }

      if (ids && ids.length > 0) {
        allRules = allRules.filter(r => ids.includes(r.id))
      }

      if (category) {
        const catLower = category.toLowerCase() as MigrationCategory
        allRules = allRules.filter(r => r.category === catLower)
      }

      if (component) {
        const compLower = component.toLowerCase()
        allRules = allRules.filter(r =>
          r.component?.toLowerCase() === compLower
          || r.component?.toLowerCase().includes(compLower)
          || r.id.toLowerCase().includes(compLower),
        )
      }

      if (allRules.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No migration rules found for the given criteria.\n\nFilters applied:\n- from: ${from}\n- to: ${to}${ids ? `\n- ids: ${ids.join(', ')}` : ''}${category ? `\n- category: ${category}` : ''}${component ? `\n- component: ${component}` : ''}`,
          }],
        }
      }

      const text = formatMigrationRules(allRules, from, to)

      return {
        content: [{ type: 'text' as const, text }],
      }
    },
  }
}

function formatUpgradePlan (plan: UpgradePlan): string {
  const lines: string[] = [
    `# Vuetify Upgrade Plan: ${plan.from} → ${plan.to}`,
    '',
    `Total migration hops: ${plan.hops.length}`,
    `Total rules: ${plan.totalRules}`,
    '',
  ]

  for (let i = 0; i < plan.hops.length; i++) {
    const hop = plan.hops[i]
    lines.push(`## Hop ${i + 1}: ${hop.from} → ${hop.to}`)
    lines.push('')
    lines.push(`**Effort:** ${hop.effort}`)
    lines.push('')
    lines.push(`**Summary:** ${hop.summary}`)
    lines.push('')
    lines.push('### Tooling')
    lines.push('')

    if (hop.tooling.eslintPlugin) {
      lines.push(`- ESLint Plugin: \`${hop.tooling.eslintPlugin}\``)
    }
    if (hop.tooling.codemods) {
      lines.push(`- Codemods: \`${hop.tooling.codemods}\``)
    }
    if (hop.tooling.notes) {
      lines.push(`- Notes: ${hop.tooling.notes}`)
    }

    lines.push('')
    lines.push(`### Rules (${hop.rules.length})`)
    lines.push('')

    const bySeverity = groupBy(hop.rules, 'severity')

    for (const severity of ['high', 'medium', 'low'] as MigrationSeverity[]) {
      const rules = bySeverity[severity] ?? []
      if (rules.length === 0) {
        continue
      }

      lines.push(`#### ${capitalize(severity)} Severity (${rules.length})`)
      lines.push('')

      for (const rule of rules) {
        const codemodBadge = rule.codemod ? ' 🔧' : ''
        lines.push(`- \`${rule.id}\`: ${rule.title}${codemodBadge}`)
      }

      lines.push('')
    }
  }

  lines.push('---')
  lines.push('')
  lines.push('🔧 = codemod available')
  lines.push('')
  lines.push('Use `get_upgrade_rules` to fetch full rule details with detect patterns and replacements.')

  return lines.join('\n')
}

function formatMigrationRules (rules: MigrationRule[], from: string, to: string): string {
  const lines: string[] = [
    `# Migration Rules: ${from} → ${to}`,
    '',
    `Found ${rules.length} rule(s)`,
    '',
  ]

  for (const rule of rules) {
    lines.push(`## ${rule.title}`)
    lines.push('')
    lines.push(`**ID:** \`${rule.id}\``)
    lines.push(`**Severity:** ${rule.severity}`)
    lines.push(`**Category:** ${rule.category}`)

    if (rule.component) {
      lines.push(`**Component:** ${rule.component}`)
    }
    if (rule.codemod) {
      lines.push(`**Codemod:** \`${rule.codemod}\` (vuetify-codemods)`)
    }

    lines.push('')
    lines.push(`### Description`)
    lines.push('')
    lines.push(rule.description)
    lines.push('')
    lines.push(`### Migration`)
    lines.push('')
    lines.push(rule.migration)
    lines.push('')

    lines.push(`### Detection`)
    lines.push('')
    lines.push('**Grep patterns:**')
    lines.push('```')
    for (const pattern of rule.detect.grep) {
      lines.push(pattern)
    }
    lines.push('```')
    lines.push('')
    lines.push('**File patterns:**')
    lines.push('```')
    for (const file of rule.detect.files) {
      lines.push(file)
    }
    lines.push('```')
    lines.push('')

    if (rule.replace.length > 0) {
      lines.push(`### Replacements`)
      lines.push('')
      lines.push('| From | To | Note |')
      lines.push('|------|-----|------|')
      for (const r of rule.replace) {
        const note = r.note ?? ''
        lines.push(`| \`${r.from}\` | \`${r.to || '(remove)'}\` | ${note} |`)
      }
      lines.push('')
    }

    if (rule.revert) {
      lines.push(`### Revert (for incremental migration)`)
      lines.push('')
      lines.push(rule.revert.description)
      lines.push('')
      lines.push('```')
      lines.push(rule.revert.snippet)
      lines.push('```')
      lines.push('')
    }

    lines.push(`**Docs:** ${rule.docs}`)

    if (rule.issue) {
      lines.push(`**Issue:** ${rule.issue}`)
    }

    lines.push('')
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}

function groupBy<T, K extends keyof T> (arr: T[], key: K): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  for (const item of arr) {
    const k = String(item[key])
    if (!result[k]) {
      result[k] = []
    }
    result[k].push(item)
  }
  return result
}

function capitalize (s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
