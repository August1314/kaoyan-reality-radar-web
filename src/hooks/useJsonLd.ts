import { useEffect } from 'react'
import type { Program } from '../lib/types'
import { buildProgramSlug } from '../lib/programSlug'

const SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

/**
 * 注入 JSON-LD 结构化数据到页面 head
 * 用于 SEO，帮助搜索引擎理解页面内容
 */
export function useJsonLd(program: Program | null) {
  useEffect(() => {
    if (!program) return

    // 构建 JSON-LD 数据
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: `${program.school} ${program.major} 考研`,
      description: program.summary,
      provider: {
        '@type': 'Organization',
        name: program.school,
      },
      educationalLevel: '研究生',
      year: program.year,
      url: `${SITE_URL}/result/${encodeURIComponent(buildProgramSlug(program))}`,
      // 扩展字段：录取数据
      aggregateRating: program.admitted
        ? {
            '@type': 'AggregateRating',
            ratingValue: program.retestLine,
            bestRating: 500,
            worstRating: 0,
            ratingCount: program.admitted,
          }
        : undefined,
    }

    // 创建或更新 script 标签
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)

    // 清理
    return () => {
      script.textContent = ''
    }
  }, [program])
}
