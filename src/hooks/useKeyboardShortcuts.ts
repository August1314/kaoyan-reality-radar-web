import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 全局键盘快捷键
 * - `/` 或 `Ctrl+K`: 聚焦搜索框
 * - `Escape`: 返回首页
 */
export function useKeyboardShortcuts({
  searchInputRef,
  onEscape,
}: {
  searchInputRef: React.RefObject<HTMLInputElement | null>
  onEscape?: () => void
}) {
  const navigate = useNavigate()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 忽略输入框内的按键（除了 Escape）
      const isInputFocused =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement

      // `/` 或 `Ctrl+K`: 聚焦搜索框
      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        if (isInputFocused && e.key === '/') return // 输入框内输入斜杠不拦截
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      // Escape: 返回首页或关闭弹层
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape()
        } else {
          // 如果当前在输入框，先失焦
          if (isInputFocused) {
            ;(document.activeElement as HTMLElement).blur()
            return
          }
          // 否则返回首页
          navigate('/')
        }
        return
      }
    },
    [searchInputRef, navigate, onEscape],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
