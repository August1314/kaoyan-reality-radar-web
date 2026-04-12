import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildProgramSlug } from '../src/lib/programSlug.ts'

type RiskTag = '报录比高压' | '复试刷人明显' | '分数线抬升' | '调剂机会少' | '信息不透明' | '同分段分化明显'
type FailureStage = '初试前' | '初试后' | '复试前' | '复试中' | '调剂阶段'
type FinalResult = '未过初试' | '进入复试但未录取' | '调剂失败' | '放弃复试' | '二战中'
type Attempt = '一战' | '二战' | '未知'
type RecordStatus = 'todo' | 'draft' | 'verified'

export interface RawProgram {
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

export interface RawFailure {
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

export type PublishedProgram = Omit<RawProgram, 'status'>
export type PublishedFailure = Omit<RawFailure, 'status'>
export interface PublishedProgramIndexEntry {
  id: string
  school: string
  major: string
  year: number
  summary: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const rawDir = path.join(rootDir, 'data/raw')
const processedDir = path.join(rootDir, 'data/processed')
const processedProgramsPath = path.join(processedDir, 'programs.json')
const processedFailuresPath = path.join(processedDir, 'failures.json')
const publishProgramsPath = path.join(rootDir, 'src/data/programs.ts')
const publishFailuresPath = path.join(rootDir, 'src/data/failures.ts')
const publishProgramIndexPath = path.join(rootDir, 'src/data/programIndex.ts')

export function compareFileName(a: string, b: string) {
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

export function isReadyProgram(item: RawProgram) {
  return item.status === 'verified'
}

export function isReadyFailure(item: RawFailure) {
  return item.status === 'verified'
}

export function toPublishedProgram(item: RawProgram): PublishedProgram {
  const { status, ...published } = item
  void status
  return published
}

export function toPublishedFailure(item: RawFailure): PublishedFailure {
  const { status, ...published } = item
  void status
  return published
}

export function toPublishedProgramIndex(item: PublishedProgram): PublishedProgramIndexEntry {
  return {
    id: item.id,
    school: item.school,
    major: item.major,
    year: item.year,
    summary: item.summary,
  }
}

export function assertUniqueIds(items: Array<{ id: string }>, label: string) {
  const seen = new Set<string>()

  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`${label} 存在重复 id：${item.id}`)
    }

    seen.add(item.id)
  }
}

export function assertUniqueProgramSlugs(programs: PublishedProgram[]) {
  const seen = new Set<string>()

  for (const program of programs) {
    const slug = buildProgramSlug(program)
    if (seen.has(slug)) {
      throw new Error(`program slug 冲突：${slug}`)
    }

    seen.add(slug)
  }
}

export function assertFailureProgramLinks(programs: PublishedProgram[], failures: PublishedFailure[]) {
  const validProgramIds = new Set(programs.map((program) => program.id))

  for (const failure of failures) {
    if (!validProgramIds.has(failure.programId)) {
      throw new Error(`failure 存在断链 programId：${failure.id} -> ${failure.programId}`)
    }
  }
}

export function validatePublishedData(programs: PublishedProgram[], failures: PublishedFailure[]) {
  assertUniqueIds(programs, 'program')
  assertUniqueIds(failures, 'failure')
  assertUniqueProgramSlugs(programs)
  assertFailureProgramLinks(programs, failures)
}

export function toTsModule<T>(constName: string, typeName: string, items: T[]) {
  return `import type { ${typeName} } from '../lib/types'\n\nexport const ${constName}: ${typeName}[] = ${JSON.stringify(items, null, 2)}\n`
}

export async function main() {
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

  validatePublishedData(processedPrograms, processedFailures)

  await writeFile(processedProgramsPath, `${JSON.stringify(processedPrograms, null, 2)}\n`, 'utf-8')
  await writeFile(processedFailuresPath, `${JSON.stringify(processedFailures, null, 2)}\n`, 'utf-8')

  await writeFile(publishProgramsPath, toTsModule('programs', 'Program', processedPrograms), 'utf-8')
  await writeFile(publishFailuresPath, toTsModule('failures', 'FailureExperience', processedFailures), 'utf-8')
  await writeFile(
    publishProgramIndexPath,
    toTsModule('programIndex', 'ProgramIndexEntry', processedPrograms.map(toPublishedProgramIndex)),
    'utf-8',
  )

  console.log(`同步完成：programs=${processedPrograms.length}, failures=${processedFailures.length}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('同步失败')
    console.error(error)
    process.exit(1)
  })
}
