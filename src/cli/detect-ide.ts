import { platform } from 'std-env'
import path from 'pathe'
import type { DetectedIDE, KnownIDE } from './ide/types.js'
import * as SupportedIDEList from './ide/known/index.js'
import { findRunningIDEInstances } from './process-utils.js'

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
  const processedPaths = new Set<string>()

  for (const ideName in SupportedIDEList) {
    const ide = SupportedIDEList[ideName as keyof typeof SupportedIDEList]
    const defaultSettingsDir = getSettingsDir(ide)
    const resolvedDefaultSettingsDir = defaultSettingsDir ? path.resolve(defaultSettingsDir) : null

    const customPaths = await findRunningIDEInstances(ide.id)
    for (const customPath of customPaths) {
      const isVSCodeFamily = ['code', 'code-insiders', 'trae', 'cursor', 'windsurf'].includes(ide.id)
      const settingsDir = isVSCodeFamily ? path.join(customPath, 'User') : customPath
      const resolvedSettingsDir = path.resolve(settingsDir)

      if (!processedPaths.has(resolvedSettingsDir)) {
        const isDefault = resolvedDefaultSettingsDir && resolvedSettingsDir === resolvedDefaultSettingsDir
        detectedIDEs.push({
          ide: ide.id,
          brand: isDefault ? ide.brand : `${ide.brand} (Custom)`,
          settingsDir,
          settingsFile: getSettingsFile(ide),
        })
        processedPaths.add(resolvedSettingsDir)
      }
    }

    const exists = await isProgramInstalled(ide)

    if (exists && defaultSettingsDir && resolvedDefaultSettingsDir // Only add if not already added by process detection or previous iteration
      && !processedPaths.has(resolvedDefaultSettingsDir)) {
      detectedIDEs.push({
        ide: ide.id,
        brand: ide.brand,
        settingsDir: defaultSettingsDir,
        settingsFile: getSettingsFile(ide),
      })
      processedPaths.add(resolvedDefaultSettingsDir)
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
