import { parse } from 'jsonc-parser'
import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'pathe'
import { serverConfig, getSettingsPath } from './settings-builder.js'
import type { DetectedIDE } from './ide/types.js'
import { deepset } from './utils/deepset.js'

async function setIdeSettings (ideInstance: DetectedIDE) {
  if (!ideInstance.settingsDir || !existsSync(ideInstance.settingsDir)) {
    return
  }
  const configFilePath = resolve(ideInstance.settingsDir, ideInstance.settingsFile)
  const settingsPath = getSettingsPath(ideInstance.ide)
  if (existsSync(configFilePath)) {
    const fileContent = await readFile(configFilePath, { encoding: 'utf8' })
    const existingConfig = parse(fileContent)
    deepset(existingConfig, settingsPath, serverConfig)
    await writeFile(configFilePath, prettyPrint(existingConfig))
    return
  } else {
    const config = {}
    deepset(config, settingsPath, serverConfig)
    await writeFile(configFilePath, prettyPrint(config))
  }
}

export async function installGlobally (ides: DetectedIDE[]) {
  for (const ide of ides) {
    await setIdeSettings(ide)
  }
}

function prettyPrint (data: unknown): string {
  return JSON.stringify(data, null, 2)
}
