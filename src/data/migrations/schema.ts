/**
 * Migration rule schema for Vuetify version upgrades.
 *
 * This schema is designed to be compatible with a future generated
 * migrations.json from the Vuetify docs build. The loader boundary
 * in index.ts can swap between hardcoded data and fetched data
 * without changing tool implementations.
 */

export type MigrationSeverity = 'high' | 'medium' | 'low'

export type MigrationCategory =
  | 'styles'
  | 'theme'
  | 'display'
  | 'grid'
  | 'typography'
  | 'elevation'
  | 'components'
  | 'composables'
  | 'directives'
  | 'utilities'

export interface MigrationDetect {
  grep: string[]
  files: string[]
}

export interface MigrationReplace {
  from: string
  to: string
  note?: string
}

export interface MigrationRevert {
  snippet: string
  description: string
}

export interface MigrationRule {
  id: string
  title: string
  severity: MigrationSeverity
  category: MigrationCategory
  component?: string
  detect: MigrationDetect
  replace: MigrationReplace[]
  codemod?: string
  revert?: MigrationRevert
  docs: string
  issue?: string
  description: string
  migration: string
}

export interface MigrationHopTooling {
  eslintPlugin?: string
  codemods?: string
  notes?: string
}

export interface MigrationHop {
  from: string
  to: string
  tooling: MigrationHopTooling
  effort: 'low' | 'medium' | 'high' | 'very-high'
  ruleCount: number
  summary: string
}

export interface MigrationData {
  version: string
  generatedAt?: string
  hops: MigrationHop[]
  rules: MigrationRule[]
}

export interface UpgradePlanHop {
  from: string
  to: string
  tooling: MigrationHopTooling
  effort: 'low' | 'medium' | 'high' | 'very-high'
  summary: string
  rules: Array<{
    id: string
    title: string
    severity: MigrationSeverity
    codemod?: string
  }>
}

export interface UpgradePlan {
  from: string
  to: string
  hops: UpgradePlanHop[]
  totalRules: number
}
