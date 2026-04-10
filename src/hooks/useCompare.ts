import { useState, useCallback } from 'react'

const STORAGE_KEY = 'compare_programs'
const MAX_COMPARE = 3

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}
function save(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>(load)

  const toggle = useCallback((id: string) => {
    setCompareIds(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_COMPARE ? [...prev, id] : prev
      save(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setCompareIds([])
    save([])
  }, [])

  return { compareIds, toggle, clear, isCompare: (id: string) => compareIds.includes(id) }
}
