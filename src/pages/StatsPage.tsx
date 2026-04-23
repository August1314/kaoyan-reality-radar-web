import { Link } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { useEntitlement } from '../hooks/useEntitlement'
import { useProtectedStats } from '../hooks/useProtectedData'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import { useSEO } from '../hooks/useSEO'
import { downloadStatsCSV } from '../lib/csv-export'
import { routeLinks } from '../lib/routes'
import { SITE_URL } from '../lib/site-url'

interface Bucket {
  label: string
  count: number
}

function Bar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = Math.min((count / max) * 100, 100)
  return (
    <div className="stats-bar-row">
      <span className="stats-bar-label">{label}</span>
      <div className="stats-bar-track">
        <div className="stats-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stats-bar-count">{count}</span>
    </div>
  )
}

function StatsLockedState() {
  return (
    <>
      <section className="card stats-hero">
        <div className="page-head-content">
          <h1>数据统计</h1>
          <p className="hero-copy">领取完整权益码后查看全站分布、分数区间和高频风险标签。</p>
        </div>
        <Link to={routeLinks.unlock()} className="route-button route-button--primary">
          领取完整权益码
        </Link>
      </section>

      <section className="card stats-locked-card">
        <p className="eyebrow">完整权益</p>
        <h2>用全站统计辅助择校判断</h2>
        <p>
          限时内测期提交择校问卷后，可人工领取完整权益码，查看学校分布、专业方向、录取分数区间和风险标签热度，并导出 CSV。
        </p>
        <div className="unlock-inline-card__actions">
          <Link to={routeLinks.unlock()} className="route-button route-button--primary">
            领取完整权益码
          </Link>
          <Link to={routeLinks.unlock()} className="route-button">
            输入解锁码
          </Link>
        </div>
      </section>
    </>
  )
}

export function StatsPage() {
  useScrollRestoration()
  useSEO({
    title: '数据统计',
    description: '考研现实雷达站数据统计概览。完整权益码包含收录专业分布、学校分布、录取分数区间、高频风险标签等聚合数据。',
    keywords: '考研,数据统计,专业分布,学校分布,录取分数,风险标签',
    canonicalUrl: `${SITE_URL}/stats`,
  })

  const { deviceId, status } = useEntitlement()
  const { stats, loading, error } = useProtectedStats(deviceId, status.statsUnlocked)

  if (!status.statsUnlocked) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <StatsLockedState />
      </main>
    )
  }

  if (loading || !stats) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <section className="card stats-hero">
          <div className="page-head-content">
            <h1>数据统计</h1>
            <p className="hero-copy">正在加载完整统计数据...</p>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <section className="card empty-state">
          <h1>统计页加载失败</h1>
          <p>{error.message}</p>
          <div className="empty-state-actions">
            <Link to={routeLinks.home()} className="route-button">
              返回首页
            </Link>
            <Link to={routeLinks.unlock()} className="route-button route-button--primary">
              领取完整权益码
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const schoolMax = stats.schoolTop[0]?.count ?? 1
  const scoreMax = Math.max(...stats.scoreBuckets.map((bucket) => bucket.count), 1)

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card stats-hero">
        <div className="page-head-content">
          <h1>数据统计</h1>
          <p className="hero-copy">收录样本全景一览</p>
        </div>
        <button
          type="button"
          className="text-link"
          onClick={() => downloadStatsCSV(stats)}
        >
          导出数据
        </button>
      </section>

      <section className="stats-kpi-grid">
        <div className="stats-kpi">
          <span className="stats-kpi-num">{stats.totalPrograms}</span>
          <span className="stats-kpi-label">收录专业</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-num">{stats.uniqueSchools}</span>
          <span className="stats-kpi-label">覆盖院校</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-num">{stats.uniqueMajors}</span>
          <span className="stats-kpi-label">涵盖专业</span>
        </div>
        {stats.avgScore !== null && (
          <div className="stats-kpi">
            <span className="stats-kpi-num">{stats.avgScore}</span>
            <span className="stats-kpi-label">平均录取分</span>
          </div>
        )}
      </section>

      {stats.schoolTop.length > 0 && (
        <section className="card">
          <h2>学校分布 Top 10</h2>
          <div className="stats-bar-list">
            {stats.schoolTop.map((bucket: Bucket) => (
              <Bar key={bucket.label} label={bucket.label} count={bucket.count} max={schoolMax} />
            ))}
          </div>
          <Link to={routeLinks.home()} className="text-link stats-more">
            查看全部 →
          </Link>
        </section>
      )}

      {stats.majorTop.length > 0 && (
        <section className="card">
          <h2>专业方向分布 Top 10</h2>
          <div className="stats-bar-list">
            {stats.majorTop.map((bucket: Bucket) => (
              <Bar key={bucket.label} label={bucket.label} count={bucket.count} max={stats.majorTop[0].count} />
            ))}
          </div>
        </section>
      )}

      {stats.scoreBuckets.some((bucket) => bucket.count > 0) && (
        <section className="card">
          <h2>录取分数分布</h2>
          <div className="stats-bar-list">
            {stats.scoreBuckets.map((bucket: Bucket) => (
              <Bar key={bucket.label} label={bucket.label} count={bucket.count} max={scoreMax} />
            ))}
          </div>
        </section>
      )}

      {stats.tagTop.length > 0 && (
        <section className="card">
          <h2>高频风险标签</h2>
          <div className="stats-tags">
            {stats.tagTop.map((bucket: Bucket) => (
              <span key={bucket.label} className="stats-tag">
                {bucket.label}
                <span className="stats-tag-count">{bucket.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
