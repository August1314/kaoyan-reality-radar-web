import type { FailureExperience } from './types'

export type EntitlementLevel = 'free' | 'survey' | 'paid'

export interface EntitlementConfig {
  storageKey: string
  freeFailureLimit: number
  surveyFailureLimit: number
  surveyFormUrl: string
  paidRequestUrl: string
  priceLabel: string
}

export const monetizationConfig: EntitlementConfig = {
  storageKey: 'kaoyan-radar-entitlement',
  freeFailureLimit: 2,
  surveyFailureLimit: 8,
  surveyFormUrl: 'https://dcnq3h3ty7w5.feishu.cn/share/base/form/shrcnmJtPBlKTL2Ooj84m7JbMOf',
  paidRequestUrl: 'https://dcnq3h3ty7w5.feishu.cn/share/base/form/shrcnmJtPBlKTL2Ooj84m7JbMOf',
  priceLabel: '9.9 元',
}

export function getFailureLimit(level: EntitlementLevel): number {
  if (level === 'paid') return Number.POSITIVE_INFINITY
  if (level === 'survey') return monetizationConfig.surveyFailureLimit
  return monetizationConfig.freeFailureLimit
}

export function getEntitlementLabel(level: EntitlementLevel): string {
  if (level === 'paid') return '完整解锁'
  if (level === 'survey') return '问卷解锁'
  return '免费体验'
}

export function getVisibleFailures<T extends FailureExperience>(failures: T[], level: EntitlementLevel): T[] {
  return failures.slice(0, getFailureLimit(level))
}

export function chooseHigherEntitlement(current: EntitlementLevel, next: EntitlementLevel): EntitlementLevel {
  const rank: Record<EntitlementLevel, number> = {
    free: 0,
    survey: 1,
    paid: 2,
  }

  return rank[next] > rank[current] ? next : current
}
