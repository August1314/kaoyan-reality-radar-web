import { Link } from 'react-router-dom'
import { SearchHistory } from './SearchHistory'
import { SearchInput } from './SearchInput'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import type { ProgramIndexEntry, TrustMetric } from '../lib/types'

interface HomeHeroSectionProps {
  examples: ProgramIndexEntry[]
  trustMetrics: TrustMetric[]
}

export function HomeHeroSection({ examples, trustMetrics }: HomeHeroSectionProps) {
  return (
    <section className="card card--featured apple-hero">
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
            <Link key={item.id} to={routeLinks.result(buildProgramSlug(item))} className="hero-pill">
              {item.school} · {item.major}
            </Link>
          ))}
        </div>
        <SearchHistory />
      </div>
    </section>
  )
}
