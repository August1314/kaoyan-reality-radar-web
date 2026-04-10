import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
}

const DEFAULT_TITLE = '考研现实雷达 - 查难度，看失败路径'
const DEFAULT_DESCRIPTION = '考研择校现实判断工具。查看目标院校专业的真实难度、报录比、分数线和失败经验，避免只看上岸叙事。'
const DEFAULT_KEYWORDS = '考研,择校,难度,报录比,分数线,失败经验,考研现实雷达'
const DEFAULT_OG_IMAGE = 'https://kaoyan-reality-radar-web.vercel.app/og-image.png'
const SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

function updateMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

function updateProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.content = content
}

function updateLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

export function useSEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  canonicalUrl,
}: SEOProps = {}) {
  useEffect(() => {
    // Title
    const fullTitle = title ? `${title} - 考研现实雷达` : DEFAULT_TITLE
    document.title = fullTitle

    // Meta
    updateMeta('description', description ?? DEFAULT_DESCRIPTION)
    updateMeta('keywords', keywords ?? DEFAULT_KEYWORDS)

    // Open Graph
    updateProperty('og:title', ogTitle ?? fullTitle)
    updateProperty('og:description', ogDescription ?? description ?? DEFAULT_DESCRIPTION)
    updateProperty('og:image', ogImage ?? DEFAULT_OG_IMAGE)
    if (canonicalUrl) {
      updateProperty('og:url', canonicalUrl)
      updateLink('canonical', canonicalUrl)
    }

    // Twitter
    updateMeta('twitter:title', ogTitle ?? fullTitle)
    updateMeta('twitter:description', ogDescription ?? description ?? DEFAULT_DESCRIPTION)
    updateMeta('twitter:image', ogImage ?? DEFAULT_OG_IMAGE)

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = DEFAULT_TITLE
      updateMeta('description', DEFAULT_DESCRIPTION)
      updateMeta('keywords', DEFAULT_KEYWORDS)
      updateProperty('og:title', DEFAULT_TITLE)
      updateProperty('og:description', DEFAULT_DESCRIPTION)
      updateProperty('og:image', DEFAULT_OG_IMAGE)
      updateProperty('og:url', SITE_URL)
      updateMeta('twitter:title', DEFAULT_TITLE)
      updateMeta('twitter:description', DEFAULT_DESCRIPTION)
      updateMeta('twitter:image', DEFAULT_OG_IMAGE)
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonicalUrl])
}

/**
 * 结果页 SEO Hook
 */
export function useResultPageSEO(program: {
  school: string
  major: string
  year: number
  summary: string
}) {
  // 空值时不更新 SEO
  const isValid = program.school && program.major

  const title = isValid ? `${program.school} · ${program.major}` : undefined
  const description = isValid
    ? `${program.school}${program.major}考研难度分析。${program.summary}。基于${program.year}年官方数据整理，查看报录比、分数线和真实失败经验。`
    : undefined
  const keywords = isValid
    ? `${program.school},${program.major},考研,难度,报录比,分数线,失败经验`
    : undefined
  const canonicalUrl = isValid
    ? `${SITE_URL}/result/${program.year}-${program.school}-${program.major}`
    : undefined

  useSEO({
    title,
    description,
    keywords,
    ogTitle: title ? `${title} - 考研现实雷达` : undefined,
    ogDescription: description,
    canonicalUrl,
  })
}
