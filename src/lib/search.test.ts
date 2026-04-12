import { describe, expect, it } from 'vitest'
import { failures } from '../data/failures'
import { programs } from '../data/programs'
import { buildProgramSlug, findFailureById, findProgramById, findProgramBySlug, findRelatedFailures, searchProgram } from './search'

describe('search', () => {
  const sampleProgram = programs[0]

  it('can round-trip a program slug', () => {
    const slug = buildProgramSlug(sampleProgram)
    expect(findProgramBySlug(slug)).toEqual(sampleProgram)
  })

  it('returns empty result for blank query', () => {
    expect(searchProgram({ school: '', major: '' })).toEqual({
      program: null,
      failures: [],
    })
  })

  it('matches program by school and major', () => {
    const result = searchProgram({
      school: sampleProgram.school,
      major: sampleProgram.major,
    })

    expect(result.program).toEqual(sampleProgram)
    expect(result.failures.every((item) => item.programId === sampleProgram.id)).toBe(true)
  })

  it('returns null for unmatched query', () => {
    const result = searchProgram({
      school: '不存在的学校',
      major: '不存在的专业',
    })

    expect(result).toEqual({
      program: null,
      failures: [],
    })
  })

  it('can find entities by id and related failures', () => {
    const sampleFailure = failures.find((item) => item.programId === sampleProgram.id)

    expect(findProgramById(sampleProgram.id)).toEqual(sampleProgram)

    if (!sampleFailure) {
      expect(findRelatedFailures(sampleProgram.id)).toEqual([])
      return
    }

    expect(findFailureById(sampleFailure.id)).toEqual(sampleFailure)
    expect(findRelatedFailures(sampleProgram.id, sampleFailure.id)).not.toContainEqual(sampleFailure)
  })
})
