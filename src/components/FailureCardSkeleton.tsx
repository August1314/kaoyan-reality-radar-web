export function FailureCardSkeleton() {
  return (
    <div className="failure-card-skeleton">
      {/* 一行：attempt + stage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div className="skeleton skeleton--row" style={{ width: '35%' }} />
        <div className="skeleton skeleton--row" style={{ width: '40%' }} />
      </div>

      {/* tags */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton skeleton--tag" />
        <div className="skeleton skeleton--tag" />
      </div>

      {/* reminder lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '75%' }} />
      </div>

      {/* source + link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton skeleton--link" />
        <div className="skeleton skeleton--link" style={{ width: 60 }} />
      </div>
    </div>
  )
}
