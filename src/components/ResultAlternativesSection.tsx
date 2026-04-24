import { SchoolProgramLinks } from './SchoolProgramLinks'

interface ResultAlternativesSectionProps {
  programId: string
  school: string
}

export function ResultAlternativesSection({ programId, school }: ResultAlternativesSectionProps) {
  return (
    <section id="alternatives">
      <SchoolProgramLinks currentProgramId={programId} school={school} />
    </section>
  )
}
