/**
 * React hook for async failures loading (Phase 6).
 * Replaces direct synchronous imports of failures data in page components.
 */

import { useEffect, useState } from 'react'
import type { FailureExperience } from '../lib/types'
import {
  fetchFailuresByProgramId,
  fetchFailureById,
  fetchRelatedFailures,
} from '../lib/async-failures'

/**
 * Hook to load failures for a given programId.
 * Returns { failures, loading, error }.
 */
export function useFailuresByProgramId(programId: string) {
  const [failures, setFailures] = useState<FailureExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFailuresByProgramId(programId)
      .then((data) => {
        if (!cancelled) {
          setFailures(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [programId])

  return { failures, loading, error }
}

/**
 * Hook to load a single failure by id.
 * Returns { failure, loading, error }.
 */
export function useFailureById(id: string) {
  const [failure, setFailure] = useState<FailureExperience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchFailureById(id)
      .then((data) => {
        if (!cancelled) {
          setFailure(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { failure, loading, error }
}

/**
 * Hook to load related failures for a given programId (excluding currentId).
 * Returns { related, loading, error }.
 */
export function useRelatedFailures(programId: string, currentId?: string) {
  const [related, setRelated] = useState<FailureExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRelatedFailures(programId, currentId)
      .then((data) => {
        if (!cancelled) {
          setRelated(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [programId, currentId])

  return { related, loading, error }
}
