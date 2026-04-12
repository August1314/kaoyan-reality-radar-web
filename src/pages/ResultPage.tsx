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
import { findFailuresByProgramId } from '../lib/failures'
import { formatMetricValue, formatRatio, formatRetestRate } from '../lib/format'
import { findProgramBySlug } from '../lib/programs'
import { resultSectionLinks, routeLinks } from '../lib/routes'
import { useResultPageSEO } from '../hooks/useSEO'

export function ResultPage() {
  const { slug = '' } = useParams()
  const program = findProgramBySlug(slug)

  // SEO - 必须在条件判断之前调用
  useResultPageSEO(program ?? { school: '', major: '', year: 0, summary: '' })

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

  const resultFailures = findFailuresByProgramId(program.id)
  const metrics = [
    { label: '报录比', value: formatRatio(program.applicants, program.admitted) ? `${formatRatio(program.applicants, program.admitted)} : 1` : '未公开' },
    { label: '复录比', value: formatRetestRate(program.retestCount, program.admitted) ? `${formatRetestRate(program.retestCount, program.admitted)} : 1` : '未公开' },
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
          <p>{resultFailures.length} 条样本</p>
        </div>
        <div className="failure-list">
          {resultFailures.map((item) => (
            <FailureCard key={item.id} failure={item} />
          ))}
        </div>
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
          <Link to={routeLinks.submit()} className="route-button route-button--primary">
            去投稿
          </Link>
        </div>
      </section>
    </main>
  )
}
