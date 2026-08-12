/**
 * Migration data loader boundary.
 *
 * This module provides a single point of access for migration data.
 * Currently loads hardcoded data from TypeScript modules.
 * In the future, this can be swapped to fetch from a generated
 * migrations.json without changing tool implementations.
 *
 * @example
 * // Current: hardcoded data
 * const data = loadMigrationData()
 *
 * // Future: could fetch from CDN or API
 * const data = await loadMigrationData()
 */
import type { MigrationData, MigrationHop, MigrationRule } from './schema.js'
import { V1_TO_V2_RULES } from './v1-to-v2.js'
import { V2_TO_V3_RULES } from './v2-to-v3.js'
import { V3_TO_V4_RULES } from './v3-to-v4.js'

export * from './schema.js'

const HOPS: MigrationHop[] = [
  {
    from: 'v1',
    to: 'v2',
    tooling: {
      eslintPlugin: 'eslint-plugin-vuetify@^1.1.0',
      notes: 'Run eslint with vuetify/deprecated rules to identify migration issues.',
    },
    effort: 'high',
    ruleCount: V1_TO_V2_RULES.length,
    summary: 'Major grid system rewrite (v-layout/v-flex → v-row/v-col). Several component renames. Use eslint-plugin-vuetify@1 deprecated rules.',
  },
  {
    from: 'v2',
    to: 'v3',
    tooling: {
      eslintPlugin: 'eslint-plugin-vuetify@^2.0.0',
      notes: 'Requires Vue 3 migration first. Run eslint with vuetify/deprecated rules.',
    },
    effort: 'very-high',
    ruleCount: V2_TO_V3_RULES.length,
    summary: 'Requires Vue 2 → Vue 3 migration. Complete rewrite with Composition API. Many components temporarily removed (returned in v3.1+).',
  },
  {
    from: 'v3',
    to: 'v4',
    tooling: {
      eslintPlugin: 'eslint-plugin-vuetify@^2.5.0',
      codemods: 'vuetify-codemods',
      notes: 'Use vuetify-codemods for automated migrations (typography, etc).',
    },
    effort: 'medium',
    ruleCount: V3_TO_V4_RULES.length,
    summary: 'MD3 design system adoption. CSS layers mandatory. Typography class renames. Several component prop/slot changes.',
  },
]

const RULES_BY_HOP: Record<string, MigrationRule[]> = {
  'v1→v2': V1_TO_V2_RULES,
  'v2→v3': V2_TO_V3_RULES,
  'v3→v4': V3_TO_V4_RULES,
}

export interface MigrationDataLoader {
  getHops: () => MigrationHop[]
  getRules: (from: string, to: string) => MigrationRule[]
  getAllRules: () => MigrationRule[]
  getData: () => MigrationData
}

export function loadMigrationData (): MigrationDataLoader {
  return {
    getHops () {
      return HOPS
    },

    getRules (from: string, to: string) {
      const key = `${from}→${to}`
      return RULES_BY_HOP[key] ?? []
    },

    getAllRules () {
      return [...V1_TO_V2_RULES, ...V2_TO_V3_RULES, ...V3_TO_V4_RULES]
    },

    getData () {
      return {
        version: '1.0.0',
        generatedAt: undefined,
        hops: HOPS,
        rules: this.getAllRules(),
      }
    },
  }
}

export const VERSION_ALIASES: Record<string, string> = {
  '1': 'v1',
  '1.5': 'v1',
  'v1.5': 'v1',
  '2': 'v2',
  '2.7': 'v2',
  'v2.7': 'v2',
  '3': 'v3',
  'v3.x': 'v3',
  '4': 'v4',
  'v4.x': 'v4',
  'latest': 'v4',
  'next': 'v4',
}

export function normalizeVersion (version: string): string {
  const v = version.toLowerCase().trim()
  return VERSION_ALIASES[v] ?? v
}

export const KNOWN_VERSIONS = ['v1', 'v2', 'v3', 'v4'] as const
export type KnownVersion = typeof KNOWN_VERSIONS[number]

export function isKnownVersion (v: string): v is KnownVersion {
  return KNOWN_VERSIONS.includes(v as KnownVersion)
}
