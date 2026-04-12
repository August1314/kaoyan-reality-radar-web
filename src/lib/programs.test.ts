import { describe, expect, it } from 'vitest'
import { programs } from '../data/programs'
import { findProgramById, findProgramBySlug } from './programs'
import { buildProgramSlug } from './programSlug'

describe('programs data access', () => {
  const sampleProgram = programs[0]

  it('finds programs by id', () => {
    expect(findProgramById(sampleProgram.id)).toEqual(sampleProgram)
  })

  it('finds programs by slug', () => {
    expect(findProgramBySlug(buildProgramSlug(sampleProgram))).toEqual(sampleProgram)
  })

  it('returns null for unknown program identifiers', () => {
    expect(findProgramById('missing-program')).toBeNull()
    expect(findProgramBySlug('missing-slug')).toBeNull()
  })
})
