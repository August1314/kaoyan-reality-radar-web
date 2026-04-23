import type { EntitlementLevel } from './monetization'
import type {
  EntitlementStatus,
  FailureExperience,
  Program,
  StatsSummary,
} from './types'

type EntitlementStatusResponse = EntitlementStatus

interface RedeemResponse {
  level: EntitlementLevel
}

export interface FailureListResponse {
  failures: FailureExperience[]
  totalCount: number
  level: EntitlementLevel
}

interface FailureDetailResponse {
  failure: FailureExperience
  level: EntitlementLevel
}

interface ProgramResponse {
  program: Program
  entitlement: EntitlementStatus
}

interface CompareResponse {
  programs: Program[]
  level: EntitlementLevel
  canExport: boolean
  canShare: boolean
}

interface StatsResponse {
  level: EntitlementLevel
  stats: StatsSummary
}

export class EntitlementApiError extends Error {
  readonly code: string
  readonly status: number
  readonly details: unknown

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
  }
}

export class LockedFailureError extends Error {
  constructor() {
    super('locked_failure')
  }
}

function getApiBase(): string {
  return (import.meta.env.VITE_ENTITLEMENT_API_BASE ?? '').replace(/\/+$/, '')
}

function apiUrl(path: string): string {
  const base = getApiBase()
  return base ? `${base}${path}` : path
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const errorBody = body as { error?: string; message?: string }
    throw new EntitlementApiError(
      errorBody.message ?? errorBody.error ?? `请求失败：${response.status}`,
      errorBody.error ?? 'request_failed',
      response.status,
      body,
    )
  }

  return body as T
}

export async function fetchEntitlementStatus(deviceId: string): Promise<EntitlementStatus> {
  const response = await fetch(apiUrl(`/api/entitlements/status?deviceId=${encodeURIComponent(deviceId)}`))
  return readJson<EntitlementStatusResponse>(response)
}

export async function redeemUnlockCode(code: string, deviceId: string): Promise<EntitlementLevel> {
  const response = await fetch(apiUrl('/api/entitlements/redeem'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, deviceId }),
  })

  return readJson<RedeemResponse>(response).then((body) => body.level)
}

export async function fetchFailuresForProgram(
  programId: string,
  deviceId: string,
): Promise<FailureListResponse> {
  const response = await fetch(
    apiUrl(`/api/failures?programId=${encodeURIComponent(programId)}&deviceId=${encodeURIComponent(deviceId)}`),
  )
  return readJson<FailureListResponse>(response)
}

export async function fetchFailureDetail(id: string, deviceId: string): Promise<FailureExperience | null> {
  const response = await fetch(
    apiUrl(`/api/failures?id=${encodeURIComponent(id)}&deviceId=${encodeURIComponent(deviceId)}`),
  )

  if (response.status === 403) {
    throw new LockedFailureError()
  }

  if (response.status === 404) return null

  return readJson<FailureDetailResponse>(response).then((body) => body.failure)
}

export async function fetchProgramBySlug(
  slug: string,
  deviceId: string,
): Promise<ProgramResponse> {
  const response = await fetch(
    apiUrl(`/api/programs?slug=${encodeURIComponent(slug)}&deviceId=${encodeURIComponent(deviceId)}`),
  )
  return readJson<ProgramResponse>(response)
}

export async function fetchComparePrograms(
  ids: string[],
  deviceId: string,
): Promise<CompareResponse> {
  const response = await fetch(apiUrl('/api/compare'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, deviceId }),
  })
  return readJson<CompareResponse>(response)
}

export async function fetchStatsSummary(deviceId: string): Promise<StatsResponse> {
  const response = await fetch(apiUrl(`/api/stats?deviceId=${encodeURIComponent(deviceId)}`))
  return readJson<StatsResponse>(response)
}
