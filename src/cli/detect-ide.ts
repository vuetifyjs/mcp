import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'pathe'

import { platform } from 'std-env'
import which from 'which'

const supportedIDEList = ['code', 'trae', 'cursor', 'code-insiders'] as const

export type IDEType = typeof supportedIDEList[number]
type OperatingSystem = 'win32' | 'darwin' | 'linux'
type PathGetter = () => string
type IDEPathSettings = Record<OperatingSystem, PathGetter[] | PathGetter>

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

const code = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Code', 'User'),
  linux: () => path.join(homedir(), '.config', 'Code', 'User'),
}

const trae = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Trae', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Trae', 'User'),
  linux: () => path.join(homedir(), '.config', 'Trae', 'User'),
}

const cursor = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Cursor', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Cursor', 'User'),
  linux: () => path.join(homedir(), '.config', 'Cursor', 'User'),
}

const codeInsiders = {
  darwin: () => path.join(homedir(), 'Library', 'Application Support', 'Code - Insiders', 'User'),
  win32: () => path.join(process.env.APPDATA!, 'Code - Insiders', 'User'),
  linux: () => path.join(homedir(), '.config', 'Code - Insiders', 'User'),
}

const idePathConfigs = {
  code,
  trae,
  cursor,
  'code-insiders': codeInsiders,
} satisfies Record<IDEType, IDEPathSettings>

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
