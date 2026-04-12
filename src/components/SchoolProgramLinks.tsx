import { Link } from 'react-router-dom'
import { programIndex } from '../data/programIndex'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'

interface SchoolProgramLinksProps {
  currentProgramId: string
  school: string
}

export function SchoolProgramLinks({ currentProgramId, school }: SchoolProgramLinksProps) {
  const sameSchoolPrograms = programIndex
    .filter((program) => program.school === school)
    .sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year
      }

      return a.major.localeCompare(b.major, 'zh-Hans-CN')
    })

  if (sameSchoolPrograms.length <= 1) {
    return null
  }

  return (
    <section className="card school-program-links">
      <div className="section-head left-align">
        <h2>同校已收录目标</h2>
        <p>{school}</p>
      </div>
      <div className="school-program-links__grid">
        {sameSchoolPrograms.map((program) => {
          const isCurrent = program.id === currentProgramId
          if (isCurrent) {
            return (
              <article key={program.id} className="school-program-link school-program-link--current" aria-current="page">
                <strong>{program.major}</strong>
                <span>当前</span>
              </article>
            )
          }

          return (
            <Link key={program.id} to={routeLinks.result(buildProgramSlug(program))} className="school-program-link">
              <strong>{program.major}</strong>
              <span>{program.year}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
