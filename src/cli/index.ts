#!/usr/bin/env node
import { config, startMessage } from '../cli/intro.js'
import { link } from 'kolorist'
import { intro as clackIntro, confirm, outro, log, multiselect, groupMultiselect, isCancel } from '@clack/prompts'
import { detectIDEs } from './detect-ide.js'
import { installGlobally } from './install-globally.js'
import type { DetectedIDE } from './ide/types.js'
import { npx } from './settings-builder.js'

const useRemote = process.argv.includes('--remote')

const ides = await detectIDEs()

if (ides.length === 0) {
  process.exit(0)
}

clackIntro(startMessage)

type IdeOption = {
  value: DetectedIDE
  label: string
  hint?: string
}

type IdeOptions =
  | { mode: 'multi', options: IdeOption[] }
  | { mode: 'group', options: Record<string, IdeOption[]> }

function toBaseBrand (brand: string): string {
  return brand.replace(/ \(Custom\)$/, '')
}

function toOptionLabel (brand: string, group: string): string {
  if (brand === group) {
    return 'Default'
  }
  const normalized = brand.replace(`${group} `, '').replace(/[()]/g, '').trim()
  return normalized || brand
}

function buildIdeOptions (input: DetectedIDE[]): IdeOptions {
  const counts = new Map<string, number>()
  for (const ide of input) {
    counts.set(ide.ide, (counts.get(ide.ide) ?? 0) + 1)
  }

  const hasDuplicates = Array.from(counts.values()).some(count => count > 1)
  if (!hasDuplicates) {
    return {
      mode: 'multi',
      options: input.map(ide => ({
        value: ide,
        label: ide.brand,
        hint: ide.settingsDir || undefined,
      })),
    }
  }

  const grouped: Record<string, IdeOption[]> = {}
  for (const ide of input) {
    const group = toBaseBrand(ide.brand)
    grouped[group] ||= []
    grouped[group].push({
      value: ide,
      label: toOptionLabel(ide.brand, group),
      hint: ide.settingsDir || undefined,
    })
  }

  return { mode: 'group', options: grouped }
}

let idesToInstall: DetectedIDE[] | symbol | null = null

if (ides.length > 1) {
  const built = buildIdeOptions(ides)
  idesToInstall = await (built.mode === 'multi'
    ? multiselect({
        message: 'Select IDEs to configure',
        options: built.options,
        required: true,
      })
    : groupMultiselect({
        message: 'Select IDE instances to configure',
        options: built.options,
        required: true,
      }))
}

if (isCancel(idesToInstall)) {
  outro('Installation cancelled')
  process.exit(0)
}

if (idesToInstall === null || idesToInstall.length === 0) {
  config(undefined, useRemote)
  process.exit(0)
}

if ((!npx || !npx?.pure) && idesToInstall.some(ide => ide.ide === 'claude')) {
  log.warn(`Claude will likely fail to resolve your \`npx\`. ${link('See more', 'https://github.com/modelcontextprotocol/servers/issues/64#issuecomment-2878569805')}`)
}

const shouldInstall = await confirm({
  message: 'Would you like to apply these settings automatically?',
})

if (shouldInstall) {
  await installGlobally(idesToInstall, useRemote)
  outro('IDE settings updated successfully')
} else {
  outro('Installation cancelled')
}
