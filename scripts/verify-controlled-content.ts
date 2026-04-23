import { access, readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const buildDirs = ['dist', 'mirror-dist'].map((dir) => path.join(rootDir, dir))
const forbiddenFiles = [
  path.join(rootDir, 'public/data/failures.json'),
  path.join(rootDir, 'dist/data/failures.json'),
  path.join(rootDir, 'mirror-dist/data/failures.json'),
]
const forbiddenTextPatterns = [
  { label: '旧问卷固定码 YAN2026', pattern: /YAN2026/ },
  { label: '旧完整权益固定码 RADAR99', pattern: /RADAR99/ },
  { label: '旧公开失败经验入口 /data/failures.json', pattern: /\/data\/failures\.json/ },
  { label: '完整失败经验 JSON review 字段', pattern: /"review"\s*:/ },
]

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function collectFiles(dir: string): Promise<string[]> {
  if (!(await pathExists(dir))) return []

  const entries = await readdir(dir)
  const files: string[] = []

  for (const entry of entries) {
    const filePath = path.join(dir, entry)
    const info = await stat(filePath)

    if (info.isDirectory()) {
      files.push(...await collectFiles(filePath))
      continue
    }

    files.push(filePath)
  }

  return files
}

async function assertForbiddenFilesAbsent() {
  const existing = []

  for (const filePath of forbiddenFiles) {
    if (await pathExists(filePath)) existing.push(path.relative(rootDir, filePath))
  }

  if (existing.length > 0) {
    throw new Error(`受控内容文件不应公开存在：${existing.join(', ')}`)
  }
}

async function assertBuiltFilesClean() {
  const files = (await Promise.all(buildDirs.map(collectFiles))).flat()
  const textFiles = files.filter((filePath) => /\.(html|js|json|txt|xml|css)$/.test(filePath))
  const violations: string[] = []

  for (const filePath of textFiles) {
    const content = await readFile(filePath, 'utf-8')

    for (const { label, pattern } of forbiddenTextPatterns) {
      if (pattern.test(content)) {
        violations.push(`${path.relative(rootDir, filePath)}: ${label}`)
      }
    }
  }

  if (violations.length > 0) {
    throw new Error(`构建产物包含受控内容泄漏：\n${violations.join('\n')}`)
  }
}

export async function main() {
  await assertForbiddenFilesAbsent()
  await assertBuiltFilesClean()
  console.log('受控内容检查通过：未发现固定码、旧静态入口或完整失败经验 JSON。')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
