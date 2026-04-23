import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const mirrorDir = path.join(rootDir, 'mirror-dist')

async function assertBuiltDist() {
  try {
    await readFile(path.join(distDir, 'index.html'), 'utf-8')
  } catch {
    throw new Error('缺少 dist/index.html。请先运行 npm run build，再准备静态镜像。')
  }
}

export async function prepareStaticMirror() {
  await assertBuiltDist()
  await rm(mirrorDir, { recursive: true, force: true })
  await mkdir(mirrorDir, { recursive: true })
  await cp(distDir, mirrorDir, { recursive: true, force: true })
  const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf-8')
  await writeFile(path.join(mirrorDir, '404.html'), indexHtml, 'utf-8')
  await writeFile(path.join(mirrorDir, '.nojekyll'), '', 'utf-8')

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: distDir,
    target: mirrorDir,
    note: '上传 mirror-dist/ 到香港或海外静态托管/Object Storage，用于改善中国大陆访问。404.html 用于 SPA history fallback。',
  }

  await writeFile(path.join(mirrorDir, 'mirror-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
  console.log(`Prepared static mirror at ${mirrorDir}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareStaticMirror().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
