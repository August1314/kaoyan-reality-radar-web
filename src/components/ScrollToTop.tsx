import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 每次路由切换时强制将页面滚动到顶部。
 * 解决 React Router 默认保留上一页滚动位置的问题。
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
