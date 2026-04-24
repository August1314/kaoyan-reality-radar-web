import { Link } from 'react-router-dom'
import { FailureCard } from './FailureCard'
import { routeLinks } from '../lib/routes'
import { getEntitlementLabel, getFailureLimit, monetizationConfig } from '../lib/monetization'
import type { FailureExperience } from '../lib/types'

export type EntitlementLevel = 'free' | 'survey' | 'paid'

interface ResultFailuresSectionProps {
  entitlementLevel: EntitlementLevel
  visibleFailures: FailureExperience[]
  failureTotalCount: number
  failuresLoading: boolean
  failuresError: unknown
}

export function ResultFailuresSection({
  entitlementLevel,
  visibleFailures,
  failureTotalCount,
  failuresLoading,
  failuresError,
}: ResultFailuresSectionProps) {
  const hiddenFailureCount = Math.max(failureTotalCount - visibleFailures.length, 0)
  const failureLimit = getFailureLimit(entitlementLevel)
  const failureLimitLabel = Number.isFinite(failureLimit) ? `${failureLimit} 条` : '全部'

  return (
    <section id="failures" className="card">
      <div className="section-head">
        <h2>失败经验</h2>
        {failuresLoading ? (
          <p>加载中...</p>
        ) : failuresError ? (
          <p className="error-text">加载失败</p>
        ) : (
          <p>
            {getEntitlementLabel(entitlementLevel)} · 当前可看 {failureLimitLabel}
            {hiddenFailureCount > 0 ? ` · 可继续解锁 ${hiddenFailureCount} 条` : ''}
          </p>
        )}
      </div>
      <div className="failure-list">
        {failuresLoading ? (
          <div className="loading-placeholder">正在加载失败经验...</div>
        ) : failuresError ? (
          <div className="error-placeholder">加载失败，请刷新重试</div>
        ) : failureTotalCount === 0 ? (
          <div className="empty-placeholder">暂无失败经验样本</div>
        ) : (
          visibleFailures.map((item) => <FailureCard key={item.id} failure={item} />)
        )}
      </div>
      {!failuresLoading && !failuresError && hiddenFailureCount > 0 ? (
        <div className="unlock-inline-card">
          <div>
            <p className="eyebrow">内容解锁</p>
            <h3>还可以继续查看 {hiddenFailureCount} 条失败经验。</h3>
            <p>
              基础体验先看 2 条；限时内测期填写择校问卷后，人工发送唯一完整权益码，可查看完整失败经验库、
              完整 CSV 和分享卡片能力。
            </p>
          </div>
          <div className="unlock-inline-card__actions">
            <a href={monetizationConfig.surveyFormUrl} className="route-button" target="_blank" rel="noreferrer">
              填写问卷
            </a>
            <Link to={routeLinks.unlock()} className="route-button">
              输入解锁码
            </Link>
            <Link to={routeLinks.unlock()} className="route-button route-button--primary">
              领取完整权益码
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  )
}
