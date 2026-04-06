export const routePaths = {
  home: '/',
  result: '/result/:slug',
  failure: '/failure/:id',
  submit: '/submit',
} as const

export const routeLinks = {
  home: () => routePaths.home,
  result: (slug: string) => `/result/${encodeURIComponent(slug)}`,
  failure: (id: string) => `/failure/${encodeURIComponent(id)}`,
  submit: () => routePaths.submit,
} as const
