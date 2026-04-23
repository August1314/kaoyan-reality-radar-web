import { describe, expect, it } from 'vitest'
import { getAllowedOrigins, isOriginAllowed } from './http.js'

describe('api cors allowlist', () => {
  it('allows configured origins', () => {
    const allowed = getAllowedOrigins('https://example.com, https://mirror.example.com')

    expect(isOriginAllowed('https://example.com', allowed)).toBe(true)
    expect(isOriginAllowed('https://mirror.example.com', allowed)).toBe(true)
  })

  it('rejects unknown origins', () => {
    const allowed = getAllowedOrigins('https://example.com')

    expect(isOriginAllowed('https://evil.example.com', allowed)).toBe(false)
  })
})
