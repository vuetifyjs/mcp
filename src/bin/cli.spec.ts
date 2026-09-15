import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isMainModule, resolveSpawnConfig } from '../../bin/cli.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

describe('resolveSpawnConfig', () => {
  describe('server mode', () => {
    it('spawns the server directly without a shell, even on Windows', () => {
      const { command, args, shell } = resolveSpawnConfig([], 'win32')

      expect(command).toBe(process.execPath)
      expect(args[0]).toBe(path.join(root, 'dist', 'index.js'))
      expect(shell).toBe(false)
    })

    it('spawns the server without a shell on POSIX', () => {
      const { shell } = resolveSpawnConfig([], 'linux')
      expect(shell).toBe(false)
    })

    it('translates --api-key and --github-token to environment variables', () => {
      const { args, env } = resolveSpawnConfig(['--api-key', 'secret', '--github-token', 'ghp_123', '--transport', 'http'], 'linux')

      expect(env.VUETIFY_API_KEY).toBe('secret')
      expect(env.GITHUB_TOKEN).toBe('ghp_123')
      expect(args).not.toContain('--api-key')
      expect(args).not.toContain('--github-token')
      expect(args).toContain('--transport')
      expect(args).toContain('http')
    })
  })

  describe('subcommand mode', () => {
    it('uses npx.cmd through a shell on Windows', () => {
      const { command, args, shell } = resolveSpawnConfig(['config'], 'win32')

      expect(command).toBe('npx.cmd')
      expect(shell).toBe(true)
      expect(args).toEqual(['--yes', '@vuetify/mcp-cli@^1', 'config'])
    })

    it('uses npx without a shell on POSIX', () => {
      const { command, shell } = resolveSpawnConfig(['config'], 'darwin')

      expect(command).toBe('npx')
      expect(shell).toBe(false)
    })
  })
})

describe('isMainModule', () => {
  it('treats a POSIX bin symlink as a direct run', () => {
    const real = fileURLToPath(import.meta.url)
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-cli-'))
    const link = path.join(dir, 'cli.js')
    fs.symlinkSync(real, link)

    expect(isMainModule(pathToFileURL(real).href, link)).toBe(true)

    fs.rmSync(dir, { recursive: true, force: true })
  })
})
