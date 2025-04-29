import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import { getCacheDir } from './cache-dir.js'

export async function getApi (version = 'latest') {
  const dir = getCacheDir(version)
  const file = join(dir, 'web-types.json')
  if (existsSync(file) && version !== 'latest') {
    return readFileSync(file, 'utf-8')
  }

  return cacheApi(file, version)
}

export async function cacheApi (file: string, version = 'latest') {
  const url = `https://cdn.jsdelivr.net/npm/vuetify@${version}/dist/json/web-types.json`
  const text = await fetch(url).then(r => r.text())

  writeFileSync(file, text, 'utf-8')

  return text
}
