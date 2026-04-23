import fs from 'node:fs'
import path from 'node:path'
import type { EntitlementLevel } from './entitlements'

interface FailureExperience {
  id: string
  programId: string
  [key: string]: unknown
}

let failuresCache: FailureExperience[] | null = null

export function readFailures(): FailureExperience[] {
  if (failuresCache) return failuresCache

  const filePath = path.join(process.cwd(), 'data/processed/failures.json')
  failuresCache = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as FailureExperience[]
  return failuresCache
}

export function findFailuresByProgramId(programId: string): FailureExperience[] {
  return readFailures().filter((item) => item.programId === programId)
}

export function findFailureById(id: string): FailureExperience | null {
  return readFailures().find((item) => item.id === id) ?? null
}

export function findVisibleFailuresByProgramId(
  programId: string,
  level: EntitlementLevel,
): FailureExperience[] {
  return findFailuresByProgramId(programId).slice(0, getFailureLimit(level))
}

export function findVisibleFailureById(id: string, level: EntitlementLevel): FailureExperience | null {
  const failure = readFailures().find((item) => item.id === id)
  if (!failure) return null

  const visible = findVisibleFailuresByProgramId(failure.programId, level)
  return visible.find((item) => item.id === id) ?? null
}

function getFailureLimit(level: EntitlementLevel): number {
  if (level === 'paid') return Number.POSITIVE_INFINITY
  if (level === 'survey') return 8
  return 2
}
