import { Link, useParams } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { formatFailureSourceNote } from '../lib/format'
import { findFailureById, findRelatedFailures } from '../lib/failures'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'

export function FailureDetailPage() {
  const { id = '' } = useParams()
  const failure = findFailureById(id)

  if (!failure) {
    return (
      <main id="main-content" className="page narrow-page">
        <section className="card empty-state">
          <h1>这条失败经验不存在</h1>
          <Link to={routeLinks.home()} className="text-link">
            返回首页
          </Link>
        </section>
      </main>
    )
  }

  const related = findRelatedFailures(failure.programId, failure.id)
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
          {related.map((item) => (
            <Link key={item.id} to={routeLinks.failure(item.id)} className="related-item">
              <strong>{item.reminder}</strong>
              <span>
                {item.failureStage} · {item.finalResult}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
