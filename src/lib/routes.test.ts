import { describe, expect, it } from 'vitest'
import { appNavItems, resultSectionLinks, routeLinks, routePaths } from './routes'

describe('routes', () => {
  it('exposes stable static route paths', () => {
    expect(routePaths.home).toBe('/')
    expect(routePaths.stats).toBe('/stats')
    expect(routePaths.compare).toBe('/compare')
    expect(routePaths.submit).toBe('/submit')
  })

  it('encodes dynamic route params', () => {
    expect(routeLinks.result('中山大学-计算机科学与技术-2025')).toBe(
      '/result/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E4%B8%8E%E6%8A%80%E6%9C%AF-2025',
    )
    expect(routeLinks.failure('failure/1')).toBe('/failure/failure%2F1')
  })

  it('provides stable app navigation and result anchors', () => {
    expect(appNavItems.map((item) => item.label)).toEqual(['首页', '统计', '对比'])
    expect(resultSectionLinks.map((item) => item.id)).toEqual([
      'overview',
      'signals',
      'failures',
      'alternatives',
      'next-step',
    ])
  })
})
