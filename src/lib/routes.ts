export const routePaths = {
  home: '/',
  result: '/result/:slug',
  failure: '/failure/:id',
  submit: '/submit',
  stats: '/stats',
  compare: '/compare',
} as const

export const routeLinks = {
  home: () => routePaths.home,
  result: (slug: string) => `/result/${encodeURIComponent(slug)}`,
  failure: (id: string) => `/failure/${encodeURIComponent(id)}`,
  submit: () => routePaths.submit,
  stats: () => routePaths.stats,
  compare: () => routePaths.compare,
} as const

export interface AppNavItem {
  label: string
  to: string
  end?: boolean
}

export type ResultSectionId = 'overview' | 'signals' | 'failures' | 'alternatives' | 'next-step'

export interface ResultSectionLink {
  id: ResultSectionId
  label: string
}

export const appNavItems: AppNavItem[] = [
  { label: '首页', to: routeLinks.home(), end: true },
  { label: '统计', to: routeLinks.stats() },
  { label: '对比', to: routeLinks.compare() },
]

export const resultSectionLinks: ResultSectionLink[] = [
  { id: 'overview', label: '概览' },
  { id: 'signals', label: '风险信号' },
  { id: 'failures', label: '失败经验' },
  { id: 'alternatives', label: '同校参考' },
  { id: 'next-step', label: '下一步' },
]
