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

type FailuresCache = Map<string, Promise<FailureExperience[]>>

// In-memory cache: keyed by programId to deduplicate concurrent fetches
const failuresCache: FailuresCache = new Map()

/**
 * Fetch failures for a specific programId from the static JSON file.
 * Returns a cached promise to avoid duplicate requests.
 */
export function fetchFailuresByProgramId(programId: string): Promise<FailureExperience[]> {
  // Check cache first
  if (failuresCache.has(programId)) {
    return failuresCache.get(programId)!
  }

  const promise = (async () => {
    const url = '/data/failures.json'
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch failures: ${response.status}`)
    }
    const all: FailureExperience[] = await response.json()
    return all.filter((item) => item.programId === programId)
  })()

  failuresCache.set(programId, promise)
  return promise
}

/**
 * Fetch a single failure by id from the static JSON file.
 */
export function fetchFailureById(id: string): Promise<FailureExperience | null> {
  const url = '/data/failures.json'
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to fetch failures: ${response.status}`)
      return response.json() as Promise<FailureExperience[]>
    })
    .then((all) => all.find((item) => item.id === id) ?? null)
}

/**
 * Fetch related failures (same programId, excluding current id).
 */
export function fetchRelatedFailures(
  programId: string,
  currentId?: string,
): Promise<FailureExperience[]> {
  return fetchFailuresByProgramId(programId).then((items) =>
    items.filter((item) => item.id !== currentId),
  )
}
