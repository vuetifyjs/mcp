import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '#prompts': resolve(root, 'src/prompts'),
      '#resources': resolve(root, 'src/resources'),
      '#services': resolve(root, 'src/services'),
      '#tools': resolve(root, 'src/tools'),
      '#transports': resolve(root, 'src/transports'),
      '#utils': resolve(root, 'src/utils'),
      '#plugins': resolve(root, 'src/plugins'),
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
  },
})
