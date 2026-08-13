import { describe, expect, it } from 'vitest'
import { getRequestOrigin, isAllowedOrigin } from './origin.js'

const resource = 'https://mcp.vuetifyjs.com/mcp'

describe('isAllowedOrigin', () => {
  it('allows localhost with a port over http or https', () => {
    expect(isAllowedOrigin('http://localhost:5173', resource)).toBe(true)
    expect(isAllowedOrigin('https://127.0.0.1:8443', resource)).toBe(true)
    expect(isAllowedOrigin('http://[::1]:3000', resource)).toBe(true)
  })

  it('rejects an evil origin', () => {
    expect(isAllowedOrigin('https://evil.example.com', resource)).toBe(false)
  })

  it('skips resource-origin matching when the resource URL cannot be parsed', () => {
    expect(isAllowedOrigin('https://mcp.vuetifyjs.com', 'not a url')).toBe(false)
    expect(isAllowedOrigin('https://claude.ai', '%%%')).toBe(true)
  })

  it('rejects an empty origin string', () => {
    expect(isAllowedOrigin('', resource)).toBe(false)
  })
})

describe('getRequestOrigin', () => {
  it('treats a missing header as absent', () => {
    expect(getRequestOrigin({ headers: {} } as any)).toBeUndefined()
  })

  it('treats multiple Origin headers as an empty present value', () => {
    expect(getRequestOrigin({ headers: { origin: ['https://claude.ai', 'https://evil.example.com'] } } as any)).toBe('')
  })
})
