import { useRef, useEffect } from 'react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

/**
 * 全局键盘快捷键监听器
 * 挂载在 App 顶层，监听全局按键事件
 */
export function GlobalShortcuts() {
  // 创建一个隐藏的 ref，用于存储搜索框的引用
  // 实际搜索框会通过 window.__searchInputRef 暴露
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // 监听搜索框注册事件
    const handleRegister = (e: CustomEvent<HTMLInputElement>) => {
      searchInputRef.current = e.detail
    }
    window.addEventListener('registerSearchInput', handleRegister as EventListener)
    return () => {
      window.removeEventListener('registerSearchInput', handleRegister as EventListener)
    }
  }, [])

  useKeyboardShortcuts({
    searchInputRef,
  })

  return null
}

// 类型扩展
declare global {
  interface WindowEventMap {
    registerSearchInput: CustomEvent<HTMLInputElement>
  }
}
