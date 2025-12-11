/**
 * Rate Limiter Implementation
 *
 * Implements a sliding window rate limiter to control request rates
 */

export interface RateLimiterOptions {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Optional key generator function for identifying clients */
  keyGenerator?: (identifier: string) => string
}

interface RateLimitRecord {
  timestamps: number[]
}

export class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map()
  private options: Required<RateLimiterOptions>
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor (options: RateLimiterOptions) {
    this.options = {
      maxRequests: options.maxRequests,
      windowMs: options.windowMs,
      keyGenerator: options.keyGenerator ?? ((id: string) => id),
    }

    // Clean up old records every minute to prevent memory leaks
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60_000)
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Client identifier (e.g., IP address, session ID)
   * @returns Object with allowed status and retry information
   */
  check (identifier: string): {
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
  } {
    const key = this.options.keyGenerator(identifier)
    const now = Date.now()
    const windowStart = now - this.options.windowMs

    let record = this.records.get(key)
    if (!record) {
      record = { timestamps: [] }
      this.records.set(key, record)
    }

    // Remove timestamps outside the current window
    record.timestamps = record.timestamps.filter(ts => ts > windowStart)

    // Check if limit is exceeded
    const allowed = record.timestamps.length < this.options.maxRequests
    const remaining = Math.max(0, this.options.maxRequests - record.timestamps.length)

    // Calculate reset time (when the oldest request will fall outside the window)
    const resetTime = record.timestamps.length > 0
      ? record.timestamps[0] + this.options.windowMs
      : now + this.options.windowMs

    let retryAfter: number | undefined
    if (!allowed && record.timestamps.length > 0) {
      // Calculate how long to wait until the oldest request expires
      retryAfter = Math.ceil((record.timestamps[0] + this.options.windowMs - now) / 1000)
    }

    // If allowed, record this request
    if (allowed) {
      record.timestamps.push(now)
    }

    return {
      allowed,
      remaining: allowed ? remaining - 1 : remaining,
      resetTime,
      retryAfter,
    }
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset (identifier: string): void {
    const key = this.options.keyGenerator(identifier)
    this.records.delete(key)
  }

  /**
   * Clear all rate limit records
   */
  clear (): void {
    this.records.clear()
  }

  destroy (): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Clean up expired records
   */
  private cleanup (): void {
    const now = Date.now()
    const windowStart = now - this.options.windowMs

    for (const [key, record] of this.records.entries()) {
      // Remove timestamps outside the current window
      record.timestamps = record.timestamps.filter(ts => ts > windowStart)

      // Remove the record entirely if it has no timestamps
      if (record.timestamps.length === 0) {
        this.records.delete(key)
      }
    }
  }
}
