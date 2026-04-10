import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY = 'kaoyan-scroll-position'
const SAVE_DELAY = 100

/**
 * 记住首页滚动位置
 * 从结果页返回首页时恢复位置
 */
export function useScrollRestoration() {
  const location = useLocation()
  const isRestoring = useRef(false)

  // 保存首页滚动位置
  useEffect(() => {
    if (location.pathname !== '/') return

    const savePosition = () => {
      if (isRestoring.current) {
        isRestoring.current = false
        return
      }
      const y = window.scrollY
      if (y > 0) {
        sessionStorage.setItem(STORAGE_KEY, String(y))
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }

    // 延迟保存，避免与恢复冲突
    const timer = setTimeout(savePosition, SAVE_DELAY)
    return () => clearTimeout(timer)
  }, [location.pathname])

  // 返回首页时恢复位置
  useEffect(() => {
    if (location.pathname !== '/') return

    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const y = parseInt(saved, 10)
      if (y > 0) {
        isRestoring.current = true
        // 延迟恢复，等待页面渲染
        setTimeout(() => {
          window.scrollTo(0, y)
        }, 0)
      }
    }
  }, [location.pathname])
}
