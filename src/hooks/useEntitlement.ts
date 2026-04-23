import { useCallback, useEffect, useReducer } from 'react'
import {
  monetizationConfig,
  type EntitlementLevel,
} from '../lib/monetization'
import { getOrCreateDeviceId } from '../lib/device-id'
import { fetchEntitlementStatus, redeemUnlockCode } from '../lib/entitlement-api'
import type { EntitlementStatus } from '../lib/types'

function readStoredEntitlement(): EntitlementLevel {
  if (typeof window === 'undefined') return 'free'

  const stored = window.localStorage.getItem(monetizationConfig.storageKey)
  return stored === 'survey' || stored === 'paid' ? stored : 'free'
}

function createFallbackStatus(level: EntitlementLevel): EntitlementStatus {
  return {
    level,
    viewedTargetCount: 0,
    targetLimit: level === 'paid' ? null : level === 'survey' ? 8 : 2,
    statsUnlocked: level === 'paid',
    compareUnlocked: level === 'survey' || level === 'paid',
    shareCompareUnlocked: level === 'paid',
  }
}

export function useEntitlement() {
  const [state, dispatch] = useReducer(
    (
      current: { status: EntitlementStatus; deviceId: string; loading: boolean; error: string | null },
      action:
        | { type: 'status_start' }
        | { type: 'status_success'; status: EntitlementStatus }
        | { type: 'status_error'; error: string }
        | { type: 'sync_status'; status: EntitlementStatus },
    ) => {
      switch (action.type) {
        case 'status_start':
          return { ...current, loading: true, error: null }
        case 'status_success':
        case 'sync_status':
          return { ...current, status: action.status, loading: false, error: null }
        case 'status_error':
          return { ...current, loading: false, error: action.error }
      }
    },
    {
      status: createFallbackStatus(readStoredEntitlement()),
      deviceId: getOrCreateDeviceId(),
      loading: true,
      error: null,
    },
  )

  useEffect(() => {
    window.localStorage.setItem(monetizationConfig.storageKey, state.status.level)
  }, [state.status.level])

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'status_start' })

    fetchEntitlementStatus(state.deviceId)
      .then((status) => {
        if (!cancelled) dispatch({ type: 'status_success', status })
      })
      .catch((error) => {
        if (!cancelled) {
          dispatch({
            type: 'status_error',
            error: error instanceof Error ? error.message : String(error),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [state.deviceId])

  const refreshStatus = useCallback(async (): Promise<EntitlementStatus> => {
    const status = await fetchEntitlementStatus(state.deviceId)
    dispatch({ type: 'sync_status', status })
    return status
  }, [state.deviceId])

  const applyUnlockCode = useCallback(async (code: string): Promise<EntitlementLevel> => {
    await redeemUnlockCode(code, state.deviceId)
    const status = await refreshStatus()
    return status.level
  }, [refreshStatus, state.deviceId])

  const syncStatus = useCallback((status: EntitlementStatus) => {
    dispatch({ type: 'sync_status', status })
  }, [])

  return {
    level: state.status.level,
    status: state.status,
    deviceId: state.deviceId,
    loading: state.loading,
    error: state.error,
    applyUnlockCode,
    refreshStatus,
    syncStatus,
    isPaid: state.status.level === 'paid',
  }
}
