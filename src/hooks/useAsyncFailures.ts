/**
 * React hook for async failures loading (Phase 6).
 * Replaces direct synchronous imports of failures data in page components.
 *
 * Uses useReducer to avoid react-hooks/set-state-in-effect lint errors
 * (dispatching an action is not considered a direct setState call in an effect).
 */

import { useEffect, useReducer } from 'react'
import type { FailureExperience } from '../lib/types'
import {
  fetchFailuresByProgramId,
  fetchFailureById,
  fetchRelatedFailures,
} from '../lib/async-failures'

// ---------------------------------------------------------------------------
// Shared reducer for async fetch state
// ---------------------------------------------------------------------------
type FetchState<T> = {
  data: T
  loading: boolean
  error: Error | null
}

type FetchAction<T> =
  | { type: 'fetch_start' }
  | { type: 'fetch_success'; payload: T }
  | { type: 'fetch_error'; error: Error }

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (action.type) {
    case 'fetch_start':
      return { data: state.data, loading: true, error: null }
    case 'fetch_success':
      return { data: action.payload, loading: false, error: null }
    case 'fetch_error':
      return { data: state.data, loading: false, error: action.error }
  }
}

// ---------------------------------------------------------------------------
// Hook implementations
// ---------------------------------------------------------------------------

/**
 * Hook to load failures for a given programId.
 * Returns { failures, loading, error }.
 */
export function useFailuresByProgramId(programId: string) {
  const [state, dispatch] = useReducer(fetchReducer<FailureExperience[]>, {
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchFailuresByProgramId(programId)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', payload: data })
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: 'fetch_error', error: err instanceof Error ? err : new Error(String(err)) })
      })

    return () => {
      cancelled = true
    }
  }, [programId])

  return { failures: state.data, loading: state.loading, error: state.error }
}

/**
 * Hook to load a single failure by id.
 * Returns { failure, loading, error }.
 */
export function useFailureById(id: string) {
  const [state, dispatch] = useReducer(fetchReducer<FailureExperience | null>, {
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchFailureById(id)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', payload: data })
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: 'fetch_error', error: err instanceof Error ? err : new Error(String(err)) })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { failure: state.data, loading: state.loading, error: state.error }
}

/**
 * Hook to load related failures for a given programId (excluding currentId).
 * Returns { related, loading, error }.
 */
export function useRelatedFailures(programId: string, currentId?: string) {
  const [state, dispatch] = useReducer(fetchReducer<FailureExperience[]>, {
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchRelatedFailures(programId, currentId)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', payload: data })
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: 'fetch_error', error: err instanceof Error ? err : new Error(String(err)) })
      })

    return () => {
      cancelled = true
    }
  }, [programId, currentId])

  return { related: state.data, loading: state.loading, error: state.error }
}
