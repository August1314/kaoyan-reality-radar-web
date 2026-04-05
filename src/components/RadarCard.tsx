import { formatRatio, formatRetestRate } from '../lib/format'
import type { Program } from '../lib/types'
import { RiskTagList } from './RiskTagList'

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
      <div className="metric-grid">
        <div>
          <span>报录比</span>
          <strong>{formatRatio(program.applicants, program.admitted)} : 1</strong>
        </div>
        <div>
          <span>复录比</span>
          <strong>{formatRetestRate(program.retestCount, program.admitted)} : 1</strong>
        </div>
        <div>
          <span>进入复试线</span>
          <strong>{program.retestLine}</strong>
        </div>
        <div>
          <span>最终最低录取</span>
          <strong>{program.lowestAdmittedScore}</strong>
        </div>
      </div>
      <RiskTagList tags={program.riskTags} />
      <p className="summary-box">{program.summary}</p>
    </section>
  )
}
