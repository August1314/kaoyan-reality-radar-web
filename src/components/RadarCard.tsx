import type { Program } from '../lib/types'
import { RiskTagList } from './RiskTagList'
import { RadarChart } from './RadarChart'

interface RadarCardProps {
  program: Program
}

export function RadarCard({ program }: RadarCardProps) {
  return (
    <section className="card radar-card">
      <div className="section-head left-align">
        <h2>难度雷达</h2>
        <p>{program.year} 年最近数据</p>
      </div>
      <RadarChart program={program} />
      <RiskTagList tags={program.riskTags} />
      <p className="summary-box">{program.summary}</p>
    </section>
  )
}
