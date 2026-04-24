import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import { PageRouteBar } from '../components/PageRouteBar'
import { RadarCard } from '../components/RadarCard'
import { ResultContextCard } from '../components/ResultContextCard'
import { ResultHeroSection } from '../components/ResultHeroSection'
import { ResultSignalsSection } from '../components/ResultSignalsSection'
import { ResultFailuresSection } from '../components/ResultFailuresSection'
import { ResultAlternativesSection } from '../components/ResultAlternativesSection'
import { ResultNextStepSection } from '../components/ResultNextStepSection'
import { programIndex } from '../data/programIndex'
import { useFailuresByProgramId } from '../hooks/useAsyncFailures'
import { useProtectedProgram } from '../hooks/useProtectedData'
import { useEntitlement } from '../hooks/useEntitlement'
import { useJsonLd } from '../hooks/useJsonLd'
import { useResultPageSEO } from '../hooks/useSEO'
import { downloadResultCSV } from '../lib/csv-export'
import { EntitlementApiError } from '../lib/entitlement-api'
import { formatMetricValue, formatRatio, formatRetestRate } from '../lib/format'
import { buildProgramSlug } from '../lib/programSlug'
import { resultSectionLinks, routeLinks } from '../lib/routes'

function ResultLockShell({ school, major }: { school: string; major: string }) {
  return (
    <>
      <section className="card card--featured page-head result-hero">
        <div className="page-head-content result-hero__content">
          <p className="eyebrow">目标判断</p>
          <h1>
            {school} · {major}
          </h1>
          <p className="hero-copy">这个目标已收录在目录中，提交择校问卷后可领取完整权益码继续查看。</p>
          <div className="result-kpis result-kpis--placeholder">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="result-kpi result-kpi--placeholder">
                <span>指标</span>
                <strong>--</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="result-hero__actions">
          <Link to={routeLinks.unlock()} className="route-button route-button--primary">
            领取完整权益码
          </Link>
          <Link to={routeLinks.unlock()} className="route-button">
            输入解锁码
          </Link>
        </div>
      </section>

      <nav className="result-anchor-nav" aria-label="结果页分区导航">
        {resultSectionLinks.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="result-anchor-link">
            {item.label}
          </a>
        ))}
      </nav>

      <div className="result-paywall">
        <div className="result-paywall__content" aria-hidden="true">
          <section id="overview" className="result-stack result-stack--featured">
            <div className="result-layout">
              <div className="card result-placeholder-card result-placeholder-card--tall" />
              <div className="card result-placeholder-card result-placeholder-card--tall" />
            </div>
          </section>

          <section id="signals" className="card result-placeholder-section">
            <div className="result-placeholder-line result-placeholder-line--short" />
            <div className="result-placeholder-line" />
            <div className="result-placeholder-line result-placeholder-line--wide" />
            <div className="result-placeholder-tags">
              <span className="result-placeholder-pill" />
              <span className="result-placeholder-pill" />
              <span className="result-placeholder-pill" />
            </div>
          </section>

          <section id="failures" className="card result-placeholder-section">
            <div className="result-placeholder-line result-placeholder-line--short" />
            <div className="failure-list">
              <div className="result-placeholder-card" />
              <div className="result-placeholder-card" />
            </div>
          </section>

          <section id="alternatives" className="card result-placeholder-section">
            <div className="result-placeholder-line result-placeholder-line--short" />
            <div className="school-program-links__grid">
              <div className="result-placeholder-card" />
              <div className="result-placeholder-card" />
            </div>
          </section>

          <section id="next-step" className="card result-placeholder-section">
            <div className="result-placeholder-line result-placeholder-line--short" />
            <div className="unlock-inline-card__actions">
              <span className="result-placeholder-button" />
              <span className="result-placeholder-button" />
              <span className="result-placeholder-button" />
            </div>
          </section>
        </div>

        <div className="result-paywall__overlay">
          <div className="result-paywall__panel card--featured">
            <p className="eyebrow">查看权益</p>
            <h2>继续查看更多目标</h2>
            <p>
              基础体验可查看 2 个目标；限时内测期提交择校问卷后，可人工领取完整权益码，继续系统筛选学校和专业。
            </p>
            <div className="result-paywall__actions">
              <Link to={routeLinks.unlock()} className="route-button route-button--primary">
                领取完整权益码
              </Link>
              <Link to={routeLinks.unlock()} className="route-button">
                输入解锁码
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function ResultPage() {
  const { slug = '' } = useParams()
  const preview = programIndex.find((item) => buildProgramSlug(item) === decodeURIComponent(slug)) ?? null
  const { level: entitlementLevel, isPaid, deviceId, syncStatus } = useEntitlement()
  const {
    program,
    entitlement,
    loading: programLoading,
    error: programError,
  } = useProtectedProgram(slug, deviceId)
  const quotaExceeded =
    programError instanceof EntitlementApiError && programError.code === 'quota_exceeded'

  useEffect(() => {
    if (entitlement) {
      syncStatus(entitlement)
    }
  }, [entitlement, syncStatus])

  const seoProgram = program ?? preview ?? { school: '', major: '', year: 0, summary: '' }
  useResultPageSEO(seoProgram)
  useJsonLd(quotaExceeded ? null : program)

  const {
    failures: visibleFailures,
    totalCount: failureTotalCount,
    loading: failuresLoading,
    error: failuresError,
  } = useFailuresByProgramId(program?.id ?? '', deviceId, entitlementLevel)

  if (!preview && !programLoading && !program) {
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

  if (!program && !programLoading && !quotaExceeded) {
    return (
      <main className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <section className="card empty-state">
          <h1>结果页暂时加载失败</h1>
          <p>{programError?.message ?? '请刷新后重试。'}</p>
          <div className="empty-state-actions">
            <Link to={routeLinks.home()} className="route-button route-button--primary">
              返回首页
            </Link>
            <Link to={routeLinks.unlock()} className="route-button">
              去解锁页
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const renderedSchool = program?.school ?? preview?.school ?? ''
  const renderedMajor = program?.major ?? preview?.major ?? ''

  if (!program || quotaExceeded) {
    return (
      <main id="main-content" className="page result-page">
        <Breadcrumb
          items={[
            { label: renderedSchool },
            { label: renderedMajor },
          ]}
        />
        <PageRouteBar
          actions={[
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <ResultLockShell school={renderedSchool} major={renderedMajor} />
      </main>
    )
  }

  const metrics = [
    {
      label: '报录比',
      value: formatRatio(program.applicants, program.admitted)
        ? `${formatRatio(program.applicants, program.admitted)} : 1`
        : '未公开',
    },
    {
      label: '复录比',
      value: formatRetestRate(program.retestCount, program.admitted)
        ? `${formatRetestRate(program.retestCount, program.admitted)} : 1`
        : '未公开',
    },
    { label: '复试线', value: formatMetricValue(program.retestLine) },
    { label: '最低录取', value: formatMetricValue(program.lowestAdmittedScore) },
  ]

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

      <ResultHeroSection
        program={program}
        metrics={metrics}
        isPaid={isPaid}
        onExportCsv={() => downloadResultCSV(program, visibleFailures)}
      />

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

      <ResultSignalsSection program={program} />
      <ResultFailuresSection
        entitlementLevel={entitlementLevel}
        visibleFailures={visibleFailures}
        failureTotalCount={failureTotalCount}
        failuresLoading={failuresLoading}
        failuresError={failuresError}
      />
      <ResultAlternativesSection programId={program.id} school={program.school} />
      <ResultNextStepSection />
    </main>
  )
}
