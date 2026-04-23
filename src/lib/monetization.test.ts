import { describe, expect, it } from 'vitest'
import {
  chooseHigherEntitlement,
  getFailureLimit,
  getVisibleFailures,
  resolveUnlockCode,
} from './monetization'
import type { FailureExperience } from './types'

function makeFailure(id: string): FailureExperience {
  return {
    id,
    programId: 'program-1',
    school: '测试大学',
    major: '计算机科学',
    year: 2025,
    attempt: '一战',
    scoreRange: '350-359',
    enteredRetest: true,
    finalResult: '进入复试但未录取',
    failureStage: '复试中',
    failureTags: ['复试状态差'],
    reminder: `reminder-${id}`,
    review: 'review',
    retryChoice: 'retry',
    advice: 'advice',
    sourceType: '匿名投稿',
  }
}

describe('monetization entitlement', () => {
  const failures = Array.from({ length: 12 }, (_, index) => makeFailure(`failure-${index}`))

  it('limits free users to two failure samples', () => {
    expect(getFailureLimit('free')).toBe(2)
    expect(getVisibleFailures(failures, 'free')).toHaveLength(2)
  })

  it('limits survey users to eight failure samples', () => {
    expect(getFailureLimit('survey')).toBe(8)
    expect(getVisibleFailures(failures, 'survey')).toHaveLength(8)
  })

  it('allows paid users to see all loaded failure samples', () => {
    expect(getVisibleFailures(failures, 'paid')).toHaveLength(12)
  })

  it('resolves unlock codes case-insensitively', () => {
    expect(resolveUnlockCode(' yan2026 ')).toBe('survey')
    expect(resolveUnlockCode('radar99')).toBe('paid')
    expect(resolveUnlockCode('bad-code')).toBeNull()
  })

  it('never downgrades an existing paid entitlement', () => {
    expect(chooseHigherEntitlement('paid', 'survey')).toBe('paid')
    expect(chooseHigherEntitlement('free', 'survey')).toBe('survey')
  })
})
