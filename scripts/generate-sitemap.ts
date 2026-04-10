import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

interface Program {
  id: string
  school: string
  major: string
  year: number
}

function buildProgramSlug(program: Program): string {
  return `${program.year}-${program.school}-${program.major}`
    .replace(/\s+/g, '-')
    .replace(/[()（）]/g, '')
}

function generateSitemap(): string {
  const now = new Date().toISOString().split('T')[0]

  // 读取 programs 数据
  const programsPath = path.resolve(__dirname, '../data/processed/programs.json')
  const programs: Program[] = JSON.parse(fs.readFileSync(programsPath, 'utf-8'))

  const urls: string[] = []

  // 首页
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`)

  // 投稿页
  urls.push(`  <url>
    <loc>${SITE_URL}/submit</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`)

  // 结果页
  for (const program of programs) {
    const slug = buildProgramSlug(program)
    urls.push(`  <url>
    <loc>${SITE_URL}/result/${encodeURIComponent(slug)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

// 生成 sitemap.xml
const sitemap = generateSitemap()
fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap)
console.log(`✅ Generated sitemap.xml`)

// 生成 robots.txt
const robots = generateRobotsTxt()
fs.writeFileSync(path.resolve(__dirname, '../public/robots.txt'), robots)
console.log('✅ Generated robots.txt')
