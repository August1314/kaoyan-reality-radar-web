import { failures } from '../data/failures'
import { programs } from '../data/programs'
import type { FailureExperience, Program } from './types'

const normalize = (value: string) => value.trim().toLowerCase()

export interface SearchInput {
  school: string
  major: string
}

export interface SearchResult {
  program: Program | null
  failures: FailureExperience[]
}

export function buildProgramSlug(program: Program) {
  return `${program.school}-${program.major}`
}

export function findProgramBySlug(slug: string) {
  return programs.find((program) => buildProgramSlug(program) === decodeURIComponent(slug)) ?? null
}

export function findProgramById(id: string) {
  return programs.find((program) => program.id === id) ?? null
}

export function searchProgram({ school, major }: SearchInput): SearchResult {
  const schoolKey = normalize(school)
  const majorKey = normalize(major)

  const program =
    programs.find((item) => {
      const schoolMatched = normalize(item.school).includes(schoolKey)
      const majorMatched = normalize(item.major).includes(majorKey)
      return schoolMatched && majorMatched
    }) ?? null

  if (!program) {
    return { program: null, failures: [] }
  }

  return {
    program,
    failures: failures.filter((item) => item.programId === program.id),
  }
}

export function findFailureById(id: string) {
  return failures.find((item) => item.id === id) ?? null
}

export function findRelatedFailures(programId: string, currentId?: string) {
  return failures.filter((item) => item.programId === programId && item.id !== currentId)
}
