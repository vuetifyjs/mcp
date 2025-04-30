import { mkdirSync } from 'node:fs'
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
export function getCacheDir (version = 'latest'): string {
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
