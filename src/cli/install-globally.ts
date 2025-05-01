import { parse } from 'jsonc-parser'
import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'pathe'
import { settingsBuilder } from './settings-builder.js'
import deepmerge from 'deepmerge'
import type { DetectedIDE } from './ide/types.js'

async function setIdeSettings (ideInstance: DetectedIDE) {
  if (!ideInstance.settingsDir) {
    return
  }
  const configFilePath = resolve(ideInstance.settingsDir, ideInstance.settingsFile)
  const builtConfig = JSON.parse(settingsBuilder(ideInstance.ide)!)
  if (existsSync(configFilePath)) {
    const fileContent = await readFile(configFilePath, { encoding: 'utf8' })
    const existingConfig = parse(fileContent)
    const mergedConfig = deepmerge(builtConfig, existingConfig, { arrayMerge: target => target })
    await writeFile(configFilePath, prettyPrint(mergedConfig))
    return
  } else {
    await writeFile(configFilePath, prettyPrint(builtConfig))
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
