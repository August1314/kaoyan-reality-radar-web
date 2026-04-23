export type EntitlementLevel = 'free' | 'survey' | 'paid'

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
  viewedProgramIds: string[]
  updatedAt: string
}

export interface EntitlementStore {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
}

export type RedeemResult =
  | { ok: true; level: EntitlementLevel }
  | { ok: false; status: number; error: string; message: string }

export interface EntitlementStatusPayload {
  level: EntitlementLevel
  viewedTargetCount: number
  targetLimit: number | null
  statsUnlocked: boolean
  compareUnlocked: boolean
  shareCompareUnlocked: boolean
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

export function isEntitlementLevel(value: string): value is EntitlementLevel {
  return value === 'survey' || value === 'paid'
}

function chooseHigherEntitlement(current: EntitlementLevel, next: EntitlementLevel): EntitlementLevel {
  const rank: Record<EntitlementLevel, number> = {
    free: 0,
    survey: 1,
    paid: 2,
  }

  return rank[next] > rank[current] ? next : current
}

export function codeKey(code: string): string {
  return `code:${normalizeCode(code)}`
}

export function deviceKey(deviceId: string): string {
  return `device:${deviceId}`
}

export function getTargetLimit(level: EntitlementLevel): number {
  if (level === 'paid') return Number.POSITIVE_INFINITY
  if (level === 'survey') return 8
  return 2
}

export function canAccessStats(level: EntitlementLevel): boolean {
  return level === 'paid'
}

export function canAccessCompare(level: EntitlementLevel): boolean {
  return level === 'survey' || level === 'paid'
}

export function canShareCompare(level: EntitlementLevel): boolean {
  return level === 'paid'
}

export function normalizeDeviceRecord(device: DeviceRecord | null | undefined): DeviceRecord {
  return {
    level: device?.level ?? 'free',
    redeemedCodes: device?.redeemedCodes ?? [],
    viewedProgramIds: device?.viewedProgramIds ?? [],
    updatedAt: device?.updatedAt ?? '',
  }
}

export function canAccessProgram(device: DeviceRecord, programId: string): boolean {
  if (device.level === 'paid') return true
  if (device.viewedProgramIds.includes(programId)) return true
  return device.viewedProgramIds.length < getTargetLimit(device.level)
}

export function recordViewedProgram(
  device: DeviceRecord,
  programId: string,
  now = new Date().toISOString(),
): DeviceRecord {
  if (device.viewedProgramIds.includes(programId)) {
    return {
      ...device,
      updatedAt: now,
    }
  }

  return {
    ...device,
    viewedProgramIds: [...device.viewedProgramIds, programId],
    updatedAt: now,
  }
}

function serializeTargetLimit(level: EntitlementLevel): number | null {
  const limit = getTargetLimit(level)
  return Number.isFinite(limit) ? limit : null
}

export function toEntitlementStatusPayload(device: DeviceRecord): EntitlementStatusPayload {
  return {
    level: device.level,
    viewedTargetCount: device.viewedProgramIds.length,
    targetLimit: serializeTargetLimit(device.level),
    statsUnlocked: canAccessStats(device.level),
    compareUnlocked: canAccessCompare(device.level),
    shareCompareUnlocked: canShareCompare(device.level),
  }
}

export async function getDeviceRecord(store: EntitlementStore, deviceId: string): Promise<DeviceRecord> {
  if (!deviceId) {
    return normalizeDeviceRecord(null)
  }

  const device = await store.get<DeviceRecord>(deviceKey(deviceId))
  return normalizeDeviceRecord(device)
}

export async function getEntitlementStatus(
  store: EntitlementStore,
  deviceId: string,
): Promise<EntitlementStatusPayload> {
  const device = await getDeviceRecord(store, deviceId)
  return toEntitlementStatusPayload(device)
}

export async function getDeviceLevel(store: EntitlementStore, deviceId: string): Promise<EntitlementLevel> {
  const device = await getDeviceRecord(store, deviceId)
  return device.level
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

  const currentDevice = normalizeDeviceRecord(await store.get<DeviceRecord>(deviceKey(deviceId)))
  const nextLevel = chooseHigherEntitlement(currentDevice.level, codeRecord.level)
  const redeemedCodes = Array.from(new Set([...currentDevice.redeemedCodes, code]))

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
    viewedProgramIds: currentDevice.viewedProgramIds,
    updatedAt: now,
  })

  return { ok: true, level: nextLevel }
}
