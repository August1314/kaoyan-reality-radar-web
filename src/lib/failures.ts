import { failures } from '../data/failures'

export function findFailuresByProgramId(programId: string) {
  return failures.filter((item) => item.programId === programId)
}

export function findFailureById(id: string) {
  return failures.find((item) => item.id === id) ?? null
}

export function findRelatedFailures(programId: string, currentId?: string) {
  return failures.filter((item) => item.programId === programId && item.id !== currentId)
}
