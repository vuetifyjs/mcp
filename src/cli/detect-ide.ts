import fs from 'node:fs'

import { platform } from 'std-env'
import which from 'which'
import type { IDEPathSettings } from './ide-paths.js'
import { idePathConfigs } from './ide-paths.js'

const supportedIDEList = ['code', 'trae', 'cursor', 'code-insiders'] as const
export type IDEType = typeof supportedIDEList[number]

export const ideBrands: Record<IDEType, string> = {
  'trae': 'Trae',
  'code': 'VS Code',
  'cursor': 'Cursor',
  'code-insiders': 'VS Code Insiders',
}

export function getSettingsForIde ({ darwin, win32, linux }: IDEPathSettings) {
  const paths = []
  if (platform === 'win32') {
    paths.push(win32)
  }
  if (platform === 'darwin') {
    paths.push(darwin)
  }
  if (platform === 'linux') {
    paths.push(linux)
  }

  const flatPaths = paths.flat()
  for (const filePath of flatPaths) {
    const path = filePath()
    if (fs.existsSync(path)) {
      return path
    }
  }
  return ''
}

export interface DetectedIDE {
  ide: IDEType
  brand: string
  config: string
}

let cachedIDEs: DetectedIDE[] | null = null

export function detectIDEs () {
  if (cachedIDEs !== null) {
    return cachedIDEs
  }

  const detectedIDEs: DetectedIDE[] = []
  for (const ide of supportedIDEList) {
    try {
      which.sync(ide)
      detectedIDEs.push({
        ide,
        brand: ideBrands[ide],
        config: getSettingsForIde(idePathConfigs[ide]),
      })
    } catch {
      continue
    }
  }

  cachedIDEs = detectedIDEs
  return detectedIDEs
}

const fallbackData = {
  ide: 'code',
  brand: 'VS Code',
  config: '',
} satisfies DetectedIDE

export function getDefaultIDE () {
  return detectIDEs().at(0) || fallbackData
}

export function clearIDECache () {
  cachedIDEs = null
}
