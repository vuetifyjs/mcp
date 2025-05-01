import { homedir } from 'node:os'
import type { KnownIDE } from '../types.js'
import path from 'pathe'
import { defaultDetection } from '../../detect/index.js'

export const TRAE: KnownIDE = {
  brand: 'Trae',
  id: 'trae',
  detect: {
    darwin: defaultDetection('trae'),
    win32: defaultDetection('trae'),
    linux: defaultDetection('trae'),
  },
  settings: {
    darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Trae', 'User'),
    win32: () => path.join(process.env.APPDATA!, 'Trae', 'User'),
    linux: () => path.join(homedir(), '.config', 'Trae', 'User'),
  },
}
