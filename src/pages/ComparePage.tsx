import { Link } from 'react-router-dom'
import { programs } from '../data/programs'
import { routeLinks } from '../lib/routes'
import { RadarChart } from '../components/RadarChart'
import { PageRouteBar } from '../components/PageRouteBar'
import { useCompare } from '../hooks/useCompare'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

function formatRatioDisplay(p: (typeof programs)[0]) {
  const ratio = p.applicants && p.admitted ? `${p.applicants}:${p.admitted}` : '—'
  return ratio
}

export function ComparePage() {
  useScrollRestoration()
  const { compareIds, clear } = useCompare()

  const comparePrograms = compareIds
    .map(id => programs.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  const empty = comparePrograms.length === 0

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card compare-hero">
        <h1>专业对比</h1>
        <p className="hero-copy">同维度横向比较，选校决策更清晰。</p>
        {!empty && (
          <div className="compare-actions">
            <Link to={routeLinks.home()} className="route-button">
              + 继续添加
            </Link>
            <button type="button" className="text-link" onClick={clear}>
              清空对比
            </button>
          </div>
        )}
      </section>

      {empty ? (
        <section className="card empty-state">
          <p>还没有添加要对比的专业。</p>
          <p>在结果页面点击「+ 对比」按钮，添加 2-3 个专业后再来对比。</p>
          <Link to={routeLinks.home()} className="route-button" style={{ marginTop: 16 }}>
            去添加
          </Link>
        </section>
      ) : (
        <>
          {/* 雷达图网格 */}
          <section className={`compare-grid compare-grid--${comparePrograms.length}`}>
            {comparePrograms.map((p) => (
              <div key={p.id} className="compare-item">
                <div className="compare-item-header">
                  <h2>{p.school}</h2>
                  <p className="compare-item-major">{p.major}</p>
                  <span className="compare-item-year">{p.year}年</span>
                </div>
                <div className="compare-radar-wrap">
                  <RadarChart program={p} />
                </div>
                <div className="compare-item-metrics">
                  <div className="compare-metric">
                    <span className="compare-metric-label">竞争比例</span>
                    <span className="compare-metric-val">{formatRatioDisplay(p)}</span>
                  </div>
                  <div className="compare-metric">
                    <span className="compare-metric-label">最低分</span>
                    <span className="compare-metric-val">
                      {p.lowestAdmittedScore ?? '—'}
                    </span>
                  </div>
                  <div className="compare-metric">
                    <span className="compare-metric-label">复录比</span>
                    <span className="compare-metric-val">
                      {p.retestCount && p.admitted
                        ? `${p.retestCount}:${p.admitted}`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 文字对比表格 */}
          <section className="card">
            <h2>关键指标对比</h2>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>指标</th>
                    {comparePrograms.map(p => (
                      <th key={p.id}>{p.school} · {p.major}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>竞争比例</td>
                    {comparePrograms.map(p => (
                      <td key={p.id}>{formatRatioDisplay(p)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>最低录取分</td>
                    {comparePrograms.map(p => (
                      <td key={p.id}>{p.lowestAdmittedScore ?? '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>复录比</td>
                    {comparePrograms.map(p => (
                      <td key={p.id}>
                        {p.retestCount && p.admitted
                          ? `${p.retestCount}:${p.admitted}`
                          : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>复试线</td>
                    {comparePrograms.map(p => (
                      <td key={p.id}>{p.retestLine ?? '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>风险标签</td>
                    {comparePrograms.map(p => (
                      <td key={p.id}>
                        <div className="tag-list">
                          {p.riskTags.map(t => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
