import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { buildProgramSlug } from '../src/lib/programSlug.ts'
import { DEFAULT_SITE_URL, normalizeSiteUrl } from '../src/lib/site-url-shared.ts'

export { DEFAULT_SITE_URL, normalizeSiteUrl }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

function parseEnvValue(content: string, key: string): string | undefined {
  const line = content
    .split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${key}=`))

  if (!line) return undefined

  return line
    .slice(key.length + 1)
    .trim()
    .replace(/^['"]|['"]$/g, '')
}

function readSiteUrlFromEnvFiles(): string | undefined {
  for (const fileName of ['.env.local', '.env.production', '.env']) {
    const envPath = path.resolve(rootDir, fileName)
    if (!fs.existsSync(envPath)) continue

    const value = parseEnvValue(fs.readFileSync(envPath, 'utf-8'), 'VITE_SITE_URL')
    if (value) return value
  }

  return undefined
}

const SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL ?? readSiteUrlFromEnvFiles())

export interface Program {
  id: string
  school: string
  major: string
  year: number
}
function readPrograms(): Program[] {
  const programsPath = path.resolve(rootDir, 'data/processed/programs.json')
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

  // 解锁页
  urls.push(`  <url>
    <loc>${SITE_URL}/unlock</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`)

  // 统计页
  urls.push(`  <url>
    <loc>${SITE_URL}/stats</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)

  // 对比页
  urls.push(`  <url>
    <loc>${SITE_URL}/compare</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
  fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')

  const robots = generateRobotsTxt()
  fs.writeFileSync(path.resolve(rootDir, 'public/robots.txt'), robots)
  console.log('✅ Generated robots.txt')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
