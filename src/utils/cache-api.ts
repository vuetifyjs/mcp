import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import { getCacheDir } from './cache-dir.js'

export async function cacheApi (version = 'latest') {
  const dir = getCacheDir(version)
  const file = join(dir, 'web-types.json')

  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf-8'))
  }

  // const url = `https://cdn.jsdelivr.net/npm/vuetify@${version}/dist/web-types.json`
  // const text = await fetch(url).then(r => r.text())

  // writeFileSync(file, text, 'utf-8')

  // return JSON.parse(text)
}
