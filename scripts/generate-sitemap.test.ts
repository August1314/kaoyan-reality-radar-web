import { describe, expect, it } from 'vitest'
import {
  generateRobotsTxt,
  generateSitemap,
  normalizeSiteUrl,
  type Program,
} from './generate-sitemap'

const TEST_SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL)

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
      `${TEST_SITE_URL}/result/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E4%B8%8E%E6%8A%80%E6%9C%AF-2025`,
    )
    expect(sitemap).toContain(`${TEST_SITE_URL}/unlock`)
    expect(sitemap).toContain(`${TEST_SITE_URL}/privacy`)
    expect(sitemap).toContain(`${TEST_SITE_URL}/terms`)
    expect(sitemap).toContain(`${TEST_SITE_URL}/disclaimer`)
    expect(sitemap).toContain(`${TEST_SITE_URL}/contact`)
    expect(sitemap).not.toContain(
      `${TEST_SITE_URL}/result/2025-%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6-%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E4%B8%8E%E6%8A%80%E6%9C%AF`,
    )
    expect(sitemap).toContain('<lastmod>2026-04-12</lastmod>')
  })

  it('generates robots.txt with sitemap pointer', () => {
    expect(generateRobotsTxt()).toContain(`Sitemap: ${TEST_SITE_URL}/sitemap.xml`)
  })

  it('normalizes custom site url before emitting canonical links', () => {
    expect(normalizeSiteUrl('https://example.com///')).toBe('https://example.com')
    expect(normalizeSiteUrl('  https://radar.example.com/path/  ')).toBe('https://radar.example.com/path')
  })
})
