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

/**
 * Confidence level for a migration finding.
 *
 * - 'high': Exact match with clean replacement + optional codemod, single unambiguous match
 * - 'medium': Multiple matches or partial pattern match with known replacement
 * - 'low': Detection hit without clean replacement, requires manual review
 */
export type MigrationConfidence = 'high' | 'medium' | 'low'

/**
 * Disposition for a migration finding.
 *
 * - 'auto': Safe to apply automatically (high confidence, clean replacement)
 * - 'review': Requires human review (low/medium confidence or complex change)
 */
export type MigrationDisposition = 'auto' | 'review'

/**
 * Proposed patch for a migration finding.
 *
 * Can be a simple string replacement or a structured object with from/to/note.
 */
export interface MigrationProposedPatch {
  from: string
  to: string
  note?: string
}

/**
 * A single migration finding emitted by the client agent after scanning.
 *
 * IMPORTANT: The MCP server returns rules; the CLIENT AGENT scans the user's
 * codebase and emits receipts. The server cannot read user files.
 *
 * Confidence guidance:
 * - 'high' (→ auto): Rule has exact replace mapping + codemod + single match in file
 * - 'medium' (→ review): Rule has replace mapping but multiple matches or no codemod
 * - 'low' (→ review): Detection hit but no clean replace, or complex multi-line change
 */
export interface MigrationReceipt {
  /** Detected or declared Vuetify version in the user's app */
  appVersion: string
  /** Component or API surface affected, when known */
  component: string | null
  /** Rule ID from get_upgrade_rules (e.g., 'v4/typography-classes') */
  breakingRule: string
  /** Optional rule title for human readability */
  breakingRuleTitle?: string
  /** File path in the user's project where the issue was found */
  filePath: string
  /** Line number(s) in the file, if available */
  line?: number | { start: number, end: number }
  /** Proposed fix: simple string or structured from/to/note */
  proposedPatch: string | MigrationProposedPatch
  /** Confidence level for this finding */
  confidence: MigrationConfidence
  /** Link to upgrade guide / rule documentation */
  docsLink: string
  /** Auto-apply or requires human review */
  disposition: MigrationDisposition
  /** Codemod name if available (e.g., 'vuetify-4-typography') */
  codemod?: string
  /** Migration hop this finding belongs to (e.g., { from: 'v3', to: 'v4' }) */
  hop?: { from: string, to: string }
  /** Matched text/pattern from detection */
  matchedText?: string
}

/**
 * Summary counts for a migration receipt report.
 */
export interface MigrationReceiptSummary {
  /** Count of findings safe to auto-apply */
  auto: number
  /** Count of findings requiring human review */
  review: number
  /** Total findings */
  total: number
  /** Breakdown by confidence level */
  byConfidence: {
    high: number
    medium: number
    low: number
  }
}

/**
 * Batch envelope for migration findings.
 *
 * This is the structure agents should return after scanning a codebase
 * using rules from get_upgrade_rules.
 */
export interface MigrationReceiptReport {
  /** Source Vuetify version being migrated from */
  from: string
  /** Target Vuetify version being migrated to */
  to: string
  /** Detected Vuetify version in the user's app */
  appVersion: string
  /** ISO 8601 timestamp when this report was generated */
  generatedAt: string
  /** Array of migration findings */
  findings: MigrationReceipt[]
  /** Summary counts for quick triage */
  summary: MigrationReceiptSummary
}

/**
 * TypeScript schema description for the MigrationReceipt contract.
 * This is returned by get_migration_receipt_schema for agent consumption.
 */
export const MIGRATION_RECEIPT_SCHEMA = {
  name: 'MigrationReceipt',
  description: 'Schema for migration findings emitted by client agents after scanning user code with rules from get_upgrade_rules. The MCP server returns rules; agents scan and fill receipts.',
  fields: {
    appVersion: { type: 'string', required: true, description: 'Detected or declared Vuetify version in the user\'s app' },
    component: { type: 'string | null', required: true, description: 'Component or API surface affected, when known' },
    breakingRule: { type: 'string', required: true, description: 'Rule ID from get_upgrade_rules (e.g., "v4/typography-classes")' },
    breakingRuleTitle: { type: 'string', required: false, description: 'Optional rule title for human readability' },
    filePath: { type: 'string', required: true, description: 'File path in the user\'s project where the issue was found' },
    line: { type: 'number | { start: number, end: number }', required: false, description: 'Line number(s) in the file' },
    proposedPatch: { type: 'string | { from: string, to: string, note?: string }', required: true, description: 'Proposed fix: simple string or structured from/to/note' },
    confidence: { type: '"high" | "medium" | "low"', required: true, description: 'Confidence level: high = exact match + codemod, medium = replace mapping, low = detect only' },
    docsLink: { type: 'string', required: true, description: 'Link to upgrade guide / rule documentation' },
    disposition: { type: '"auto" | "review"', required: true, description: 'auto = safe to apply automatically, review = needs human review' },
    codemod: { type: 'string', required: false, description: 'Codemod name if available (e.g., "vuetify-4-typography")' },
    hop: { type: '{ from: string, to: string }', required: false, description: 'Migration hop this finding belongs to' },
    matchedText: { type: 'string', required: false, description: 'Matched text/pattern from detection' },
  },
  confidenceGuidance: {
    high: 'Use when: rule has exact replace mapping + codemod available + single unambiguous match. Set disposition: "auto".',
    medium: 'Use when: rule has replace mapping but multiple matches in file, or no codemod available. Set disposition: "review".',
    low: 'Use when: detect.grep hit but no clean replace mapping, or complex multi-line change required. Set disposition: "review".',
  },
  batchEnvelope: {
    name: 'MigrationReceiptReport',
    fields: {
      from: 'Source Vuetify version',
      to: 'Target Vuetify version',
      appVersion: 'Detected app version',
      generatedAt: 'ISO 8601 timestamp',
      findings: 'Array of MigrationReceipt',
      summary: '{ auto: number, review: number, total: number, byConfidence: { high, medium, low } }',
    },
  },
} as const
