import { homedir } from 'node:os'
import type { KnownIDE } from '../types.js'
import path from 'pathe'
import { checkMacOSApp, checkWindowsApp } from '../../detect/index.js'

export const CLAUDE: KnownIDE = {
  brand: 'Claude',
  id: 'claude',
  detect: {
    darwin: () => checkMacOSApp('Claude'),
    win32: () => checkWindowsApp('claude'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Claude', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Claude'),
  },
  settingsFile: 'claude_desktop_config.json',
}
