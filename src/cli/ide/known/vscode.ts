import { homedir } from 'node:os'
import type { KnownIDE } from '../types.js'
import path from 'pathe'
import { defaultDetection } from '../../detect/index.js'

export const VSCODE: KnownIDE = {
  brand: 'VS Code',
  id: 'code',
  detect: {
    darwin: defaultDetection('code'),
    win32: defaultDetection('code'),
    linux: defaultDetection('code'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Code', 'User'),
    linux: () => path.join(homedir(), '.config', 'Code', 'User'),
  },
}

export const VSCODE_INSIDERS: KnownIDE = {
  brand: 'VS Code Insiders',
  id: 'code-insiders',
  detect: {
    darwin: defaultDetection('code-insiders'),
    win32: defaultDetection('code-insiders'),
    linux: defaultDetection('code-insiders'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code - Insiders', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Code - Insiders', 'User'),
    linux: () => path.join(homedir(), '.config', 'Code - Insiders', 'User'),
  },
  settingsFile: 'settings.json',
}
