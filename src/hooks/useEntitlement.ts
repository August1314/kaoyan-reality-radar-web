import { useEffect, useState } from 'react'
import {
  chooseHigherEntitlement,
  monetizationConfig,
  resolveUnlockCode,
  type EntitlementLevel,
} from '../lib/monetization'

function readStoredEntitlement(): EntitlementLevel {
  if (typeof window === 'undefined') return 'free'

  const stored = window.localStorage.getItem(monetizationConfig.storageKey)
  return stored === 'survey' || stored === 'paid' ? stored : 'free'
}

export function useEntitlement() {
  const [level, setLevel] = useState<EntitlementLevel>(readStoredEntitlement)

  useEffect(() => {
    window.localStorage.setItem(monetizationConfig.storageKey, level)
  }, [level])

  function applyUnlockCode(code: string): EntitlementLevel | null {
    const resolved = resolveUnlockCode(code)
    if (!resolved) return null

    const nextLevel = chooseHigherEntitlement(level, resolved)
    setLevel(nextLevel)
    return nextLevel
  }

  return {
    level,
    applyUnlockCode,
    isPaid: level === 'paid',
  }
}
