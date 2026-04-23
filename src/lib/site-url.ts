export const DEFAULT_SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

export function normalizeSiteUrl(value?: string): string {
  const siteUrl = value?.trim() || DEFAULT_SITE_URL
  return siteUrl.replace(/\/+$/, '')
}

export function getSiteHostname(siteUrl = SITE_URL): string {
  try {
    return new URL(siteUrl).hostname
  } catch {
    return new URL(DEFAULT_SITE_URL).hostname
  }
}

/**
 * Vite 在构建时会注入 `import.meta.env.VITE_SITE_URL`。
 * 本地未配置时使用默认生产域名。
 */
export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL)

/**
 * OG Image URL（基于 SITE_URL）
 */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`
