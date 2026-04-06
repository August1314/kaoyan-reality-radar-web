import { Link } from 'react-router-dom'
import { programs } from '../data/programs'
import { routeLinks } from '../lib/routes'
import { buildProgramSlug } from '../lib/search'

export function ProgramBrowseGrid() {
  return (
    <div className="example-grid">
      {programs.map((program) => (
        <Link key={program.id} to={routeLinks.result(buildProgramSlug(program))} className="example-card">
          <strong>{program.school}</strong>
          <span>{program.major}</span>
          <small>{program.summary}</small>
        </Link>
      ))}
    </div>
  )
}
