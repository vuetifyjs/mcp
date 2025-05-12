import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

/**
 * Resolve an OS-appropriate writable cache folder.
 * Order of preference:
 *   1. Explicit override  (VUETIFY_MCP_CACHE)
 *   2. XDG spec           (Linux / macOS)
 *   3. LOCALAPPDATA       (Windows)
 *   4. ~/.cache or %USERPROFILE%\AppData\Local
 */
export function getApiCacheDirRoot () {
  return (
    process.env.VUETIFY_MCP_CACHE
    ?? process.env.XDG_CACHE_HOME
    ?? (process.platform === 'win32'
      ? process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local', 'Vuetify')
      : join(homedir(), '.cache', 'Vuetify'))
  )
}

export function getApiCacheDir (version: string) {
  const dir = join(getApiCacheDirRoot(), version)

  mkdirSync(dir, { recursive: true })

  return dir
}

export async function getApi (version: string) {
  const dir = getApiCacheDir(version)
  const file = join(dir, 'web-types.json')

  if (existsSync(file) && version !== 'latest') {
    return readFileSync(file, 'utf8')
  }

  return cacheApi(version)
}

export async function cacheApi (version: string) {
  const url = `https://cdn.jsdelivr.net/npm/vuetify@${version}/dist/json/web-types.json`
  const text = await fetch(url).then(r => r.text())

  if (text !== `Couldn't find the requested release version ${version}`) {
    const dir = getApiCacheDir(version)
    const file = join(dir, 'web-types.json')

    writeFileSync(file, text, 'utf8')
  }

  return text
}
