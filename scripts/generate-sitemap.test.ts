import { describe, expect, it } from 'vitest'
import { generateRobotsTxt, generateSitemap, type Program } from './generate-sitemap'

describe('generate-sitemap', () => {
  const samplePrograms: Program[] = [
    {
      id: 'p-1',
      school: '中山大学',
      major: '计算机科学与技术',
      year: 2025,
    },
  ]

  it('generates result urls with the same slug convention as runtime routes', () => {
    const sitemap = generateSitemap(samplePrograms, '2026-04-12')

    expect(sitemap).toContain(
      'https://kaoyan-reality-radar-web.vercel.app/result/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E4%B8%8E%E6%8A%80%E6%9C%AF-2025',
    )
    expect(sitemap).not.toContain(
      'https://kaoyan-reality-radar-web.vercel.app/result/2025-%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E4%B8%8E%E6%8A%80%E6%9C%AF',
    )
    expect(sitemap).toContain('<lastmod>2026-04-12</lastmod>')
  })

  it('generates robots.txt with sitemap pointer', () => {
    expect(generateRobotsTxt()).toContain('Sitemap: https://kaoyan-reality-radar-web.vercel.app/sitemap.xml')
  })
})
