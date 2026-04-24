import { Link } from 'react-router-dom'
import { CompareToggle } from './CompareButton'
import { ShareButton } from './ShareButton'
import { downloadShareCard } from '../lib/share-card'
import type { Program } from '../lib/types'

interface ResultHeroSectionProps {
  program: Program
  metrics: Array<{ label: string; value: string }>
  isPaid: boolean
  onExportCsv: () => void
}

export function ResultHeroSection({ program, metrics, isPaid, onExportCsv }: ResultHeroSectionProps) {
  return (
    <section className="card page-head result-hero result-hero--featured">
      <div className="page-head-content result-hero__content">
        <p className="eyebrow">目标判断</p>
        <h1>
          {program.school} · {program.major}
        </h1>
        <p className="hero-copy">先看难度，再看失败路径。</p>
        <div className="result-kpis">
          {metrics.map((item) => (
            <div key={item.label} className="result-kpi">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="result-hero__actions">
        <ShareButton
          title={`${program.school} · ${program.major} - 考研现实雷达`}
          text={`看看${program.school}${program.major}的真实难度和失败经验`}
        />
        <button type="button" className="text-link export-btn" onClick={onExportCsv}>
          导出当前 CSV
        </button>
        {isPaid ? (
          <button type="button" className="text-link share-btn" onClick={() => downloadShareCard([program])}>
            分享卡片
          </button>
        ) : (
          <Link to="/unlock" className="text-link share-btn">
            完整权益分享卡片
          </Link>
        )}
        <CompareToggle programId={program.id} />
      </div>
    </section>
  )
}
