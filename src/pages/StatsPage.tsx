import { Link } from 'react-router-dom'
import { programs } from '../data/programs'
import { routeLinks } from '../lib/routes'
import { PageRouteBar } from '../components/PageRouteBar'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

// ── 数据统计工具 ────────────────────────────────────────────────

interface Bucket { label: string; count: number }

function topN<T>(arr: T[], key: (t: T) => string, n = 10): Bucket[] {
  const counts: Record<string, number> = {}
  arr.forEach(t => { counts[key(t)] = (counts[key(t)] || 0) + 1 })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }))
}

// 横向进度条
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

// ── 组件 ─────────────────────────────────────────────────────────

export function StatsPage() {
  useScrollRestoration()

  const totalPrograms = programs.length

  // 学校分布
  const schoolTop = topN(programs, p => p.school, 10)
  const schoolMax = schoolTop[0]?.count ?? 1

  // 专业方向分布（取 major 第一个词或大类）
  const majorTop = topN(programs, p => p.major, 10)

  // 风险标签分布
  const allTags = programs.flatMap(p => p.riskTags)
  const tagTop = topN(allTags, t => t, 8)

  // 分数区间（从 lowestAdmittedScore 分布）
  const scores = programs
    .map(p => p.lowestAdmittedScore)
    .filter((s): s is number => s !== null)

  const scoreBuckets: Bucket[] = [
    { label: '< 300', count: scores.filter(s => s < 300).length },
    { label: '300-340', count: scores.filter(s => s >= 300 && s < 340).length },
    { label: '340-370', count: scores.filter(s => s >= 340 && s < 370).length },
    { label: '370-400', count: scores.filter(s => s >= 370 && s < 400).length },
    { label: '≥ 400', count: scores.filter(s => s >= 400).length },
  ]
  const scoreMax = Math.max(...scoreBuckets.map(b => b.count), 1)

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null

  const uniqueSchools = new Set(programs.map(p => p.school)).size
  const uniqueMajors = new Set(programs.map(p => p.major)).size

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '首页', to: routeLinks.home() },
          { label: '数据统计', to: '#', tone: 'primary' },
        ]}
      />

      <section className="card stats-hero">
        <h1>数据统计</h1>
        <p className="hero-copy">收录样本全景一览</p>
      </section>

      {/* 核心数字 */}
      <section className="stats-kpi-grid">
        <div className="stats-kpi">
          <span className="stats-kpi-num">{totalPrograms}</span>
          <span className="stats-kpi-label">收录专业</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-num">{uniqueSchools}</span>
          <span className="stats-kpi-label">覆盖院校</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-num">{uniqueMajors}</span>
          <span className="stats-kpi-label">涵盖专业</span>
        </div>
        {avgScore !== null && (
          <div className="stats-kpi">
            <span className="stats-kpi-num">{avgScore}</span>
            <span className="stats-kpi-label">平均录取分</span>
          </div>
        )}
      </section>

      {/* 学校分布 */}
      {schoolTop.length > 0 && (
        <section className="card">
          <h2>学校分布 Top 10</h2>
          <div className="stats-bar-list">
            {schoolTop.map(b => (
              <Bar key={b.label} label={b.label} count={b.count} max={schoolMax} />
            ))}
          </div>
          <Link to={routeLinks.home()} className="text-link stats-more">
            查看全部 →
          </Link>
        </section>
      )}

      {/* 专业分布 */}
      {majorTop.length > 0 && (
        <section className="card">
          <h2>专业方向分布 Top 10</h2>
          <div className="stats-bar-list">
            {majorTop.map(b => (
              <Bar key={b.label} label={b.label} count={b.count} max={majorTop[0].count} />
            ))}
          </div>
        </section>
      )}

      {/* 分数区间 */}
      {scoreBuckets.some(b => b.count > 0) && (
        <section className="card">
          <h2>录取分数分布</h2>
          <div className="stats-bar-list">
            {scoreBuckets.map(b => (
              <Bar key={b.label} label={b.label} count={b.count} max={scoreMax} />
            ))}
          </div>
        </section>
      )}

      {/* 风险标签 */}
      {tagTop.length > 0 && (
        <section className="card">
          <h2>高频风险标签</h2>
          <div className="stats-tags">
            {tagTop.map(b => (
              <span key={b.label} className="stats-tag">
                {b.label}
                <span className="stats-tag-count">{b.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
