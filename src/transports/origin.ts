/**
 * Origin header checks for browser clients.
 *
 * Missing Origin is allowed (Claude/Cursor backends, Inspector). Empty string is present and invalid.
 */
import type { IncomingMessage } from 'node:http'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

const EXTRA_ORIGINS = new Set([
  'https://claude.ai',
  'https://www.claude.ai',
  'https://claude.com',
  'https://www.claude.com',
  'https://www.cursor.com',
  'https://cursor.com',
])

export function getRequestOrigin (req: IncomingMessage): string | undefined {
  const origin = req.headers.origin
  // Multiple Origin headers are not spec; treat as present and invalid.
  if (Array.isArray(origin)) {
    return ''
  }

  if (typeof origin !== 'string') {
    return undefined
  }

  return origin
}

export function isAllowedOrigin (origin: string, resourceUrl: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    return false
  }

  const normalized = parsed.origin

  if (EXTRA_ORIGINS.has(normalized)) {
    return true
  }

  if (
    (parsed.protocol === 'http:' || parsed.protocol === 'https:')
    && LOCAL_HOSTS.has(parsed.hostname)
  ) {
    return true
  }

  try {
    return normalized === new URL(resourceUrl).origin
  } catch {
    return false
  }
}
