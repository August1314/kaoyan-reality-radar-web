/**
 * Pure utilities shared between Vite runtime (site-url.ts) and Node scripts (generate-sitemap.ts).
 * No runtime-specific globals here — keep it environment-agnostic.
 */

export const DEFAULT_SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

export function normalizeSiteUrl(value?: string): string {
  const siteUrl = value?.trim() || DEFAULT_SITE_URL
  return siteUrl.replace(/\/+$/, '')
}
