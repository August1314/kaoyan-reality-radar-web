import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PageRouteBar } from '../components/PageRouteBar'
import { CompareButton } from '../components/CompareButton'
import { SearchHistory } from '../components/SearchHistory'
import { SearchInput } from '../components/SearchInput'
import { failures } from '../data/failures'
import { programIndex } from '../data/programIndex'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import type { FeaturePanel, PromoBandItem, TrustMetric } from '../lib/types'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export function HomePage() {
  const examples = useMemo(() => programIndex.slice(0, 4), [])
  const featuredExample = examples[0]
  const promoItems = useMemo<PromoBandItem[]>(
    () => [
      { label: '公开目标', value: `${programIndex.length} 条` },
      { label: '失败经验', value: `${failures.length} 条` },
      { label: '资料边界', value: '公开资料 + 匿名投稿' },
    ],
    [],
  )
  const trustMetrics = useMemo<TrustMetric[]>(
    () => [
      { value: `${programIndex.length}`, label: '已收录目标' },
      { value: `${new Set(programIndex.map((item) => item.school)).size}`, label: '覆盖院校' },
      { value: `${new Set(programIndex.map((item) => item.major)).size}`, label: '覆盖专业' },
      { value: `${failures.length}`, label: '失败经验' },
    ],
    [],
  )
  const featurePanels = useMemo<Record<'judgement' | 'failures' | 'compare', FeaturePanel>>(
    () => ({
      judgement: {
        eyebrow: '风险判断',
        title: '先看公开难度，不先听上岸故事。',
        summary: '报录比、复试线、最低录取分和风险标签先摆在前面，判断这件事先做定量。',
        theme: 'dark',
        actionLabel: '看统计',
        actionTo: routeLinks.stats(),
        secondaryLabel: '打开一个目标',
        secondaryTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
      },
      failures: {
        eyebrow: '失败经验',
        title: '别人怎么失手，比成功复盘更值钱。',
        summary: '这个站点最有价值的部分，不是“考上了”，而是“为什么在那一步掉下来了”。',
        theme: 'light',
        actionLabel: '看样本',
        actionTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
        secondaryLabel: '去投稿',
        secondaryTo: routeLinks.submit(),
      },
      compare: {
        eyebrow: '横向对比',
        title: '把相近目标摆在一排，少靠感觉选学校。',
        summary: '对比保留，但只当成深一步工具。先查单个目标，确认候选，再一起横向看。',
        theme: 'tint',
        actionLabel: '去对比',
        actionTo: routeLinks.compare(),
        secondaryLabel: '看结果页',
        secondaryTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
      },
    }),
    [featuredExample],
  )
  const featuredSchools = useMemo(() => {
    const seen = new Set<string>()
    return programIndex.filter((item) => {
      if (seen.has(item.school)) return false
      seen.add(item.school)
      return true
    }).slice(0, 8)
  }, [])
  const failureSamples = useMemo(() => failures.slice(0, 3), [])

  useScrollRestoration()

  return (
    <main id="main-content" className="page home-page apple-home-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="promo-band" aria-label="站点信息带">
        {promoItems.map((item) => (
          <article key={item.label} className="promo-band__item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="card apple-hero">
        <div className="apple-hero__copy">
          <p className="eyebrow">考研现实判断</p>
          <h1>先看难度，再决定冲不冲。</h1>
          <p className="hero-copy apple-hero__summary">公开资料、失败经验、横向对比，放在同一个入口里。</p>

          <div className="apple-hero__metrics">
            {trustMetrics.map((metric) => (
              <article key={metric.label} className="apple-hero__metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="apple-search-panel">
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
                {item.school} · {item.major}
              </Link>
            ))}
          </div>
          <SearchHistory />
        </div>
      </section>

      <section className={`card feature-panel feature-panel--${featurePanels.judgement.theme}`}>
        <div className="feature-panel__copy">
          <p className="eyebrow">{featurePanels.judgement.eyebrow}</p>
          <h2>{featurePanels.judgement.title}</h2>
          <p className="feature-panel__summary">{featurePanels.judgement.summary}</p>
          <div className="feature-panel__actions">
            <Link to={featurePanels.judgement.actionTo} className="route-button route-button--primary">
              {featurePanels.judgement.actionLabel}
            </Link>
            {featurePanels.judgement.secondaryLabel && featurePanels.judgement.secondaryTo ? (
              <Link to={featurePanels.judgement.secondaryTo} className="text-link">
                {featurePanels.judgement.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="feature-panel__media">
          <div className="mini-stat-grid">
            {trustMetrics.map((metric) => (
              <article key={metric.label} className="mini-stat">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`card feature-panel feature-panel--${featurePanels.failures.theme}`}>
        <div className="feature-panel__copy">
          <p className="eyebrow">{featurePanels.failures.eyebrow}</p>
          <h2>{featurePanels.failures.title}</h2>
          <p className="feature-panel__summary">{featurePanels.failures.summary}</p>
          <div className="feature-panel__actions">
            <Link to={featurePanels.failures.actionTo} className="route-button route-button--primary">
              {featurePanels.failures.actionLabel}
            </Link>
            {featurePanels.failures.secondaryLabel && featurePanels.failures.secondaryTo ? (
              <Link to={featurePanels.failures.secondaryTo} className="text-link">
                {featurePanels.failures.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="feature-panel__media">
          <div className="feature-quote-list">
            {failureSamples.map((item) => (
              <article key={item.id} className="feature-quote">
                <strong>{item.reminder}</strong>
                <span>{item.failureStage} · {item.finalResult}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`card feature-panel feature-panel--${featurePanels.compare.theme}`}>
        <div className="feature-panel__copy">
          <p className="eyebrow">{featurePanels.compare.eyebrow}</p>
          <h2>{featurePanels.compare.title}</h2>
          <p className="feature-panel__summary">{featurePanels.compare.summary}</p>
          <div className="feature-panel__actions">
            <Link to={featurePanels.compare.actionTo} className="route-button route-button--primary">
              {featurePanels.compare.actionLabel}
            </Link>
            {featurePanels.compare.secondaryLabel && featurePanels.compare.secondaryTo ? (
              <Link to={featurePanels.compare.secondaryTo} className="text-link">
                {featurePanels.compare.secondaryLabel}
              </Link>
            ) : null}
          </div>
          <CompareButton />
        </div>
        <div className="feature-panel__media">
          <div className="compare-preview-list">
            {examples.slice(0, 3).map((item) => (
              <article key={item.id} className="compare-preview-item">
                <strong>{item.school}</strong>
                <span>{item.major}</span>
                <small>{item.year} 年</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-tile-grid">
        <article className="card home-tile">
          <div className="section-head left-align">
            <h2>热门入口</h2>
            <p>直接进结果页</p>
          </div>
          <div className="home-tile__grid">
            {examples.map((item) => (
              <Link
                key={item.id}
                to={routeLinks.result(buildProgramSlug(item))}
                className="home-tile__link"
              >
                <strong>{item.school}</strong>
                <span>{item.major}</span>
                <small>{item.year}</small>
              </Link>
            ))}
          </div>
        </article>

        <article className="card home-tile">
          <div className="section-head left-align">
            <h2>按学校浏览</h2>
            <p>先学校，后专业</p>
          </div>
          <div className="school-chip-grid">
            {featuredSchools.map((item) => (
              <Link
                key={item.school}
                to={routeLinks.result(buildProgramSlug(item))}
                className="school-chip"
              >
                {item.school}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="card home-footer-panel">
        <div className="home-footer-panel__copy">
          <p className="eyebrow">继续补样本</p>
          <h2>匿名补一条失败经验。</h2>
          <p className="feature-panel__summary">公开站点，只做现实判断，不做保过承诺。</p>
        </div>
        <div className="submit-card__actions">
          <Link to={routeLinks.submit()} className="route-button route-button--primary">
            去投稿
          </Link>
          <Link to={routeLinks.stats()} className="route-button">
            看统计
          </Link>
        </div>
        <div className="home-footer-panel__meta">
          <span>公开资料整理</span>
          <span>匿名经验人工审核</span>
          <span>不做个性化咨询</span>
        </div>
      </section>
    </main>
  )
}