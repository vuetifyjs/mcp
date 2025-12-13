import { ansi256, underline } from 'kolorist'
import { join } from 'node:path'
import { getDefaultIDE } from './detect-ide.js'
import { getSettingsBuilder } from './settings-builder.js'
import type { DetectedIDE } from './ide/types.js'

const defaultIde = await getDefaultIDE()

const blue = ansi256(33)

const WELCOME_MESSAGE = 'Welcome to the Vuetify MCP Server'
const CONFIG_TEMPLATE = `
Open your IDE and paste this into your
%settings% file (for %brand%):`
const CLAUDE_CODE_TEMPLATE = `
Run this command to configure Claude Code:`

export const startMessage = blue(WELCOME_MESSAGE)

function configMessage (ide: DetectedIDE) {
  if (ide.ide === 'claude-code') {
    return blue(CLAUDE_CODE_TEMPLATE)
  }
  return blue(
    CONFIG_TEMPLATE
      .replace('%settings%', underline(join(ide.settingsDir, ide.settingsFile)))
      .replace('%brand%', ide.brand),
  )
}

export const intro = (): void => {
  console.warn(startMessage)
}

export const config = (ide: DetectedIDE = defaultIde, remote?: boolean): void => {
  const message = `\n${configMessage(ide)}\n\n${getSettingsBuilder(ide.ide, undefined, remote)}`
  console.warn(message)
}
