import type { Program } from '../lib/types'

interface ResultContextCardProps {
  program: Program
}

function getMissingFields(program: Program) {
  const missingFields: string[] = []

  if (program.applicants == null) missingFields.push('报名人数')
  if (program.retestCount == null) missingFields.push('复试人数')
  if (program.retestLine == null) missingFields.push('复试线')
  if (program.lowestAdmittedScore == null) missingFields.push('最低拟录取分')

  return missingFields
}

export function ResultContextCard({ program }: ResultContextCardProps) {
  const missingFields = getMissingFields(program)

  return (
    <section className="card result-context-card">
      <div className="section-head left-align">
        <h2>数据口径</h2>
        <p>先看来源和缺口，再看分数和排名，避免把未公开字段当成真实空缺。</p>
      </div>

      <div className="context-grid">
        <div className="context-item">
          <span>年份 / 招生季</span>
          <strong>{program.year} 年</strong>
        </div>
        <div className="context-item">
          <span>来源范围</span>
          <strong>官方公开材料整理</strong>
        </div>
        <div className="context-item">
          <span>发布态</span>
          <strong>verified 静态数据</strong>
        </div>
        <div className="context-item">
          <span>时间口径</span>
          <strong>{program.year} 年招生季</strong>
        </div>
      </div>

      <p className="context-note">{program.sourceNote}</p>

      <div className="context-missing">
        <p className="context-missing__label">暂未公开 / 待补充字段</p>
        {missingFields.length > 0 ? (
          <ul className="tag-list muted-tags context-tags">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        ) : (
          <p className="context-missing__empty">当前项目的核心字段已整理完毕。</p>
        )}
      </div>
    </section>
  )
}
