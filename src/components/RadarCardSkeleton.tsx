export function RadarCardSkeleton() {
  return (
    <section className="card radar-card radar-card-skeleton">
      <div className="section-head left-align">
        <div className="skeleton skeleton--h2" />
        <div className="skeleton skeleton--p" />
      </div>

      <div className="metric-skeleton-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="metric-skeleton-item">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton skeleton--tag" />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
        <div className="skeleton" style={{ height: 16 }} />
        <div className="skeleton" style={{ height: 16, width: '85%' }} />
        <div className="skeleton" style={{ height: 16, width: '70%' }} />
      </div>
    </section>
  )
}
