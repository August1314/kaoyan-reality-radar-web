import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { programIndex } from '../data/programIndex'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'

export function ProgramBrowseGrid() {
  const groupedPrograms = useMemo(() => {
    const groups = new Map<string, typeof programIndex>()

    for (const program of programIndex) {
      const existing = groups.get(program.school)
      if (existing) {
        existing.push(program)
        continue
      }

      groups.set(program.school, [program])
    }

    return Array.from(groups.entries()).map(([school, items]) => ({
      school,
      items,
    }))
  }, [])

  return (
    <div className="school-browse-list">
      {groupedPrograms.map((group) => (
        <details key={group.school} className="school-browse-card">
          <summary className="school-browse-summary">
            <div>
              <strong>{group.school}</strong>
              <span>{group.items.length} 个目标</span>
            </div>
            <small>展开</small>
          </summary>
          <div className="school-browse-programs">
            {group.items.map((program) => (
              <Link
                key={program.id}
                to={routeLinks.result(buildProgramSlug(program))}
                className="school-browse-program"
              >
                <strong>{program.major}</strong>
                <span>{program.year} · {program.summary}</span>
              </Link>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
