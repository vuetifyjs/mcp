import { platform } from 'std-env'
import type { DetectedIDE, KnownIDE } from './ide/types.js'
import * as SupportedIDEList from './ide/known/index.js'

const DEFAULT_SETTINGS_FILE = 'mcp.json'
let cachedIDEs: DetectedIDE[] | null = null

async function isProgramInstalled (ide: KnownIDE) {
  const check = ide.detect[platform as keyof typeof ide.detect]
  if (check) {
    return await check()
  }
  return false
}

function getSettingsFile (ide: KnownIDE): string {
  if (ide.settingsFile && typeof ide.settingsFile === 'string') {
    return ide.settingsFile
  } else if (typeof ide.settingsFile === 'object') {
    return ide.settingsFile[platform as keyof typeof ide.settingsFile] ?? DEFAULT_SETTINGS_FILE
  }
  return DEFAULT_SETTINGS_FILE
}

function getSettingsDir (ide: KnownIDE): string {
  if (typeof ide.settings === 'object') {
    return ide.settings[platform as keyof typeof ide.settings]?.() ?? ''
  }
  return ''
}

export async function detectIDEs () {
  if (cachedIDEs !== null) {
    return cachedIDEs
  }

  const detectedIDEs: DetectedIDE[] = []
  for (const ideName in SupportedIDEList) {
    const exists = await isProgramInstalled(SupportedIDEList[ideName as keyof typeof SupportedIDEList])

    if (exists) {
      const ide = SupportedIDEList[ideName as keyof typeof SupportedIDEList]
      detectedIDEs.push({
        ide: ide.id,
        brand: ide.brand,
        settingsDir: getSettingsDir(ide),
        settingsFile: getSettingsFile(ide),
      })
    }
  }

  cachedIDEs = detectedIDEs
  return detectedIDEs
}

const fallbackData = {
  ide: 'code',
  brand: 'VS Code',
  settingsDir: '',
  settingsFile: DEFAULT_SETTINGS_FILE,
} satisfies DetectedIDE

export async function getDefaultIDE () {
  return (await detectIDEs()).at(0) || fallbackData
}

export function clearIDECache () {
  cachedIDEs = null
}
