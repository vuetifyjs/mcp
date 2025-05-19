#!/usr/bin/env node
import { config, startMessage } from '../cli/intro.js'
import { link } from 'kolorist'
import { intro as clackIntro, confirm, outro, log, select } from '@clack/prompts'
import { detectIDEs } from './detect-ide.js'
import { installGlobally } from './install-globally.js'
import type { DetectedIDE } from './ide/types.js'
import { npx } from './settings-builder.js'

const ides = await detectIDEs()

if (ides.length === 0) {
  process.exit(0)
}

clackIntro(startMessage)

let idesToInstall: DetectedIDE | symbol | null = null

if (ides.length > 1) {
  idesToInstall = await select({
    message: 'Select IDE to configure',
    options: ides.map(ide => ({ value: ide, label: ide.brand })),
  })
}

if (ides.length === 1) {
  idesToInstall = ides[0]
}

if (idesToInstall === null) {
  config()
  process.exit(0)
}

config(idesToInstall as DetectedIDE)

if ((!npx || !npx?.pure) && (idesToInstall as DetectedIDE).ide === 'claude') {
  log.warn(`Claude probably will fail with resolving your \`npx\`. ${link('See more', 'https://github.com/modelcontextprotocol/servers/issues/64#issuecomment-2878569805')}`)
}

const shouldInstall = await confirm({
  message: 'Would you like to apply these settings automatically?',
})

if (shouldInstall) {
  await installGlobally([idesToInstall as DetectedIDE])
  outro('IDE settings updated successfully')
} else {
  outro('Installation cancelled')
}
