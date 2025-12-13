import type { KnownIDE } from '../types.js'
import { defaultDetection } from '../../detect/index.js'

export const CLAUDE_CODE: KnownIDE = {
  brand: 'Claude Code',
  id: 'claude-code',
  detect: {
    darwin: defaultDetection('claude'),
    win32: defaultDetection('claude'),
    linux: defaultDetection('claude'),
  },
  settings: {},
}
