import { Link, useParams } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { formatFailureSourceNote } from '../lib/format'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import { useFailureById, useRelatedFailures } from '../hooks/useAsyncFailures'

export function FailureDetailPage() {
  const { id = '' } = useParams()
  const { failure, loading, error } = useFailureById(id)
  const { related, loading: relatedLoading } = useRelatedFailures(
    failure?.programId ?? '',
    failure?.id,
  )

  if (loading) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar />
        <section className="card empty-state">
          <p>加载中...</p>
        </section>
      </main>
    )
  }

  if (error || !failure) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar />
        <section className="card empty-state">
          <h1>这条失败经验不存在</h1>
          <Link to={routeLinks.home()} className="text-link">
            返回首页
          </Link>
        </section>
      </main>
    )
  }

  const actions = [
    { label: '回到结果页', to: routeLinks.result(buildProgramSlug(failure)) },
    { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' as const },
  ]

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar actions={actions} />
      <section className="card detail-header">
        <p className="eyebrow">失败经验详情</p>
        <h1>
          {failure.school} · {failure.major}
        </h1>
        <p className="meta-line">
          {failure.attempt} / {failure.scoreRange} / {failure.finalResult}
        </p>
      </section>

      <section className="card detail-body">
        <p className="detail-source-note">{formatFailureSourceNote(failure.sourceType)}</p>
        <h2>失败路径</h2>
        <p>{failure.review}</p>
        <h2>如果重来一次</h2>
        <p>{failure.retryChoice}</p>
        <h2>给后来者的提醒</h2>
        <p>{failure.advice}</p>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>相关卡片</h2>
          <p>同校 / 同专业的其它失败经验。</p>
        </div>
        <div className="related-list">
          {relatedLoading ? (
            <p>加载中...</p>
          ) : related.length === 0 ? (
            <p className="empty-note">暂无相关样本</p>
          ) : (
            related.map((item) => (
              <Link key={item.id} to={routeLinks.failure(item.id)} className="related-item">
                <strong>{item.reminder}</strong>
                <span>
                  {item.failureStage} · {item.finalResult}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  )
}