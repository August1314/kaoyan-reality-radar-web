import { describe, expect, it } from 'vitest'
import {
  getDeviceLevel,
  normalizeCode,
  redeemCode,
  type CodeRecord,
  type EntitlementStore,
} from './entitlements.js'

function createMemoryStore(initial: Record<string, unknown> = {}): EntitlementStore & { data: Map<string, unknown> } {
  const data = new Map<string, unknown>(Object.entries(initial))
  return {
    data,
    async get<T>(key: string) {
      return (data.get(key) as T | undefined) ?? null
    },
    async set<T>(key: string, value: T) {
      data.set(key, value)
    },
  }
}

describe('server entitlement redemption', () => {
  const surveyCode: CodeRecord = {
    level: 'survey',
    status: 'unused',
    createdAt: '2026-04-23T00:00:00.000Z',
  }

  it('normalizes codes before lookup', () => {
    expect(normalizeCode(' kr-s-abcd-2345-wxyz ')).toBe('KR-S-ABCD-2345-WXYZ')
  })

  it('binds an unused code to the first device', async () => {
    const store = createMemoryStore({ 'code:KR-S-TEST-0001-AAAA': surveyCode })

    const result = await redeemCode(store, 'kr-s-test-0001-aaaa', 'device-a', '2026-04-23T00:01:00.000Z')

    expect(result).toEqual({ ok: true, level: 'survey' })
    expect(await getDeviceLevel(store, 'device-a')).toBe('survey')
    expect(store.data.get('code:KR-S-TEST-0001-AAAA')).toMatchObject({
      status: 'redeemed',
      boundDeviceId: 'device-a',
    })
  })

  it('allows the same device to reuse an already redeemed code', async () => {
    const store = createMemoryStore({
      'code:KR-S-TEST-0001-AAAA': {
        ...surveyCode,
        status: 'redeemed',
        boundDeviceId: 'device-a',
      },
    })

    await expect(redeemCode(store, 'KR-S-TEST-0001-AAAA', 'device-a')).resolves.toEqual({
      ok: true,
      level: 'survey',
    })
  })

  it('rejects a redeemed code on a different device', async () => {
    const store = createMemoryStore({
      'code:KR-S-TEST-0001-AAAA': {
        ...surveyCode,
        status: 'redeemed',
        boundDeviceId: 'device-a',
      },
    })

    await expect(redeemCode(store, 'KR-S-TEST-0001-AAAA', 'device-b')).resolves.toMatchObject({
      ok: false,
      status: 409,
      error: 'code_already_used',
    })
  })

  it('never downgrades a paid device when redeeming a survey code', async () => {
    const store = createMemoryStore({
      'code:KR-S-TEST-0001-AAAA': surveyCode,
      'device:device-a': {
        level: 'paid',
        redeemedCodes: ['KR-P-TEST-0001-AAAA'],
        updatedAt: '2026-04-23T00:00:00.000Z',
      },
    })

    await expect(redeemCode(store, 'KR-S-TEST-0001-AAAA', 'device-a')).resolves.toEqual({
      ok: true,
      level: 'paid',
    })
  })
})
