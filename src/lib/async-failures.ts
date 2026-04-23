/**
 * Async failures service for Phase 6 - loads failures on demand.
 * 
 * Previously: all failures (237KB) were bundled with programSlug chunk,
 * loading at page initialization even when user never viewed failures.
 * 
 * Now: failures are fetched asynchronously when needed (lazy load),
 * only after user navigates to a result page or failures section.
 */

import type { FailureExperience } from './types'
import {
  fetchFailureDetail,
  fetchFailuresForProgram,
  type FailureListResponse,
} from './entitlement-api'
import type { EntitlementLevel } from './monetization'

type FailuresCache = Map<string, Promise<FailureListResponse>>

// In-memory cache: keyed by programId + deviceId + level to deduplicate concurrent fetches.
const failuresCache: FailuresCache = new Map()

/**
 * Fetch failures for a specific programId from the static JSON file.
 * Returns a cached promise to avoid duplicate requests.
 */
export function fetchFailuresByProgramId(
  programId: string,
  deviceId: string,
  level: EntitlementLevel,
): Promise<FailureListResponse> {
  if (!programId) {
    return Promise.resolve({ failures: [], totalCount: 0, level })
  }

  const cacheKey = `${programId}:${deviceId}:${level}`

  // Check cache first
  if (failuresCache.has(cacheKey)) {
    return failuresCache.get(cacheKey)!
  }

  const promise = fetchFailuresForProgram(programId, deviceId)

  failuresCache.set(cacheKey, promise)
  return promise
}

/**
 * Fetch a single failure by id from the static JSON file.
 */
export function fetchFailureById(id: string, deviceId: string): Promise<FailureExperience | null> {
  return fetchFailureDetail(id, deviceId)
}

/**
 * Fetch related failures (same programId, excluding current id).
 */
export function fetchRelatedFailures(
  programId: string,
  deviceId: string,
  level: EntitlementLevel,
  currentId?: string,
): Promise<FailureExperience[]> {
  return fetchFailuresByProgramId(programId, deviceId, level).then(({ failures }) =>
    failures.filter((item) => item.id !== currentId),
  )
}
