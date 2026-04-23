import fs from 'node:fs'
import path from 'node:path'
import { getVisibleFailures, type EntitlementLevel } from '../../src/lib/monetization.ts'
import type { FailureExperience } from '../../src/lib/types.ts'

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
  return getVisibleFailures(findFailuresByProgramId(programId), level)
}

export function findVisibleFailureById(id: string, level: EntitlementLevel): FailureExperience | null {
  const failure = readFailures().find((item) => item.id === id)
  if (!failure) return null

  const visible = findVisibleFailuresByProgramId(failure.programId, level)
  return visible.find((item) => item.id === id) ?? null
}
