import { ansi256 } from 'kolorist'

import { getDefaultIDE } from './detect-ide.js'
import { getSettingsBuilder } from './settings-builder.js'

const ide = await getDefaultIDE()

const blue = ansi256(33)

const startMessage = blue(`Welcome to the Vuetify MCP Server`)

const configMessage = blue(`Welcome to the Vuetify MCP Server!
Open your IDE and paste this into your
.vscode/settings.json file (for ${ide.brand}):`)

export const intro = (command?: 'config' | (string & {})) => console.warn(command === 'config'
  ? `
${configMessage}

${getSettingsBuilder(ide.ide)}
`
  : startMessage)
