export function ResultContextCardSkeleton() {
  return (
    <section className="card result-context-card result-context-card-skeleton">
      <div className="section-head left-align">
        <div className="skeleton skeleton--h2" />
        <div className="skeleton skeleton--p" />
      </div>

      {/* context grid 2x2 */}
      <div className="context-skeleton-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="context-skeleton-item">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ))}
      </div>

      {/* context note */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '95%' }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
      </div>

      {/* context missing tags */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <div className="skeleton skeleton--tag" />
        <div className="skeleton skeleton--tag" />
      </div>
    </section>
  )
}
