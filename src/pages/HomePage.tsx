import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PageRouteBar } from '../components/PageRouteBar'
import { ProgramBrowseGrid } from '../components/ProgramBrowseGrid'
import { SearchHistory } from '../components/SearchHistory'
import { SearchInput } from '../components/SearchInput'
import { failures } from '../data/failures'
import { programIndex } from '../data/programIndex'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import type { InsightCard, TrustMetric } from '../lib/types'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export function HomePage() {
  const examples = useMemo(() => programIndex.slice(0, 3), [])
  const featuredExample = examples[0]
  const trustMetrics = useMemo<TrustMetric[]>(
    () => [
      { value: `${programIndex.length}`, label: '已收录目标' },
      { value: `${new Set(programIndex.map((item) => item.school)).size}`, label: '覆盖院校' },
      { value: `${new Set(programIndex.map((item) => item.major)).size}`, label: '覆盖专业' },
      { value: `${failures.length}`, label: '失败经验' },
    ],
    [],
  )
  const insightCards = useMemo<InsightCard[]>(
    () => [
      {
        title: '先看真实难度',
        description: '报录比、复试线、最低分同屏判断。',
        actionLabel: '看统计',
        actionTo: routeLinks.stats(),
      },
      {
        title: '再看失败路径',
        description: '别人卡在哪一步，比上岸故事更有用。',
        actionLabel: '看样本',
        actionTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
      },
      {
        title: '最后做横向比较',
        description: '把相近目标放在一起，少靠感觉。',
        actionLabel: '去对比',
        actionTo: routeLinks.compare(),
      },
    ],
    [featuredExample],
  )

  useScrollRestoration()

  return (
    <main id="main-content" className="page home-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">考研择校判断</p>
          <h1>别只看上岸故事。</h1>
          <p className="hero-copy">先看难度，再看别人怎么失败。</p>

          <div className="trust-strip">
            {trustMetrics.map((metric) => (
              <article key={metric.label} className="trust-strip__item">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="home-hero__panel card">
          <div className="section-head left-align">
            <h2>直接查目标</h2>
            <p>学校或专业</p>
          </div>
          <SearchInput className="hero-search" />
          <div className="hero-pills" aria-label="示例目标">
            {examples.map((item) => (
              <Link
                key={item.id}
                to={routeLinks.result(buildProgramSlug(item))}
                className="hero-pill"
              >
                {item.school}
              </Link>
            ))}
          </div>
          <SearchHistory />
        </div>
      </section>

      <section className="card insight-band">
        <div className="section-head">
          <h2>怎么用</h2>
          <p>三步够了</p>
        </div>
        <div className="insight-grid">
          {insightCards.map((item) => (
            <Link
              key={item.title}
              to={item.actionTo}
              className="insight-card"
            >
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <small>{item.actionLabel}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>热门入口</h2>
          <p>直接进结果页</p>
        </div>
        <div className="example-grid">
          {examples.map((item) => (
            <Link
              key={item.id}
              to={routeLinks.result(buildProgramSlug(item))}
              className="example-card"
            >
              <strong>{item.school}</strong>
              <span>{item.major}</span>
              <small>{item.year}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>按学校浏览</h2>
          <p>先学校，后专业</p>
        </div>
        <ProgramBrowseGrid />
      </section>

      <section className="card submit-card submit-card--hero">
        <div>
          <p className="eyebrow">继续补样本</p>
          <h2>匿名补一条失败经验。</h2>
        </div>
        <div className="submit-card__actions">
          <Link to={routeLinks.submit()} className="route-button route-button--primary">
            去投稿
          </Link>
          <Link to={routeLinks.stats()} className="text-link">
            看统计
          </Link>
        </div>
      </section>
    </main>
  )
}
