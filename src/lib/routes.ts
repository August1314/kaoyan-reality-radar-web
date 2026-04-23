export const routePaths = {
  home: '/',
  result: '/result/:slug',
  failure: '/failure/:id',
  submit: '/submit',
  unlock: '/unlock',
  pay: '/pay',
  stats: '/stats',
  compare: '/compare',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  contact: '/contact',
} as const

export const routeLinks = {
  home: () => routePaths.home,
  result: (slug: string) => `/result/${encodeURIComponent(slug)}`,
  failure: (id: string) => `/failure/${encodeURIComponent(id)}`,
  submit: () => routePaths.submit,
  unlock: () => routePaths.unlock,
  pay: () => routePaths.pay,
  stats: () => routePaths.stats,
  compare: () => routePaths.compare,
  privacy: () => routePaths.privacy,
  terms: () => routePaths.terms,
  disclaimer: () => routePaths.disclaimer,
  contact: () => routePaths.contact,
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
  { label: '解锁', to: routeLinks.unlock() },
]

export const resultSectionLinks: ResultSectionLink[] = [
  { id: 'overview', label: '概览' },
  { id: 'signals', label: '风险信号' },
  { id: 'failures', label: '失败经验' },
  { id: 'alternatives', label: '同校参考' },
  { id: 'next-step', label: '下一步' },
]
