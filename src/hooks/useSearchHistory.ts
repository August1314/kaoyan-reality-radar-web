import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kaoyan-search-history'
const MAX_HISTORY = 10

export interface SearchHistoryItem {
  /** 唯一标识：program.id */
  id: string
  /** 显示名称：学校 · 专业 */
  label: string
  /** 跳转 slug */
  slug: string
  /** 时间戳 */
  timestamp: number
}

function loadHistory(): SearchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SearchHistoryItem[]
    // 按时间倒序
    return parsed.sort((a, b) => b.timestamp - a.timestamp)
  } catch {
    return []
  }
}

function saveHistory(items: SearchHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // localStorage 满了或不可用，静默失败
  }
}

export function useSearchHistory() {
  // 使用 lazy initialization，避免 useEffect 中 setState
  const [history, setHistory] = useState<SearchHistoryItem[]>(loadHistory)

  /** 添加搜索历史 */
  const addHistory = useCallback((item: Omit<SearchHistoryItem, 'timestamp'>) => {
    setHistory((prev) => {
      // 去重：已存在则移除旧的
      const filtered = prev.filter((h) => h.id !== item.id)
      // 新项放最前
      const newItem: SearchHistoryItem = { ...item, timestamp: Date.now() }
      // 最多保留 MAX_HISTORY 条
      const next = [newItem, ...filtered].slice(0, MAX_HISTORY)
      saveHistory(next)
      return next
    })
  }, [])

  /** 清除所有历史 */
  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  /** 删除单条历史 */
  const removeHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id)
      saveHistory(next)
      return next
    })
  }, [])

  return {
    history,
    addHistory,
    clearHistory,
    removeHistory,
  }
}
