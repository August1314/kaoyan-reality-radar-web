import fs from 'node:fs'
import path from 'node:path'

export interface Program {
  id: string
  school: string
  major: string
  year: number
  applicants: number | null
  admitted: number | null
  retestCount: number | null
  retestLine: number | null
  lowestAdmittedScore: number | null
  riskTags: string[]
  summary: string
  sourceNote: string
}

export interface StatsBucket {
  label: string
  count: number
}

export interface StatsSummary {
  totalPrograms: number
  uniqueSchools: number
  uniqueMajors: number
  avgScore: number | null
  schoolTop: StatsBucket[]
  majorTop: StatsBucket[]
  scoreBuckets: StatsBucket[]
  tagTop: StatsBucket[]
}

let programsCache: Program[] | null = null

function topN<T>(items: T[], key: (item: T) => string, limit = 10): StatsBucket[] {
  const counts: Record<string, number> = {}

  items.forEach((item) => {
    const label = key(item)
    counts[label] = (counts[label] ?? 0) + 1
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

export function readPrograms(): Program[] {
  if (programsCache) return programsCache

  const filePath = path.join(process.cwd(), 'data/processed/programs.json')
  programsCache = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Program[]
  return programsCache
}

export function findProgramBySlug(slug: string): Program | null {
  const decodedSlug = decodeURIComponent(slug)
  return readPrograms().find((program) => {
    const programSlug = `${program.school}-${program.major}-${program.year}`
    return programSlug === decodedSlug
  }) ?? null
}

export function findProgramsByIds(ids: string[]): Program[] {
  const index = new Map(readPrograms().map((program) => [program.id, program]))
  return ids
    .map((id) => index.get(id))
    .filter((program): program is Program => Boolean(program))
}

export function buildStatsSummary(): StatsSummary {
  const programs = readPrograms()
  const schoolTop = topN(programs, (program) => program.school, 10)
  const majorTop = topN(programs, (program) => program.major, 10)
  const scores = programs
    .map((program) => program.lowestAdmittedScore)
    .filter((score): score is number => score !== null)
  const scoreBuckets: StatsBucket[] = [
    { label: '< 300', count: scores.filter((score) => score < 300).length },
    { label: '300-340', count: scores.filter((score) => score >= 300 && score < 340).length },
    { label: '340-370', count: scores.filter((score) => score >= 340 && score < 370).length },
    { label: '370-400', count: scores.filter((score) => score >= 370 && score < 400).length },
    { label: '≥ 400', count: scores.filter((score) => score >= 400).length },
  ]
  const tagTop = topN(programs.flatMap((program) => program.riskTags), (tag) => tag, 8)

  return {
    totalPrograms: programs.length,
    uniqueSchools: new Set(programs.map((program) => program.school)).size,
    uniqueMajors: new Set(programs.map((program) => program.major)).size,
    avgScore: scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null,
    schoolTop,
    majorTop,
    scoreBuckets,
    tagTop,
  }
}
