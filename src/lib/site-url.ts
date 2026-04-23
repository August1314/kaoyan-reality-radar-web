import { DEFAULT_SITE_URL, normalizeSiteUrl } from './site-url-shared'

export { DEFAULT_SITE_URL, normalizeSiteUrl }

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
