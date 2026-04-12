import { describe, expect, it } from 'vitest'
import {
  assertFailureProgramLinks,
  assertUniqueIds,
  assertUniqueProgramSlugs,
  isReadyFailure,
  isReadyProgram,
  toPublishedFailure,
  toPublishedProgramIndex,
  toPublishedProgram,
  validatePublishedData,
  type RawFailure,
  type RawProgram,
} from './sync-data'

describe('sync-data', () => {
  const rawProgram: RawProgram = {
    id: 'program-1',
    school: '中山大学',
    major: '计算机科学与技术',
    year: 2025,
    applicants: 100,
    admitted: 10,
    retestCount: 20,
    retestLine: 350,
    lowestAdmittedScore: 360,
    riskTags: ['报录比高压'],
    summary: 'summary',
    sourceNote: 'source',
    status: 'verified',
  }

  const rawFailure: RawFailure = {
    id: 'failure-1',
    programId: 'program-1',
    school: '中山大学',
    major: '计算机科学与技术',
    year: 2025,
    attempt: '一战',
    scoreRange: '350-359',
    enteredRetest: true,
    finalResult: '进入复试但未录取',
    failureStage: '复试中',
    failureTags: ['复试状态差'],
    reminder: 'reminder',
    review: 'review',
    retryChoice: 'retry',
    advice: 'advice',
    sourceType: '匿名投稿',
    status: 'verified',
  }

  it('keeps only verified data for publishing', () => {
    expect(isReadyProgram(rawProgram)).toBe(true)
    expect(isReadyFailure(rawFailure)).toBe(true)
    expect(toPublishedProgram(rawProgram)).not.toHaveProperty('status')
    expect(toPublishedFailure(rawFailure)).not.toHaveProperty('status')
    expect(toPublishedProgramIndex(toPublishedProgram(rawProgram))).toEqual({
      id: 'program-1',
      school: '中山大学',
      major: '计算机科学与技术',
      year: 2025,
      summary: 'summary',
    })
  })

  it('validates published data successfully for a correct dataset', () => {
    const program = toPublishedProgram(rawProgram)
    const failure = toPublishedFailure(rawFailure)

    expect(() => validatePublishedData([program], [failure])).not.toThrow()
  })

  it('rejects duplicate ids and duplicate slugs', () => {
    const program = toPublishedProgram(rawProgram)
    const duplicateIdProgram = {
      ...program,
      major: '软件工程',
    }
    const duplicateSlugProgram = {
      ...program,
      id: 'program-2',
    }

    expect(() => assertUniqueIds([program, duplicateIdProgram], 'program')).toThrow('重复 id')
    expect(() => assertUniqueProgramSlugs([program, duplicateSlugProgram])).toThrow('slug 冲突')
  })

  it('rejects failures linked to missing programs', () => {
    const program = toPublishedProgram(rawProgram)
    const brokenFailure = {
      ...toPublishedFailure(rawFailure),
      programId: 'missing-program',
    }

    expect(() => assertFailureProgramLinks([program], [brokenFailure])).toThrow('断链 programId')
  })
})
