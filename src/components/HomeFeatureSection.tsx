import { Link } from 'react-router-dom'
import { CompareButton } from './CompareButton'
import type { FeaturePanel, ProgramIndexEntry, TrustMetric } from '../lib/types'

function FeaturePanelCard({
  panel,
  children,
}: {
  panel: FeaturePanel
  children: React.ReactNode
}) {
  return (
    <section className={`card card--subtle feature-panel feature-panel--${panel.theme}`}>
      <div className="feature-panel__copy">
        <p className="eyebrow">{panel.eyebrow}</p>
        <h2>{panel.title}</h2>
        <p className="feature-panel__summary">{panel.summary}</p>
        <div className="feature-panel__actions">
          <Link to={panel.actionTo} className="route-button route-button--primary">
            {panel.actionLabel}
          </Link>
          {panel.secondaryLabel && panel.secondaryTo ? (
            <Link to={panel.secondaryTo} className="text-link">
              {panel.secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="feature-panel__media">{children}</div>
    </section>
  )
}

interface HomeFeatureSectionProps {
  featurePanels: Record<'judgement' | 'failures' | 'compare', FeaturePanel>
  trustMetrics: TrustMetric[]
  failureSamples: { id: string; reminder: string; failureStage: string; finalResult: string }[]
  examples: ProgramIndexEntry[]
}

export function HomeFeatureSection({ featurePanels, trustMetrics, failureSamples, examples }: HomeFeatureSectionProps) {
  return (
    <>
      <FeaturePanelCard panel={featurePanels.judgement}>
        <div className="mini-stat-grid">
          {trustMetrics.map((metric) => (
            <article key={metric.label} className="mini-stat">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </FeaturePanelCard>

      <FeaturePanelCard panel={featurePanels.failures}>
        <div className="feature-quote-list">
          {failureSamples.map((item) => (
            <article key={item.id} className="feature-quote">
              <strong>{item.reminder}</strong>
              <span>
                {item.failureStage} · {item.finalResult}
              </span>
            </article>
          ))}
        </div>
      </FeaturePanelCard>

      <FeaturePanelCard panel={featurePanels.compare}>
        <div className="compare-preview-list">
          {examples.slice(0, 3).map((item) => (
            <article key={item.id} className="compare-preview-item">
              <strong>{item.school}</strong>
              <span>{item.major}</span>
              <small>{item.year} 年</small>
            </article>
          ))}
        </div>
        <div className="feature-panel__actions feature-panel__actions--inline">
          <CompareButton />
        </div>
      </FeaturePanelCard>
    </>
  )
}
