import { describe, expect, it } from 'vitest'
import { upgradeGuideRef } from '#services/documentation'

describe('upgradeGuideRef', () => {
  it('uses v3-stable for v2.7', () => {
    expect(upgradeGuideRef('v2.7')).toBe('v3-stable')
  })

  it('uses next for v3', () => {
    expect(upgradeGuideRef('v3')).toBe('next')
  })

  it('leaves v1.5 on the default branch', () => {
    expect(upgradeGuideRef('v1.5')).toBeUndefined()
  })
})
