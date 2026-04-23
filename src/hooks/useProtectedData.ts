import { useEffect, useReducer } from 'react'
import {
  fetchComparePrograms,
  fetchProgramBySlug,
  fetchStatsSummary,
} from '../lib/entitlement-api'
import type { EntitlementLevel } from '../lib/monetization'
import type { EntitlementStatus, Program, StatsSummary } from '../lib/types'

type AsyncState<T> = {
  data: T
  loading: boolean
  error: Error | null
}

type AsyncAction<T> =
  | { type: 'fetch_start' }
  | { type: 'fetch_success'; payload: T }
  | { type: 'fetch_error'; error: Error }

function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'fetch_start':
      return { ...state, loading: true, error: null }
    case 'fetch_success':
      return { data: action.payload, loading: false, error: null }
    case 'fetch_error':
      return { ...state, loading: false, error: action.error }
  }
}

interface ProgramAccessState {
  program: Program | null
  entitlement: EntitlementStatus | null
}

export function useProtectedProgram(slug: string, deviceId: string) {
  const [state, dispatch] = useReducer(asyncReducer<ProgramAccessState>, {
    data: { program: null, entitlement: null },
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchProgramBySlug(slug, deviceId)
      .then((data) => {
        if (!cancelled) {
          dispatch({
            type: 'fetch_success',
            payload: { program: data.program, entitlement: data.entitlement },
          })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          dispatch({
            type: 'fetch_error',
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deviceId, slug])

  return {
    program: state.data.program,
    entitlement: state.data.entitlement,
    loading: state.loading,
    error: state.error,
  }
}

interface CompareAccessState {
  programs: Program[]
  level: EntitlementLevel
  canExport: boolean
  canShare: boolean
}

export function useProtectedCompare(ids: string[], deviceId: string, enabled: boolean) {
  const [state, dispatch] = useReducer(asyncReducer<CompareAccessState>, {
    data: { programs: [], level: 'free', canExport: false, canShare: false },
    loading: enabled,
    error: null,
  })

  useEffect(() => {
    if (!enabled) {
      dispatch({
        type: 'fetch_success',
        payload: { programs: [], level: 'free', canExport: false, canShare: false },
      })
      return
    }

    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchComparePrograms(ids, deviceId)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', payload: data })
      })
      .catch((error) => {
        if (!cancelled) {
          dispatch({
            type: 'fetch_error',
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deviceId, enabled, ids])

  return {
    programs: state.data.programs,
    level: state.data.level,
    canExport: state.data.canExport,
    canShare: state.data.canShare,
    loading: state.loading,
    error: state.error,
  }
}

export function useProtectedStats(deviceId: string, enabled: boolean) {
  const [state, dispatch] = useReducer(asyncReducer<StatsSummary | null>, {
    data: null,
    loading: enabled,
    error: null,
  })

  useEffect(() => {
    if (!enabled) {
      dispatch({ type: 'fetch_success', payload: null })
      return
    }

    let cancelled = false
    dispatch({ type: 'fetch_start' })

    fetchStatsSummary(deviceId)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'fetch_success', payload: data.stats })
      })
      .catch((error) => {
        if (!cancelled) {
          dispatch({
            type: 'fetch_error',
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deviceId, enabled])

  return {
    stats: state.data,
    loading: state.loading,
    error: state.error,
  }
}
