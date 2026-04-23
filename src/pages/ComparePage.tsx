import { Link } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { RadarChart } from '../components/RadarChart'
import { programIndex } from '../data/programIndex'
import { useCompare } from '../hooks/useCompare'
import { useProtectedCompare } from '../hooks/useProtectedData'
import { useEntitlement } from '../hooks/useEntitlement'
import { useScrollRestoration } from '../hooks/useScrollRestoration'
import { useComparePageSEO } from '../hooks/useSEO'
import { downloadCompareCSV, formatRatioDisplay } from '../lib/csv-export'
import { downloadShareCard } from '../lib/share-card'
import { routeLinks } from '../lib/routes'

function CompareLockedState() {
  return (
    <section className="card empty-state">
      <p className="eyebrow">对比能力</p>
      <h1>解锁后开启目标对比</h1>
      <p>填写问卷后可对比已查看过的目标；完整解锁后还包含 CSV 导出和分享卡片，适合正式做择校取舍。</p>
      <div className="empty-state-actions">
        <Link to={routeLinks.unlock()} className="route-button">
          输入解锁码
        </Link>
        <Link to={routeLinks.pay()} className="route-button route-button--primary">
          去付款页
        </Link>
      </div>
    </section>
  )
}

export function ComparePage() {
  useScrollRestoration()

  const { compareIds, clear } = useCompare()
  const { deviceId, status } = useEntitlement()
  const { programs: comparePrograms, canExport, canShare, loading, error } = useProtectedCompare(
    compareIds,
    deviceId,
    status.compareUnlocked && compareIds.length > 0,
  )

  useComparePageSEO(compareIds, programIndex)

  if (!status.compareUnlocked) {
    return (
      <main id="main-content" className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <CompareLockedState />
      </main>
    )
  }

  const empty = compareIds.length === 0
  const droppedCount = Math.max(compareIds.length - comparePrograms.length, 0)

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card compare-hero">
        <h1>专业对比</h1>
        <p className="hero-copy">围绕你已经查看过的目标做横向比较，信息口径更一致。</p>
        {!empty && (
          <div className="compare-actions">
            <Link to={routeLinks.home()} className="route-button">
              + 继续添加
            </Link>
            <button type="button" className="text-link" onClick={clear}>
              清空对比
            </button>
            {canExport ? (
              <button
                type="button"
                className="text-link export-btn"
                onClick={() => downloadCompareCSV(comparePrograms)}
              >
                导出 CSV
              </button>
            ) : (
              <Link to={routeLinks.pay()} className="text-link export-btn">
                完整权益导出
              </Link>
            )}
            {canShare ? (
              <button
                type="button"
                className="text-link share-btn"
                onClick={() => downloadShareCard(comparePrograms)}
              >
                分享卡片
              </button>
            ) : (
              <Link to={routeLinks.pay()} className="text-link share-btn">
                完整权益分享
              </Link>
            )}
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
      ) : loading ? (
        <section className="card empty-state">
          <p>正在加载可比较目标...</p>
        </section>
      ) : error ? (
        <section className="card empty-state">
          <p>对比数据加载失败。</p>
          <p>{error.message}</p>
        </section>
      ) : comparePrograms.length === 0 ? (
        <section className="card empty-state">
          <p>先查看这些目标的结果页，就可以把它们加入同一组对比。</p>
          <p>这样对比内容会和你的实际浏览记录保持一致。</p>
          <Link to={routeLinks.home()} className="route-button route-button--primary" style={{ marginTop: 16 }}>
            去查看结果页
          </Link>
        </section>
      ) : (
        <>
          {droppedCount > 0 ? (
            <section className="card compare-warning">
              <p>
                当前先展示 {comparePrograms.length} 个已查看目标；另外 {droppedCount} 个目标打开结果页后，也可以加入同一组对比。
              </p>
            </section>
          ) : null}

          <section className={`compare-grid compare-grid--${comparePrograms.length}`}>
            {comparePrograms.map((program) => (
              <div key={program.id} className="compare-item">
                <div className="compare-item-header">
                  <h2>{program.school}</h2>
                  <p className="compare-item-major">{program.major}</p>
                  <span className="compare-item-year">{program.year}年</span>
                </div>
                <div className="compare-radar-wrap">
                  <RadarChart program={program} />
                </div>
                <div className="compare-item-metrics">
                  <div className="compare-metric">
                    <span className="compare-metric-label">竞争比例</span>
                    <span className="compare-metric-val">{formatRatioDisplay(program)}</span>
                  </div>
                  <div className="compare-metric">
                    <span className="compare-metric-label">最低分</span>
                    <span className="compare-metric-val">
                      {program.lowestAdmittedScore ?? '—'}
                    </span>
                  </div>
                  <div className="compare-metric">
                    <span className="compare-metric-label">复录比</span>
                    <span className="compare-metric-val">
                      {program.retestCount && program.admitted
                        ? `${program.retestCount}:${program.admitted}`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>关键指标对比</h2>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>指标</th>
                    {comparePrograms.map((program) => (
                      <th key={program.id}>{program.school} · {program.major}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>竞争比例</td>
                    {comparePrograms.map((program) => (
                      <td key={program.id}>{formatRatioDisplay(program)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>最低录取分</td>
                    {comparePrograms.map((program) => (
                      <td key={program.id}>{program.lowestAdmittedScore ?? '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>复录比</td>
                    {comparePrograms.map((program) => (
                      <td key={program.id}>
                        {program.retestCount && program.admitted
                          ? `${program.retestCount}:${program.admitted}`
                          : '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>复试线</td>
                    {comparePrograms.map((program) => (
                      <td key={program.id}>{program.retestLine ?? '—'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>风险标签</td>
                    {comparePrograms.map((program) => (
                      <td key={program.id}>
                        <div className="tag-list">
                          {program.riskTags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
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
