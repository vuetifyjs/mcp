#!/usr/bin/env node
import { intro } from '../cli/intro.js'
import { confirm, multiselect } from '@clack/prompts'
import type { DetectedIDE } from './detect-ide.js'
import { detectIDEs } from './detect-ide.js'

const ides = detectIDEs()

intro('config')

if (ides.length === 0) {
  process.exit(0)
}

const shouldAddGlobally = await confirm({
  message: 'Add to global settings?',
})

let idesToInstall: DetectedIDE[] | symbol = []
if (shouldAddGlobally !== true) { // might be symbol or boolean
  process.exit(0)
}

if (shouldAddGlobally && ides.length > 1) {
  idesToInstall = await multiselect({
    message: 'Select IDEs to add to global settings',
    options: ides.map(ide => ({ value: ide, label: ide.brand })),
  })
}

if (shouldAddGlobally && ides.length === 1) {
  idesToInstall = ides
}

if (Array.isArray(idesToInstall) && idesToInstall.length > 0) {
  console.log('idesToInstall', idesToInstall)
} else {
  console.log('No IDEs selected')
}
