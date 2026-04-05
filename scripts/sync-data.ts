import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type RiskTag = '报录比高压' | '复试刷人明显' | '分数线抬升' | '调剂机会少' | '信息不透明' | '同分段分化明显'
type FailureStage = '初试前' | '初试后' | '复试前' | '复试中' | '调剂阶段'
type FinalResult = '未过初试' | '进入复试但未录取' | '调剂失败' | '放弃复试' | '二战中'
type Attempt = '一战' | '二战' | '未知'
type RecordStatus = 'todo' | 'draft' | 'verified'

interface RawProgram {
  id: string
  school: string
  major: string
  year: number
  applicants: number | null
  admitted: number | null
  retestCount: number | null
  retestLine: number | null
  lowestAdmittedScore: number | null
  riskTags: RiskTag[]
  summary: string
  sourceNote: string
  status?: RecordStatus
}

interface RawFailure {
  id: string
  programId: string
  school: string
  major: string
  year: number
  attempt: Attempt
  scoreRange: string
  enteredRetest: boolean
  finalResult: FinalResult
  failureStage: FailureStage
  failureTags: string[]
  reminder: string
  review: string
  retryChoice: string
  advice: string
  sourceType: string
  status?: RecordStatus
}

type PublishedProgram = Omit<RawProgram, 'status'>
type PublishedFailure = Omit<RawFailure, 'status'>

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const rawDir = path.join(rootDir, 'data/raw')
const processedDir = path.join(rootDir, 'data/processed')
const processedProgramsPath = path.join(processedDir, 'programs.json')
const processedFailuresPath = path.join(processedDir, 'failures.json')
const publishProgramsPath = path.join(rootDir, 'src/data/programs.ts')
const publishFailuresPath = path.join(rootDir, 'src/data/failures.ts')

function compareFileName(a: string, b: string) {
  return a.localeCompare(b, 'en')
}

async function listBatchFiles(prefix: 'programs' | 'failures') {
  const entries = await readdir(rawDir)
  return entries.filter((name) => new RegExp(`^${prefix}\\.batch-\\d+\\.json$`).test(name)).sort(compareFileName)
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content) as T
}

function isReadyProgram(item: RawProgram) {
  return item.status === 'verified'
}

function isReadyFailure(item: RawFailure) {
  return item.status === 'verified'
}

function toPublishedProgram(item: RawProgram): PublishedProgram {
  const { status, ...published } = item
  void status
  return published
}

function toPublishedFailure(item: RawFailure): PublishedFailure {
  const { status, ...published } = item
  void status
  return published
}

function toTsModule<T>(constName: string, typeName: string, items: T[]) {
  return `import type { ${typeName} } from '../lib/types'\n\nexport const ${constName}: ${typeName}[] = ${JSON.stringify(items, null, 2)}\n`
}

async function main() {
  const [programBatchFiles, failureBatchFiles] = await Promise.all([listBatchFiles('programs'), listBatchFiles('failures')])

  const processedPrograms: PublishedProgram[] = []
  const processedFailures: PublishedFailure[] = []

  for (const fileName of programBatchFiles) {
    const rawPrograms = await readJsonFile<RawProgram[]>(path.join(rawDir, fileName))
    const readyPrograms = rawPrograms.filter(isReadyProgram).map(toPublishedProgram)
    processedPrograms.push(...readyPrograms)
    await writeFile(path.join(processedDir, fileName), `${JSON.stringify(readyPrograms, null, 2)}\n`, 'utf-8')
  }

  for (const fileName of failureBatchFiles) {
    const rawFailures = await readJsonFile<RawFailure[]>(path.join(rawDir, fileName))
    const readyFailures = rawFailures.filter(isReadyFailure).map(toPublishedFailure)
    processedFailures.push(...readyFailures)
    await writeFile(path.join(processedDir, fileName), `${JSON.stringify(readyFailures, null, 2)}\n`, 'utf-8')
  }

  await writeFile(processedProgramsPath, `${JSON.stringify(processedPrograms, null, 2)}\n`, 'utf-8')
  await writeFile(processedFailuresPath, `${JSON.stringify(processedFailures, null, 2)}\n`, 'utf-8')

  await writeFile(publishProgramsPath, toTsModule('programs', 'Program', processedPrograms), 'utf-8')
  await writeFile(publishFailuresPath, toTsModule('failures', 'FailureExperience', processedFailures), 'utf-8')

  console.log(`同步完成：programs=${processedPrograms.length}, failures=${processedFailures.length}`)
}

main().catch((error) => {
  console.error('同步失败')
  console.error(error)
  process.exit(1)
})
