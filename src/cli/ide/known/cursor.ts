import { homedir } from 'node:os'
import type { KnownIDE } from '../types.js'
import path from 'pathe'
import { defaultDetection } from '../../detect/index.js'

export const CURSOR: KnownIDE = {
  brand: 'Cursor',
  id: 'cursor',
  detect: {
    darwin: defaultDetection('cursor'),
    win32: defaultDetection('cursor'),
    linux: defaultDetection('cursor'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Cursor', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Cursor', 'User'),
    linux: () => path.join(homedir(), '.config', 'Cursor', 'User'),
  },
}
