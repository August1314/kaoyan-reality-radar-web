import { describe, expect, it } from 'vitest'
import { failures } from '../data/failures'
import { findFailureById, findFailuresByProgramId, findRelatedFailures } from './failures'

describe('failures data access', () => {
  const sampleFailure = failures[0]

  it('finds failures by id', () => {
    expect(findFailureById(sampleFailure.id)).toEqual(sampleFailure)
  })

  it('finds failures by program id', () => {
    const related = findFailuresByProgramId(sampleFailure.programId)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every((item) => item.programId === sampleFailure.programId)).toBe(true)
  })

  it('excludes current failure from related failures', () => {
    const related = findRelatedFailures(sampleFailure.programId, sampleFailure.id)
    expect(related).not.toContainEqual(sampleFailure)
  })

  it('returns empty results for unknown ids', () => {
    expect(findFailureById('missing-failure')).toBeNull()
    expect(findFailuresByProgramId('missing-program')).toEqual([])
  })
})
