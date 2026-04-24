import { RiskTagList } from './RiskTagList'
import type { Program } from '../lib/types'

interface ResultSignalsSectionProps {
  program: Program
}

export function ResultSignalsSection({ program }: ResultSignalsSectionProps) {
  return (
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
  )
}
