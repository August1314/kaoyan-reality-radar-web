import { Link } from 'react-router-dom'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import type { ProgramIndexEntry } from '../lib/types'

interface HomeQuickEntrySectionProps {
  examples: ProgramIndexEntry[]
  featuredSchools: ProgramIndexEntry[]
}

export function HomeQuickEntrySection({ examples, featuredSchools }: HomeQuickEntrySectionProps) {
  return (
    <section className="home-tile-grid home-tile-grid--compact">
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
            <Link key={item.school} to={routeLinks.result(buildProgramSlug(item))} className="school-chip">
              {item.school}
            </Link>
          ))}
        </div>
      </article>
    </section>
  )
}
