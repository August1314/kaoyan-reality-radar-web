import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { buildProgramSlug } from '../src/lib/programSlug.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://kaoyan-reality-radar-web.vercel.app'

export interface Program {
  id: string
  school: string
  major: string
  year: number
}
function readPrograms(): Program[] {
  const programsPath = path.resolve(__dirname, '../data/processed/programs.json')
  return JSON.parse(fs.readFileSync(programsPath, 'utf-8')) as Program[]
}

export function generateSitemap(programs: Program[], now = new Date().toISOString().split('T')[0]): string {

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

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

export function main() {
  const sitemap = generateSitemap(readPrograms())
  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')

  const robots = generateRobotsTxt()
  fs.writeFileSync(path.resolve(__dirname, '../public/robots.txt'), robots)
  console.log('✅ Generated robots.txt')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
