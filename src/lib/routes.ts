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
