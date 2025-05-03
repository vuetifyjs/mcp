import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export async function getApi (version = 'latest') {
  const dir = getApiCacheDir(version)
  const file = join(dir, 'web-types.json')

  if (existsSync(file) && version !== 'latest') {
    return readFileSync(file, 'utf-8')
  }

  return cacheApi(file, version)
}

/**
 * Resolve an OS-appropriate writable cache folder.
 * Order of preference:
 *   1. Explicit override  (VUETIFY_MCP_CACHE)
 *   2. XDG spec           (Linux / macOS)
 *   3. LOCALAPPDATA       (Windows)
 *   4. ~/.cache or %USERPROFILE%\AppData\Local
 */
export function getApiCacheDir (version = 'latest'): string {
	const base =
		process.env.VUETIFY_MCP_CACHE ??
		process.env.XDG_CACHE_HOME ??
		(process.platform === 'win32'
			? process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local')
			: join(homedir(), '.cache'))

	const dir = join(base, 'vuetify-mcp', version)

	mkdirSync(dir, { recursive: true })

	return dir
}

export async function cacheApi (file: string, version = 'latest') {
  const url = `https://cdn.jsdelivr.net/npm/vuetify@${version}/dist/json/web-types.json`
  const text = await fetch(url).then(r => r.text())

  writeFileSync(file, text, 'utf-8')

  return text
}
