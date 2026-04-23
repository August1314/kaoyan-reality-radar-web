import { useEffect, useReducer } from 'react'
import {
  monetizationConfig,
  type EntitlementLevel,
} from '../lib/monetization'
import { getOrCreateDeviceId } from '../lib/device-id'
import { fetchEntitlementStatus, redeemUnlockCode } from '../lib/entitlement-api'

function readStoredEntitlement(): EntitlementLevel {
  if (typeof window === 'undefined') return 'free'

  const stored = window.localStorage.getItem(monetizationConfig.storageKey)
  return stored === 'survey' || stored === 'paid' ? stored : 'free'
}

export function useEntitlement() {
  const [state, dispatch] = useReducer(
    (
      current: { level: EntitlementLevel; deviceId: string; loading: boolean; error: string | null },
      action:
        | { type: 'status_start' }
        | { type: 'status_success'; level: EntitlementLevel }
        | { type: 'status_error'; error: string }
        | { type: 'redeem_success'; level: EntitlementLevel },
    ) => {
      switch (action.type) {
        case 'status_start':
          return { ...current, loading: true, error: null }
        case 'status_success':
        case 'redeem_success':
          return { ...current, level: action.level, loading: false, error: null }
        case 'status_error':
          return { ...current, loading: false, error: action.error }
      }
    },
    {
      level: readStoredEntitlement(),
      deviceId: getOrCreateDeviceId(),
      loading: true,
      error: null,
    },
  )

  useEffect(() => {
    window.localStorage.setItem(monetizationConfig.storageKey, state.level)
  }, [state.level])

  useEffect(() => {
    let cancelled = false
    dispatch({ type: 'status_start' })

    fetchEntitlementStatus(state.deviceId)
      .then((level) => {
        if (!cancelled) dispatch({ type: 'status_success', level })
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

  async function applyUnlockCode(code: string): Promise<EntitlementLevel> {
    const level = await redeemUnlockCode(code, state.deviceId)
    dispatch({ type: 'redeem_success', level })
    return level
  }

  return {
    level: state.level,
    deviceId: state.deviceId,
    loading: state.loading,
    error: state.error,
    applyUnlockCode,
    isPaid: state.level === 'paid',
  }
}
