import { describe, expect, it } from 'vitest'
import {
  canAccessCompare,
  canAccessProgram,
  canAccessStats,
  getDeviceLevel,
  getTargetLimit,
  normalizeCode,
  normalizeDeviceRecord,
  recordViewedProgram,
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
        viewedProgramIds: ['batch-001-program-1'],
        updatedAt: '2026-04-23T00:00:00.000Z',
      },
    })

    await expect(redeemCode(store, 'KR-S-TEST-0001-AAAA', 'device-a')).resolves.toEqual({
      ok: true,
      level: 'paid',
    })
  })

  it('preserves viewed program ids after entitlement upgrade', async () => {
    const store = createMemoryStore({
      'code:KR-S-TEST-0001-AAAA': surveyCode,
      'device:device-a': {
        level: 'free',
        redeemedCodes: [],
        viewedProgramIds: ['batch-001-program-1', 'batch-001-program-2'],
        updatedAt: '2026-04-23T00:00:00.000Z',
      },
    })

    await redeemCode(store, 'KR-S-TEST-0001-AAAA', 'device-a')

    expect(store.data.get('device:device-a')).toMatchObject({
      level: 'survey',
      viewedProgramIds: ['batch-001-program-1', 'batch-001-program-2'],
    })
  })
})

describe('target quota helpers', () => {
  it('tracks viewed targets without duplicate counting', () => {
    const base = normalizeDeviceRecord(null)
    const first = recordViewedProgram(base, 'program-a', '2026-04-23T00:00:00.000Z')
    const revisit = recordViewedProgram(first, 'program-a', '2026-04-23T00:01:00.000Z')

    expect(first.viewedProgramIds).toEqual(['program-a'])
    expect(revisit.viewedProgramIds).toEqual(['program-a'])
    expect(revisit.updatedAt).toBe('2026-04-23T00:01:00.000Z')
  })

  it('blocks new program access once free quota is exhausted', () => {
    const freeDevice = normalizeDeviceRecord({
      level: 'free',
      redeemedCodes: [],
      viewedProgramIds: ['program-a', 'program-b'],
      updatedAt: '2026-04-23T00:00:00.000Z',
    })

    expect(getTargetLimit('free')).toBe(2)
    expect(canAccessProgram(freeDevice, 'program-a')).toBe(true)
    expect(canAccessProgram(freeDevice, 'program-c')).toBe(false)
  })

  it('allows more targets after survey upgrade and keeps paid unlimited', () => {
    const surveyDevice = normalizeDeviceRecord({
      level: 'survey',
      redeemedCodes: [],
      viewedProgramIds: Array.from({ length: 8 }, (_, index) => `program-${index}`),
      updatedAt: '2026-04-23T00:00:00.000Z',
    })
    const paidDevice = normalizeDeviceRecord({
      level: 'paid',
      redeemedCodes: [],
      viewedProgramIds: Array.from({ length: 20 }, (_, index) => `program-${index}`),
      updatedAt: '2026-04-23T00:00:00.000Z',
    })

    expect(getTargetLimit('survey')).toBe(8)
    expect(canAccessProgram(surveyDevice, 'program-9')).toBe(false)
    expect(canAccessProgram(paidDevice, 'program-999')).toBe(true)
  })

  it('enforces stats and compare permissions by entitlement level', () => {
    expect(canAccessStats('free')).toBe(false)
    expect(canAccessStats('survey')).toBe(false)
    expect(canAccessStats('paid')).toBe(true)

    expect(canAccessCompare('free')).toBe(false)
    expect(canAccessCompare('survey')).toBe(true)
    expect(canAccessCompare('paid')).toBe(true)
  })
})
