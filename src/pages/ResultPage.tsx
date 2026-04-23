import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import { FailureCard } from '../components/FailureCard'
import { PageRouteBar } from '../components/PageRouteBar'
import { SchoolProgramLinks } from '../components/SchoolProgramLinks'
import { RadarCard } from '../components/RadarCard'
import { ResultContextCard } from '../components/ResultContextCard'
import { RiskTagList } from '../components/RiskTagList'
import { ShareButton } from '../components/ShareButton'
import { CompareToggle } from '../components/CompareButton'
import { downloadResultCSV } from '../lib/csv-export'
import { downloadShareCard } from '../lib/share-card'
import { formatMetricValue, formatRatio, formatRetestRate } from '../lib/format'
import { findProgramBySlug } from '../lib/programs'
import { getEntitlementLabel, getFailureLimit, getVisibleFailures, monetizationConfig } from '../lib/monetization'
import { resultSectionLinks, routeLinks } from '../lib/routes'
import { useResultPageSEO } from '../hooks/useSEO'
import { useFailuresByProgramId } from '../hooks/useAsyncFailures'
import { useJsonLd } from '../hooks/useJsonLd'
import { useEntitlement } from '../hooks/useEntitlement'

export function ResultPage() {
  const { slug = '' } = useParams()
  const program = findProgramBySlug(slug)

  // Phase 6: Load failures asynchronously instead of bundling all 237KB in initial chunk
  // Hook is called unconditionally (before any conditional return) to satisfy rules-of-hooks.
  // When program is null we pass empty string so fetch returns [] and section stays hidden.
  const { failures: resultFailures, loading: failuresLoading, error: failuresError } = useFailuresByProgramId(
    program?.id ?? '',
  )
  const { level: entitlementLevel, isPaid } = useEntitlement()

  // SEO - 必须在条件判断之前调用
  useResultPageSEO(program ?? { school: '', major: '', year: 0, summary: '' })

  // JSON-LD 结构化数据
  useJsonLd(program ?? null)

  if (!program) {
    return (
      <main className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <section className="card empty-state">
          <h1>暂时还没有找到这个目标</h1>
          <p>先回首页换一个目标。</p>
          <div className="empty-state-actions">
            <Link to={routeLinks.home()} className="route-button route-button--primary">
              返回首页
            </Link>
            <Link to={routeLinks.submit()} className="route-button">
              去匿名投稿
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const metrics = [
    { label: '报录比', value: formatRatio(program.applicants, program.admitted) ? `${formatRatio(program.applicants, program.admitted)} : 1` : '未公开' },
    { label: '复录比', value: formatRetestRate(program.retestCount, program.admitted) ? `${formatRetestRate(program.retestCount, program.admitted)} : 1` : '未公开' },
    { label: '复试线', value: formatMetricValue(program.retestLine) },
    { label: '最低录取', value: formatMetricValue(program.lowestAdmittedScore) },
  ]
  const visibleFailures = getVisibleFailures(resultFailures, entitlementLevel)
  const hiddenFailureCount = Math.max(resultFailures.length - visibleFailures.length, 0)
  const failureLimit = getFailureLimit(entitlementLevel)
  const failureLimitLabel = Number.isFinite(failureLimit) ? `${failureLimit} 条` : '全部'

  return (
    <main id="main-content" className="page result-page">
      <Breadcrumb
        items={[
          { label: program.school },
          { label: program.major },
        ]}
      />
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card page-head result-hero">
        <div className="page-head-content result-hero__content">
          <p className="eyebrow">目标判断</p>
          <h1>
            {program.school} · {program.major}
          </h1>
          <p className="hero-copy">先看难度，再看失败路径。</p>
          <div className="result-kpis">
            {metrics.map((item) => (
              <div key={item.label} className="result-kpi">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="result-hero__actions">
          <ShareButton
            title={`${program.school} · ${program.major} - 考研现实雷达`}
            text={`看看${program.school}${program.major}的真实难度和失败经验`}
          />
          <button
            type="button"
            className="text-link export-btn"
            onClick={() => downloadResultCSV(program, visibleFailures)}
          >
            导出当前 CSV
          </button>
          {isPaid ? (
            <button
              type="button"
              className="text-link share-btn"
              onClick={() => downloadShareCard([program])}
            >
              分享卡片
            </button>
          ) : (
            <Link to={routeLinks.unlock()} className="text-link share-btn">
              解锁分享卡片
            </Link>
          )}
          <CompareToggle programId={program.id} />
        </div>
      </section>

      <nav className="result-anchor-nav" aria-label="结果页分区导航">
        {resultSectionLinks.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="result-anchor-link">
            {item.label}
          </a>
        ))}
      </nav>

      <section id="overview" className="result-stack">
        <div className="result-layout">
          <RadarCard program={program} />
          <ResultContextCard program={program} />
        </div>
      </section>

      <section id="signals" className="card reminder-card">
        <div className="section-head left-align">
          <h2>风险信号</h2>
          <p>这页先看这些</p>
        </div>
        <div className="reminder-card__body">
          <RiskTagList tags={program.riskTags} />
          <p className="summary-box">{program.summary}</p>
          <p className="source-note">{program.sourceNote}</p>
        </div>
      </section>

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
              {hiddenFailureCount > 0 ? ` · 还有 ${hiddenFailureCount} 条待解锁` : ''}
            </p>
          )}
        </div>
        <div className="failure-list">
          {failuresLoading ? (
            <div className="loading-placeholder">正在加载失败经验...</div>
          ) : failuresError ? (
            <div className="error-placeholder">加载失败，请刷新重试</div>
          ) : resultFailures.length === 0 ? (
            <div className="empty-placeholder">暂无失败经验样本</div>
          ) : (
            visibleFailures.map((item) => (
              <FailureCard key={item.id} failure={item} />
            ))
          )}
        </div>
        {!failuresLoading && !failuresError && hiddenFailureCount > 0 ? (
          <div className="unlock-inline-card">
            <div>
              <p className="eyebrow">内容解锁</p>
              <h3>还有 {hiddenFailureCount} 条失败经验没有展开。</h3>
              <p>
                免费先看 2 条；填写择校问卷后输入体验码可看更多；{monetizationConfig.priceLabel} 解锁完整失败经验库、
                完整 CSV 和分享卡片能力。
              </p>
            </div>
            <div className="unlock-inline-card__actions">
              <a
                href={monetizationConfig.surveyFormUrl}
                className="route-button"
                target="_blank"
                rel="noreferrer"
              >
                填写问卷
              </a>
              <Link to={routeLinks.unlock()} className="route-button route-button--primary">
                输入解锁码
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section id="alternatives">
        <SchoolProgramLinks currentProgramId={program.id} school={program.school} />
      </section>

      <section id="next-step" className="card submit-card submit-card--hero">
        <div>
          <p className="eyebrow">下一步</p>
          <h2>继续补样本，或者开始对比。</h2>
        </div>
        <div className="submit-card__actions">
          <Link to={routeLinks.compare()} className="route-button">
            去对比
          </Link>
          <Link to={routeLinks.stats()} className="route-button">
            看统计
          </Link>
          <Link to={routeLinks.unlock()} className="route-button">
            解锁失败经验
          </Link>
          <Link to={routeLinks.submit()} className="route-button route-button--primary">
            去投稿
          </Link>
        </div>
      </section>
    </main>
  )
}
