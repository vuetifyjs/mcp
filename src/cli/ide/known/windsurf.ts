import { homedir } from 'node:os'
import type { KnownIDE } from '../types.js'
import path from 'pathe'
import { defaultDetection } from '../../detect/index.js'

export const WINDSURF: KnownIDE = {
  brand: 'Windsurf',
  id: 'windsurf',
  detect: {
    darwin: defaultDetection('windsurf'),
    win32: defaultDetection('windsurf'),
    linux: defaultDetection('windsurf'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Windsurf', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Windsurf', 'User'),
    linux: () => path.join(homedir(), '.config', 'Windsurf', 'User'),
  },
}
