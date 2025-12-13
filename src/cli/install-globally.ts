import { parse } from 'jsonc-parser'
import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'pathe'
import { x } from 'tinyexec'
import { getServerConfig, getSettingsPath, getClaudeCodeArgs } from './settings-builder.js'
import type { DetectedIDE } from './ide/types.js'
import { deepset } from './utils/deepset.js'

async function installClaudeCode () {
  const args = getClaudeCodeArgs()
  const result = await x('claude', args)

  if (result.exitCode !== 0) {
    if (result.stderr.includes('already exists')) {
      // Remove existing and re-add
      await x('claude', ['mcp', 'remove', '--scope', 'user', 'vuetify-mcp'])
      await x('claude', args, { throwOnError: true })
    } else {
      throw new Error(result.stderr || 'Failed to add MCP server')
    }
  }
}

async function setIdeSettings (ideInstance: DetectedIDE, remote?: boolean) {
  if (ideInstance.ide === 'claude-code') {
    return installClaudeCode()
  }

  if (!ideInstance.settingsDir || !existsSync(ideInstance.settingsDir)) {
    return
  }
  const configFilePath = resolve(ideInstance.settingsDir, ideInstance.settingsFile)
  const settingsPath = getSettingsPath(ideInstance.ide)
  const serverConfig = getServerConfig(undefined, remote)

  let config = {}
  if (existsSync(configFilePath)) {
    try {
      const fileContent = await readFile(configFilePath, { encoding: 'utf8' })
      const parsed = parse(fileContent)
      if (parsed && typeof parsed === 'object') {
        config = parsed
      }
    } catch {
      console.error('Failed to parse existing config, creating new one')
    }
  }

  deepset(config, settingsPath, serverConfig)
  await writeFile(configFilePath, prettyPrint(config))
}

export async function installGlobally (ides: DetectedIDE[], remote?: boolean) {
  for (const ide of ides) {
    await setIdeSettings(ide, remote)
  }
}

function prettyPrint (data: unknown): string {
  return JSON.stringify(data, null, 2)
}
