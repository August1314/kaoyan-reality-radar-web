import { chooseHigherEntitlement, type EntitlementLevel } from '../../src/lib/monetization.ts'

export type CodeStatus = 'unused' | 'redeemed'

export interface CodeRecord {
  level: EntitlementLevel
  status: CodeStatus
  createdAt: string
  boundDeviceId?: string
  redeemedAt?: string
}

export interface DeviceRecord {
  level: EntitlementLevel
  redeemedCodes: string[]
  updatedAt: string
}

export interface EntitlementStore {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
}

export type RedeemResult =
  | { ok: true; level: EntitlementLevel }
  | { ok: false; status: number; error: string; message: string }

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

export function isEntitlementLevel(value: string): value is EntitlementLevel {
  return value === 'survey' || value === 'paid'
}

export function codeKey(code: string): string {
  return `code:${normalizeCode(code)}`
}

export function deviceKey(deviceId: string): string {
  return `device:${deviceId}`
}

export async function getDeviceLevel(store: EntitlementStore, deviceId: string): Promise<EntitlementLevel> {
  if (!deviceId) return 'free'

  const device = await store.get<DeviceRecord>(deviceKey(deviceId))
  return device?.level ?? 'free'
}

export async function redeemCode(
  store: EntitlementStore,
  rawCode: string,
  deviceId: string,
  now = new Date().toISOString(),
): Promise<RedeemResult> {
  const code = normalizeCode(rawCode)
  if (!code || !deviceId) {
    return { ok: false, status: 400, error: 'invalid_request', message: '缺少解锁码或设备标识。' }
  }

  const key = codeKey(code)
  const codeRecord = await store.get<CodeRecord>(key)
  if (!codeRecord) {
    return { ok: false, status: 404, error: 'invalid_code', message: '解锁码不存在或已失效。' }
  }

  if (codeRecord.status === 'redeemed' && codeRecord.boundDeviceId !== deviceId) {
    return { ok: false, status: 409, error: 'code_already_used', message: '这个解锁码已绑定到其它设备。' }
  }

  const currentDevice = await store.get<DeviceRecord>(deviceKey(deviceId))
  const nextLevel = chooseHigherEntitlement(currentDevice?.level ?? 'free', codeRecord.level)
  const redeemedCodes = Array.from(new Set([...(currentDevice?.redeemedCodes ?? []), code]))

  if (codeRecord.status === 'unused') {
    await store.set<CodeRecord>(key, {
      ...codeRecord,
      status: 'redeemed',
      boundDeviceId: deviceId,
      redeemedAt: now,
    })
  }

  await store.set<DeviceRecord>(deviceKey(deviceId), {
    level: nextLevel,
    redeemedCodes,
    updatedAt: now,
  })

  return { ok: true, level: nextLevel }
}
